global.console = {
    ...console,
    error: jest.fn(),
};

// aqui é feito o import dos métodos a serem testados
import {
    registerUser,
    loginUser,
  } from './userAPI.js';
  import { makeAuthenticatedRequest } from '../utils/apiUtils.js';

// mock do módulo 'apiUtils.js' (as funções dentro desse módulo serão substituídas por mocks)
jest.mock('../utils/apiUtils.js');

// Mock global fetch
global.fetch = jest.fn();

describe('User API', () => {

    // Mock sessionStorage para evitar erros de referência em Node.js
    beforeAll(() => {
        global.sessionStorage = {
            setItem: jest.fn(),
            getItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn(),
        };
    });

    // antes de cada teste correr é feito um reset às mocks
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // teste para a resposta da API ao registar um utilizador
    describe('registerUser', () => {
        it('should return the registered user when the API call is successful', async () => {
            // 1. Arrange
            // mock de uma tentativa de registo com os seguintes dados
            const newUser = {
                username: 'joca123',
                firstName: 'João',
            };
            // mock do resultado esperado após um registo bem sucedido
            const createdUser = {
                id: 1,
                username: 'joca123',
                firstName: 'João',
            };
            // mock da resposta da API ao fecth com sucesso (ok: true)
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue(createdUser),
            };
            // mock do fetch para retornar a resposta simulada
            fetch.mockResolvedValue(mockResponse);

            // 2. Act
            // chamada à função que estamos a testar, passando os dados do novo utilizador
            const result = await registerUser(newUser);

        // 3. Assert
        // verifica se a função fetch foi chamada exatamente uma vez
        expect(fetch).toHaveBeenCalledTimes(1);
        // verifica se a chamada ao fetch foi feita com os argumentos esperados
        expect(fetch).toHaveBeenCalledWith(
            expect.any(String), // o URL é passado como uma String qualquer, não sendo necessário para o teste o caminho real
            {
                method: 'POST', // método HTTP correto
                headers: { 'Content-Type': 'application/json' }, // cabeçalhos esperados
                body: JSON.stringify(newUser), // corpo da requisição convertido para JSON
            }
        );
        // verifica se o resultado da função é o utilizador criado
        expect(result).toEqual(createdUser);
    });

    it('should throw an error when the API call fails', async () => {
        // 1. Arrange
        // mock de uma tentativa de registo com uma password inválida
        const newUser = {
            username: 'joca123',
            firstName: 'João',
            password: '1234', // password inválida (menos de 8 caracteres, sem letras e números misturados)
        };
    
        // mock de um erro de resposta da API
        const mockResponse = {
            ok: false,
            statusText: 'Bad Request',
        };
        // mock do fetch para retornar a resposta simulada
        fetch.mockResolvedValue(mockResponse);

    // 2. Act
    // chama a função para registrar o utilizador
    const result = registerUser(newUser);

    // 3. Assert
    // verifica que a exceção foi lançada
    await expect(result).rejects.toThrow('Registration failed: Bad Request');
    });
    });

    describe('loginUser', () => {
        it('should return a token when the API call is successful', async () => {
            // 1. Arrange
            // mock de uma tentativa de login com os seguintes dados
            const credentials = {
                username: 'joca123',
                password: 'password123',
            };
            // mock da token retornada
            const token = 'mockedToken123';
            // mock da resposta da API ao fetch com sucesso (ok: true)
            const mockResponse = {
                ok: true,
                text: jest.fn().mockResolvedValue(token),
            };
            // mock do fetch para retornar a resposta simulada
            fetch.mockResolvedValue(mockResponse);
            // mock da função auxiliar que coloca o token na sessionStorage
            const mockSetAuthToken = jest.fn();
            global.setAuthToken = mockSetAuthToken;
    
            // 2. Act
            // chamada à função a testar, passando as credênciais mock
            const result = await loginUser(credentials);
    
            // 3. Assert
            // verifica se a função foi chamada uma vez
            expect(fetch).toHaveBeenCalledTimes(1);
            // verifica se a função foi chamada com os argumentos esperados
            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                }
            );
            // verifica que o retorno é apenas o token
            expect(result).toEqual({ token: token });
            // verifica se o token foi armazenado no sessionStorage
            expect(sessionStorage.setItem).toHaveBeenCalledWith('authToken', token);
        });
    
        it('should throw an error when the API call fails', async () => {
            // 1. Arrange
            // mock de uma tentativa de login com uma password inválida
            const credentials = {
                username: 'joca123',
                password: 'wrongpassword',
            };
            // mock da resposta da API ao fecth sem sucesso (ok: false)
            const mockResponse = {
                ok: false,
                statusText: 'Unauthorized',
            };
            // mock do fetch para retornar a resposta simulada
            fetch.mockResolvedValue(mockResponse);
    
            // 2. Act
            // chamada à função a testar, passando as credênciais mock
            const result = loginUser(credentials);
    
            // 3. Assert
            // verifica se a exceção foi lançada
            await expect(result).rejects.toThrow('Login failed: Unauthorized');
        });
    });

});