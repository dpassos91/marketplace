package aor.paj.dao;

import java.util.List;

import aor.paj.entity.CategoryEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateless
public class CategoryDao {

  @PersistenceContext(unitName = "jorge-nuno-diogo-proj3")
  private EntityManager em;

  /**
   * Persists a category to the database
   * 
   * @param category the category to be persisted
   * @return the persisted category
   */
  public CategoryEntity create(CategoryEntity category) {
    em.persist(category);
    return category;
  }

  /**
   * Updates a category in the database
   * 
   * @param category the category to be updated
   * @return the updated category
   */
  public CategoryEntity update(CategoryEntity category) {
    return em.merge(category);
  }

  /**
   * Deletes a category from the database
   * 
   * @param id the id of the category to be deleted
   * @return true if the category was deleted, false otherwise
   */
  public boolean delete(Long id) {
    CategoryEntity category = findById(id);
    if (category != null) {
      em.remove(category);
      return true;
    }
    return false;
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
    return em.createNamedQuery("Category.findByName", CategoryEntity.class)
        .setParameter("name", name)
        .getResultStream()
        .findFirst()
        .orElse(null);
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