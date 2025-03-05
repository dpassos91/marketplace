package aor.paj.bean;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import aor.paj.dao.EvaluationDao;
import aor.paj.dao.ProductDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.EvaluationDto;
import aor.paj.dto.ProductDto;
import aor.paj.entity.EvaluationEntity;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import aor.paj.util.ProductStateId;

public class EvaluationBeanTest {

    @Mock
    private EvaluationDao evaluationDao;

    @Mock
    private UserDao userDao;

    @Mock
    private ProductDao productDao;

    @InjectMocks
    private EvaluationBean evaluationBean;

    private UserEntity buyer;
    private UserEntity seller;
    private ProductEntity product;
    private EvaluationDto evaluationDto;
    private EvaluationEntity evaluationEntity;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Set up user entities
        buyer = new UserEntity();
        buyer.setId(1L);
        buyer.setUsername("buyer");

        seller = new UserEntity();
        seller.setId(2L);
        seller.setUsername("seller");

        // Set up product entity
        product = new ProductEntity();
        product.setId(1L);
        product.setTitle("Test Product");
        product.setSeller(seller);
        product.setBuyer(buyer);
        product.setStateId(ProductStateId.COMPRADO.getStateId());

        // Set up evaluation DTO
        evaluationDto = new EvaluationDto();
        evaluationDto.setId(1L);
        evaluationDto.setTitle("Great seller");
        evaluationDto.setComment("Fast shipping");
        evaluationDto.setRating(5);
        evaluationDto.setEvaluatorId(buyer.getId());
        evaluationDto.setEvaluatedId(seller.getId());
        evaluationDto.setProductId(product.getId());

