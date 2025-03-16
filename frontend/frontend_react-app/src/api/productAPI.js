
// src/api/productAPI.js
import { API_ENDPOINTS, apiCall } from './apiConfig';

/**
 * Fetches all products from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 */
export const getAllProducts = async () => {
  try {
    return await apiCall(API_ENDPOINTS.products.all);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

/**
 * Fetches all active products from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of active product objects.
 */
export const getAllActiveProducts = async () => {
  try {
    return await apiCall(API_ENDPOINTS.products.active);
  } catch (error) {
    console.error('Failed to fetch active products:', error);
    return [];
  }
};

/**
 * Fetches paginated products from the API.
 * @param {number} [page=0] - The page number to retrieve.
 * @param {number} [size=10] - The number of products per page.
 * @returns {Promise<Object>} A promise that resolves to a paginated product response.
 */
export const getProductsPaginated = async (page = 0, size = 10) => {
  try {
    return await apiCall(API_ENDPOINTS.products.paginated(page, size));
  } catch (error) {
    console.error('Failed to fetch paginated products:', error);
    return [];
  }
};

/**
 * Retrieves a specific product by its ID.
 * @param {string|number} productId - The ID of the product to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the product object.
 */
export const getProductById = async (productId) => {
  try {
    return await apiCall(API_ENDPOINTS.products.byId(productId));
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

/**
 * Retrieves all products belonging to a specific category.
 * @param {string|number} categoryId - The ID of the category to filter products by.
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 */
export const getProductsByCategory = async (categoryId) => {
  try {
    return await apiCall(API_ENDPOINTS.products.byCategory(categoryId));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

/**
 * Retrieves all products listed by a specific seller.
 * @param {string|number} sellerId - The ID of the seller.
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 */
export const getProductsBySeller = async (sellerId) => {
  try {
    return await apiCall(API_ENDPOINTS.products.bySeller(sellerId));
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return [];
  }
};

/**
 * Searches for products by their title.
 * @param {string} title - The search term.
 * @returns {Promise<Array>} A promise that resolves to an array of matching product objects.
 */
export const searchProductsByTitle = async (title) => {
  try {
    return await apiCall(API_ENDPOINTS.products.search(title));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

/**
 * Retrieves products by geographic location.
 * @param {string} location - The location to filter products by.
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 */
export const getProductsByLocation = async (location) => {
  try {
    return await apiCall(API_ENDPOINTS.products.byLocation(location));
  } catch (error) {
    console.error('Error fetching products by location:', error);
    return [];
  }
};

/**
 * Retrieves products by their current status.
 * @param {string|number} status - The status ID or code to filter products by.
 * @returns {Promise<Array>} A promise that resolves to an array of product objects.
 */
export const getProductsByStatus = async (status) => {
  try {
    return await apiCall(API_ENDPOINTS.products.byStatus(status));
  } catch (error) {
    console.error('Error fetching products by status:', error);
    return [];
  }
};

/**
 * Creates a new product.
 * @param {Object} product - The product data to be created.
 * @returns {Promise<Object>} A promise that resolves to the newly created product object.
 */
export const createProduct = async (product) => {
  try {
    return await apiCall(API_ENDPOINTS.products.create, {
      method: 'POST',
      body: JSON.stringify(product),
    });
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Updates an existing product.
 * @param {string|number} productId - The ID of the product to update.
 * @param {Object} updatedProduct - The updated product data.
 * @returns {Promise<Object>} A promise that resolves to the updated product object.
 */
export const updateProduct = async (productId, updatedProduct) => {
  try {
    return await apiCall(API_ENDPOINTS.products.update(productId), {
      method: 'PUT',
      body: JSON.stringify(updatedProduct),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Updates the status of a product.
 * @param {string|number} productId - The ID of the product to update.
 * @param {string|number} stateIdOrDescription - Either a state ID or description string.
 * @returns {Promise<Object>} A promise that resolves to the updated product object.
 */
export const updateProductStatus = async (productId, stateIdOrDescription) => {
  try {
    let stateId = stateIdOrDescription;

    if (typeof stateIdOrDescription === 'string') {
      // Supondo que PRODUCT_STATES está acessível aqui
      // Adapte conforme necessário
      const state = PRODUCT_STATES.fromDescription(stateIdOrDescription);
      if (!state) {
        throw new Error(`Invalid status description: ${stateIdOrDescription}`);
      }
      stateId = state.id;
    } else if (!Number.isInteger(stateIdOrDescription)) {
      throw new Error(`Invalid state ID: ${stateIdOrDescription}`);
    }

    return await apiCall(API_ENDPOINTS.products.updateStatus(productId, stateId), {
      method: 'PUT',
    });
  } catch (error) {
    console.error('Error updating product status:', error);
    throw error;
  }
};

/**
 * Purchases a product by setting its status to sold and recording the buyer.
 * @param {string|number} productId - The ID of the product to purchase.
 * @param {string|number} buyerId - The ID of the user purchasing the product.
 * @returns {Promise<Object>} A promise that resolves to the updated product object.
 */
export const purchaseProduct = async (productId, buyerId) => {
  try {
    if (!productId || !buyerId) {
      throw new Error('Product ID and buyer ID are required');
    }

    return await apiCall(API_ENDPOINTS.products.purchase(productId, buyerId), {
      method: 'PUT',
    });
  } catch (error) {
    console.error('Failed to purchase product:', error);
    throw error;
  }
};

/**
 * Soft deletes a product by setting its state to inactive.
 * @param {string|number} productId - The ID of the product to deactivate.
 * @returns {Promise<Object>} A promise that resolves to the deactivated product object.
 */
export const softDeleteProduct = async (productId) => {
  try {
    return await apiCall(API_ENDPOINTS.products.deactivate(productId), {
      method: 'PUT',
    });
  } catch (error) {
    console.error('Error deactivating product:', error);
    throw error;
  }
};

/**
 * Permanently deletes a product from the database (admin use only).
 * @param {string|number} productId - The ID of the product to delete permanently.
 * @returns {Promise<boolean>} A promise that resolves to true if deletion is successful.
 */
export const permanentlyDeleteProduct = async (productId) => {
  try {
    await apiCall(API_ENDPOINTS.products.permanentDelete(productId), {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error permanently deleting product:', error);
    throw error;
  }
};

/**
 * Reactivates a previously deactivated product.
 * @param {string|number} productId - The ID of the product to reactivate.
 * @param {string|number} newStateId - The new state ID to set for the product.
 * @returns {Promise<Object>} A promise that resolves to the reactivated product object.
 */
export const reactivateProduct = async (productId, newStateId) => {
  try {
    return await apiCall(API_ENDPOINTS.products.reactivate(productId, newStateId), {
      method: 'PUT',
    });
  } catch (error) {
    console.error('Error reactivating product:', error);
    throw error;
  }
};

/**
 * Fetches all inactive (deactivated) products.
 * @returns {Promise<Array>} A promise that resolves to an array of inactive product objects.
 */
export const getInactiveProducts = async () => {
  try {
    return await apiCall(API_ENDPOINTS.products.inactive);
  } catch (error) {
    console.error('Error fetching inactive products:', error);
    return [];
  }
};

/**
 * Gets the total count of all products.
 * @returns {Promise<number>} A promise that resolves to the total product count.
 */
export const getProductCount = async () => {
  try {
    return await apiCall(API_ENDPOINTS.products.count);
  } catch (error) {
    console.error('Error fetching product count:', error);
    return 0;
  }
};

/**
 * Gets the count of active products only.
 * @returns {Promise<number>} A promise that resolves to the active product count.
 */
export const getActiveProductCount = async () => {
  try {
    return await apiCall(API_ENDPOINTS.products.activeCount);
  } catch (error) {
    console.error('Error fetching active product count:', error);
    return 0;
  }
};

/**
 * Fetches all edited products from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of edited product objects.
 */
export const getAllEditedProducts = async () => {
  try {
    return await apiCall(API_ENDPOINTS.products.edited);
  } catch (error) {
    console.error('Failed to fetch edited products:', error);
    return [];
  }
};




