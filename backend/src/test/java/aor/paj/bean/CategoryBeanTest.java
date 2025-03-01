package aor.paj.bean;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import aor.paj.dao.CategoryDao;
import aor.paj.dto.CategoryDto;
import aor.paj.entity.CategoryEntity;

public class CategoryBeanTest {

  @InjectMocks
  private CategoryBean categoryBean;

  @Mock
  private CategoryDao categoryDao;

  @BeforeEach
  public void setup() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testAddCategory_Success() {
    // Arrange
    CategoryDto inputDto = new CategoryDto("Electronics");

    when(categoryDao.existsByName("Electronics")).thenReturn(false);

    CategoryEntity savedEntity = new CategoryEntity("Electronics");
    savedEntity.setId(1L);
    when(categoryDao.create(any(CategoryEntity.class))).thenReturn(savedEntity);

    // Act
    CategoryDto result = categoryBean.addCategory(inputDto);

    // Assert
    assertNotNull(result);
    assertEquals(1L, result.getId());
    assertEquals("Electronics", result.getName());
    verify(categoryDao).existsByName("Electronics");
    verify(categoryDao).create(any(CategoryEntity.class));
  }

  @Test
  public void testAddCategory_AlreadyExists() {
    // Arrange
    CategoryDto inputDto = new CategoryDto("Electronics");

    when(categoryDao.existsByName("Electronics")).thenReturn(true);

    // Act
    CategoryDto result = categoryBean.addCategory(inputDto);

    // Assert
    assertNull(result);
    verify(categoryDao).existsByName("Electronics");
    verify(categoryDao, never()).create(any(CategoryEntity.class));
  }

  @Test
  public void testAddCategory_NullInput() {
    // Act
    CategoryDto result = categoryBean.addCategory(null);

    // Assert
    assertNull(result);
    verify(categoryDao, never()).existsByName(anyString());
    verify(categoryDao, never()).create(any(CategoryEntity.class));
  }

  @Test
  public void testGetCategoryById_Found() {
    // Arrange
    Long categoryId = 1L;
    CategoryEntity categoryEntity = new CategoryEntity("Electronics");
    categoryEntity.setId(categoryId);

    when(categoryDao.findById(categoryId)).thenReturn(categoryEntity);

    // Act
    CategoryDto result = categoryBean.getCategoryById(categoryId);

    // Assert
    assertNotNull(result);
    assertEquals(categoryId, result.getId());
    assertEquals("Electronics", result.getName());
    verify(categoryDao).findById(categoryId);
  }

  @Test
  public void testGetCategoryById_NotFound() {
    // Arrange
    Long categoryId = 999L;
    when(categoryDao.findById(categoryId)).thenReturn(null);

    // Act
    CategoryDto result = categoryBean.getCategoryById(categoryId);

    // Assert
    assertNull(result);
    verify(categoryDao).findById(categoryId);
  }

  @Test
  public void testGetCategoryByName_Found() {
    // Arrange
    String categoryName = "Electronics";
    CategoryEntity categoryEntity = new CategoryEntity(categoryName);
    categoryEntity.setId(1L);

    when(categoryDao.findByName(categoryName)).thenReturn(categoryEntity);

    // Act
    CategoryDto result = categoryBean.getCategoryByName(categoryName);

    // Assert
    assertNotNull(result);
    assertEquals(1L, result.getId());
    assertEquals(categoryName, result.getName());
    verify(categoryDao).findByName(categoryName);
  }

  @Test
  public void testGetCategoryByName_NotFound() {
    // Arrange
    String categoryName = "NonExistentCategory";
    when(categoryDao.findByName(categoryName)).thenReturn(null);

    // Act
    CategoryDto result = categoryBean.getCategoryByName(categoryName);

    // Assert
    assertNull(result);
    verify(categoryDao).findByName(categoryName);
  }