        // Set up evaluation entity
        evaluationEntity = new EvaluationEntity();
        evaluationEntity.setId(1L);
        evaluationEntity.setTitle("Great seller");
        evaluationEntity.setComment("Fast shipping");
        evaluationEntity.setRating(5);
        evaluationEntity.setEvaluator(buyer);
        evaluationEntity.setEvaluated(seller);
        evaluationEntity.setProduct(product);
        evaluationEntity.setDate(LocalDate.now());
    }

    @Test
    void testAddEvaluation_Success() {
        // Arrange
        when(userDao.findById(buyer.getId())).thenReturn(buyer);
        when(userDao.findById(seller.getId())).thenReturn(seller);
        when(productDao.findById(product.getId())).thenReturn(product);
        when(evaluationDao.existsByBuyerSellerAndProduct(buyer.getId(), seller.getId(), product.getId()))
                .thenReturn(false);
        when(evaluationDao.create(any(EvaluationEntity.class))).thenReturn(evaluationEntity);

        // Act
        EvaluationDto result = evaluationBean.addEvaluation(evaluationDto);

        // Assert
        assertNotNull(result);
        assertEquals(evaluationDto.getTitle(), result.getTitle());
        assertEquals(evaluationDto.getComment(), result.getComment());
        assertEquals(evaluationDto.getRating(), result.getRating());
        verify(evaluationDao).create(any(EvaluationEntity.class));
    }

    @Test
    void testAddEvaluation_NullDto() {
        // Act
        EvaluationDto result = evaluationBean.addEvaluation(null);

        // Assert
        assertNull(result);
        verify(evaluationDao, never()).create(any(EvaluationEntity.class));
    }

    @Test
    void testAddEvaluation_MissingRequiredFields() {
        // Arrange
        evaluationDto.setEvaluatorId(null);

        // Act
        EvaluationDto result = evaluationBean.addEvaluation(evaluationDto);

        // Assert
        assertNull(result);
        verify(evaluationDao, never()).create(any(EvaluationEntity.class));
    }

    @Test
    void testAddEvaluation_AlreadyEvaluated() {
        // Arrange
        when(userDao.findById(buyer.getId())).thenReturn(buyer);
        when(userDao.findById(seller.getId())).thenReturn(seller);
        when(productDao.findById(product.getId())).thenReturn(product);
        when(evaluationDao.existsByBuyerSellerAndProduct(buyer.getId(), seller.getId(), product.getId()))
                .thenReturn(true);

        // Act
        EvaluationDto result = evaluationBean.addEvaluation(evaluationDto);

        // Assert
        assertNull(result);
        verify(evaluationDao, never()).create(any(EvaluationEntity.class));
    }

    @Test
    void testGetEvaluationById() {
        // Arrange
        when(evaluationDao.findById(1L)).thenReturn(evaluationEntity);

        // Act
        EvaluationDto result = evaluationBean.getEvaluationById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(evaluationEntity.getId(), result.getId());
        assertEquals(evaluationEntity.getTitle(), result.getTitle());
    }

    @Test
    void testGetAllEvaluations() {
        // Arrange
        List<EvaluationEntity> entities = Arrays.asList(evaluationEntity);
        when(evaluationDao.findAll()).thenReturn(entities);

        // Act
        List<EvaluationDto> results = evaluationBean.getAllEvaluations();

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(evaluationEntity.getId(), results.get(0).getId());
    }

    @Test
    void testUpdateEvaluation_Success() {
        // Arrange
        when(evaluationDao.findById(evaluationDto.getId())).thenReturn(evaluationEntity);
        when(evaluationDao.update(any(EvaluationEntity.class))).thenReturn(evaluationEntity);

        // Act
        EvaluationDto result = evaluationBean.updateEvaluation(evaluationDto);

        // Assert
        assertNotNull(result);
        verify(evaluationDao).update(any(EvaluationEntity.class));
    }

    @Test
    void testUpdateEvaluation_NotFound() {
        // Arrange
        when(evaluationDao.findById(evaluationDto.getId())).thenReturn(null);

        // Act
        EvaluationDto result = evaluationBean.updateEvaluation(evaluationDto);

        // Assert
        assertNull(result);
        verify(evaluationDao, never()).update(any(EvaluationEntity.class));
    }

    @Test
    void testDeleteEvaluation() {
        // Arrange
        when(evaluationDao.delete(1L)).thenReturn(true);

        // Act
        boolean result = evaluationBean.deleteEvaluation(1L);

        // Assert
        assertTrue(result);
        verify(evaluationDao).delete(1L);
    }

    @Test
    void testGetAverageRatingForUser() {
        // Arrange
        when(evaluationDao.calculateAverageRating(seller.getId())).thenReturn(4.5);

        // Act
        Double result = evaluationBean.getAverageRatingForUser(seller.getId());

        // Assert
        assertEquals(4.5, result);
    }

    @Test
    void testGetProductsEligibleForEvaluation() {
        // Arrange
        List<ProductEntity> products = Arrays.asList(product);
        when(productDao.findPurchasedByUser(buyer.getId())).thenReturn(products);
        when(evaluationDao.existsByBuyerSellerAndProduct(buyer.getId(), seller.getId(), product.getId()))
                .thenReturn(false);

        // Act
        List<ProductDto> result = evaluationBean.getProductsEligibleForEvaluation(buyer.getId());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void testGetEvaluationsPaginated() {
        // Arrange
        List<EvaluationEntity> entities = Arrays.asList(evaluationEntity);
        when(evaluationDao.findAllPaginated(0, 10)).thenReturn(entities);

        // Act
        List<EvaluationDto> results = evaluationBean.getEvaluationsPaginated(0, 10);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
    }

    @Test
    void testGetEvaluationsByEvaluator() {
        // Arrange
        List<EvaluationEntity> entities = Arrays.asList(evaluationEntity);
        when(evaluationDao.findByEvaluator(buyer.getId())).thenReturn(entities);

        // Act
        List<EvaluationDto> results = evaluationBean.getEvaluationsByEvaluator(buyer.getId());

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
    }

    @Test
    void testGetEvaluationsByEvaluated() {
        // Arrange
        List<EvaluationEntity> entities = Arrays.asList(evaluationEntity);
        when(evaluationDao.findByEvaluated(seller.getId())).thenReturn(entities);

        // Act
        List<EvaluationDto> results = evaluationBean.getEvaluationsByEvaluated(seller.getId());

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
    }
}
