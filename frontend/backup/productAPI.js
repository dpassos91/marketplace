'use strict';

import { API_ENDPOINTS } from '../config/apiConfig.js';
import { makeAuthenticatedRequest } from '../utils/apiUtils.js';
import { PRODUCT_STATES } from '../../../javaScript/config/productStates.js';

/**
 * Fetches all products from the API.
 *
 * @async
 * @function getAllProducts
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 * If an error occurs, returns an empty array.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getAllProducts() {
  try {
    const response = await fetch(API_ENDPOINTS.products.all, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

/**
 * Fetches all active products from the API.
 *
 * @async
 * @function getAllActiveProducts
 * @returns {Promise<Array>} A promise that resolves to an array of active product objects.
 * If an error occurs, returns an empty array.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getAllActiveProducts() {
  try {
    const response = await fetch(API_ENDPOINTS.products.active, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch active products:', error);
    return [];
  }
}

/**
 * Fetches paginated products from the API.
 *
 * @async
 * @function getProductsPaginated
 * @param {number} [page=0] - The page number to retrieve.
 * @param {number} [size=10] - The number of products per page.
 * @returns {Promise<Object>} A promise that resolves to a paginated product response.
 * If an error occurs, returns an empty array.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getProductsPaginated(page = 0, size = 10) {
  try {
    const response = await fetch(API_ENDPOINTS.products.paginated(page, size), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch paginated products:', error);
    return [];
  }
}

/**
 * Retrieves a specific product by its ID.
 *
 * @async
 * @function getProductById
 * @param {string|number} productId - The ID of the product to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the product object.
 * Returns null if the product doesn't exist or if an error occurs.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getProductById(productId) {
  try {
    const response = await fetch(API_ENDPOINTS.products.byId(productId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Retrieves all products belonging to a specific category.
 *
 * @async
 * @function getProductsByCategory
 * @param {string|number} categoryId - The ID of the category to filter products by.
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 * If an error occurs, returns an empty array.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getProductsByCategory(categoryId) {
  try {
    const response = await fetch(
      API_ENDPOINTS.products.byCategory(categoryId),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching products by category: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

/**
 * Retrieves all products listed by a specific seller.
 *
 * @async
 * @function getProductsBySeller
 * @param {string|number} sellerId - The ID of the seller whose products are being retrieved.
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 * If an error occurs, returns an empty array.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getProductsBySeller(sellerId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.bySeller(sellerId),
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching seller products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return [];
  }
}

/**
 * Searches for products by their title.
 *
 * @async
 * @function searchProductsByTitle
 * @param {string} title - The search term to match against product titles.
 * @returns {Promise<Array>} A promise that resolves to an array of matching product objects.
 * If an error occurs, returns an empty array.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function searchProductsByTitle(title) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.search(title),
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Error searching products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

/**
 * Retrieves products by geographic location.
 *
 * @async
 * @function getProductsByLocation
 * @param {string} location - The location to filter products by.
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 * If an error occurs, returns an empty array.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getProductsByLocation(location) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.byLocation(location),
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching products by location: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products by location:', error);
    return [];
  }
}

/**
 * Retrieves products by their current status.
 *
 * @async
 * @function getProductsByStatus
 * @param {string|number} status - The status ID or code to filter products by.
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 * If an error occurs, returns an empty array.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getProductsByStatus(status) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.byStatus(status),
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching products by status: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products by status:', error);
    return [];
  }
}

/**
 * Creates a new product.
 *
 * @async
 * @function createProduct
 * @param {Object} product - The product data to be created.
 * @param {string} product.title - The title of the product.
 * @param {string} product.description - A detailed description of the product.
 * @param {number} product.price - The price of the product.
 * @param {string|number} [product.categoryId] - The ID of the category the product belongs to.
 * @param {string} [product.location] - The geographic location of the product.
 * @returns {Promise<Object>} A promise that resolves to the newly created product object.
 * @throws {Error} Throws an error if the creation fails or if the HTTP response is not ok.
 */
