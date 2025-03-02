package aor.paj.dao;

import java.util.List;

import aor.paj.entity.ProductEntity;
import aor.paj.util.ProductStateId;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateless
public class ProductDao {

    @PersistenceContext(unitName = "jorge-nuno-diogo-proj3")
    private EntityManager em;

    /**
     * Persists a product to the database
     * 
     * @param product the product to be persisted
     * @return the persisted product
     */
    public ProductEntity create(ProductEntity product) {
        em.persist(product);
        return product;
    }

    /**
     * Updates a product in the database
     * 
     * @param product the product to be updated
     * @return the updated product
     */
    public ProductEntity update(ProductEntity product) {
        return em.merge(product);
    }

    /**
     * Deletes a product from the database
     * 
     * @param id the id of the product to be deleted
     * @return true if the product was deleted, false otherwise
     */
    public boolean delete(Long id) {
        ProductEntity product = findById(id);
        if (product != null) {
            em.remove(product);
            return true;
        }
        return false;
    }

    /**
     * Finds a product by its id
     * 
     * @param id the id of the product to be found
     * @return the product with the given id, null if not found
     */
    public ProductEntity findById(Long id) {
        return em.createNamedQuery("Product.findById", ProductEntity.class)
                .setParameter("id", id)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }

    /**
     * Gets all products from the database
     * 
     * @return a list of all products
     */
    public List<ProductEntity> findAll() {
        return em.createNamedQuery("Product.findAll", ProductEntity.class)
                .getResultList();
    }

    /**
     * Gets all active products
     * 
     * @return a list of all active products
     */
    public List<ProductEntity> findAllActive() {
        return em.createNamedQuery("Product.findByActive", ProductEntity.class)
                .setParameter("active", true)
                .getResultList();
    }

    /**
     * Gets products by category
     * 
     * @param categoryId the id of the category
     * @return a list of products in the specified category
     */
    public List<ProductEntity> findByCategory(Long categoryId) {
        return em.createNamedQuery("Product.findByCategory", ProductEntity.class)
                .setParameter("categoryId", categoryId)
                .getResultList();
    }

