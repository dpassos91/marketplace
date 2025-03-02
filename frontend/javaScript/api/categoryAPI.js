'use strict';

import { API_ENDPOINTS } from '../config/apiConfig.js';
import { makeAuthenticatedRequest } from '../utils/apiUtils.js';

// Get all categories
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

// Get category by ID
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

// Add a new category
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

// Update a category
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

// Delete a category
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
