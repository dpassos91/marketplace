package aor.paj.dao;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import aor.paj.entity.EvaluationEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.TypedQuery;

@Stateless
public class EvaluationDao {
  private static final Logger logger = LogManager.getLogger(EvaluationDao.class);

  @PersistenceContext(unitName = "jorge-nuno-diogo-proj3")
  private EntityManager em;

  /**
   * Persists an evaluation to the database
   * 
   * @param evaluation the evaluation to be persisted
   * @return the persisted evaluation
   */
  public EvaluationEntity create(EvaluationEntity evaluation) {
    long startTime = System.currentTimeMillis();
    try {
      em.persist(evaluation);
      logger.debug("DB Transaction: Created evaluation (evaluator={}, evaluated={}, product={}), time taken: {}ms",
          evaluation.getEvaluator().getId(),
          evaluation.getEvaluated().getId(),
          evaluation.getProduct().getId(),
          (System.currentTimeMillis() - startTime));
      return evaluation;
    } catch (PersistenceException e) {
      logger.error("DB Error: Failed to create evaluation: {}", e.getMessage(), e);
      throw e;
    }
  }

  /**
   * Updates an evaluation in the database
   * 
   * @param evaluation the evaluation to be updated
   * @return the updated evaluation
   */
  public EvaluationEntity update(EvaluationEntity evaluation) {
    return em.merge(evaluation);
  }

  /**
   * Deletes an evaluation from the database
   * 
   * @param id the id of the evaluation to be deleted
   * @return true if the evaluation was deleted, false otherwise
   */
  public boolean delete(Long id) {
    EvaluationEntity evaluation = findById(id);
    if (evaluation != null) {
      em.remove(evaluation);
      return true;
    }
    return false;
  }

  /**
   * Finds an evaluation by its id
   * 
   * @param id the id of the evaluation to be found
   * @return the evaluation with the given id, null if not found
   */
  public EvaluationEntity findById(Long id) {
    return em.createNamedQuery("Evaluation.findById", EvaluationEntity.class)
        .setParameter("id", id)
        .getResultStream()
        .findFirst()
        .orElse(null);
  }

  /**
   * Gets all evaluations from the database
   * 
   * @return a list of all evaluations
   */
  public List<EvaluationEntity> findAll() {
    return em.createNamedQuery("Evaluation.findAll", EvaluationEntity.class)
        .getResultList();
  }

  /**
   * Finds evaluations given by a specific user (evaluator)
   * 
   * @param evaluatorId the id of the evaluator
   * @return list of evaluations given by this user
   */
  public List<EvaluationEntity> findByEvaluator(Long evaluatorId) {
    return em.createNamedQuery("Evaluation.findByEvaluator", EvaluationEntity.class)
        .setParameter("evaluatorId", evaluatorId)
        .getResultList();
  }

  /**
   * Finds evaluations received by a specific user (evaluated)
   * 
   * @param evaluatedId the id of the evaluated user
   * @return list of evaluations received by this user
   */
  public List<EvaluationEntity> findByEvaluated(Long evaluatedId) {
    return em.createNamedQuery("Evaluation.findByEvaluated", EvaluationEntity.class)
        .setParameter("evaluatedId", evaluatedId)
        .getResultList();
  }

  /**
   * Gets all evaluations with pagination
   * 
   * @param offset the offset for pagination
   * @param limit  the maximum number of results
   * @return a list of evaluations with pagination
   */
  public List<EvaluationEntity> findAllPaginated(int offset, int limit) {
    TypedQuery<EvaluationEntity> query = em.createNamedQuery("Evaluation.findAll", EvaluationEntity.class);
    query.setFirstResult(offset);
    query.setMaxResults(limit);
    return query.getResultList();
  }