  @Test
  public void testGetAllCategories_WithResults() {
    // Arrange
    CategoryEntity entity1 = new CategoryEntity("Electronics");
    entity1.setId(1L);
    CategoryEntity entity2 = new CategoryEntity("Books");
    entity2.setId(2L);

    List<CategoryEntity> entityList = Arrays.asList(entity1, entity2);
    when(categoryDao.findAll()).thenReturn(entityList);

    // Act
    List<CategoryDto> results = categoryBean.getAllCategories();

    // Assert
    assertNotNull(results);
    assertEquals(2, results.size());
    assertEquals("Electronics", results.get(0).getName());
    assertEquals("Books", results.get(1).getName());
    verify(categoryDao).findAll();
  }

  @Test
  public void testGetAllCategories_EmptyList() {
    // Arrange
    when(categoryDao.findAll()).thenReturn(Collections.emptyList());

    // Act
    List<CategoryDto> results = categoryBean.getAllCategories();

    // Assert
    assertNotNull(results);
    assertTrue(results.isEmpty());
    verify(categoryDao).findAll();
  }

  @Test
  public void testGetCategoriesPaginated_WithResults() {
    // Arrange
    int page = 0;
    int pageSize = 10;
    int offset = page * pageSize;

    CategoryEntity entity1 = new CategoryEntity("Electronics");
    entity1.setId(1L);
    CategoryEntity entity2 = new CategoryEntity("Books");
    entity2.setId(2L);

    List<CategoryEntity> entityList = Arrays.asList(entity1, entity2);
    when(categoryDao.findAllPaginated(offset, pageSize)).thenReturn(entityList);

    // Act
    List<CategoryDto> results = categoryBean.getCategoriesPaginated(page, pageSize);

    // Assert
    assertNotNull(results);
    assertEquals(2, results.size());
    assertEquals("Electronics", results.get(0).getName());
    assertEquals("Books", results.get(1).getName());
    verify(categoryDao).findAllPaginated(offset, pageSize);
  }

  @Test
  public void testGetCategoriesPaginated_EmptyList() {
    // Arrange
    int page = 10;
    int pageSize = 10;
    int offset = page * pageSize;

    when(categoryDao.findAllPaginated(offset, pageSize)).thenReturn(Collections.emptyList());

    // Act
    List<CategoryDto> results = categoryBean.getCategoriesPaginated(page, pageSize);

    // Assert
    assertNotNull(results);
    assertTrue(results.isEmpty());
    verify(categoryDao).findAllPaginated(offset, pageSize);
  }

  @Test
  public void testGetCategoryCount() {
    // Arrange
    Long expectedCount = 42L;
    when(categoryDao.count()).thenReturn(expectedCount);

    // Act
    Long result = categoryBean.getCategoryCount();

    // Assert
    assertEquals(expectedCount, result);
    verify(categoryDao).count();
  }

  @Test
  public void testUpdateCategory_Success() {
    // Arrange
    Long categoryId = 1L;
    CategoryDto inputDto = new CategoryDto(categoryId, "Updated Electronics");

    CategoryEntity existingEntity = new CategoryEntity("Electronics");
    existingEntity.setId(categoryId);
    when(categoryDao.findById(categoryId)).thenReturn(existingEntity);

    // No other category with this name
    when(categoryDao.findByName("Updated Electronics")).thenReturn(null);

    // Updated entity
    CategoryEntity updatedEntity = new CategoryEntity("Updated Electronics");
    updatedEntity.setId(categoryId);
    when(categoryDao.update(any(CategoryEntity.class))).thenReturn(updatedEntity);

    // Act
    CategoryDto result = categoryBean.updateCategory(inputDto);

    // Assert
    assertNotNull(result);
    assertEquals(categoryId, result.getId());
    assertEquals("Updated Electronics", result.getName());
    verify(categoryDao).findById(categoryId);
    verify(categoryDao).findByName("Updated Electronics");
    verify(categoryDao).update(any(CategoryEntity.class));
  }

