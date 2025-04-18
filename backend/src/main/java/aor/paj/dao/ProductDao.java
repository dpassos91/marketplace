package aor.paj.dao;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import aor.paj.entity.ProductEntity;
import aor.paj.util.ProductStateId;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.TypedQuery;

@Stateless
public class ProductDao {
    private static final Logger logger = LogManager.getLogger(ProductDao.class);

    @PersistenceContext(unitName = "diogopassos-proj5")
    private EntityManager em;

    /**
     * Persists a product to the database
     * 
     * @param product the product to be persisted
     * @return the persisted product
     */
    public ProductEntity create(ProductEntity product) {
        long startTime = System.currentTimeMillis();
        try {
            em.persist(product);
            logger.debug("DB Transaction: Created product with title '{}', time taken: {}ms",
                    product.getTitle(), (System.currentTimeMillis() - startTime));
            return product;
        } catch (PersistenceException e) {
            logger.error("DB Error: Failed to persist product: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Updates a product in the database
     * 
     * @param product the product to be updated
     * @return the updated product
     */
    public ProductEntity update(ProductEntity product) {
        long startTime = System.currentTimeMillis();
        try {
            ProductEntity updated = em.merge(product);
            logger.debug("DB Transaction: Updated product id={}, time taken: {}ms",
                    product.getId(), (System.currentTimeMillis() - startTime));
            return updated;
        } catch (PersistenceException e) {
            logger.error("DB Error: Failed to update product id={}: {}", product.getId(), e.getMessage(), e);
            throw e;
        }
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
        long startTime = System.currentTimeMillis();
        try {
            ProductEntity result = em.createNamedQuery("Product.findById", ProductEntity.class)
                    .setParameter("id", id)
                    .getResultStream()
                    .findFirst()
                    .orElse(null);

            long timeTaken = System.currentTimeMillis() - startTime;
            if (result == null) {
                logger.debug("DB Query: Product id={} not found, time taken: {}ms", id, timeTaken);
            } else {
                logger.debug("DB Query: Found product id={}, time taken: {}ms", id, timeTaken);
            }
            return result;
        } catch (Exception e) {
            logger.error("DB Error: Failed to find product id={}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    public List<ProductEntity> findByCategorySellerAndStates(Long categoryId, Long sellerId, List<Integer> stateIds) {
        String jpql = "SELECT p FROM ProductEntity p WHERE 1=1";
    
        if (categoryId != null) {
            jpql += " AND p.category.id = :categoryId";
        }
    
        if (sellerId != null) {
            jpql += " AND p.seller.id = :sellerId";
        }
    
        if (stateIds != null && !stateIds.isEmpty()) {
            jpql += " AND p.stateId IN :stateIds";
        }
    
        TypedQuery<ProductEntity> query = em.createQuery(jpql, ProductEntity.class);
    
        if (categoryId != null) query.setParameter("categoryId", categoryId);
        if (sellerId != null) query.setParameter("sellerId", sellerId);
        if (stateIds != null && !stateIds.isEmpty()) query.setParameter("stateIds", stateIds);
    
        return query.getResultList();
    }
    

    /**
     * Gets all products from the database
     * 
     * @return a list of all products
     */
    public List<ProductEntity> findAll() {
        long startTime = System.currentTimeMillis();
        try {
            List<ProductEntity> results = em.createNamedQuery("Product.findAll", ProductEntity.class).getResultList();
            logger.debug("DB Query: Found {} products, time taken: {}ms",
                    results.size(), (System.currentTimeMillis() - startTime));
            return results;
        } catch (Exception e) {
            logger.error("DB Error: Failed to retrieve all products: {}", e.getMessage(), e);
            throw e;
        }
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
        long startTime = System.currentTimeMillis();
        try {
            TypedQuery<ProductEntity> query = em.createNamedQuery("Product.findAll", ProductEntity.class);
            List<ProductEntity> results = createPaginatedQuery(query, offset, limit).getResultList();
            logger.debug("DB Query: Found {} products for page offset={} limit={}, time taken: {}ms",
                    results.size(), offset, limit, (System.currentTimeMillis() - startTime));
            return results;
        } catch (Exception e) {
            logger.error("DB Error: Failed to retrieve paginated products (offset={}, limit={}): {}",
                    offset, limit, e.getMessage(), e);
            throw e;
        }
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
        return createPaginatedQuery(query, offset, limit).getResultList();
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

    /**
     * Makes a product inactive (soft delete)
     * 
     * @param id the ID of the product to deactivate
     * @return the updated product or null if not found
     */
    public ProductEntity deactivateProduct(Long id) {
        ProductEntity product = findById(id);
        if (product != null) {
            product.setStateId(ProductStateId.INATIVO.getStateId());
            return update(product);
        }
        return null;
    }

    /**
     * Reactivates a previously deactivated product
     * 
     * @param id         the ID of the product to reactivate
     * @param newStateId the state to set the product to after reactivation
     * @return the updated product or null if not found
     */
    public ProductEntity reactivateProduct(Long id, int newStateId) {
        ProductEntity product = findById(id);
        if (product != null) {
            product.setStateId(newStateId);
            return update(product);
        }
        return null;
    }

    /**
     * Finds all inactive products
     * 
     * @return list of inactive products
     */
    public List<ProductEntity> findAllInactive() {
        return em.createQuery(
                "SELECT p FROM ProductEntity p WHERE p.stateId = :inactiveState",
                ProductEntity.class)
                .setParameter("inactiveState", ProductStateId.INATIVO.getStateId())
                .getResultList();
    }

    /**
     * Gets products whose sellers have been deactivated
     * 
     * @return List of product entities from inactive users
     */
    public List<ProductEntity> findProductsFromInactiveUsers() {
        long startTime = System.currentTimeMillis();
        try {
            List<ProductEntity> results = em.createQuery(
                    "SELECT p FROM ProductEntity p WHERE p.seller.active = false",
                    ProductEntity.class)
                    .getResultList();

            logger.debug("DB Query: Found {} products from inactive users, time taken: {}ms",
                    results.size(), (System.currentTimeMillis() - startTime));

            return results;
        } catch (Exception e) {
            logger.error("DB Error: Failed to retrieve products from inactive users: {}",
                    e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Gets all products that have been edited (non-null editDate)
     * 
     * @return List of products that have been edited
     */
    public List<ProductEntity> findAllEdited() {
        long startTime = System.currentTimeMillis();
        try {
            List<ProductEntity> results = em.createNamedQuery("Product.findByEditDate", ProductEntity.class)
                    .getResultList();
            logger.debug("DB Query: Found {} edited products, time taken: {}ms",
                    results.size(), (System.currentTimeMillis() - startTime));
            return results;
        } catch (Exception e) {
            logger.error("DB Error: Failed to retrieve edited products: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Permanently deletes a product that is in INATIVO state
     * 
     * @param id the ID of the product to permanently delete
     * @return true if deleted, false if not found or not in INATIVO state
     */
    public boolean permanentlyDelete(Long id) {
        ProductEntity product = findById(id);
        if (product != null && product.getStateId() == ProductStateId.INATIVO.getStateId()) {
            em.remove(product);
            return true;
        }
        return false;
    }

    // Helper method:
    private <T> TypedQuery<T> createPaginatedQuery(TypedQuery<T> baseQuery, int offset, int limit) {
        baseQuery.setFirstResult(offset);
        baseQuery.setMaxResults(limit);
        return baseQuery;
    }
}