export async function createProduct(product) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.create,
      {
        method: 'POST',
        body: JSON.stringify(product),
      }
    );

    if (!response.ok) {
      throw new Error(`Error creating product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Updates an existing product.
 *
 * @async
 * @function updateProduct
 * @param {string|number} productId - The ID of the product to update.
 * @param {Object} updatedProduct - The updated product data.
 * @param {string} [updatedProduct.title] - The updated title of the product.
 * @param {string} [updatedProduct.description] - The updated description of the product.
 * @param {number} [updatedProduct.price] - The updated price of the product.
 * @param {string|number} [updatedProduct.categoryId] - The updated category ID.
 * @param {string} [updatedProduct.location] - The updated location of the product.
 * @returns {Promise<Object>} A promise that resolves to the updated product object.
 * @throws {Error} Throws an error if the update fails or if the HTTP response is not ok.
 */
export async function updateProduct(productId, updatedProduct) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.update(productId),
      {
        method: 'PUT',
        body: JSON.stringify(updatedProduct),
      }
    );

    if (!response.ok) {
      let errorMessage = `HTTP error: ${response.status}`;
      try {
        // Try to parse error response as JSON
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If it's not JSON, try to get it as text
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (textError) {
          // Ignore text parsing error
        }
      }
      throw new Error(`Failed to update product: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Updates the status of a product.
 *
 * @async
 * @function updateProductStatus
 * @param {string|number} productId - The ID of the product to update.
 * @param {string|number} stateIdOrDescription - Either a state ID or description string.
 * @returns {Promise<Object>} A promise that resolves to the updated product object.
 * @throws {Error} Throws an error if the status update fails, if the state is invalid,
 * or if the HTTP response is not ok.
 */
export async function updateProductStatus(productId, stateIdOrDescription) {
  try {
    // Determine if we were passed an ID or a description
    let stateId = stateIdOrDescription;

    if (typeof stateIdOrDescription === 'string') {
      const state = PRODUCT_STATES.fromDescription(stateIdOrDescription);
      if (!state) {
        throw new Error(`Invalid status description: ${stateIdOrDescription}`);
      }
      stateId = state.id;
    } else if (!Number.isInteger(stateIdOrDescription)) {
      throw new Error(`Invalid state ID: ${stateIdOrDescription}`);
    }

    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.updateStatus(productId, stateId),
      {
        method: 'PUT',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update product status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
}

/**
 * Purchases a product by setting its status to sold and recording the buyer.
 *
 * @async
 * @function purchaseProduct
 * @param {string|number} productId - The ID of the product to purchase.
 * @param {string|number} buyerId - The ID of the user purchasing the product.
 * @returns {Promise<Object>} A promise that resolves to the updated product object.
 * @throws {Error} Throws an error if the purchase fails, if required IDs are missing,
 * or if the HTTP response is not ok.
 */
export async function purchaseProduct(productId, buyerId) {
  try {
    if (!productId || !buyerId) {
      throw new Error('Product ID and buyer ID are required');
    }

    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.purchase(productId, buyerId),
      {
        method: 'PUT',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `HTTP error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to purchase product:', error);
    throw error;
  }
}

/**
 * Soft deletes a product by setting its state to inactive.
 *
 * @async
 * @function softDeleteProduct
 * @param {string|number} productId - The ID of the product to deactivate.
 * @returns {Promise<Object>} A promise that resolves to the deactivated product object.
 * @throws {Error} Throws an error if the deactivation fails or if the HTTP response is not ok.
 */
export async function softDeleteProduct(productId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.deactivate(productId),
      {
        method: 'PUT',
      }
    );

    if (!response.ok) {
      throw new Error(`Error deactivating product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deactivating product:', error);
    throw error;
  }
}

/**
 * Permanently deletes a product from the database (admin use only).
 *
 * @async
 * @function permanentlyDeleteProduct
 * @param {string|number} productId - The ID of the product to delete permanently.
 * @returns {Promise<boolean>} A promise that resolves to true if deletion is successful.
 * @throws {Error} Throws an error if the deletion fails or if the HTTP response is not ok.
 */
export async function permanentlyDeleteProduct(productId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.permanentDelete(productId),
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error permanently deleting product: ${response.statusText}`
      );
    }

    return true;
  } catch (error) {
    console.error('Error permanently deleting product:', error);
    throw error;
  }
}

/**
 * Reactivates a previously deactivated product.
 *
 * @async
 * @function reactivateProduct
 * @param {string|number} productId - The ID of the product to reactivate.
 * @param {string|number} newStateId - The new state ID to set for the product.
 * @returns {Promise<Object>} A promise that resolves to the reactivated product object.
 * @throws {Error} Throws an error if the reactivation fails or if the HTTP response is not ok.
 */
export async function reactivateProduct(productId, newStateId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.reactivate(productId, newStateId),
      {
        method: 'PUT',
      }
    );

    if (!response.ok) {
      throw new Error(`Error reactivating product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error reactivating product:', error);
    throw error;
  }
}

/**
 * Fetches all inactive (deactivated) products.
 *
 * @async
 * @function getInactiveProducts
 * @returns {Promise<Array>} A promise that resolves to an array of inactive product objects.
 * If an error occurs, returns an empty array.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getInactiveProducts() {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.inactive,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching inactive products: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching inactive products:', error);
    return [];
  }
}

/**
 * Gets the total count of all products.
 *
 * @async
 * @function getProductCount
 * @returns {Promise<number>} A promise that resolves to the total product count.
 * If an error occurs, returns 0.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getProductCount() {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.count,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching product count: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product count:', error);
    return 0;
  }
}

/**
 * Gets the count of active products only.
 *
 * @async
 * @function getActiveProductCount
 * @returns {Promise<number>} A promise that resolves to the active product count.
 * If an error occurs, returns 0.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getActiveProductCount() {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.activeCount,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching active product count: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching active product count:', error);
    return 0;
  }
}

/**
 * Fetches all edited products from the API.
 *
 * @async
 * @function getAllEditedProducts
 * @returns {Promise<Array>} A promise that resolves to an array of edited product objects.
 * If an error occurs, returns an empty array.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export async function getAllEditedProducts() {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.edited,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching edited products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch edited products:', error);
    return [];
  }
}
