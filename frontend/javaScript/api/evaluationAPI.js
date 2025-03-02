'use strict';

import { API_ENDPOINTS } from '../config/apiConfig.js';
import { makeAuthenticatedRequest } from '../utils/apiUtils.js';

// Get all evaluations for a seller
export async function getEvaluationsForSeller(sellerId) {
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

// Get evaluation by ID
export async function getEvaluationById(evaluationId) {
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

// Add a new evaluation
export async function addEvaluation(evaluationData) {
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

// Update an evaluation
export async function updateEvaluation(evaluationData) {
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

// Delete an evaluation
export async function deleteEvaluation(evaluationId) {
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

// Check if a user has already evaluated a seller
export async function hasUserEvaluatedSeller(sellerId) {
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