    /**
     * Gets products by seller
     * 
     * @param userId the id of the seller
     * @return a list of products sold by the specified user
     */
    public List<ProductEntity> findBySeller(Long userId) {
        return em.createNamedQuery("Product.findByUser", ProductEntity.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    /**
     * Gets products by title (partial match)
     * 
     * @param title the partial title to search for
     * @return a list of products matching the title
     */
    public List<ProductEntity> findByTitle(String title) {
        if (title == null) {
            return List.of(); // Return empty list for null input
        }

        return em.createNamedQuery("Product.findByTitle", ProductEntity.class)
                .setParameter("title", "%" + title + "%")
                .getResultList();
    }

    /**
     * Gets products by location (partial match)
     * 
     * @param location the location to search for
     * @return a list of products in the specified location
     */
    public List<ProductEntity> findByLocation(String location) {
        return em.createNamedQuery("Product.findByLocation", ProductEntity.class)
                .setParameter("location", "%" + location + "%")
                .getResultList();
    }

    /**
     * Gets products by status
     * 
     * @param status the status to search for
     * @return a list of products with the specified status
     */
    public List<ProductEntity> findByStatus(String status) {
        // Convert status description to stateId
        ProductStateId stateEnum = ProductStateId.fromDescription(status);
        if (stateEnum == null) {
            return List.of(); // Return empty list if invalid status
        }
        int stateId = stateEnum.getStateId();

        return em.createQuery("SELECT p FROM ProductEntity p WHERE p.stateId = :stateId", ProductEntity.class)
                .setParameter("stateId", stateId)
                .getResultList();
    }

    /**
     * Gets all products with pagination
     * 
     * @param offset the offset for pagination
     * @param limit  the maximum number of results
     * @return a list of products with pagination
     */
    public List<ProductEntity> findAllPaginated(int offset, int limit) {
        TypedQuery<ProductEntity> query = em.createNamedQuery("Product.findAll", ProductEntity.class);
        query.setFirstResult(offset);
        query.setMaxResults(limit);
        return query.getResultList();
    }

    /**
     * Gets active products with pagination
     * 
     * @param offset the offset for pagination
     * @param limit  the maximum number of results
     * @return a paginated list of active products
     */
    public List<ProductEntity> findAllActivePaginated(int offset, int limit) {
        TypedQuery<ProductEntity> query = em.createNamedQuery("Product.findByActive", ProductEntity.class)
                .setParameter("active", true);
        query.setFirstResult(offset);
        query.setMaxResults(limit);
        return query.getResultList();
    }

    /**
     * Gets products by category with pagination
     * 
     * @param categoryId the id of the category
     * @param offset     the offset for pagination
     * @param limit      the maximum number of results
     * @return a paginated list of products in the specified category
     */
    public List<ProductEntity> findByCategoryPaginated(Long categoryId, int offset, int limit) {
        TypedQuery<ProductEntity> query = em.createNamedQuery("Product.findByCategory", ProductEntity.class)
                .setParameter("categoryId", categoryId);
        query.setFirstResult(offset);
        query.setMaxResults(limit);
        return query.getResultList();
    }

    /**
     * Gets products by seller with pagination
     * 
     * @param userId the id of the seller
     * @param offset the offset for pagination
     * @param limit  the maximum number of results
     * @return a paginated list of products sold by the specified user
     */
    public List<ProductEntity> findBySellerPaginated(Long userId, int offset, int limit) {
        TypedQuery<ProductEntity> query = em.createNamedQuery("Product.findByUser", ProductEntity.class)
                .setParameter("userId", userId);
        query.setFirstResult(offset);
        query.setMaxResults(limit);
        return query.getResultList();
    }

    /**
     * Counts the total number of products
     * 
     * @return the total number of products
     */
    public Long count() {
        return em.createQuery("SELECT COUNT(p) FROM ProductEntity p", Long.class).getSingleResult();
    }

    /**
     * Counts the number of active products
     * 
     * @return the count of active products
     */
    public Long countActive() {
        return em.createQuery(
                "SELECT COUNT(p) FROM ProductEntity p WHERE p.active = true", Long.class)
                .getSingleResult();
    }

    /**
     * Counts the number of products in a specific category
     * 
     * @param categoryId the id of the category
     * @return the count of products in the category
     */
    public Long countByCategory(Long categoryId) {
        return em.createQuery(
                "SELECT COUNT(p) FROM ProductEntity p WHERE p.category.id = :categoryId", Long.class)
                .setParameter("categoryId", categoryId)
                .getSingleResult();
    }

    /**
     * Counts the number of products sold by a specific user
     * 
     * @param userId the id of the seller
     * @return the count of products sold by the user
     */
    public Long countBySeller(Long userId) {
        return em.createQuery(
                "SELECT COUNT(p) FROM ProductEntity p WHERE p.seller.id = :userId", Long.class)
                .setParameter("userId", userId)
                .getSingleResult();
    }

    /**
     * Gets products purchased by a specific buyer
     * 
     * @param userId the ID of the buyer
     * @return a list of products purchased by the specified user
     */
    public List<ProductEntity> findPurchasedByUser(Long userId) {
        return em.createQuery(
                "SELECT p FROM ProductEntity p WHERE p.buyer.id = :userId AND p.stateId = :stateId",
                ProductEntity.class)
                .setParameter("userId", userId)
                .setParameter("stateId", ProductStateId.COMPRADO.getStateId())
                .getResultList();
    }

    /**
     * Gets products by stateId
     * 
     * @param stateId the stateId to search for
     * @return a list of products with the specified stateId
     */
    public List<ProductEntity> findByStateId(int stateId) {
        return em.createQuery("SELECT p FROM ProductEntity p WHERE p.stateId = :stateId", ProductEntity.class)
                .setParameter("stateId", stateId)
                .getResultList();
    }
}