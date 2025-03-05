'use strict';

import { API_ENDPOINTS } from '../config/apiConfig.js';
import { makeAuthenticatedRequest } from '../utils/apiUtils.js';
import { PRODUCT_STATES } from '../config/productStates.js';

// Get all products
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

// Get all active products
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

// Get paginated products
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

// Get product by ID
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

// Get products by category
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

// Get products by seller
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

// Search products by title
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

// Get products by location
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

// Get products by status
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

// Create a new product
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

// Update a product
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
      throw new Error(`Error updating product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// Update product status
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

// Purchase a product
export async function purchaseProduct(productId, buyerId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.purchase(productId, buyerId),
      {
        method: 'PUT',
      }
    );

    if (!response.ok) {
      throw new Error(`Error purchasing product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error purchasing product:', error);
    throw error;
  }
}

// Delete a product
export async function deleteProduct(productId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.products.delete(productId),
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`Error deleting product: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Get product count
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

// Get active product count
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
