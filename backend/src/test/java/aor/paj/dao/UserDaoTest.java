package aor.paj.dao;

import aor.paj.entity.UserEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserDaoTest {
    @InjectMocks
    private UserDao userDao;

    @Mock
    private EntityManager entityManager;

    @Mock
    private TypedQuery<UserEntity> typedQuery;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreate() {
        // Arrange, Act e Assert (AAA) é uma abordagem comum para estruturar testes unitários de forma clara e organizada em três fases
        // 1. Arrange (fase de preparação do teste)
        // cria uma nova instância de UserEntity e faz 'set' de um username fictício
        UserEntity user = new UserEntity();
        user.setUsername("Joca123");

        // 2. Act (fase de execução da funcionalidade)
        // chama a função create, passa user como argumento e guarda o resultado em result
        UserEntity result = userDao.create(user);

        // 3. Assert (fase de validação do resultado)
        // verifica se o persist foi chamado durante a execução
        verify(entityManager).persist(user);
        // verifica se o resultado da chamada da função é igual ao utilizador criado
        assertEquals(user, result);
    }

    @Test
    void testUpdate() {
        // 1. Arrange
        // cria uma nova instância de UserEntity e faz 'set' de um novo username fictício
        UserEntity user = new UserEntity();
        user.setUsername("Joca321");
        // quando merge(user) for chamado no entityManager, vai ser retornado um objeto "user" em vez de executar a função
        when(entityManager.merge(user)).thenReturn(user);

        // 2. Act
        // é chamada a função update, passado user como argumento e guardado o resultado
        UserEntity result = userDao.update(user);

        // 3. Assert
        // verifica se o merge foi chamado durante a execução
        verify(entityManager).merge(user);
        // verifica se o resultado da chamada da função é igual ao utilizador criado
        assertEquals(user, result);
    }

    @Test
    void testDelete() {
        // 1. Arrange
        // ID fictício para o user e é criado um objeto UserEntity vazio
        Long userId = 1L; // ID fictício
        UserEntity user = new UserEntity();

        // simula a criação de uma consulta "User.findById" e retorna o mock typedQuery
        when(entityManager.createNamedQuery("User.findById", UserEntity.class)).thenReturn(typedQuery);
        // simula a definição do parâmetro "id" na consulta, retornando o typedQuery atualizado
        when(typedQuery.setParameter("id", userId)).thenReturn(typedQuery);
        // simula a execução da consulta e retorna um Stream com o user fictício
        when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(user));

        // 2. Act
        // chama a função delete e passa o ID como argumento, guardando o resultado
        boolean result = userDao.delete(userId);

        // 3. Assert
        assertTrue(result);
        verify(entityManager).remove(user);
    }

    @Test
    void testFindById() {
        // 1. Arrange
        Long userId = 1L; // ID fictício
        UserEntity expectedUser = new UserEntity(); // user fictício
        expectedUser.setId(userId); // é definido o ID para o user criado
        // simula a criação de uma consulta "User.findById" e retorna o mock typedQuery
        when(entityManager.createNamedQuery("User.findById", UserEntity.class)).thenReturn(typedQuery);
        // simula a definição do parâmetro "id" na consulta, retornando a typedQuery atualizada
        when(typedQuery.setParameter("id", userId)).thenReturn(typedQuery);
        // simula a execução da consulta e retorna um Stream com o utilizador fictício
        when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(expectedUser));

        // 2. Act
        // chama a função findById passando o ID do utilizador e guarda o resultado
        UserEntity result = userDao.findById(userId);

        // 3. Assert
        // verifica se o utilizador retornado é igual ao utilizador esperado
        assertEquals(expectedUser, result);
    }

    @Test
    void testFindAll() {
        // 1. Arrange
        // cria uma lista de utilizadores fictícios para retorno
        List<UserEntity> expectedUsers = Arrays.asList( new UserEntity(), new UserEntity());

        // simula a criação de uma consulta "User.findAll" e retorna o mock typedQuery
        when(entityManager.createNamedQuery("User.findAll", UserEntity.class)).thenReturn(typedQuery);
        // simula a execução da consulta e retorna a lista de utilizadores fictícios
        when(typedQuery.getResultList()).thenReturn(expectedUsers);

        // 2. Act
        // chama a função findAll, que retorna todos os utilizadores
        List<UserEntity> result = userDao.findAll();

        // 3. Assert
        // verifica se o resultado é igual à lista de utilizadores fictícia
        assertEquals(expectedUsers, result);
    }

    @Test
    void testFindAllActive() {
        // 1. Arrange
        // cria uma lista de utilizadores fictícios que estão ativos
        List<UserEntity> expectedUsers = Arrays.asList( new UserEntity(), new UserEntity());

        // simula a criação de uma consulta "User.findByActive" com o parâmetro "isActive=true" e retorna o mock typedQuery
        when(entityManager.createNamedQuery("User.findByActive", UserEntity.class)).thenReturn(typedQuery);
        // simula a definição do parâmetro "isActive" na consulta, retornando a typedQuery atualizada
        when(typedQuery.setParameter("isActive", true)).thenReturn(typedQuery);
        // simula o resultado da consulta e o retorno dos expectedUsers
        when(typedQuery.getResultList()).thenReturn(expectedUsers);

        // 2. Act
        // chama a função "findAllActive" e guarda o resultado
        List<UserEntity> result = userDao.findAllActive();

        // 3. Assert
        // verifica se o resultado é igual aos expectedUsers
        assertEquals(expectedUsers, result);
    }

    @Test
    void findAllUsername() {
        // 1. Arrange
        // mock da lista esperada no retorno com 3 usernames
        List<String> expectedUsernames = Arrays.asList("user1", "user2", "user3");

        // mock da consulta (a consulta deve retornar uma lista de String)
        TypedQuery<String> typedQuery = mock(TypedQuery.class);

        // configuração do comportamento da consulta mock
        when(entityManager.createNamedQuery("User.findAllUsername", String.class)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedUsernames);

        // 2. Act
        // chamada da função e captura do resultado
        List<String> result = userDao.findAllUsername();

        // 3. Assert
        // verificação de se o resultado é igual à lista esperada
        assertEquals(expectedUsernames, result);
    }

    @Test
    void findByUsername() {
        // 1. Arrange
        // username fictício, inicialização de um objeto do tipo UserEntity e 'set' do username fictício no objeto
        String username = "Joca123";
        UserEntity expectedUser = new UserEntity();
        expectedUser.setUsername(username);

        // configuração do comportamento da consulta mock
        when(entityManager.createNamedQuery("User.findByUsername", UserEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("username", username)).thenReturn(typedQuery);
        when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(expectedUser));

        // 2. Act
        // chamada da função findByUsername e captura do resultado
        UserEntity result = userDao.findByUsername(username);

        // 3. Assert
        // verificação de se o resultado é igual ao objeto esperado
        assertEquals(expectedUser, result);
    }

    @Test
    void findByToken() {
        // 1. Arrange
        // token fictícia e inicialização de um objeto UserEntity para fazer 'set' ao token
        String token = "abc123";
        UserEntity expectedUser = new UserEntity();
        expectedUser.setToken(token);

        // configuração do comportamento da consulta mock
        when(entityManager.createNamedQuery("User.findByToken", UserEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("token", token)).thenReturn(typedQuery);
        when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(expectedUser));

        // 2. Act
        // chamada da função findByToken sendo passado o token como argumento
        UserEntity result = userDao.findByToken(token);

        // 3. Assert
        // verificação de se o resultado é igual ao objeto esperado
        assertEquals(expectedUser, result);
    }
}