package aor.paj.bean;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.ProductDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.ProductDto;
import aor.paj.entity.CategoryEntity;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import aor.paj.util.ProductStateId;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class ProductBean {

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
        if (productDto == null) {
            return null;
        }

        // Check if seller and category exist
        UserEntity seller = userDao.findById(productDto.getSellerId());
        CategoryEntity category = categoryDao.findById(productDto.getCategoryId());

        if (seller == null || category == null) {
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
        ProductEntity savedProduct = productDao.create(productEntity);

        // Return saved product as DTO
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

    /**
     * Gets products by seller
     * 
     * @param sellerId The ID of the seller
     * @return List of product DTOs sold by the specified user
     */
    public List<ProductDto> getProductsBySeller(Long sellerId) {
        List<ProductEntity> entities = productDao.findBySeller(sellerId);
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
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
        ProductEntity product = productDao.findById(productId);
        if (product == null) {
            return null;
        }

        ProductStateId state = ProductStateId.fromStateId(stateId);
        product.setStateId(state.getStateId());
        product.setEditDate(LocalDate.now());

        ProductEntity updatedProduct = productDao.update(product);
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
        ProductEntity product = productDao.findById(productId);
        UserEntity buyer = userDao.findById(buyerId);

        if (product == null || buyer == null) {
            return null;
        }

        // Verify product is available for purchase
        int currentStateId = product.getStateId();
        if (currentStateId != ProductStateId.DISPONIVEL.getStateId() &&
                currentStateId != ProductStateId.RESERVADO.getStateId()) {
            return null;
        }

        // Verify buyer is not the seller
        if (product.getSeller().getId().equals(buyerId)) {
            return null;
        }

        // Update product status to purchased
        product.setStateId(ProductStateId.COMPRADO.getStateId());
        product.setBuyer(buyer);
        product.setEditDate(LocalDate.now());

        ProductEntity updatedProduct = productDao.update(product);
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
        int offset = page * pageSize;
        List<ProductEntity> entities = productDao.findAllPaginated(offset, pageSize);
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
     * Converts a product entity to a DTO
     * 
     * @param entity The product entity to convert
     * @return The corresponding DTO or null if entity is null
     */
    private ProductDto convertEntityToDto(ProductEntity entity) {
        if (entity == null) {
            return null;
        }

        ProductDto dto = new ProductDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setLocation(entity.getLocation());
        dto.setImageUrl(entity.getImageUrl());
        dto.setStatus(entity.getStatus());
        dto.setActive(entity.isActive());

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
            dto.setSellerUsername(entity.getSeller().getUsername());
        }

        // Set buyer information if available
        if (entity.getBuyer() != null) {
            dto.setBuyerId(entity.getBuyer().getId());
            dto.setBuyerUsername(entity.getBuyer().getUsername());
        }

        return dto;
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
        entity.setImageUrl(dto.getImageUrl()); // Add imageUrl field
        entity.setStatus(dto.getStatus());
        entity.setActive(dto.isActive());

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

        // Note: category, seller, and buyer relationships are set in the calling
        // methods

        return entity;
    }
}