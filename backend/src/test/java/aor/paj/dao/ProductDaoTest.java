package aor.paj.dao;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import aor.paj.entity.ProductEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

public class ProductDaoTest {

    @InjectMocks
    private ProductDao productDao;

    @Mock
    private EntityManager em;

    @Mock
    private TypedQuery<ProductEntity> typedQuery;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreate() {
        // Arrange
        ProductEntity product = new ProductEntity();
        product.setTitle("Test Product");
        product.setDescription("Test Description");

        // Act
        ProductEntity result = productDao.create(product);

        // Assert
        verify(em).persist(product);
        assertEquals(product, result);
    }

    @Test
    public void testUpdate() {
        // Arrange
        ProductEntity product = new ProductEntity();
        product.setId(1L);
        product.setTitle("Updated Product");

        when(em.merge(product)).thenReturn(product);

        // Act
        ProductEntity result = productDao.update(product);

        // Assert
        verify(em).merge(product);
        assertEquals(product, result);
    }

    @Test
    public void testDeleteExistingProduct() {
        // Arrange
        Long productId = 1L;
        ProductEntity product = new ProductEntity();

        when(em.createNamedQuery("Product.findById", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("id", productId)).thenReturn(typedQuery);
        when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(product));

        // Act
        boolean result = productDao.delete(productId);

        // Assert
        assertTrue(result);
        verify(em).remove(product);
    }

    @Test
    public void testDeleteNonExistingProduct() {
        // Arrange
        Long productId = 1L;

        when(em.createNamedQuery("Product.findById", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("id", productId)).thenReturn(typedQuery);
        when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.empty());

        // Act
        boolean result = productDao.delete(productId);

        // Assert
        assertFalse(result);
        verify(em, never()).remove(any());
    }

    @Test
    public void testFindById() {
        // Arrange
        Long productId = 1L;
        ProductEntity expectedProduct = new ProductEntity();
        expectedProduct.setId(productId);

        when(em.createNamedQuery("Product.findById", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("id", productId)).thenReturn(typedQuery);
        when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(expectedProduct));

        // Act
        ProductEntity result = productDao.findById(productId);

        // Assert
        assertEquals(expectedProduct, result);
    }

    @Test
    public void testFindByIdNotFound() {
        // Arrange
        Long productId = 999L;

        when(em.createNamedQuery("Product.findById", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("id", productId)).thenReturn(typedQuery);
        when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.empty());

        // Act
        ProductEntity result = productDao.findById(productId);

        // Assert
        assertNull(result);
    }

