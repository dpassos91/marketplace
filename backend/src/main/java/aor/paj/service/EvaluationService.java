package aor.paj.service;

import java.util.List;

import aor.paj.bean.EvaluationBean;
import aor.paj.dto.EvaluationDto;
import aor.paj.dto.ProductDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/evaluations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EvaluationService {

  @Inject
  private EvaluationBean evaluationBean;

  /**
   * Get products eligible for evaluation by a specific user
   * 
   * @param userId The ID of the user (buyer)
   * @return Response with list of eligible products
   */
  @GET
  @Path("/eligible/{userId}")
  public Response getEligibleProductsToEvaluate(@PathParam("userId") Long userId) {
    if (userId == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("User ID is required").build();
    }

    List<ProductDto> eligibleProducts = evaluationBean.getProductsEligibleForEvaluation(userId);
    return Response.ok(eligibleProducts).build();
  }

  /**
   * Get all evaluations
   * 
   * @return Response with list of all evaluations
   */
  @GET
  public Response getAllEvaluations() {
    List<EvaluationDto> evaluations = evaluationBean.getAllEvaluations();
    return Response.ok(evaluations).build();
  }

  /**
   * Get paginated list of evaluations
   * 
   * @param page Page number (zero-based)
   * @param size Page size
   * @return Response with paginated list of evaluations
   */
  @GET
  @Path("/paginated")
  public Response getEvaluationsPaginated(
      @QueryParam("page") @DefaultValue("0") int page,
      @QueryParam("size") @DefaultValue("10") int size) {
    List<EvaluationDto> evaluations = evaluationBean.getEvaluationsPaginated(page, size);
    return Response.ok(evaluations).build();
  }

  /**
   * Get total count of evaluations
   * 
   * @return Response with count of evaluations
   */
  @GET
  @Path("/count")
  public Response getEvaluationCount() {
    Long count = evaluationBean.getEvaluationCount();
    return Response.ok(count).build();
  }

  /**
   * Get evaluation by ID
   * 
   * @param id Evaluation ID
   * @return Response with evaluation or 404 if not found
   */
  @GET
  @Path("/{id}")
  public Response getEvaluationById(@PathParam("id") Long id) {
    if (id == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Evaluation ID is required").build();
    }

    EvaluationDto evaluation = evaluationBean.getEvaluationById(id);
    if (evaluation == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    return Response.ok(evaluation).build();
  }

  /**
   * Get evaluations given by a specific user
   * 
   * @param evaluatorId ID of the evaluator
   * @return Response with list of evaluations
   */
  @GET
  @Path("/evaluator/{evaluatorId}")
  public Response getEvaluationsByEvaluator(@PathParam("evaluatorId") Long evaluatorId) {
    if (evaluatorId == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Evaluator ID is required").build();
    }

    List<EvaluationDto> evaluations = evaluationBean.getEvaluationsByEvaluator(evaluatorId);
    return Response.ok(evaluations).build();
  }

  /**
   * Get paginated evaluations given by a specific user
   * 
   * @param evaluatorId ID of the evaluator
   * @param page        Page number (zero-based)
   * @param size        Page size
   * @return Response with paginated list of evaluations
   */
  @GET
  @Path("/evaluator/{evaluatorId}/paginated")
  public Response getEvaluationsByEvaluatorPaginated(
      @PathParam("evaluatorId") Long evaluatorId,
      @QueryParam("page") @DefaultValue("0") int page,
      @QueryParam("size") @DefaultValue("10") int size) {
    if (evaluatorId == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Evaluator ID is required").build();
    }

    List<EvaluationDto> evaluations = evaluationBean.getEvaluationsByEvaluatorPaginated(evaluatorId, page, size);
    return Response.ok(evaluations).build();
  }

  /**
   * Get evaluations received by a specific user
   * 
   * @param evaluatedId ID of the evaluated user
   * @return Response with list of evaluations
   */
  @GET
  @Path("/evaluated/{evaluatedId}")
  public Response getEvaluationsByEvaluated(@PathParam("evaluatedId") Long evaluatedId) {
    if (evaluatedId == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Evaluated ID is required").build();
    }

    List<EvaluationDto> evaluations = evaluationBean.getEvaluationsByEvaluated(evaluatedId);
    return Response.ok(evaluations).build();
  }

  /**
   * Get paginated evaluations received by a specific user
   * 
   * @param evaluatedId ID of the evaluated user
   * @param page        Page number (zero-based)
   * @param size        Page size
   * @return Response with paginated list of evaluations
   */
  @GET
  @Path("/evaluated/{evaluatedId}/paginated")
  public Response getEvaluationsByEvaluatedPaginated(
      @PathParam("evaluatedId") Long evaluatedId,
      @QueryParam("page") @DefaultValue("0") int page,
      @QueryParam("size") @DefaultValue("10") int size) {
    if (evaluatedId == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Evaluated ID is required").build();
    }

    List<EvaluationDto> evaluations = evaluationBean.getEvaluationsByEvaluatedPaginated(evaluatedId, page, size);
    return Response.ok(evaluations).build();
  }

  /**
   * Get count of evaluations received by a specific user
   * 
   * @param evaluatedId ID of the evaluated user
   * @return Response with count of evaluations
   */
  @GET
  @Path("/evaluated/{evaluatedId}/count")
  public Response getEvaluationCountByEvaluated(@PathParam("evaluatedId") Long evaluatedId) {
    if (evaluatedId == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Evaluated ID is required").build();
    }

    Long count = evaluationBean.getEvaluationCountByEvaluated(evaluatedId);
    return Response.ok(count).build();
  }

  /**
   * Get average rating for a specific user
   * 
   * @param evaluatedId ID of the evaluated user
   * @return Response with average rating or 404 if no ratings exist
   */
  @GET
  @Path("/evaluated/{evaluatedId}/average")
  public Response getAverageRatingForUser(@PathParam("evaluatedId") Long evaluatedId) {
    if (evaluatedId == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Evaluated ID is required").build();
    }

    Double averageRating = evaluationBean.getAverageRatingForUser(evaluatedId);
    if (averageRating == null) {
      return Response.ok(0.0).build(); // Return 0.0 if no ratings exist
    }
    return Response.ok(averageRating).build();
  }

  /**
   * Create a new evaluation
   * 
   * @param evaluationDto Evaluation data
   * @return Response with created evaluation or 400 if invalid
   */
  @POST
  public Response createEvaluation(EvaluationDto evaluationDto) {
    if (evaluationDto == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Evaluation data is required").build();
    }

    // Input validation
    if (evaluationDto.getEvaluatorId() == null ||
        evaluationDto.getEvaluatedId() == null ||
        evaluationDto.getRating() == null ||
        evaluationDto.getProductId() == null) {
      return Response.status(Response.Status.BAD_REQUEST)
          .entity("Missing required fields: evaluator, evaluated, rating, and product").build();
    }

    // Validate rating range
    if (evaluationDto.getRating() < 1 || evaluationDto.getRating() > 5) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Rating must be between 1 and 5").build();
    }

    EvaluationDto savedEvaluation = evaluationBean.addEvaluation(evaluationDto);
    if (savedEvaluation == null) {
      return Response.status(Response.Status.BAD_REQUEST)
          .entity(
              "Cannot create evaluation. Verify that the product was purchased by this user and has not been evaluated yet.")
          .build();
    }
    return Response.status(Response.Status.CREATED).entity(savedEvaluation).build();
  }

  /**
   * Update an existing evaluation
   * 
   * @param id            Evaluation ID
   * @param evaluationDto Updated evaluation data
   * @return Response with updated evaluation or error if invalid
   */
  @PUT
  @Path("/{id}")
  public Response updateEvaluation(@PathParam("id") Long id, EvaluationDto evaluationDto) {
    if (id == null || evaluationDto == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Evaluation ID and data are required").build();
    }

    // Ensure ID in path matches the one in DTO
    if (evaluationDto.getId() == null) {
      evaluationDto.setId(id);
    } else if (!id.equals(evaluationDto.getId())) {
      return Response.status(Response.Status.BAD_REQUEST)
          .entity("ID in path doesn't match ID in evaluation").build();
    }

    // Validate rating range if provided
    if (evaluationDto.getRating() != null && (evaluationDto.getRating() < 1 || evaluationDto.getRating() > 5)) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Rating must be between 1 and 5").build();
    }

    EvaluationDto updatedEvaluation = evaluationBean.updateEvaluation(evaluationDto);
    if (updatedEvaluation == null) {
      return Response.status(Response.Status.NOT_FOUND)
          .entity("Evaluation not found or you don't have permission to update it").build();
    }
    return Response.ok(updatedEvaluation).build();
  }

  /**
   * Delete an evaluation
   * 
   * @param id Evaluation ID
   * @return Response with 204 if successful or 404 if not found
   */
  @DELETE
  @Path("/{id}")
  public Response deleteEvaluation(@PathParam("id") Long id) {
    if (id == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Evaluation ID is required").build();
    }

    boolean deleted = evaluationBean.deleteEvaluation(id);
    if (!deleted) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    return Response.noContent().build();
  }
}
