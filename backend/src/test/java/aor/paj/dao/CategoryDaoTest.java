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

import aor.paj.entity.CategoryEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

public class CategoryDaoTest {

  @InjectMocks
  private CategoryDao categoryDao;

  @Mock
  private EntityManager em;

  @Mock
  private TypedQuery<CategoryEntity> typedQuery;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testCreate() {
    // Arrange
    CategoryEntity category = new CategoryEntity();
    category.setName("Test Category");

    // Act
    CategoryEntity result = categoryDao.create(category);

    // Assert
    verify(em).persist(category);
    assertEquals(category, result);
  }

  @Test
  public void testUpdate() {
    // Arrange
    CategoryEntity category = new CategoryEntity();
    category.setId(1L);
    category.setName("Updated Category");

    when(em.merge(category)).thenReturn(category);

    // Act
    CategoryEntity result = categoryDao.update(category);

    // Assert
    verify(em).merge(category);
    assertEquals(category, result);
  }

  @Test
  public void testDeleteExistingCategory() {
    // Arrange
    Long categoryId = 1L;
    CategoryEntity category = new CategoryEntity();

    when(em.createNamedQuery("Category.findById", CategoryEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("id", categoryId)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(category));

    // Act
    boolean result = categoryDao.delete(categoryId);

    // Assert
    assertTrue(result);
    verify(em).remove(category);
  }

  @Test
  public void testDeleteNonExistingCategory() {
    // Arrange
    Long categoryId = 1L;

    when(em.createNamedQuery("Category.findById", CategoryEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("id", categoryId)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.empty());

    // Act
    boolean result = categoryDao.delete(categoryId);

    // Assert
    assertFalse(result);
    verify(em, never()).remove(any());
  }

  @Test
  public void testFindByIdExisting() {
    // Arrange
    Long categoryId = 1L;
    CategoryEntity expectedCategory = new CategoryEntity();
    expectedCategory.setId(categoryId);

    when(em.createNamedQuery("Category.findById", CategoryEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("id", categoryId)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(expectedCategory));

    // Act
    CategoryEntity result = categoryDao.findById(categoryId);

    // Assert
    assertEquals(expectedCategory, result);
  }

  @Test
  public void testFindByIdNonExisting() {
    // Arrange
    Long categoryId = 999L;

    when(em.createNamedQuery("Category.findById", CategoryEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("id", categoryId)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.empty());

    // Act
    CategoryEntity result = categoryDao.findById(categoryId);

    // Assert
    assertNull(result);
  }

  @Test
  public void testFindByNameExisting() {
    // Arrange
    String categoryName = "Test Category";
    CategoryEntity expectedCategory = new CategoryEntity();
    expectedCategory.setName(categoryName);

    when(em.createNamedQuery("Category.findByName", CategoryEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("name", categoryName)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(expectedCategory));

    // Act
    CategoryEntity result = categoryDao.findByName(categoryName);

    // Assert
    assertEquals(expectedCategory, result);
  }

  @Test
  public void testFindByNameNonExisting() {
    // Arrange
    String categoryName = "Non-existent Category";

    when(em.createNamedQuery("Category.findByName", CategoryEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("name", categoryName)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.empty());

    // Act
    CategoryEntity result = categoryDao.findByName(categoryName);

    // Assert
    assertNull(result);
  }

  @Test
  public void testFindAll() {
    // Arrange
    List<CategoryEntity> expectedCategories = Arrays.asList(
        new CategoryEntity(),
        new CategoryEntity());

    when(em.createNamedQuery("Category.findAll", CategoryEntity.class)).thenReturn(typedQuery);
    when(typedQuery.getResultList()).thenReturn(expectedCategories);

    // Act
    List<CategoryEntity> result = categoryDao.findAll();

    // Assert
    assertEquals(expectedCategories, result);
  }

  @Test
  public void testFindAllPaginated() {
    // Arrange
    int offset = 0;
    int limit = 10;
    List<CategoryEntity> expectedCategories = Arrays.asList(
        new CategoryEntity(),
        new CategoryEntity());

    when(em.createNamedQuery("Category.findAll", CategoryEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setFirstResult(offset)).thenReturn(typedQuery);
    when(typedQuery.setMaxResults(limit)).thenReturn(typedQuery);
    when(typedQuery.getResultList()).thenReturn(expectedCategories);

    // Act
    List<CategoryEntity> result = categoryDao.findAllPaginated(offset, limit);

    // Assert
    assertEquals(expectedCategories, result);
    verify(typedQuery).setFirstResult(offset);
    verify(typedQuery).setMaxResults(limit);
  }

  @Test
  public void testCount() {
    // Arrange
    Long expectedCount = 5L;

    // Create a specific mock for TypedQuery<Long>
    @SuppressWarnings("unchecked")
    TypedQuery<Long> longQuery = (TypedQuery<Long>) mock(TypedQuery.class);

    when(em.createQuery("SELECT COUNT(c) FROM CategoryEntity c", Long.class)).thenReturn(longQuery);
    when(longQuery.getSingleResult()).thenReturn(expectedCount);

    // Act
    Long result = categoryDao.count();

    // Assert
    assertEquals(expectedCount, result);
  }

  @Test
  public void testExistsByNameWhenExists() {
    // Arrange
    String categoryName = "Existing Category";
    CategoryEntity existingCategory = new CategoryEntity();
    existingCategory.setName(categoryName);

    when(em.createNamedQuery("Category.findByName", CategoryEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("name", categoryName)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(existingCategory));

    // Act
    boolean result = categoryDao.existsByName(categoryName);

    // Assert
    assertTrue(result);
  }

  @Test
  public void testExistsByNameWhenNotExists() {
    // Arrange
    String categoryName = "Non-existent Category";

    when(em.createNamedQuery("Category.findByName", CategoryEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("name", categoryName)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.empty());

    // Act
    boolean result = categoryDao.existsByName(categoryName);

    // Assert
    assertFalse(result);
  }
}