    @Test
    public void testFindAll() {
        // Arrange
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        when(em.createNamedQuery("Product.findAll", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findAll();

        // Assert
        assertEquals(expectedProducts, result);
    }

    @Test
    public void testFindAllActive() {
        // Arrange
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        when(em.createNamedQuery("Product.findByActive", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("active", true)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findAllActive();

        // Assert
        assertEquals(expectedProducts, result);
    }

    @Test
    public void testFindByCategory() {
        // Arrange
        Long categoryId = 1L;
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        when(em.createNamedQuery("Product.findByCategory", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("categoryId", categoryId)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findByCategory(categoryId);

        // Assert
        assertEquals(expectedProducts, result);
        verify(typedQuery).setParameter("categoryId", categoryId);
    }

    @Test
    public void testFindBySeller() {
        // Arrange
        Long userId = 1L;
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        when(em.createNamedQuery("Product.findByUser", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("userId", userId)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findBySeller(userId);

        // Assert
        assertEquals(expectedProducts, result);
        verify(typedQuery).setParameter("userId", userId);
    }

    @Test
    public void testFindByTitle() {
        // Arrange
        String title = "Test";
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        when(em.createNamedQuery("Product.findByTitle", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("title", "%" + title + "%")).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findByTitle(title);

        // Assert
        assertEquals(expectedProducts, result);
        verify(typedQuery).setParameter("title", "%" + title + "%");
    }

    @Test
    public void testFindByLocation() {
        // Arrange
        String location = "Lisbon";
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        when(em.createNamedQuery("Product.findByLocation", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("location", "%" + location + "%")).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findByLocation(location);

        // Assert
        assertEquals(expectedProducts, result);
        verify(typedQuery).setParameter("location", "%" + location + "%");
    }

    @Test
    public void testFindByStateId() {
        // Arrange
        int stateId = 1; // Any valid state ID
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        TypedQuery<ProductEntity> mockQuery = mock(TypedQuery.class);
        when(em.createQuery("SELECT p FROM ProductEntity p WHERE p.stateId = :stateId", ProductEntity.class))
                .thenReturn(mockQuery);
        when(mockQuery.setParameter("stateId", stateId)).thenReturn(mockQuery);
        when(mockQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findByStateId(stateId);

        // Assert
        assertEquals(expectedProducts, result);
        verify(mockQuery).setParameter("stateId", stateId);
    }

    @Test
    public void testFindByStatus() {
        // Arrange
        String validStatus = "Reservado"; // Must match exactly what enum accepts

        // Mock findByStateId to return data when called with the right state ID
        int expectedStateId = 3; // Whatever stateId corresponds to "Reservado"
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        // Create typed query mock for findByStateId
        TypedQuery<ProductEntity> stateIdQuery = mock(TypedQuery.class);
        when(em.createQuery("SELECT p FROM ProductEntity p WHERE p.stateId = :stateId", ProductEntity.class))
                .thenReturn(stateIdQuery);
        when(stateIdQuery.setParameter("stateId", expectedStateId)).thenReturn(stateIdQuery);
        when(stateIdQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findByStatus(validStatus);

        // Assert - if valid, should call the findByStateId method
        assertEquals(expectedProducts, result);

        // Test invalid status
        String invalidStatus = "INVALID_STATUS";
        List<ProductEntity> invalidResult = productDao.findByStatus(invalidStatus);
        assertTrue(invalidResult.isEmpty());
    }

    @Test
    public void testFindAllPaginated() {
        // Arrange
        int offset = 0;
        int limit = 10;
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        when(em.createNamedQuery("Product.findAll", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setFirstResult(offset)).thenReturn(typedQuery);
        when(typedQuery.setMaxResults(limit)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findAllPaginated(offset, limit);

        // Assert
        assertEquals(expectedProducts, result);
        verify(typedQuery).setFirstResult(offset);
        verify(typedQuery).setMaxResults(limit);
    }

    @Test
    public void testFindAllActivePaginated() {
        // Arrange
        int offset = 0;
        int limit = 10;
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        when(em.createNamedQuery("Product.findByActive", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("active", true)).thenReturn(typedQuery);
        when(typedQuery.setFirstResult(offset)).thenReturn(typedQuery);
        when(typedQuery.setMaxResults(limit)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findAllActivePaginated(offset, limit);

        // Assert
        assertEquals(expectedProducts, result);
        verify(typedQuery).setParameter("active", true);
        verify(typedQuery).setFirstResult(offset);
        verify(typedQuery).setMaxResults(limit);
    }

    @Test
    public void testFindByCategoryPaginated() {
        // Arrange
        Long categoryId = 1L;
        int offset = 0;
        int limit = 10;
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        when(em.createNamedQuery("Product.findByCategory", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("categoryId", categoryId)).thenReturn(typedQuery);
        when(typedQuery.setFirstResult(offset)).thenReturn(typedQuery);
        when(typedQuery.setMaxResults(limit)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findByCategoryPaginated(categoryId, offset, limit);

        // Assert
        assertEquals(expectedProducts, result);
        verify(typedQuery).setParameter("categoryId", categoryId);
        verify(typedQuery).setFirstResult(offset);
        verify(typedQuery).setMaxResults(limit);
    }

    @Test
    public void testFindBySellerPaginated() {
        // Arrange
        Long userId = 1L;
        int offset = 0;
        int limit = 10;
        List<ProductEntity> expectedProducts = Arrays.asList(
                new ProductEntity(),
                new ProductEntity());

        when(em.createNamedQuery("Product.findByUser", ProductEntity.class)).thenReturn(typedQuery);
        when(typedQuery.setParameter("userId", userId)).thenReturn(typedQuery);
        when(typedQuery.setFirstResult(offset)).thenReturn(typedQuery);
        when(typedQuery.setMaxResults(limit)).thenReturn(typedQuery);
        when(typedQuery.getResultList()).thenReturn(expectedProducts);

        // Act
        List<ProductEntity> result = productDao.findBySellerPaginated(userId, offset, limit);

        // Assert
        assertEquals(expectedProducts, result);
        verify(typedQuery).setParameter("userId", userId);
        verify(typedQuery).setFirstResult(offset);
        verify(typedQuery).setMaxResults(limit);
    }

    @Test
    public void testCount() {
        // Arrange
        Long expectedCount = 5L;

        @SuppressWarnings("unchecked")
        TypedQuery<Long> longQuery = (TypedQuery<Long>) mock(TypedQuery.class);

        when(em.createQuery("SELECT COUNT(p) FROM ProductEntity p", Long.class)).thenReturn(longQuery);
        when(longQuery.getSingleResult()).thenReturn(expectedCount);

        // Act
        Long result = productDao.count();

        // Assert
        assertEquals(expectedCount, result);
    }

    @Test
    public void testCountActive() {
        // Arrange
        Long expectedCount = 3L;

        @SuppressWarnings("unchecked")
        TypedQuery<Long> longQuery = (TypedQuery<Long>) mock(TypedQuery.class);

        when(em.createQuery("SELECT COUNT(p) FROM ProductEntity p WHERE p.active = true", Long.class))
                .thenReturn(longQuery);
        when(longQuery.getSingleResult()).thenReturn(expectedCount);

        // Act
        Long result = productDao.countActive();

        // Assert
        assertEquals(expectedCount, result);
    }

    @Test
    public void testCountByCategory() {
        // Arrange
        Long categoryId = 1L;
        Long expectedCount = 2L;

        @SuppressWarnings("unchecked")
        TypedQuery<Long> longQuery = (TypedQuery<Long>) mock(TypedQuery.class);

        when(em.createQuery("SELECT COUNT(p) FROM ProductEntity p WHERE p.category.id = :categoryId", Long.class))
                .thenReturn(longQuery);
        when(longQuery.setParameter("categoryId", categoryId)).thenReturn(longQuery);
        when(longQuery.getSingleResult()).thenReturn(expectedCount);

        // Act
        Long result = productDao.countByCategory(categoryId);

        // Assert
        assertEquals(expectedCount, result);
        verify(longQuery).setParameter("categoryId", categoryId);
    }

    @Test
    public void testCountBySeller() {
        // Arrange
        Long userId = 1L;
        Long expectedCount = 2L;

        @SuppressWarnings("unchecked")
        TypedQuery<Long> longQuery = (TypedQuery<Long>) mock(TypedQuery.class);

        when(em.createQuery("SELECT COUNT(p) FROM ProductEntity p WHERE p.seller.id = :userId", Long.class))
                .thenReturn(longQuery);
        when(longQuery.setParameter("userId", userId)).thenReturn(longQuery);
        when(longQuery.getSingleResult()).thenReturn(expectedCount);

        // Act
        Long result = productDao.countBySeller(userId);

        // Assert
        assertEquals(expectedCount, result);
        verify(longQuery).setParameter("userId", userId);
    }
}