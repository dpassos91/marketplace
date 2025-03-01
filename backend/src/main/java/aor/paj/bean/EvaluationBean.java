package aor.paj.bean;

import aor.paj.dao.EvaluationDao;
import aor.paj.dao.ProductDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.EvaluationDto;
import aor.paj.entity.EvaluationEntity;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class EvaluationBean {

  @Inject
  private EvaluationDao evaluationDao;

  @Inject
  private ProductDao productDao;

  @Inject
  private UserDao userDao;

  /**
   * Adds a new evaluation/review for a product
   * 
   * @param evaluationDto The evaluation to add
   * @return The added evaluation with ID or null if invalid
   */
  public EvaluationDto addEvaluation(EvaluationDto evaluationDto) {
    if (evaluationDto == null || evaluationDto.getProductId() == null ||
        evaluationDto.getUserId() == null || evaluationDto.getRating() == null) {
      return null;
    }

    // Check if product and user exist
    ProductEntity product = productDao.findById(evaluationDto.getProductId());
    UserEntity user = userDao.findUserById(evaluationDto.getUserId());

    if (product == null || user == null) {
      return null;
    }

    // Check if user already evaluated this product
    if (evaluationDao.findByUserAndProduct(user.getId(), product.getId()) != null) {
      return null; // User already evaluated this product
    }

    // Convert DTO to Entity
    EvaluationEntity evaluationEntity = convertDtoToEntity(evaluationDto);
    evaluationEntity.setProduct(product);
    evaluationEntity.setUser(user);
    evaluationEntity.setDate(LocalDateTime.now());

    // Save evaluation to database
    EvaluationEntity savedEvaluation = evaluationDao.persist(evaluationEntity);

    // Return saved evaluation as DTO
    return convertEntityToDto(savedEvaluation);
  }

  /**
   * Gets an evaluation by its ID
   * 
   * @param id The ID of the evaluation
   * @return The evaluation DTO or null if not found
   */
  public EvaluationDto getEvaluationById(long id) {
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
   * Gets all evaluations for a specific product
   * 
   * @param productId The ID of the product
   * @return List of evaluation DTOs for the product
   */
  public List<EvaluationDto> getEvaluationsByProduct(long productId) {
    List<EvaluationEntity> entities = evaluationDao.findByProduct(productId);
    return entities.stream()
        .map(this::convertEntityToDto)
        .collect(Collectors.toList());
  }

  /**
   * Gets all evaluations by a specific user
   * 
   * @param userId The ID of the user
   * @return List of evaluation DTOs by the user
   */
  public List<EvaluationDto> getEvaluationsByUser(long userId) {
    List<EvaluationEntity> entities = evaluationDao.findByUser(userId);
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

    // Update the evaluation entity
    if (evaluationDto.getRating() != null) {
      existingEvaluation.setRating(evaluationDto.getRating());
    }

    if (evaluationDto.getComment() != null) {
      existingEvaluation.setComment(evaluationDto.getComment());
    }

    // Update modification date
    existingEvaluation.setDate(LocalDateTime.now());

    // Save the updated entity
    EvaluationEntity updatedEvaluation = evaluationDao.merge(existingEvaluation);

    // Return the updated entity as DTO
    return convertEntityToDto(updatedEvaluation);
  }

  /**
   * Deletes an evaluation by its ID
   * 
   * @param id The ID of the evaluation to delete
   * @return true if successful, false otherwise
   */
  public boolean deleteEvaluation(long id) {
    return evaluationDao.delete(id);
  }

  /**
   * Calculates the average rating for a product
   * 
   * @param productId The ID of the product
   * @return The average rating or null if no evaluations exist
   */
  public Double getAverageRatingForProduct(long productId) {
    return evaluationDao.getAverageRatingForProduct(productId);
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
    dto.setProductId(entity.getProduct().getId());
    dto.setUserId(entity.getUser().getId());
    dto.setRating(entity.getRating());
    dto.setComment(entity.getComment());
    dto.setDate(entity.getDate());
    dto.setUsername(entity.getUser().getUsername());
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

    entity.setRating(dto.getRating());
    entity.setComment(dto.getComment());

    // Note: product and user relationships are set in the calling method
    // as they require database lookups

    return entity;
  }
}