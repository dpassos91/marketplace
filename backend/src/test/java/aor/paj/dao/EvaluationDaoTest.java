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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import aor.paj.entity.EvaluationEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

public class EvaluationDaoTest {

  @InjectMocks
  private EvaluationDao evaluationDao;

  @Mock
  private EntityManager em;

  @Mock
  private TypedQuery<EvaluationEntity> typedQuery;

  @Mock
  private TypedQuery<Long> longQuery;

  @Mock
  private TypedQuery<Double> doubleQuery;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  public void testCreate() {
    // Arrange
    EvaluationEntity evaluation = new EvaluationEntity();
    evaluation.setTitle("Test Evaluation");

    // Act
    EvaluationEntity result = evaluationDao.create(evaluation);

    // Assert
    verify(em).persist(evaluation);
    assertEquals(evaluation, result);
  }

  @Test
  public void testUpdate() {
    // Arrange
    EvaluationEntity evaluation = new EvaluationEntity();
    evaluation.setId(1L);
    evaluation.setTitle("Updated Evaluation");

    when(em.merge(evaluation)).thenReturn(evaluation);

    // Act
    EvaluationEntity result = evaluationDao.update(evaluation);

    // Assert
    verify(em).merge(evaluation);
    assertEquals(evaluation, result);
  }

