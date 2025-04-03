package aor.paj.dao;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import aor.paj.entity.CategoryEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.TypedQuery;

@Stateless
public class CategoryDao {
  private static final Logger logger = LogManager.getLogger(CategoryDao.class);

  @PersistenceContext(unitName = "diogopassos-proj5")
  private EntityManager em;

  /**
   * Persists a category to the database
   * 
   * @param category the category to be persisted
   * @return the persisted category
   */
  public CategoryEntity create(CategoryEntity category) {
    long startTime = System.currentTimeMillis();
    try {
      em.persist(category);
      logger.debug("DB Transaction: Created category '{}', time taken: {}ms",
          category.getName(), (System.currentTimeMillis() - startTime));
      return category;
    } catch (PersistenceException e) {
      logger.error("DB Error: Failed to create category '{}': {}", category.getName(), e.getMessage(), e);
      throw e;
    }
  }

  /**
   * Updates a category in the database
   * 
   * @param category the category to be updated
   * @return the updated category
   */
  public CategoryEntity update(CategoryEntity category) {
    long startTime = System.currentTimeMillis();
    try {
      CategoryEntity updated = em.merge(category);
      logger.debug("DB Transaction: Updated category id={}, name='{}', time taken: {}ms",
          category.getId(), category.getName(), (System.currentTimeMillis() - startTime));
      return updated;
    } catch (PersistenceException e) {
      logger.error("DB Error: Failed to update category id={}: {}",
          category.getId(), e.getMessage(), e);
      throw e;
    }
  }

  /**
   * Deletes a category from the database
   * 
   * @param id the id of the category to be deleted
   * @return true if successful, false otherwise
   */
  public boolean delete(Long id) {
    long startTime = System.currentTimeMillis();
    try {
      CategoryEntity category = findById(id);
      if (category != null) {
        em.remove(category);
        logger.debug("DB Transaction: Deleted category id={}, time taken: {}ms",
            id, (System.currentTimeMillis() - startTime));
        return true;
      }
      logger.debug("DB Transaction: Category id={} not found for deletion, time taken: {}ms",
          id, (System.currentTimeMillis() - startTime));
      return false;
    } catch (PersistenceException e) {
      logger.error("DB Error: Failed to delete category id={}: {}", id, e.getMessage(), e);
      throw e;
    }
  }

  /**
   * Finds a category by its id
   * 
   * @param id the id of the category to be found
   * @return the category with the given id, null if not found
   */
  public CategoryEntity findById(Long id) {
    return em.createNamedQuery("Category.findById", CategoryEntity.class)
        .setParameter("id", id)
        .getResultStream()
        .findFirst()
        .orElse(null);
  }

  /**
   * Finds a category by its name
   * 
   * @param name the name of the category to be found
   * @return the category with the given name, null if not found
   */
  public CategoryEntity findByName(String name) {
    long startTime = System.currentTimeMillis();
    try {
      CategoryEntity result = em.createNamedQuery("Category.findByName", CategoryEntity.class)
          .setParameter("name", name)
          .getResultStream()
          .findFirst()
          .orElse(null);

      long timeTaken = System.currentTimeMillis() - startTime;
      if (result == null) {
        logger.debug("DB Query: Category name='{}' not found, time taken: {}ms", name, timeTaken);
      } else {
        logger.debug("DB Query: Found category id={}, name='{}', time taken: {}ms",
            result.getId(), result.getName(), timeTaken);
      }
      return result;
    } catch (Exception e) {
      logger.error("DB Error: Failed to find category by name='{}': {}", name, e.getMessage(), e);
      throw e;
    }
  }

  /**
   * Gets all categories from the database
   * 
   * @return a list of all categories
   */
  public List<CategoryEntity> findAll() {
    return em.createNamedQuery("Category.findAll", CategoryEntity.class)
        .getResultList();
  }

  /**
   * Gets all categories with pagination
   * 
   * @param offset the offset for pagination
   * @param limit  the maximum number of results
   * @return a list of categories with pagination
   */
  public List<CategoryEntity> findAllPaginated(int offset, int limit) {
    TypedQuery<CategoryEntity> query = em.createNamedQuery("Category.findAll", CategoryEntity.class);
    query.setFirstResult(offset);
    query.setMaxResults(limit);
    return query.getResultList();
  }

  /**
   * Counts the total number of categories
   * 
   * @return the total number of categories
   */
  public Long count() {
    return em.createQuery("SELECT COUNT(c) FROM CategoryEntity c", Long.class).getSingleResult();
  }

  /**
   * Checks if a category with the given name already exists
   * 
   * @param name the name to check
   * @return true if a category with the given name exists, false otherwise
   */
  public boolean existsByName(String name) {
    return findByName(name) != null;
  }
}