  /**
   * Gets evaluations for a specific evaluated user with pagination
   * 
   * @param evaluatedId the id of the evaluated user
   * @param offset      the offset for pagination
   * @param limit       the maximum number of results
   * @return a paginated list of evaluations received by the user
   */
  public List<EvaluationEntity> findByEvaluatedPaginated(Long evaluatedId, int offset, int limit) {
    TypedQuery<EvaluationEntity> query = em.createNamedQuery("Evaluation.findByEvaluated", EvaluationEntity.class)
        .setParameter("evaluatedId", evaluatedId);
    query.setFirstResult(offset);
    query.setMaxResults(limit);
    return query.getResultList();
  }

  /**
   * Gets evaluations given by a specific evaluator with pagination
   * 
   * @param evaluatorId the id of the evaluator
   * @param offset      the offset for pagination
   * @param limit       the maximum number of results
   * @return a paginated list of evaluations given by the user
   */
  public List<EvaluationEntity> findByEvaluatorPaginated(Long evaluatorId, int offset, int limit) {
    TypedQuery<EvaluationEntity> query = em.createNamedQuery("Evaluation.findByEvaluator", EvaluationEntity.class)
        .setParameter("evaluatorId", evaluatorId);
    query.setFirstResult(offset);
    query.setMaxResults(limit);
    return query.getResultList();
  }

  /**
   * Calculates the average rating for a specific user
   * 
   * @param userId the id of the user
   * @return the average rating for the user, or 0.0 if no ratings exist
   */
  public Double calculateAverageRating(Long userId) {
    long startTime = System.currentTimeMillis();
    try {
      Double result = em.createQuery(
          "SELECT AVG(e.rating) FROM EvaluationEntity e WHERE e.evaluated.id = :userId", Double.class)
          .setParameter("userId", userId)
          .getSingleResult();

      logger.debug("DB Query: Calculated average rating for user id={}: {}, time taken: {}ms",
          userId, result, (System.currentTimeMillis() - startTime));
      return result != null ? result : 0.0;
    } catch (Exception e) {
      logger.error("DB Error: Failed to calculate average rating for user id={}: {}",
          userId, e.getMessage(), e);
      return 0.0;
    }
  }

  /**
   * Counts the total number of evaluations
   * 
   * @return the total number of evaluations
   */
  public Long count() {
    return em.createQuery("SELECT COUNT(e) FROM EvaluationEntity e", Long.class).getSingleResult();
  }

  /**
   * Counts the number of evaluations received by a user
   * 
   * @param userId the id of the user
   * @return the count of evaluations received
   */
  public Long countByEvaluated(Long userId) {
    return em.createQuery(
        "SELECT COUNT(e) FROM EvaluationEntity e WHERE e.evaluated.id = :userId", Long.class)
        .setParameter("userId", userId)
        .getSingleResult();
  }

  /**
   * Check if a buyer already evaluated a seller for a specific product
   */
  public boolean existsByBuyerSellerAndProduct(Long buyerId, Long sellerId, Long productId) {
    long startTime = System.currentTimeMillis();
    try {
      TypedQuery<Long> query = em.createQuery(
          "SELECT COUNT(e) FROM EvaluationEntity e " +
              "WHERE e.evaluator.id = :buyerId " +
              "AND e.evaluated.id = :sellerId " +
              "AND e.product.id = :productId",
          Long.class);

      query.setParameter("buyerId", buyerId);
      query.setParameter("sellerId", sellerId);
      query.setParameter("productId", productId);

      Long count = query.getSingleResult();
      boolean exists = count > 0;

      logger.debug("DB Query: Checked if evaluation exists (buyer={}, seller={}, product={}): {}, time taken: {}ms",
          buyerId, sellerId, productId, exists, (System.currentTimeMillis() - startTime));

      return exists;
    } catch (Exception e) {
      logger.error("DB Error: Failed to check if evaluation exists (buyer={}, seller={}, product={}): {}",
          buyerId, sellerId, productId, e.getMessage(), e);
      throw e;
    }
  }
}