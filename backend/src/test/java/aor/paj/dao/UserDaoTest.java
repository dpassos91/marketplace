package aor.paj.dao;

import aor.paj.entity.UserEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

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
        // Arrange (fase de preparação do teste)
        UserEntity user = new UserEntity();
        user.setUsername("Joca123");

        // Act (fase de execução da funcionalidade)
        UserEntity result = userDao.create(user);

        // Assert (fase de validação do resultado)
        verify(entityManager).persist(user);
        assertEquals(user, result);
    }

    @Test
    void update() {
        // Arrange
        UserEntity user = new UserEntity();
        user.setUsername("Joca321");

        when(entityManager.merge(user)).thenReturn(user);

        // Act
        UserEntity result = userDao.update(user);

        // Assert
        verify(entityManager).merge(user);
        assertEquals(user, result);
    }

    @Test
    void delete() {
    }

    @Test
    void findById() {
    }

    @Test
    void findAll() {
    }

    @Test
    void findAllActive() {
    }
}