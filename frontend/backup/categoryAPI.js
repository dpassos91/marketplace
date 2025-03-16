'use strict';

import { API_ENDPOINTS } from '../config/ApiConfig.js';
import { makeAuthenticatedRequest } from '../utils/apiUtils.js';

/**
 * Fetches all categories from the API.
 *
 * @async
 * @function getAllCategories
 * @returns {Promise<Array>} A promise that resolves to an array of category objects.
 * If an error occurs, returns an empty array.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getAllCategories() {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.categories.all,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

/**
 * Retrieves a specific category by its ID.
 *
 * @async
 * @function getCategoryById
 * @param {string|number} categoryId - The ID of the category to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the category object.
 * Returns null if the category doesn't exist or if an error occurs.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getCategoryById(categoryId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.categories.byId(categoryId),
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching category: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

/**
 * Creates a new category.
 *
 * @async
 * @function addCategory
 * @param {Object} category - The category object to be created.
 * @param {string} category.name - The name of the category.
 * @param {string} [category.description] - Optional description for the category.
 * @returns {Promise<Object>} A promise that resolves to the newly created category object.
 * @throws {Error} Throws an error if the creation fails or if the HTTP response is not ok.
 */
export async function addCategory(category) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.categories.create,
      {
        method: 'POST',
        body: JSON.stringify(category),
      }
    );

    if (!response.ok) {
      throw new Error(`Error adding category: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}

/**
 * Updates an existing category.
 *
 * @async
 * @function updateCategory
 * @param {string|number} categoryId - The ID of the category to update.
 * @param {Object} updatedCategory - The updated category data.
 * @param {string} [updatedCategory.name] - The updated name of the category.
 * @param {string} [updatedCategory.description] - The updated description of the category.
 * @returns {Promise<Object>} A promise that resolves to the updated category object.
 * @throws {Error} Throws an error if the update fails or if the HTTP response is not ok.
 */
export async function updateCategory(categoryId, updatedCategory) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.categories.update(categoryId),
      {
        method: 'PUT',
        body: JSON.stringify(updatedCategory),
      }
    );

    if (!response.ok) {
      throw new Error(`Error updating category: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

/**
 * Deletes a category by its ID.
 *
 * @async
 * @function deleteCategory
 * @param {string|number} categoryId - The ID of the category to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if deletion is successful.
 * @throws {Error} Throws an error if the deletion fails or if the HTTP response is not ok.
 */
export async function deleteCategory(categoryId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.categories.delete(categoryId),
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`Error deleting category: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}
