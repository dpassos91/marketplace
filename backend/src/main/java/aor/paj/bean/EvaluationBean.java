package aor.paj.bean;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import aor.paj.dao.EvaluationDao;
import aor.paj.dao.ProductDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.EvaluationDto;
import aor.paj.dto.ProductDto;
import aor.paj.entity.EvaluationEntity;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import aor.paj.util.ProductStateId;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class EvaluationBean {

    @Inject
    private EvaluationDao evaluationDao;

    @Inject
    private UserDao userDao;

    @Inject
    private ProductDao productDao;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    /**
     * Adds a new seller evaluation based on a purchased product
     * 
     * @param evaluationDto The evaluation to add
     * @return The added evaluation with ID or null if invalid
     */
    public EvaluationDto addEvaluation(EvaluationDto evaluationDto) {
        if (evaluationDto == null || evaluationDto.getEvaluatorId() == null ||
                evaluationDto.getEvaluatedId() == null || evaluationDto.getRating() == null ||
                evaluationDto.getProductId() == null) {
            return null;
        }

        // Check if users and product exist
        UserEntity buyer = userDao.findById(evaluationDto.getEvaluatorId());
        UserEntity seller = userDao.findById(evaluationDto.getEvaluatedId());
        ProductEntity product = productDao.findById(evaluationDto.getProductId());

        if (buyer == null || seller == null || product == null) {
            return null;
        }

        // Verify buyer is not evaluating themselves
        if (buyer.getId().equals(seller.getId())) {
            return null;
        }

        // Verify product was actually sold by the seller to the buyer
        if (!product.getSeller().getId().equals(seller.getId()) ||
                product.getBuyer() == null ||
                !product.getBuyer().getId().equals(buyer.getId()) ||
                product.getStateId() != ProductStateId.COMPRADO.getStateId()) {
            return null; // Not a valid purchase
        }

        // Check if buyer already evaluated this seller for this product
        if (evaluationDao.existsByBuyerSellerAndProduct(buyer.getId(), seller.getId(), product.getId())) {
            return null; // Already evaluated
        }

        // Convert DTO to Entity
        EvaluationEntity evaluationEntity = convertDtoToEntity(evaluationDto);
        evaluationEntity.setEvaluator(buyer);
        evaluationEntity.setEvaluated(seller);
        evaluationEntity.setProduct(product);
        evaluationEntity.setDate(LocalDate.now());

        // Save evaluation to database
        EvaluationEntity savedEvaluation = evaluationDao.create(evaluationEntity);

        // Return saved evaluation as DTO
        return convertEntityToDto(savedEvaluation);
    }

    /**
     * Gets an evaluation by its ID
     * 
     * @param id The ID of the evaluation
     * @return The evaluation DTO or null if not found
     */
    public EvaluationDto getEvaluationById(Long id) {
        EvaluationEntity evaluation = evaluationDao.findById(id);
        return convertEntityToDto(evaluation);
    }

    /**
     * Gets all evaluations from the database
     * 
     * @return List of evaluation DTOs
     */
    public List<EvaluationDto> getAllEvaluations() {
        List<EvaluationEntity> entities = evaluationDao.findAll();
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets all evaluations given by a specific user
     * 
     * @param evaluatorId The ID of the evaluating user
     * @return List of evaluation DTOs
     */
    public List<EvaluationDto> getEvaluationsByEvaluator(Long evaluatorId) {
        List<EvaluationEntity> entities = evaluationDao.findByEvaluator(evaluatorId);
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets all evaluations received by a specific user
     * 
     * @param evaluatedId The ID of the evaluated user
     * @return List of evaluation DTOs
     */
    public List<EvaluationDto> getEvaluationsByEvaluated(Long evaluatedId) {
        List<EvaluationEntity> entities = evaluationDao.findByEvaluated(evaluatedId);
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets evaluations with pagination
     * 
     * @param page     The page number (0-based)
     * @param pageSize The number of items per page
     * @return List of evaluation DTOs for the requested page
     */
    public List<EvaluationDto> getEvaluationsPaginated(int page, int pageSize) {
        int offset = page * pageSize;
        List<EvaluationEntity> entities = evaluationDao.findAllPaginated(offset, pageSize);
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets evaluations for a specific evaluated user with pagination
     * 
     * @param evaluatedId The ID of the evaluated user
     * @param page        The page number (0-based)
     * @param pageSize    The number of items per page
     * @return List of evaluation DTOs for the requested page
     */
    public List<EvaluationDto> getEvaluationsByEvaluatedPaginated(Long evaluatedId, int page, int pageSize) {
        int offset = page * pageSize;
        List<EvaluationEntity> entities = evaluationDao.findByEvaluatedPaginated(evaluatedId, offset, pageSize);
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Gets evaluations given by a specific user with pagination
     * 
     * @param evaluatorId The ID of the evaluating user
     * @param page        The page number (0-based)
     * @param pageSize    The number of items per page
     * @return List of evaluation DTOs for the requested page
     */
    public List<EvaluationDto> getEvaluationsByEvaluatorPaginated(Long evaluatorId, int page, int pageSize) {
        int offset = page * pageSize;
        List<EvaluationEntity> entities = evaluationDao.findByEvaluatorPaginated(evaluatorId, offset, pageSize);
        return entities.stream()
                .map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing evaluation
     * 
     * @param evaluationDto The updated evaluation information
     * @return The updated evaluation DTO or null if not found/invalid
     */
    public EvaluationDto updateEvaluation(EvaluationDto evaluationDto) {
        if (evaluationDto == null || evaluationDto.getId() == null) {
            return null;
        }

        // Check if evaluation exists
        EvaluationEntity existingEvaluation = evaluationDao.findById(evaluationDto.getId());
        if (existingEvaluation == null) {
            return null;
        }

        // Check if the evaluator is the same (only the evaluator can update their
        // review)
        if (!existingEvaluation.getEvaluator().getId().equals(evaluationDto.getEvaluatorId())) {
            return null;
        }

        // Update the evaluation entity
        if (evaluationDto.getTitle() != null) {
            existingEvaluation.setTitle(evaluationDto.getTitle());
        }

        if (evaluationDto.getComment() != null) {
            existingEvaluation.setComment(evaluationDto.getComment());
        }

        if (evaluationDto.getRating() != null) {
            // Convert Integer rating (1-5) to BigDecimal
            existingEvaluation.setRating(evaluationDto.getRating());
        }

        // Update modification date
        existingEvaluation.setDate(LocalDate.now());

        // Save the updated entity
        EvaluationEntity updatedEvaluation = evaluationDao.update(existingEvaluation);

        // Return the updated entity as DTO
        return convertEntityToDto(updatedEvaluation);
    }

    /**
     * Deletes an evaluation by its ID
     * 
     * @param id The ID of the evaluation to delete
     * @return true if successful, false otherwise
     */
    public boolean deleteEvaluation(Long id) {
        return evaluationDao.delete(id);
    }

    /**
     * Calculates the average rating for a specific user
     * 
     * @param userId The ID of the user
     * @return The average rating or 0.0 if no evaluations exist
     */
    public Double getAverageRatingForUser(Long userId) {
        Double average = evaluationDao.calculateAverageRating(userId);
        return average != null ? average : 0.0;
    }

    /**
     * Get total count of evaluations
     * 
     * @return Total number of evaluations
     */
    public Long getEvaluationCount() {
        return evaluationDao.count();
    }

    /**
     * Get count of evaluations received by a specific user
     * 
     * @param userId The ID of the evaluated user
     * @return Number of evaluations received
     */
    public Long getEvaluationCountByEvaluated(Long userId) {
        return evaluationDao.countByEvaluated(userId);
    }

    /**
     * Gets products that a user has purchased but not yet evaluated the seller
     * 
     * @param userId The ID of the user (buyer)
     * @return List of products eligible for evaluation
     */
    public List<ProductDto> getProductsEligibleForEvaluation(Long userId) {
        // Get products purchased by this user
        List<ProductEntity> purchasedProducts = productDao.findPurchasedByUser(userId);

        // Filter out products where this user already evaluated the seller
        return purchasedProducts.stream()
                .filter(product -> !evaluationDao.existsByBuyerSellerAndProduct(
                        userId,
                        product.getSeller().getId(),
                        product.getId()))
                .map(this::convertProductEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Converts a ProductEntity to a ProductDto
     * 
     * @param entity The product entity to convert
     * @return The corresponding DTO or null if entity is null
     */
    private ProductDto convertProductEntityToDto(ProductEntity entity) {
        if (entity == null) {
            return null;
        }

        ProductDto dto = new ProductDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setLocation(entity.getLocation());
        dto.setStatus(entity.getStatus());
        dto.setActive(entity.isActive());

        // Convert dates to string format
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

        // Set buyer information
        if (entity.getBuyer() != null) {
            dto.setBuyerId(entity.getBuyer().getId());
            dto.setBuyerUsername(entity.getBuyer().getUsername());
        }

        return dto;
    }

    /**
     * Converts an evaluation entity to a DTO
     * 
     * @param entity The evaluation entity to convert
     * @return The corresponding DTO or null if entity is null
     */
    private EvaluationDto convertEntityToDto(EvaluationEntity entity) {
        if (entity == null) {
            return null;
        }

        EvaluationDto dto = new EvaluationDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setComment(entity.getComment());

        // Format LocalDate to String
        dto.setDate(entity.getDate() != null ? entity.getDate().format(DATE_FORMATTER) : null);

        // Convert BigDecimal grade to Integer rating (1-5)
        dto.setRating(entity.getRating() != null ? entity.getRating().intValue() : null);

        // Set user information
        if (entity.getEvaluator() != null) {
            dto.setEvaluatorId(entity.getEvaluator().getId());
            dto.setEvaluatorUsername(entity.getEvaluator().getUsername());
        }

        if (entity.getEvaluated() != null) {
            dto.setEvaluatedId(entity.getEvaluated().getId());
            dto.setEvaluatedUsername(entity.getEvaluated().getUsername());
        }

        // Set product information
        if (entity.getProduct() != null) {
            dto.setProductId(entity.getProduct().getId());
            dto.setProductTitle(entity.getProduct().getTitle());
        }

        return dto;
    }

    /**
     * Converts an evaluation DTO to an entity
     * 
     * @param dto The evaluation DTO to convert
     * @return The corresponding entity or null if DTO is null
     */
    private EvaluationEntity convertDtoToEntity(EvaluationDto dto) {
        if (dto == null) {
            return null;
        }

        EvaluationEntity entity = new EvaluationEntity();

        // Only set ID if it's an existing evaluation (for updates)
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }

        entity.setTitle(dto.getTitle());
        entity.setComment(dto.getComment());

        // Parse date if provided, otherwise it will be set in the calling method
        if (dto.getDate() != null && !dto.getDate().isEmpty()) {
            try {
                entity.setDate(LocalDate.parse(dto.getDate(), DATE_FORMATTER));
            } catch (Exception e) {
                // Use current date as fallback
                entity.setDate(LocalDate.now());
            }
        }

        // Convert Integer rating to BigDecimal
        if (dto.getRating() != null) {
            entity.setRating(dto.getRating());
        }

        // Note: evaluator and evaluated relationships are set in the calling method

        return entity;
    }
}