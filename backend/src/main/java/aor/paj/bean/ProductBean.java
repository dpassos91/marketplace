package aor.paj.bean;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.ProductDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.CategoryCountDto;
import aor.paj.dto.ProductDto;
import aor.paj.dto.ProductPurchaseStatsDto;
import aor.paj.dto.UserProductStatsDto;
import aor.paj.entity.CategoryEntity;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import aor.paj.util.ProductStateId;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;

@ApplicationScoped
public class ProductBean {
    private static final Logger logger = LogManager.getLogger(ProductBean.class);

    @Inject
    private ProductDao productDao;

    @Inject
    private UserDao userDao;

    @Inject
    private CategoryDao categoryDao;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    /**
     * Adds a new product to the database
     * 
     * @param productDto The product to add
     * @return The added product with ID
     */
    public ProductDto addProduct(ProductDto productDto) {
        logger.debug("Attempting to create product: {}", productDto);

        if (productDto == null) {
            logger.warn("Product creation failed: null productDto");
            return null;
        }

        // Check if seller and category exist
        UserEntity seller = userDao.findById(productDto.getSellerId());
        CategoryEntity category = categoryDao.findById(productDto.getCategoryId());

        if (seller == null) {
            logger.warn("Product creation failed: seller not found, id={}", productDto.getSellerId());
            return null;
        }
        if (category == null) {
            logger.warn("Product creation failed: category not found, id={}", productDto.getCategoryId());
            return null;
        }

        // Convert DTO to Entity
        ProductEntity productEntity = convertDtoToEntity(productDto);
        productEntity.setSeller(seller);
        productEntity.setCategory(category);
        productEntity.setDate(LocalDate.now());
        productEntity.setActive(true);
        productEntity.setStateId(ProductStateId.DISPONIVEL.getStateId());

        // Save product to database
        logger.debug("Saving new product to database");
        long startTime = System.currentTimeMillis();
        ProductEntity savedProduct = productDao.create(productEntity);
        long endTime = System.currentTimeMillis();

        logger.info("Product created successfully: id={}, title='{}', took {}ms",
                savedProduct.getId(), savedProduct.getTitle(), (endTime - startTime));

        return convertEntityToDto(savedProduct);
    }

    /**
     * Gets a product by its ID
     * 
     * @param id The ID of the product
     * @return The product DTO or null if not found
     */
    public ProductDto getProductById(Long id) {
        ProductEntity product = productDao.findById(id);
        return convertEntityToDto(product);
    }

