package aor.paj.bean;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.ProductDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.ProductDto;
import aor.paj.entity.CategoryEntity;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import aor.paj.util.ProductStateId;

public class ProductBeanTest {

    @InjectMocks
    private ProductBean productBean;

    @Mock
    private ProductDao productDao;

    @Mock
    private UserDao userDao;

    @Mock
    private CategoryDao categoryDao;

    private UserEntity seller;
    private UserEntity buyer;
    private CategoryEntity category;
    private ProductEntity productEntity;
    private ProductDto productDto;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        // Set up test data
        seller = new UserEntity();
        seller.setId(1L);
        seller.setUsername("seller");

        buyer = new UserEntity();
        buyer.setId(2L);
        buyer.setUsername("buyer");

        category = new CategoryEntity();
        category.setId(1L);
        category.setName("Electronics");

        productEntity = new ProductEntity();
        productEntity.setId(1L);
        productEntity.setTitle("Test Product");
        productEntity.setDescription("Test Description");
        productEntity.setPrice(99.99);
        productEntity.setLocation("Test Location");
        productEntity.setImageUrl("test.jpg");
        productEntity.setStateId(ProductStateId.DISPONIVEL.getStateId());
        productEntity.setActive(true);
        productEntity.setDate(LocalDate.now());
        productEntity.setSeller(seller);
        productEntity.setCategory(category);

