package aor.paj.dao;

import aor.paj.entity.UserEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.lang.reflect.Type;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

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
        // Arrange
        UserEntity user = new UserEntity();
        user.setUsername("Joca123");

        // Act
        UserEntity result = userDao.create(user);

        // Assert
        verify(entityManager).persist(user);
        assertEquals(user, result);
    }

    @Test
    void update() {
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