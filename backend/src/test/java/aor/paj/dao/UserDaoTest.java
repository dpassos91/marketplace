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
        UserEntity user = new UserEntity();
        user.setUsername("Joca123");

        // 2. Act (fase de execução da funcionalidade)
        UserEntity result = userDao.create(user);

        // 3. Assert (fase de validação do resultado)
        verify(entityManager).persist(user);
        assertEquals(user, result);
    }

    @Test
    void testUpdate() {
        // 1. Arrange
        UserEntity user = new UserEntity();
        user.setUsername("Joca321");
        //Quando merge(user) for chamado no entityManager, vai ser retornado um objeto "user" em vez de executar a função
        when(entityManager.merge(user)).thenReturn(user);

        // 2. Act
        UserEntity result = userDao.update(user);

        // 3. Assert
        verify(entityManager).merge(user);
        assertEquals(user, result);
    }

    @Test
    void testDelete() {
        // 1. Arrange
        Long userId = 1L; // ID fictício
        UserEntity user = new UserEntity();

        when(entityManager.createNamedQuery("User.findById", UserEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("id", userId)).thenReturn(typedQuery);
        when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(user));

        // 2. Act
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
        // Em baixo vão ser simulados os comportamentos do entityManager e typedQuery
        when(entityManager.createNamedQuery("User.findById", UserEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("id", userId)).thenReturn(typedQuery);
        when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(expectedUser));

        // 2. Act
        UserEntity result = userDao.findById(userId);

        // 3. Assert
        assertEquals(expectedUser, result);
    }

    @Test
    void testFindAll() {
        // 1. Arrange
        List<UserEntity> expectedUsers = Arrays.asList( new UserEntity(), new UserEntity());

        when(entityManager.createNamedQuery("User.findAll", UserEntity.class)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedUsers);

        // 2. Act
        List<UserEntity> result = userDao.findAll();

        // 3. Assert
        assertEquals(expectedUsers, result);
    }

    @Test
    void testFindAllActive() {
        // 1. Arrange
        List<UserEntity> expectedUsers = Arrays.asList( new UserEntity(), new UserEntity());

        when(entityManager.createNamedQuery("User.findByActive", UserEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("isActive", true)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedUsers);

        // 2. Act
        List<UserEntity> result = userDao.findAllActive();

        // 3. Assert
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
    }

    @Test
    void findByToken() {
    }
}