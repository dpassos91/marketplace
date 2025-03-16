import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userAPI from '../api/UserAPI';

// Função para obter dados do usuário do localStorage
const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem('userData');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Error parsing stored user data:", error);
        return null;
    }
};

// Função para definir dados do usuário no localStorage
const setStoredUser = (user) => {
    try {
        localStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
        console.error("Error saving user data:", error);
    }
};

// Função para remover dados do usuário do localStorage
const clearStoredUser = () => {
    try {
        localStorage.removeItem('userData');
    } catch (error) {
        console.error("Error clearing user data:", error);
    }
};

export function useAuth() {
    const [user, setUser] = useState(getStoredUser());
    const navigate = useNavigate();

    useEffect(() => {
        setUser(getStoredUser());
    }, []);

    const login = async (credentials) => {
        try {
            const userData = await userAPI.loginUser(credentials);
            setStoredUser(userData);
            setUser(userData);
            alert(
                `Login bem sucedido! Bem-vindo/a ${userData.firstName} ${userData.lastName}!`
            );
            navigate('/');
            return true;
        } catch (error) {
            alert('Login falhou! Por favor verifique as suas credenciais.');
            console.error(error);
            return false;
        }
    };

    const register = async (newUser) => {
        try {
            await userAPI.registerUser(newUser);
            alert('Utilizador registado! Bem-vindo/a, ' + newUser.firstName);
            navigate('/login');
            return true;
        } catch (error) {
            alert('Erro ao registar utilizador. Tente novamente.');
            console.error(error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await userAPI.logoutUser();
            clearStoredUser();
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return { user, login, register, logout };
}
