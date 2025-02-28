package aor.paj.dao;

import aor.paj.entity.UserEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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

    }

    @Test
    void testFindById() {
        // 1. Arrange
        Long userId = 1L; // ID fictício "1L"
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
    void findAll() {
    }

    @Test
    void findAllActive() {
    }
}