  @Test
  public void testUpdateCategory_NameAlreadyExists() {
    // Arrange
    Long categoryId = 1L;
    CategoryDto inputDto = new CategoryDto(categoryId, "Books");

    CategoryEntity existingEntity = new CategoryEntity("Electronics");
    existingEntity.setId(categoryId);
    when(categoryDao.findById(categoryId)).thenReturn(existingEntity);

    // Another category already uses this name
    CategoryEntity conflictingEntity = new CategoryEntity("Books");
    conflictingEntity.setId(2L); // Different ID
    when(categoryDao.findByName("Books")).thenReturn(conflictingEntity);

    // Act
    CategoryDto result = categoryBean.updateCategory(inputDto);

    // Assert
    assertNull(result);
    verify(categoryDao).findById(categoryId);
    verify(categoryDao).findByName("Books");
    verify(categoryDao, never()).update(any(CategoryEntity.class));
  }

  @Test
  public void testUpdateCategory_SameNameAsExisting() {
    // Arrange
    Long categoryId = 1L;
    CategoryDto inputDto = new CategoryDto(categoryId, "Electronics");

    CategoryEntity existingEntity = new CategoryEntity("Electronics");
    existingEntity.setId(categoryId);
    when(categoryDao.findById(categoryId)).thenReturn(existingEntity);

    // Updated entity (same name)
    when(categoryDao.update(any(CategoryEntity.class))).thenReturn(existingEntity);

    // Act
    CategoryDto result = categoryBean.updateCategory(inputDto);

    // Assert
    assertNotNull(result);
    assertEquals(categoryId, result.getId());
    assertEquals("Electronics", result.getName());
    verify(categoryDao).findById(categoryId);
    verify(categoryDao, never()).findByName(anyString()); // Should not check name if it's the same
    verify(categoryDao).update(any(CategoryEntity.class));
  }

  @Test
  public void testUpdateCategory_CategoryNotFound() {
    // Arrange
    Long categoryId = 999L;
    CategoryDto inputDto = new CategoryDto(categoryId, "NonExistent");

    when(categoryDao.findById(categoryId)).thenReturn(null);

    // Act
    CategoryDto result = categoryBean.updateCategory(inputDto);

    // Assert
    assertNull(result);
    verify(categoryDao).findById(categoryId);
    verify(categoryDao, never()).findByName(anyString());
    verify(categoryDao, never()).update(any(CategoryEntity.class));
  }

  @Test
  public void testUpdateCategory_NullInput() {
    // Act
    CategoryDto result = categoryBean.updateCategory(null);

    // Assert
    assertNull(result);
    verify(categoryDao, never()).findById(anyLong());
    verify(categoryDao, never()).update(any(CategoryEntity.class));
  }

  @Test
  public void testUpdateCategory_NullId() {
    // Arrange
    CategoryDto inputDto = new CategoryDto("No ID Category");

    // Act
    CategoryDto result = categoryBean.updateCategory(inputDto);

    // Assert
    assertNull(result);
    verify(categoryDao, never()).findById(anyLong());
    verify(categoryDao, never()).update(any(CategoryEntity.class));
  }

  @Test
  public void testDeleteCategory_Success() {
    // Arrange
    Long categoryId = 1L;
    when(categoryDao.delete(categoryId)).thenReturn(true);

    // Act
    boolean result = categoryBean.deleteCategory(categoryId);

    // Assert
    assertTrue(result);
    verify(categoryDao).delete(categoryId);
  }

  @Test
  public void testDeleteCategory_Failure() {
    // Arrange
    Long categoryId = 999L;
    when(categoryDao.delete(categoryId)).thenReturn(false);

    // Act
    boolean result = categoryBean.deleteCategory(categoryId);

    // Assert
    assertFalse(result);
    verify(categoryDao).delete(categoryId);
  }

  @Test
  public void testCategoryExists_True() {
    // Arrange
    String categoryName = "Electronics";
    when(categoryDao.existsByName(categoryName)).thenReturn(true);

    // Act
    boolean result = categoryBean.categoryExists(categoryName);

    // Assert
    assertTrue(result);
    verify(categoryDao).existsByName(categoryName);
  }

  @Test
  public void testCategoryExists_False() {
    // Arrange
    String categoryName = "NonExistentCategory";
    when(categoryDao.existsByName(categoryName)).thenReturn(false);

    // Act
    boolean result = categoryBean.categoryExists(categoryName);

    // Assert
    assertFalse(result);
    verify(categoryDao).existsByName(categoryName);
  }
}