        productDto = new ProductDto();
        productDto.setId(1L);
        productDto.setTitle("Test Product");
        productDto.setDescription("Test Description");
        productDto.setPrice(99.99);
        productDto.setLocation("Test Location");
        productDto.setImageUrl("test.jpg");
        productDto.setProductState(ProductStateId.DISPONIVEL);
        productDto.setDate(LocalDate.now().format(DATE_FORMATTER));
        productDto.setSellerId(1L);
        productDto.setCategoryId(1L);
    }

    @Test
    public void testAddProduct_Success() {
        // Arrange
        when(userDao.findById(anyLong())).thenReturn(seller);
        when(categoryDao.findById(anyLong())).thenReturn(category);
        when(productDao.create(any(ProductEntity.class))).thenReturn(productEntity);

        // Act
        ProductDto result = productBean.addProduct(productDto);

        // Assert
        assertNotNull(result);
        assertEquals(productEntity.getId(), result.getId());
        assertEquals(productEntity.getTitle(), result.getTitle());

        // Verify
        verify(userDao).findById(productDto.getSellerId());
        verify(categoryDao).findById(productDto.getCategoryId());
        verify(productDao).create(any(ProductEntity.class));
    }

    @Test
    public void testAddProduct_NullProduct() {
        // Act
        ProductDto result = productBean.addProduct(null);

        // Assert
        assertNull(result);
        verify(userDao, never()).findById(anyLong());
        verify(categoryDao, never()).findById(anyLong());
        verify(productDao, never()).create(any(ProductEntity.class));
    }

    @Test
    public void testAddProduct_SellerNotFound() {
        // Arrange
        when(userDao.findById(anyLong())).thenReturn(null);
        when(categoryDao.findById(anyLong())).thenReturn(category);

        // Act
        ProductDto result = productBean.addProduct(productDto);

        // Assert
        assertNull(result);
        verify(userDao).findById(productDto.getSellerId());
        verify(categoryDao).findById(productDto.getCategoryId());
        verify(productDao, never()).create(any(ProductEntity.class));
    }

    @Test
    public void testAddProduct_CategoryNotFound() {
        // Arrange
        when(userDao.findById(anyLong())).thenReturn(seller);
        when(categoryDao.findById(anyLong())).thenReturn(null);

        // Act
        ProductDto result = productBean.addProduct(productDto);

        // Assert
        assertNull(result);
        verify(userDao).findById(productDto.getSellerId());
        verify(categoryDao).findById(productDto.getCategoryId());
        verify(productDao, never()).create(any(ProductEntity.class));
    }

    @Test
    public void testGetProductById_Success() {
        // Arrange
        when(productDao.findById(anyLong())).thenReturn(productEntity);

        // Act
        ProductDto result = productBean.getProductById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(productEntity.getId(), result.getId());
        assertEquals(productEntity.getTitle(), result.getTitle());
        assertEquals(productEntity.getDescription(), result.getDescription());
        assertEquals(productEntity.getPrice(), result.getPrice());
        verify(productDao).findById(1L);
    }

    @Test
    public void testGetProductById_NotFound() {
        // Arrange
        when(productDao.findById(anyLong())).thenReturn(null);

        // Act
        ProductDto result = productBean.getProductById(999L);

        // Assert
        assertNull(result);
        verify(productDao).findById(999L);
    }

    @Test
    public void testGetAllProducts() {
        // Arrange
        List<ProductEntity> entities = Arrays.asList(productEntity);
        when(productDao.findAll()).thenReturn(entities);

        // Act
        List<ProductDto> results = productBean.getAllProducts();

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(productEntity.getId(), results.get(0).getId());
        assertEquals(productEntity.getTitle(), results.get(0).getTitle());
        verify(productDao).findAll();
    }

    @Test
    public void testGetAllProducts_EmptyList() {
        // Arrange
        when(productDao.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<ProductDto> results = productBean.getAllProducts();

        // Assert
        assertNotNull(results);
        assertTrue(results.isEmpty());
        verify(productDao).findAll();
    }

    @Test
    public void testGetAllActiveProducts() {
        // Arrange
        List<ProductEntity> entities = Arrays.asList(productEntity);
        when(productDao.findAllActive()).thenReturn(entities);

        // Act
        List<ProductDto> results = productBean.getAllActiveProducts();

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(productEntity.getId(), results.get(0).getId());
        verify(productDao).findAllActive();
    }

    @Test
    public void testGetProductsByCategory() {
        // Arrange
        List<ProductEntity> entities = Arrays.asList(productEntity);
        when(productDao.findByCategory(anyLong())).thenReturn(entities);

        // Act
        List<ProductDto> results = productBean.getProductsByCategory(1L);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(productEntity.getId(), results.get(0).getId());
        verify(productDao).findByCategory(1L);
    }

    @Test
    public void testGetProductsBySeller() {
        // Arrange
        List<ProductEntity> entities = Arrays.asList(productEntity);
        when(productDao.findBySeller(anyLong())).thenReturn(entities);

        // Act
        List<ProductDto> results = productBean.getProductsBySeller(1L);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(productEntity.getId(), results.get(0).getId());
        verify(productDao).findBySeller(1L);
    }

    @Test
    public void testGetProductsByTitle() {
        // Arrange
        List<ProductEntity> entities = Arrays.asList(productEntity);
        when(productDao.findByTitle(anyString())).thenReturn(entities);

        // Act
        List<ProductDto> results = productBean.getProductsByTitle("Test");

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(productEntity.getId(), results.get(0).getId());
        verify(productDao).findByTitle("Test");
    }

    @Test
    public void testGetProductsByLocation() {
        // Arrange
        List<ProductEntity> entities = Arrays.asList(productEntity);
        when(productDao.findByLocation(anyString())).thenReturn(entities);

        // Act
        List<ProductDto> results = productBean.getProductsByLocation("Test Location");

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(productEntity.getId(), results.get(0).getId());
        verify(productDao).findByLocation("Test Location");
    }

    @Test
    public void testGetProductsByStatus() {
        // Arrange
        List<ProductEntity> entities = Arrays.asList(productEntity);
        when(productDao.findByStatus(anyString())).thenReturn(entities);

        // Act
        List<ProductDto> results = productBean.getProductsByStatus("Available");

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(productEntity.getId(), results.get(0).getId());
        verify(productDao).findByStatus("Available");
    }

    @Test
    public void testUpdateProduct_Success() {
        // Arrange
        ProductDto updateDto = new ProductDto();
        updateDto.setId(1L);
        updateDto.setTitle("Updated Title");
        updateDto.setDescription("Updated Description");
        updateDto.setPrice(199.99);

        when(productDao.findById(anyLong())).thenReturn(productEntity);
        when(productDao.update(any(ProductEntity.class))).thenReturn(productEntity);

        // Act
        ProductDto result = productBean.updateProduct(updateDto);

        // Assert
        assertNotNull(result);
        verify(productDao).findById(1L);
        verify(productDao).update(any(ProductEntity.class));
    }

    @Test
    public void testUpdateProduct_WithCategoryAndBuyer() {
        // Arrange
        ProductDto updateDto = new ProductDto();
        updateDto.setId(1L);
        updateDto.setTitle("Updated Title");
        updateDto.setCategoryId(2L);
        updateDto.setBuyerId(3L);

        CategoryEntity newCategory = new CategoryEntity();
        newCategory.setId(2L);
        newCategory.setName("New Category");

        UserEntity newBuyer = new UserEntity();
        newBuyer.setId(3L);
        newBuyer.setUsername("newBuyer");

        when(productDao.findById(anyLong())).thenReturn(productEntity);
        when(categoryDao.findById(2L)).thenReturn(newCategory);
        when(userDao.findById(3L)).thenReturn(newBuyer);
        when(productDao.update(any(ProductEntity.class))).thenReturn(productEntity);

        // Act
        ProductDto result = productBean.updateProduct(updateDto);

        // Assert
        assertNotNull(result);
        verify(productDao).findById(1L);
        verify(categoryDao).findById(2L);
        verify(userDao).findById(3L);
        verify(productDao).update(any(ProductEntity.class));
    }

    @Test
    public void testUpdateProduct_NotFound() {
        // Arrange
        ProductDto updateDto = new ProductDto();
        updateDto.setId(999L);
        updateDto.setTitle("Updated Title");

        when(productDao.findById(999L)).thenReturn(null);

        // Act
        ProductDto result = productBean.updateProduct(updateDto);

        // Assert
        assertNull(result);
        verify(productDao).findById(999L);
        verify(productDao, never()).update(any(ProductEntity.class));
    }

    @Test
    public void testUpdateProduct_NullDto() {
        // Act
        ProductDto result = productBean.updateProduct(null);

        // Assert
        assertNull(result);
        verify(productDao, never()).findById(anyLong());
        verify(productDao, never()).update(any(ProductEntity.class));
    }

    @Test
    public void testUpdateProduct_NullId() {
        // Arrange
        ProductDto updateDto = new ProductDto();
        updateDto.setTitle("Updated Title");

        // Act
        ProductDto result = productBean.updateProduct(updateDto);

        // Assert
        assertNull(result);
        verify(productDao, never()).findById(anyLong());
        verify(productDao, never()).update(any(ProductEntity.class));
    }

    @Test
    public void testUpdateProductStatus_Success() {
        // Arrange
        when(productDao.findById(anyLong())).thenReturn(productEntity);
        when(productDao.update(any(ProductEntity.class))).thenReturn(productEntity);

        // Act
        ProductDto result = productBean.updateProductStatus(1L, ProductStateId.RESERVADO.getStateId());

        // Assert
        assertNotNull(result);
        verify(productDao).findById(1L);
        verify(productDao).update(any(ProductEntity.class));
    }

    @Test
    public void testUpdateProductStatus_ProductNotFound() {
        // Arrange
        when(productDao.findById(anyLong())).thenReturn(null);

        // Act
        ProductDto result = productBean.updateProductStatus(999L, ProductStateId.RESERVADO.getStateId());

        // Assert
        assertNull(result);
        verify(productDao).findById(999L);
        verify(productDao, never()).update(any(ProductEntity.class));
    }

    @Test
    public void testMarkProductAsPurchased_Success() {
        // Arrange
        when(productDao.findById(anyLong())).thenReturn(productEntity);
        when(userDao.findById(anyLong())).thenReturn(buyer);
        when(productDao.update(any(ProductEntity.class))).thenReturn(productEntity);

        // Act
        ProductDto result = productBean.markProductAsPurchased(1L, 2L);

        // Assert
        assertNotNull(result);
        verify(productDao).findById(1L);
        verify(userDao).findById(2L);
        verify(productDao).update(any(ProductEntity.class));
    }

    @Test
    public void testMarkProductAsPurchased_ProductNotFound() {
        // Arrange
        when(productDao.findById(anyLong())).thenReturn(null);
        when(userDao.findById(anyLong())).thenReturn(buyer);

        // Act
        ProductDto result = productBean.markProductAsPurchased(999L, 2L);

        // Assert
        assertNull(result);
        verify(productDao).findById(999L);
        verify(productDao, never()).update(any(ProductEntity.class));
    }

    @Test
    public void testMarkProductAsPurchased_BuyerNotFound() {
        // Arrange
        when(productDao.findById(anyLong())).thenReturn(productEntity);
        when(userDao.findById(anyLong())).thenReturn(null);

        // Act
        ProductDto result = productBean.markProductAsPurchased(1L, 999L);

        // Assert
        assertNull(result);
        verify(productDao).findById(1L);
        verify(userDao).findById(999L);
        verify(productDao, never()).update(any(ProductEntity.class));
    }

    @Test
    public void testMarkProductAsPurchased_AlreadyPurchased() {
        // Arrange
        productEntity.setStateId(ProductStateId.COMPRADO.getStateId());
        when(productDao.findById(anyLong())).thenReturn(productEntity);
        when(userDao.findById(anyLong())).thenReturn(buyer);

        // Act
        ProductDto result = productBean.markProductAsPurchased(1L, 2L);

        // Assert
        assertNull(result);
        verify(productDao).findById(1L);
        verify(userDao).findById(2L);
        verify(productDao, never()).update(any(ProductEntity.class));
    }

    @Test
    public void testMarkProductAsPurchased_SellerCannotBuy() {
        // Arrange
        when(productDao.findById(anyLong())).thenReturn(productEntity);
        when(userDao.findById(1L)).thenReturn(seller); // Seller trying to buy own product

        // Act
        ProductDto result = productBean.markProductAsPurchased(1L, 1L);

        // Assert
        assertNull(result);
        verify(productDao).findById(1L);
        verify(userDao).findById(1L);
        verify(productDao, never()).update(any(ProductEntity.class));
    }

    @Test
    public void testDeleteProduct_Success() {
        // Arrange
        when(productDao.delete(anyLong())).thenReturn(true);

        // Act
        boolean result = productBean.deleteProduct(1L);

        // Assert
        assertTrue(result);
        verify(productDao).delete(1L);
    }

    @Test
    public void testDeleteProduct_Failure() {
        // Arrange
        when(productDao.delete(anyLong())).thenReturn(false);

        // Act
        boolean result = productBean.deleteProduct(999L);

        // Assert
        assertFalse(result);
        verify(productDao).delete(999L);
    }

    @Test
    public void testGetProductsPaginated() {
        // Arrange
        List<ProductEntity> entities = Arrays.asList(productEntity);
        when(productDao.findAllPaginated(anyInt(), anyInt())).thenReturn(entities);

        // Act
        List<ProductDto> results = productBean.getProductsPaginated(0, 10);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(productEntity.getId(), results.get(0).getId());
        verify(productDao).findAllPaginated(0, 10);
    }

    @Test
    public void testGetProductCount() {
        // Arrange
        when(productDao.count()).thenReturn(42L);

        // Act
        Long result = productBean.getProductCount();

        // Assert
        assertEquals(42L, result);
        verify(productDao).count();
    }

    @Test
    public void testGetActiveProductCount() {
        // Arrange
        when(productDao.countActive()).thenReturn(30L);

        // Act
        Long result = productBean.getActiveProductCount();

        // Assert
        assertEquals(30L, result);
        verify(productDao).countActive();
    }

    @Test
    public void testDeactivateProduct() {
        // Arrange
        when(productDao.deactivateProduct(anyLong())).thenReturn(productEntity);

        // Act
        ProductDto result = productBean.deactivateProduct(1L);

        // Assert
        assertNotNull(result);
        verify(productDao).deactivateProduct(1L);
    }

    @Test
    public void testReactivateProduct() {
        // Arrange
        when(productDao.reactivateProduct(anyLong(), anyInt())).thenReturn(productEntity);

        // Act
        ProductDto result = productBean.reactivateProduct(1L, ProductStateId.DISPONIVEL.getStateId());

        // Assert
        assertNotNull(result);
        verify(productDao).reactivateProduct(1L, ProductStateId.DISPONIVEL.getStateId());
    }

    @Test
    public void testGetAllInactiveProducts() {
        // Arrange
        List<ProductEntity> entities = Arrays.asList(productEntity);
        when(productDao.findAllInactive()).thenReturn(entities);

        // Act
        List<ProductDto> results = productBean.getAllInactiveProducts();

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(productEntity.getId(), results.get(0).getId());
        verify(productDao).findAllInactive();
    }

    @Test
    public void testPermanentlyDeleteProduct_Success() {
        // Arrange
        when(productDao.permanentlyDelete(anyLong())).thenReturn(true);

        // Act
        boolean result = productBean.permanentlyDeleteProduct(1L);

        // Assert
        assertTrue(result);
        verify(productDao).permanentlyDelete(1L);
    }

    @Test
    public void testPermanentlyDeleteProduct_Failure() {
        // Arrange
        when(productDao.permanentlyDelete(anyLong())).thenReturn(false);

        // Act
        boolean result = productBean.permanentlyDeleteProduct(999L);

        // Assert
        assertFalse(result);
        verify(productDao).permanentlyDelete(999L);
    }
}