    /**
     * Gets all products from the database
     * 
     * @return List of product DTOs
     */
    public List<ProductDto> getAllProducts() {
        List<ProductEntity> entities = productDao.findAll();
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets all active products
     * 
     * @return List of active product DTOs
     */
    public List<ProductDto> getAllActiveProducts() {
        List<ProductEntity> entities = productDao.findAllActive();
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets products by category
     * 
     * @param categoryId The ID of the category
     * @return List of product DTOs in the specified category
     */
    public List<ProductDto> getProductsByCategory(Long categoryId) {
        List<ProductEntity> entities = productDao.findByCategory(categoryId);
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getFilteredProducts(Long categoryId, Long sellerId, List<Integer> includeStates) {
        logger.info("Filtering products by category={}, seller={}, states={}", categoryId, sellerId, includeStates);
    
        List<ProductEntity> entities = productDao.findByCategorySellerAndStates(categoryId, sellerId, includeStates);
        
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets products by seller with robust error handling
     * 
     * @param sellerId The ID of the seller
     * @return List of product DTOs sold by the specified user
     */
    public List<ProductDto> getProductsBySeller(Long sellerId) {
        logger.debug("Getting products for seller id={}", sellerId);
        long startTime = System.currentTimeMillis();

        try {
            // Attempt database operation
            List<ProductEntity> entities = productDao.findBySeller(sellerId);

            // Process results
            List<ProductDto> results = entities.stream()
                    .map(this::convertEntityToDto)
                    .collect(Collectors.toList());

            // Log success and timing
            logger.debug("DB Query Success: Found {} products for seller id={}, time taken: {}ms",
                    results.size(), sellerId, (System.currentTimeMillis() - startTime));

            return results;
        } catch (PersistenceException e) {
            // Log specific database errors with details
            logger.error("DB Transaction Error: Failed to retrieve products for seller id={}: {}",
                    sellerId, e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            // Log unexpected errors
            logger.error("Unexpected error retrieving products for seller id={}: {}",
                    sellerId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Gets products by title (partial match)
     * 
     * @param title The partial title to search for
     * @return List of product DTOs matching the title
     */
    public List<ProductDto> getProductsByTitle(String title) {
        List<ProductEntity> entities = productDao.findByTitle(title);
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets products by location
     * 
     * @param location The location to search for
     * @return List of product DTOs in the specified location
     */
    public List<ProductDto> getProductsByLocation(String location) {
        List<ProductEntity> entities = productDao.findByLocation(location);
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets products by status
     * 
     * @param status The status to search for
     * @return List of product DTOs with the specified status
     */
    public List<ProductDto> getProductsByStatus(String status) {
        List<ProductEntity> entities = productDao.findByStatus(status);
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing product
     * 
     * @param productDto The updated product information
     * @return The updated product DTO or null if not found
     */
    public ProductDto updateProduct(ProductDto productDto) {
        if (productDto == null || productDto.getId() == null) {
            return null;
        }

        // Check if product exists
        ProductEntity existingProduct = productDao.findById(productDto.getId());
        if (existingProduct == null) {
            return null;
        }

        // Update the product entity with non-null fields from the DTO
        if (productDto.getTitle() != null) {
            existingProduct.setTitle(productDto.getTitle());
        }

        if (productDto.getDescription() != null) {
            existingProduct.setDescription(productDto.getDescription());
        }

        if (productDto.getPrice() != null) {
            existingProduct.setPrice(productDto.getPrice());
        }

        if (productDto.getLocation() != null) {
            existingProduct.setLocation(productDto.getLocation());
        }

        if (productDto.getImageUrl() != null) {
            existingProduct.setImageUrl(productDto.getImageUrl());
        }

        if (productDto.getStatus() != null) {
            existingProduct.setStatus(productDto.getStatus());
        }

        // Update category if provided
        if (productDto.getCategoryId() != null) {
            CategoryEntity category = categoryDao.findById(productDto.getCategoryId());
            if (category != null) {
                existingProduct.setCategory(category);
            }
        }

        // Update buyer if provided
        if (productDto.getBuyerId() != null) {
            UserEntity buyer = userDao.findById(productDto.getBuyerId());
            if (buyer != null) {
                existingProduct.setBuyer(buyer);
            }
        }

        // Always update edit date when updating a product
        existingProduct.setEditDate(LocalDate.now());

        // Save the updated entity
        ProductEntity updatedProduct = productDao.update(existingProduct);

        // Return the updated entity as DTO
        return convertEntityToDto(updatedProduct);
    }

    /**
     * Updates the status of a product
     * 
     * @param productId The ID of the product
     * @param stateId   The new state ID
     * @return The updated product DTO or null if not found
     */
    public ProductDto updateProductStatus(Long productId, int stateId) {
        logger.info("Updating product status: id={}, newStateId={}", productId, stateId);

        ProductEntity product = productDao.findById(productId);
        if (product == null) {
            logger.warn("Product status update failed: product not found, id={}", productId);
            return null;
        }

        int oldStateId = product.getStateId();
        ProductStateId newState = ProductStateId.fromStateId(stateId);

        logger.debug("Product state transition: id={}, {} -> {}",
                productId, ProductStateId.fromStateId(oldStateId).name(), newState.name());

        product.setStateId(newState.getStateId());
        product.setEditDate(LocalDate.now());

        ProductEntity updatedProduct = productDao.update(product);
        logger.info("Product status updated successfully: id={}, new state={}",
                productId, newState.name());

        return convertEntityToDto(updatedProduct);
    }

    /**
     * Marks a product as purchased by a specific user
     * 
     * @param productId The ID of the product
     * @param buyerId   The ID of the buyer
     * @return The updated product DTO or null if not found/invalid
     */
    public ProductDto markProductAsPurchased(Long productId, Long buyerId) {
        logger.info("Processing purchase: productId={}, buyerId={}", productId, buyerId);

        ProductEntity product = productDao.findById(productId);
        UserEntity buyer = userDao.findById(buyerId);

        if (product == null) {
            logger.warn("Purchase failed: product not found, id={}", productId);
            return null;
        }
        if (buyer == null) {
            logger.warn("Purchase failed: buyer not found, id={}", buyerId);
            return null;
        }

        // Verify product is available for purchase
        int currentStateId = product.getStateId();
        if (currentStateId != ProductStateId.DISPONIVEL.getStateId() &&
                currentStateId != ProductStateId.RESERVADO.getStateId()) {
            logger.warn("Purchase failed: product {} is in invalid state: {}",
                    productId, ProductStateId.fromStateId(currentStateId).name());
            return null;
        }

        // Verify buyer is not the seller
        if (product.getSeller().getId().equals(buyerId)) {
            logger.warn("Purchase failed: buyer {} is the seller of product {}", buyerId, productId);
            return null;
        }

        // Update product status to purchased
        product.setStateId(ProductStateId.COMPRADO.getStateId());
        product.setBuyer(buyer);
        product.setEditDate(LocalDate.now());

        ProductEntity updatedProduct = productDao.update(product);
        logger.info("Purchase completed successfully: product={}, buyer={}, price={}",
                productId, buyerId, product.getPrice());

        return convertEntityToDto(updatedProduct);
    }

    /**
     * Deletes a product by its ID
     * 
     * @param id The ID of the product to delete
     * @return true if successful, false otherwise
     */
    public boolean deleteProduct(Long id) {
        return productDao.delete(id);
    }

    /**
     * Gets products with pagination
     * 
     * @param page     The page number (0-based)
     * @param pageSize The number of items per page
     * @return List of product DTOs for the requested page
     */
    public List<ProductDto> getProductsPaginated(int page, int pageSize) {
        logger.debug("Fetching paginated products: page={}, size={}", page, pageSize);

        int offset = page * pageSize;
        long startTime = System.currentTimeMillis();

        List<ProductEntity> entities = productDao.findAllPaginated(offset, pageSize);

        long endTime = System.currentTimeMillis();
        logger.info("Retrieved {} products for page {}, took {}ms",
                entities.size(), page, (endTime - startTime));

        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get total count of products
     * 
     * @return Total number of products
     */
    public Long getProductCount() {
        return productDao.count();
    }

    /**
     * Get count of active products
     * 
     * @return Number of active products
     */
    public Long getActiveProductCount() {
        return productDao.countActive();
    }

    /**
     * Soft deletes a product by setting its state to INATIVO
     * 
     * @param id The ID of the product to deactivate
     * @return The updated product DTO or null if not found
     */
    public ProductDto deactivateProduct(Long id) {
        ProductEntity product = productDao.deactivateProduct(id);
        return convertEntityToDto(product);
    }

    /**
     * Reactivates a product that was previously deactivated
     * 
     * @param id         The ID of the product to reactivate
     * @param newStateId The state to set the product to after reactivation
     * @return The updated product DTO or null if not found
     */
    public ProductDto reactivateProduct(Long id, int newStateId) {
        ProductEntity product = productDao.reactivateProduct(id, newStateId);
        return convertEntityToDto(product);
    }

    /**
     * Gets all inactive products
     * 
     * @return List of inactive product DTOs
     */
    public List<ProductDto> getAllInactiveProducts() {
        List<ProductEntity> entities = productDao.findAllInactive();
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Permanently deletes a product with detailed transaction outcome logging
     */
    public boolean permanentlyDeleteProduct(Long id) {
        logger.info("Attempting to permanently delete product id={}", id);
        long startTime = System.currentTimeMillis();

        try {
            // Check if product exists and is inactive
            ProductEntity product = productDao.findById(id);

            if (product == null) {
                logger.warn("Delete failed: Product id={} not found", id);
                return false;
            }

            if (product.isActive()) {
                logger.warn("Delete failed: Cannot permanently delete active product id={}", id);
                return false;
            }

            // Perform delete
            boolean result = productDao.permanentlyDelete(id);

            // Log outcome
            if (result) {
                logger.info("DB Transaction successful: Permanently deleted product id={}, time taken: {}ms",
                        id, (System.currentTimeMillis() - startTime));
            } else {
                logger.warn("DB Transaction failed: Could not delete product id={}, time taken: {}ms",
                        id, (System.currentTimeMillis() - startTime));
            }

            return result;
        } catch (PersistenceException e) {
            logger.error("DB Transaction Error: Failed to delete product id={}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Gets all products that have been edited (have a non-null editDate)
     * 
     * @return List of product DTOs that have been edited
     */
    public List<ProductDto> getAllEditedProducts() {
        logger.debug("Getting all products that have been edited");
        long startTime = System.currentTimeMillis();

        List<ProductEntity> entities = productDao.findAllEdited();

        List<ProductDto> results = entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());

        logger.info("Retrieved {} edited products, took {}ms",
                results.size(), (System.currentTimeMillis() - startTime));

        return results;
    }

    /**
     * Gets products whose sellers have been deactivated
     * 
     * @return List of product DTOs from inactive users
     */
    public List<ProductDto> getProductsFromInactiveUsers() {
        logger.debug("Getting products from inactive users");
        long startTime = System.currentTimeMillis();

        List<ProductEntity> entities = productDao.findProductsFromInactiveUsers();

        List<ProductDto> results = entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());

        logger.info("Retrieved {} products from inactive users, took {}ms",
                results.size(), (System.currentTimeMillis() - startTime));

        return results;
    }

    public int countDraftProducts() {
        logger.info("Counting draft products.");
        return (int) productDao.countByState(ProductStateId.RASCUNHO.getStateId());
    }
    
    public int countPublishedProducts() {
        logger.info("Counting published products.");
        return (int) productDao.countByState(ProductStateId.DISPONIVEL.getStateId());
    }
    
    public int countReservedProducts() {
        logger.info("Counting reserved products.");
        return (int) productDao.countByState(ProductStateId.RESERVADO.getStateId());
    }
    
    public int countPurchasedProducts() {
        logger.info("Counting purchased products.");
        return (int) productDao.countByState(ProductStateId.COMPRADO.getStateId());
    }

    public int countInactiveProducts() {
        logger.info("Counting inactive products.");
        return (int) productDao.countByState(ProductStateId.INATIVO.getStateId());
    }

    public double calculateAverageTimeToPurchase() {
        logger.info("Calculating average time to purchase.");
    
        List<ProductEntity> purchasedProducts = productDao.findByState(ProductStateId.COMPRADO.getStateId());
    
        if (purchasedProducts.isEmpty()) {
            logger.warn("No purchased products found. Returning 0.");
            return 0.0;
        }
    
        double totalDays = 0.0;
        int count = 0;
    
        for (ProductEntity product : purchasedProducts) {
            if (product.getDate() != null && product.getEditDate() != null) {
                long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(product.getDate(), product.getEditDate());
                if (daysBetween >= 0) { // só considerar se a diferença for válida
                    totalDays += daysBetween;
                    count++;
                }
            }
        }
    
        if (count == 0) {
            logger.warn("No valid purchased products with both dates found. Returning 0.");
            return 0.0;
        }
    
        double average = totalDays / count;
        logger.info("Average time to purchase calculated: {} days", average);
        return average;
    }

    public List<CategoryCountDto> getPopularCategories() {
        logger.info("Fetching popular categories.");
    
        List<Object[]> results = productDao.countProductsByCategory();
        List<CategoryCountDto> popularCategories = new ArrayList<>();
    
        for (Object[] row : results) {
            String categoryName = (String) row[1];    // Nome da categoria
            Long productCount = (Long) row[2];         // Número de produtos
    
            CategoryCountDto dto = new CategoryCountDto();
            dto.setCategoryName(categoryName);
            dto.setProductCount(productCount.intValue());
    
            popularCategories.add(dto);
        }
    
        logger.info("Fetched {} popular categories.", popularCategories.size());
        return popularCategories;
    }
    

    public List<UserProductStatsDto> getProductsPerUser() {
        logger.info("Fetching product statistics per user.");
    
        List<Object[]> results = productDao.countProductsGroupedByUserAndState();
        Map<String, UserProductStatsDto> userStatsMap = new HashMap<>();
    
        for (Object[] row : results) {
            String username = (String) row[0];
            Integer stateId = (Integer) row[1];
            Long count = (Long) row[2];
    
            UserProductStatsDto stats = userStatsMap.getOrDefault(username, new UserProductStatsDto(username));
    
            stats.setTotalProducts(stats.getTotalProducts() + count.intValue());
    
            if (stateId != null) {
                switch (stateId) {
                    case 1 -> stats.setDraftProducts(stats.getDraftProducts() + count.intValue()); // Rascunho
                    case 2 -> stats.setPublishedProducts(stats.getPublishedProducts() + count.intValue()); // Disponível
                    case 3 -> stats.setReservedProducts(stats.getReservedProducts() + count.intValue()); // Reservado
                    case 4 -> stats.setPurchasedProducts(stats.getPurchasedProducts() + count.intValue()); // Comprado
                    case 5 -> stats.setInactiveProducts(stats.getInactiveProducts() + count.intValue()); // Inativo
                    default -> logger.warn("Unknown stateId {} for user {}", stateId, username);
                }
            }
    
            userStatsMap.put(username, stats);
        }
    
        logger.info("Fetched statistics for {} users.", userStatsMap.size());
        return new ArrayList<>(userStatsMap.values());
    }
    
    public List<ProductPurchaseStatsDto> getProductsPurchasedOverTime() {
        List<Object[]> results = productDao.countPurchasesPerDay();
        List<ProductPurchaseStatsDto> stats = new ArrayList<>();
    
        for (Object[] row : results) {
            java.sql.Date sqlDate = (java.sql.Date) row[0];
            LocalDate localDate = sqlDate.toLocalDate();
            Long purchasedProducts = (Long) row[1];
    
            ProductPurchaseStatsDto dto = new ProductPurchaseStatsDto();
            dto.setDate(localDate.toString());
            dto.setPurchasedProducts(purchasedProducts.intValue());
    
            stats.add(dto);
        }
    
        return stats;
    }

    /**
     * Converts a product entity to a DTO
     * 
     * @param entity The product entity to convert
     * @return The corresponding DTO or null if entity is null
     */
    private ProductDto convertEntityToDto(ProductEntity entity) {
        if (entity == null) {
            logger.debug("Attempting to convert null entity to DTO");
            return null;
        }
    
        try {
            ProductDto dto = new ProductDto();
            dto.setId(entity.getId());
            dto.setTitle(entity.getTitle());
            dto.setDescription(entity.getDescription());
            dto.setPrice(entity.getPrice());
            dto.setLocation(entity.getLocation());
            dto.setImageUrl(entity.getImageUrl());
    
            // Set state consistently using ProductStateId enum
            setProductStateFromEntity(dto, entity);
    
            // Format dates to strings
            if (entity.getDate() != null) {
                dto.setDate(entity.getDate().format(DATE_FORMATTER));
            }
    
            if (entity.getEditDate() != null) {
                dto.setEditDate(entity.getEditDate().format(DATE_FORMATTER));
            }
    
            // Set category information
            if (entity.getCategory() != null) {
                dto.setCategoryId(entity.getCategory().getId());
                dto.setCategoryName(entity.getCategory().getName());
            }
    
            // Set seller information
            if (entity.getSeller() != null) {
                dto.setSellerId(entity.getSeller().getId());
                dto.setSellerUsername(
                    entity.getSeller().isActive()
                        ? entity.getSeller().getUsername()
                        : "Conta Cancelada"
                );
            } else {
                // Utilizador foi apagado permanentemente
                dto.setSellerUsername(
                    entity.getSellerName() != null
                        ? entity.getSellerName()
                        : "Vendedor desconhecido"
                );
            }
    
            // Set buyer information if available
            if (entity.getBuyer() != null) {
                dto.setBuyerId(entity.getBuyer().getId());
                dto.setBuyerUsername(
                    entity.getBuyer().isActive()
                        ? entity.getBuyer().getUsername()
                        : "Conta Cancelada"
                );
            }
    
            logger.trace("Successfully converted entity to DTO: id={}", entity.getId());
            return dto;
        } catch (Exception e) {
            logger.error("Error converting entity to DTO: id={}, error={}",
                    entity.getId(), e.getMessage());
            throw e;
        }
    }
    

    /**
     * Converts a product DTO to an entity
     * 
     * @param dto The product DTO to convert
     * @return The corresponding entity or null if DTO is null
     */
    private ProductEntity convertDtoToEntity(ProductDto dto) {
        if (dto == null) {
            return null;
        }

        ProductEntity entity = new ProductEntity();

        // Only set ID if it's an existing product (for updates)
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }

        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setLocation(dto.getLocation());
        entity.setImageUrl(dto.getImageUrl());

        // Set state consistently from ProductStateId
        ProductStateId state = dto.getProductState();
        if (state != null) {
            entity.setStateId(state.getStateId());
            // Active is automatically set in the setStateId method
        } else if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }

        // Parse dates if provided
        if (dto.getDate() != null && !dto.getDate().isEmpty()) {
            try {
                entity.setDate(LocalDate.parse(dto.getDate(), DATE_FORMATTER));
            } catch (Exception e) {
                // Use current date as fallback
                entity.setDate(LocalDate.now());
            }
        }

        if (dto.getEditDate() != null && !dto.getEditDate().isEmpty()) {
            try {
                entity.setEditDate(LocalDate.parse(dto.getEditDate(), DATE_FORMATTER));
            } catch (Exception e) {
                // Use current date as fallback if needed
                entity.setEditDate(LocalDate.now());
            }
        }

        return entity;
    }

    // Helper method:
    private void setProductStateFromEntity(ProductDto dto, ProductEntity entity) {
        if (entity.getStateId() != null) {
            try {
                ProductStateId state = ProductStateId.fromStateId(entity.getStateId());
                dto.setProductState(state);
            } catch (IllegalArgumentException e) {
                dto.setStatus("Unknown");
                dto.setActive(false);
            }
        }
    }
}