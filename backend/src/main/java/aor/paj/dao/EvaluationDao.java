package aor.paj.dao;

import java.util.List;

import aor.paj.entity.EvaluationEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateless
public class EvaluationDao {

  @PersistenceContext(unitName = "jorge-nuno-diogo-proj3")
  private EntityManager em;

  /**
   * Persists an evaluation to the database
   * 
   * @param evaluation the evaluation to be persisted
   * @return the persisted evaluation
   */
  public EvaluationEntity create(EvaluationEntity evaluation) {
    em.persist(evaluation);
    return evaluation;
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
   * @return the average rating for the user, or null if no ratings exist
   */
  public Double calculateAverageRating(Long userId) {
    return em.createQuery(
        "SELECT AVG(e.grade) FROM EvaluationEntity e WHERE e.evaluated.id = :userId", Double.class)
        .setParameter("userId", userId)
        .getSingleResult();
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
}