  @Test
  public void testDeleteExistingEvaluation() {
    // Arrange
    Long evaluationId = 1L;
    EvaluationEntity evaluation = new EvaluationEntity();

    when(em.createNamedQuery("Evaluation.findById", EvaluationEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("id", evaluationId)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(evaluation));

    // Act
    boolean result = evaluationDao.delete(evaluationId);

    // Assert
    assertTrue(result);
    verify(em).remove(evaluation);
  }

  @Test
  public void testDeleteNonExistingEvaluation() {
    // Arrange
    Long evaluationId = 1L;

    when(em.createNamedQuery("Evaluation.findById", EvaluationEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("id", evaluationId)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.empty());

    // Act
    boolean result = evaluationDao.delete(evaluationId);

    // Assert
    assertFalse(result);
    verify(em, never()).remove(any());
  }

  @Test
  public void testFindByIdExisting() {
    // Arrange
    Long evaluationId = 1L;
    EvaluationEntity expectedEvaluation = new EvaluationEntity();
    expectedEvaluation.setId(evaluationId);

    when(em.createNamedQuery("Evaluation.findById", EvaluationEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("id", evaluationId)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.of(expectedEvaluation));

    // Act
    EvaluationEntity result = evaluationDao.findById(evaluationId);

    // Assert
    assertEquals(expectedEvaluation, result);
  }

  @Test
  public void testFindByIdNonExisting() {
    // Arrange
    Long evaluationId = 999L;

    when(em.createNamedQuery("Evaluation.findById", EvaluationEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("id", evaluationId)).thenReturn(typedQuery);
    when(typedQuery.getResultStream()).thenAnswer(invocation -> Stream.empty());

    // Act
    EvaluationEntity result = evaluationDao.findById(evaluationId);

    // Assert
    assertNull(result);
  }

  @Test
  public void testFindAll() {
    // Arrange
    List<EvaluationEntity> expectedEvaluations = Arrays.asList(
        new EvaluationEntity(),
        new EvaluationEntity());

    when(em.createNamedQuery("Evaluation.findAll", EvaluationEntity.class)).thenReturn(typedQuery);
    when(typedQuery.getResultList()).thenReturn(expectedEvaluations);

    // Act
    List<EvaluationEntity> result = evaluationDao.findAll();

    // Assert
    assertEquals(expectedEvaluations, result);
  }

  @Test
  public void testFindByEvaluator() {
    // Arrange
    Long evaluatorId = 1L;
    List<EvaluationEntity> expectedEvaluations = Arrays.asList(
        new EvaluationEntity(),
        new EvaluationEntity());

    when(em.createNamedQuery("Evaluation.findByEvaluator", EvaluationEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("evaluatorId", evaluatorId)).thenReturn(typedQuery);
    when(typedQuery.getResultList()).thenReturn(expectedEvaluations);

    // Act
    List<EvaluationEntity> result = evaluationDao.findByEvaluator(evaluatorId);

    // Assert
    assertEquals(expectedEvaluations, result);
  }

  @Test
  public void testFindByEvaluated() {
    // Arrange
    Long evaluatedId = 1L;
    List<EvaluationEntity> expectedEvaluations = Arrays.asList(
        new EvaluationEntity(),
        new EvaluationEntity());

    when(em.createNamedQuery("Evaluation.findByEvaluated", EvaluationEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("evaluatedId", evaluatedId)).thenReturn(typedQuery);
    when(typedQuery.getResultList()).thenReturn(expectedEvaluations);

    // Act
    List<EvaluationEntity> result = evaluationDao.findByEvaluated(evaluatedId);

    // Assert
    assertEquals(expectedEvaluations, result);
  }

  @Test
  public void testFindAllPaginated() {
    // Arrange
    int offset = 0;
    int limit = 10;
    List<EvaluationEntity> expectedEvaluations = Arrays.asList(
        new EvaluationEntity(),
        new EvaluationEntity());

    when(em.createNamedQuery("Evaluation.findAll", EvaluationEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setFirstResult(offset)).thenReturn(typedQuery);
    when(typedQuery.setMaxResults(limit)).thenReturn(typedQuery);
    when(typedQuery.getResultList()).thenReturn(expectedEvaluations);

    // Act
    List<EvaluationEntity> result = evaluationDao.findAllPaginated(offset, limit);

    // Assert
    assertEquals(expectedEvaluations, result);
    verify(typedQuery).setFirstResult(offset);
    verify(typedQuery).setMaxResults(limit);
  }

  @Test
  public void testFindByEvaluatedPaginated() {
    // Arrange
    Long evaluatedId = 1L;
    int offset = 0;
    int limit = 10;
    List<EvaluationEntity> expectedEvaluations = Arrays.asList(
        new EvaluationEntity(),
        new EvaluationEntity());

    when(em.createNamedQuery("Evaluation.findByEvaluated", EvaluationEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("evaluatedId", evaluatedId)).thenReturn(typedQuery);
    when(typedQuery.setFirstResult(offset)).thenReturn(typedQuery);
    when(typedQuery.setMaxResults(limit)).thenReturn(typedQuery);
    when(typedQuery.getResultList()).thenReturn(expectedEvaluations);

    // Act
    List<EvaluationEntity> result = evaluationDao.findByEvaluatedPaginated(evaluatedId, offset, limit);

    // Assert
    assertEquals(expectedEvaluations, result);
    verify(typedQuery).setParameter("evaluatedId", evaluatedId);
    verify(typedQuery).setFirstResult(offset);
    verify(typedQuery).setMaxResults(limit);
  }

  @Test
  public void testFindByEvaluatorPaginated() {
    // Arrange
    Long evaluatorId = 1L;
    int offset = 0;
    int limit = 10;
    List<EvaluationEntity> expectedEvaluations = Arrays.asList(
        new EvaluationEntity(),
        new EvaluationEntity());

    when(em.createNamedQuery("Evaluation.findByEvaluator", EvaluationEntity.class)).thenReturn(typedQuery);
    when(typedQuery.setParameter("evaluatorId", evaluatorId)).thenReturn(typedQuery);
    when(typedQuery.setFirstResult(offset)).thenReturn(typedQuery);
    when(typedQuery.setMaxResults(limit)).thenReturn(typedQuery);
    when(typedQuery.getResultList()).thenReturn(expectedEvaluations);

    // Act
    List<EvaluationEntity> result = evaluationDao.findByEvaluatorPaginated(evaluatorId, offset, limit);

    // Assert
    assertEquals(expectedEvaluations, result);
    verify(typedQuery).setParameter("evaluatorId", evaluatorId);
    verify(typedQuery).setFirstResult(offset);
    verify(typedQuery).setMaxResults(limit);
  }

  @Test
  public void testCalculateAverageRating() {
    // Arrange
    Long userId = 1L;
    Double expectedRating = 4.5;

    when(em.createQuery("SELECT AVG(e.rating) FROM EvaluationEntity e WHERE e.evaluated.id = :userId", Double.class))
        .thenReturn(doubleQuery);
    when(doubleQuery.setParameter("userId", userId)).thenReturn(doubleQuery);
    when(doubleQuery.getSingleResult()).thenReturn(expectedRating);

    // Act
    Double result = evaluationDao.calculateAverageRating(userId);

    // Assert
    assertEquals(expectedRating, result);
  }

  @Test
  public void testCount() {
    // Arrange
    Long expectedCount = 5L;

    when(em.createQuery("SELECT COUNT(e) FROM EvaluationEntity e", Long.class)).thenReturn(longQuery);
    when(longQuery.getSingleResult()).thenReturn(expectedCount);

    // Act
    Long result = evaluationDao.count();

    // Assert
    assertEquals(expectedCount, result);
  }

  @Test
  public void testCountByEvaluated() {
    // Arrange
    Long userId = 1L;
    Long expectedCount = 3L;

    when(em.createQuery("SELECT COUNT(e) FROM EvaluationEntity e WHERE e.evaluated.id = :userId", Long.class))
        .thenReturn(longQuery);
    when(longQuery.setParameter("userId", userId)).thenReturn(longQuery);
    when(longQuery.getSingleResult()).thenReturn(expectedCount);

    // Act
    Long result = evaluationDao.countByEvaluated(userId);

    // Assert
    assertEquals(expectedCount, result);
  }

  @Test
  public void testExistsByBuyerSellerAndProductWhenExists() {
    // Arrange
    Long buyerId = 1L;
    Long sellerId = 2L;
    Long productId = 3L;

    when(em.createQuery(
        "SELECT COUNT(e) FROM EvaluationEntity e " +
            "WHERE e.evaluator.id = :buyerId " +
            "AND e.evaluated.id = :sellerId " +
            "AND e.product.id = :productId",
        Long.class))
        .thenReturn(longQuery);
    when(longQuery.setParameter("buyerId", buyerId)).thenReturn(longQuery);
    when(longQuery.setParameter("sellerId", sellerId)).thenReturn(longQuery);
    when(longQuery.setParameter("productId", productId)).thenReturn(longQuery);
    when(longQuery.getSingleResult()).thenReturn(1L);

    // Act
    boolean result = evaluationDao.existsByBuyerSellerAndProduct(buyerId, sellerId, productId);

    // Assert
    assertTrue(result);
  }

  @Test
  public void testExistsByBuyerSellerAndProductWhenNotExists() {
    // Arrange
    Long buyerId = 1L;
    Long sellerId = 2L;
    Long productId = 3L;

    when(em.createQuery(
        "SELECT COUNT(e) FROM EvaluationEntity e " +
            "WHERE e.evaluator.id = :buyerId " +
            "AND e.evaluated.id = :sellerId " +
            "AND e.product.id = :productId",
        Long.class))
        .thenReturn(longQuery);
    when(longQuery.setParameter("buyerId", buyerId)).thenReturn(longQuery);
    when(longQuery.setParameter("sellerId", sellerId)).thenReturn(longQuery);
    when(longQuery.setParameter("productId", productId)).thenReturn(longQuery);
    when(longQuery.getSingleResult()).thenReturn(0L);

    // Act
    boolean result = evaluationDao.existsByBuyerSellerAndProduct(buyerId, sellerId, productId);

    // Assert
    assertFalse(result);
  }

  @Test
  public void testFindBySeller() {
    // Arrange
    Long sellerId = 1L;
    List<EvaluationEntity> expectedEvaluations = Arrays.asList(
        new EvaluationEntity(),
        new EvaluationEntity());

    when(em.createQuery("SELECT e FROM EvaluationEntity e WHERE e.evaluated.id = :sellerId",
        EvaluationEntity.class))
        .thenReturn(typedQuery);
    when(typedQuery.setParameter("sellerId", sellerId)).thenReturn(typedQuery);
    when(typedQuery.getResultList()).thenReturn(expectedEvaluations);

    // Act
    List<EvaluationEntity> result = evaluationDao.findBySeller(sellerId);

    // Assert
    assertEquals(expectedEvaluations, result);
  }
}