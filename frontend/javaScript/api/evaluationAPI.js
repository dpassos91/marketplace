'use strict';

import { API_ENDPOINTS, DEFAULT_OPTIONS } from '../config/apiConfig.js';

// Get all evaluations for a seller
export async function getSellerEvaluations(sellerId) {
  try {
    const response = await fetch(API_ENDPOINTS.evaluations.bySeller(sellerId), {
      method: 'GET',
      headers: DEFAULT_OPTIONS.headers,
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching seller evaluations: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching seller evaluations:', error);
    return [];
  }
}

// Add a new evaluation
export async function addEvaluation(evaluation) {
  try {
    const response = await fetch(API_ENDPOINTS.evaluations.create, {
      method: 'POST',
      headers: DEFAULT_OPTIONS.headers,
      body: JSON.stringify(evaluation),
    });

    if (!response.ok) {
      throw new Error(`Error adding evaluation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding evaluation:', error);
    throw error;
  }
}

// Update an evaluation
export async function updateEvaluation(evaluationId, updatedEvaluation) {
  try {
    const response = await fetch(
      API_ENDPOINTS.evaluations.update(evaluationId),
      {
        method: 'PUT',
        headers: DEFAULT_OPTIONS.headers,
        body: JSON.stringify(updatedEvaluation),
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
    const response = await fetch(
      API_ENDPOINTS.evaluations.delete(evaluationId),
      {
        method: 'DELETE',
        headers: DEFAULT_OPTIONS.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Error deleting evaluation: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    throw error;
  }
}
