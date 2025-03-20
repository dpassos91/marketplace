import { API_ENDPOINTS } from '../config/ApiConfig.js';
import { makeAuthenticatedRequest } from '../utils/apiUtils.js';

/**
 * Fetches all evaluations for a specific seller.
 *
 * @async
 * @function getEvaluationsForSeller
 * @param {string|number} sellerId - The ID of the seller whose evaluations are being retrieved.
 * @returns {Promise<Array>} A promise that resolves to an array of evaluation objects.
 * @throws {Error} Throws an error if the HTTP request fails or if the response is not ok.
 */
async function getEvaluationsForSeller(sellerId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.evaluations.byEvaluated(sellerId),
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching evaluations: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    throw error;
  }
}

/**
 * Retrieves a specific evaluation by its ID.
 *
 * @async
 * @function getEvaluationById
 * @param {string|number} evaluationId - The ID of the evaluation to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the evaluation object.
 * @throws {Error} Throws an error if the HTTP request fails or if the response is not ok.
 */
async function getEvaluationById(evaluationId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.evaluations.byId(evaluationId),
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching evaluation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    throw error;
  }
}


/**
 * Fetches all evaluations from the API.
 *
 * This function makes an authenticated GET request to the evaluations endpoint
 * and returns the response data as a JSON object. If the request fails or the
 * response is not OK, an error is thrown.
 *
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing all evaluations.
 * @throws {Error} If there is an error fetching the evaluations or the response is not OK.
 */
async function getAllEvaluations() {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.evaluations.all,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching evaluations: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    throw error;
  }
}

/**
 * Creates a new evaluation.
 *
 * @async
 * @function addEvaluation
 * @param {Object} evaluationData - The evaluation data to be submitted.
 * @param {string|number} evaluationData.evaluatedId - The ID of the user being evaluated.
 * @param {number} evaluationData.rating - The rating score (typically 1-5).
 * @param {string} [evaluationData.comment] - Optional comment for the evaluation.
 * @returns {Promise<Object>} A promise that resolves to the newly created evaluation object.
 * @throws {Error} Throws an error if the creation fails or if the HTTP response is not ok.
 */
async function addEvaluation(evaluationData) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.evaluations.create,
      {
        method: 'POST',
        body: JSON.stringify(evaluationData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error creating evaluation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating evaluation:', error);
    throw error;
  }
}

/**
 * Updates an existing evaluation.
 *
 * @async
 * @function updateEvaluation
 * @param {Object} evaluationData - The updated evaluation data.
 * @param {string|number} evaluationData.id - The ID of the evaluation to update.
 * @param {number} [evaluationData.rating] - The updated rating score.
 * @param {string} [evaluationData.comment] - The updated comment.
 * @returns {Promise<Object>} A promise that resolves to the updated evaluation object.
 * @throws {Error} Throws an error if the update fails or if the HTTP response is not ok.
 */
async function updateEvaluation(evaluationData) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.evaluations.update(evaluationData.id),
      {
        method: 'PUT',
        body: JSON.stringify(evaluationData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error updating evaluation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating evaluation:', error);
    throw error;
  }
}

/**
 * Deletes an evaluation by its ID.
 *
 * @async
 * @function deleteEvaluation
 * @param {string|number} evaluationId - The ID of the evaluation to delete.
 * @returns {Promise<string>} A promise that resolves to the response text from the server.
 * @throws {Error} Throws an error if the deletion fails or if the HTTP response is not ok.
 */
async function deleteEvaluation(evaluationId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.evaluations.delete(evaluationId),
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`Error deleting evaluation: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    throw error;
  }
}

/**
 * Checks if the current authenticated user has already evaluated a specific seller.
 *
 * @async
 * @function hasUserEvaluatedSeller
 * @param {string|number} sellerId - The ID of the seller to check.
 * @returns {Promise<boolean|Object>} A promise that resolves to the evaluation status information.
 * Returns false if an error occurs.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
async function hasUserEvaluatedSeller(sellerId) {
  try {
    const response = await makeAuthenticatedRequest(
      `${API_ENDPOINTS.evaluations.hasEvaluated}?sellerId=${sellerId}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error checking evaluation status: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking evaluation status:', error);
    return false;
  }
}

/**
 * Retrieves products that the specified user is eligible to evaluate.
 *
 * @async
 * @function getEligibleProductsForEvaluation
 * @param {string|number} userId - The ID of the user to check for eligible products.
 * @returns {Promise<Array>} A promise that resolves to an array of products eligible for evaluation.
 * @throws {Error} Throws an error if the HTTP request fails or if the response is not ok.
 */
async function getEligibleProductsForEvaluation(userId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.evaluations.eligible(userId),
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching eligible products: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching eligible products:', error);
    throw error;
  }
}

export const evaluationAPI = {
  getEvaluationsForSeller,
  getEvaluationById,
  getAllEvaluations,
  addEvaluation,
  updateEvaluation,
  deleteEvaluation,
  hasUserEvaluatedSeller,
  getEligibleProductsForEvaluation
};
