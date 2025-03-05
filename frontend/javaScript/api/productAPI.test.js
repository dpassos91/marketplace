global.console = {
  ...console,
  error: jest.fn(),
};

import {
  getAllProducts,
  getAllActiveProducts,
  getProductsPaginated,
  getProductById,
  getProductsByCategory,
  getProductsBySeller,
  searchProductsByTitle,
  getProductsByLocation,
  getProductsByStatus,
  createProduct,
  updateProduct,
  updateProductStatus,
  purchaseProduct,
  softDeleteProduct,
  permanentlyDeleteProduct,
  reactivateProduct,
  getInactiveProducts,
  getProductCount,
  getActiveProductCount,
} from './productAPI.js';
import { makeAuthenticatedRequest } from '../utils/apiUtils.js';

// Mock the dependencies
jest.mock('../utils/apiUtils.js');

// Mock global fetch
global.fetch = jest.fn();

describe('Product API', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return products when the API call is successful', async () => {
      // Arrange
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 100 },
        { id: 2, title: 'Product 2', price: 200 },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
      };
      fetch.mockResolvedValue(mockResponse);

      // Act
      const result = await getAllProducts();

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when the API call fails', async () => {
      // Arrange
      fetch.mockRejectedValue(new Error('API error'));

      // Act
      const result = await getAllProducts();

      // Assert
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to fetch products:',
        expect.any(Error)
      );
    });
  });

  describe('getAllActiveProducts', () => {
    it('should return active products when the API call is successful', async () => {
      // Arrange
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 100, active: true },
        { id: 2, title: 'Product 2', price: 200, active: true },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
      };
      fetch.mockResolvedValue(mockResponse);

      // Act
      const result = await getAllActiveProducts();

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when the API call fails', async () => {
      // Arrange
      fetch.mockRejectedValue(new Error('API error'));

      // Act
      const result = await getAllActiveProducts();

      // Assert
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to fetch active products:',
        expect.any(Error)
      );
    });
  });

  describe('getProductsPaginated', () => {
    it('should return paginated products when the API call is successful', async () => {
      // Arrange
      const page = 1;
      const size = 10;
      const mockProducts = {
        content: [
          { id: 1, title: 'Product 1', price: 100 },
          { id: 2, title: 'Product 2', price: 200 },
        ],
        totalPages: 5,
        totalElements: 43,
      };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
      };
      fetch.mockResolvedValue(mockResponse);

      // Act
      const result = await getProductsPaginated(page, size);

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`?page=${page}&size=${size}`),
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Object),
        })
      );
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when the API call fails', async () => {
      // Arrange
      fetch.mockRejectedValue(new Error('API error'));

      // Act
      const result = await getProductsPaginated(1, 10);

      // Assert
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to fetch paginated products:',
        expect.any(Error)
      );
    });
  });

  describe('getProductById', () => {
    it('should return a product when the API call is successful', async () => {
      // Arrange
      const productId = 1;
      const mockProduct = { id: productId, title: 'Product 1', price: 100 };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProduct),
      };
      fetch.mockResolvedValue(mockResponse);

      // Act
      const result = await getProductById(productId);

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(productId.toString()),
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Object),
        })
      );
      expect(result).toEqual(mockProduct);
    });

    it('should return null when the API call fails', async () => {
      // Arrange
      const productId = 999;
      fetch.mockRejectedValue(new Error('Product not found'));

      // Act
      const result = await getProductById(productId);

      // Assert
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching product:',
        expect.any(Error)
      );
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products when the API call is successful', async () => {
      // Arrange
      const categoryId = 1;
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 100, categoryId },
        { id: 2, title: 'Product 2', price: 200, categoryId },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
      };
      fetch.mockResolvedValue(mockResponse);

      // Act
      const result = await getProductsByCategory(categoryId);

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(categoryId.toString()),
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Object),
        })
      );
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when the API call fails', async () => {
      // Arrange
      const categoryId = 999;
      fetch.mockRejectedValue(new Error('Category not found'));

      // Act
      const result = await getProductsByCategory(categoryId);

      // Assert
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching products by category:',
        expect.any(Error)
      );
    });
  });

  describe('getProductsBySeller', () => {
    it('should return products when the API call is successful', async () => {
      // Arrange
      const sellerId = 1;
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 100, sellerId },
        { id: 2, title: 'Product 2', price: 200, sellerId },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await getProductsBySeller(sellerId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.stringContaining(sellerId.toString()),
        { method: 'GET' }
      );
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when the API call fails', async () => {
      // Arrange
      const sellerId = 999;
      makeAuthenticatedRequest.mockRejectedValue(new Error('Seller not found'));

      // Act
      const result = await getProductsBySeller(sellerId);

      // Assert
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching seller products:',
        expect.any(Error)
      );
    });
  });

  describe('searchProductsByTitle', () => {
    it('should return matching products when the API call is successful', async () => {
      // Arrange
      const searchTitle = 'laptop';
      const mockProducts = [
        { id: 1, title: 'HP Laptop', price: 800 },
        { id: 2, title: 'Dell Laptop', price: 900 },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await searchProductsByTitle(searchTitle);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.stringContaining(searchTitle),
        { method: 'GET' }
      );
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when the API call fails', async () => {
      // Arrange
      const searchTitle = 'nonexistent';
      makeAuthenticatedRequest.mockRejectedValue(new Error('Search error'));

      // Act
      const result = await searchProductsByTitle(searchTitle);

      // Assert
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error searching products:',
        expect.any(Error)
      );
    });
  });

  describe('getProductsByLocation', () => {
    it('should return products when the API call is successful', async () => {
      // Arrange
      const location = 'Lisbon';
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 100, location },
        { id: 2, title: 'Product 2', price: 200, location },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await getProductsByLocation(location);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.stringContaining(location),
        { method: 'GET' }
      );
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when the API call fails', async () => {
      // Arrange
      const location = 'Mars';
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Location not found')
      );

      // Act
      const result = await getProductsByLocation(location);

      // Assert
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching products by location:',
        expect.any(Error)
      );
    });
  });

  describe('createProduct', () => {
    it('should return the created product when the API call is successful', async () => {
      // Arrange
      const newProduct = {
        title: 'New Product',
        price: 150,
        description: 'Test description',
      };
      const createdProduct = {
        id: 3,
        title: 'New Product',
        price: 150,
        description: 'Test description',
      };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(createdProduct),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await createProduct(newProduct);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        {
          method: 'POST',
          body: JSON.stringify(newProduct),
        }
      );
      expect(result).toEqual(createdProduct);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const newProduct = {
        title: 'New Product',
        price: -10, // Invalid price
      };
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Invalid product data')
      );

      // Act & Assert
      await expect(createProduct(newProduct)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error creating product:',
        expect.any(Error)
      );
    });
  });

  describe('updateProduct', () => {
    it('should return the updated product when the API call is successful', async () => {
      // Arrange
      const productId = 1;
      const updatedProduct = { title: 'Updated Product', price: 180 };
      const responseProduct = {
        id: productId,
        title: 'Updated Product',
        price: 180,
      };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(responseProduct),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await updateProduct(productId, updatedProduct);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.stringContaining(productId.toString()),
        {
          method: 'PUT',
          body: JSON.stringify(updatedProduct),
        }
      );
      expect(result).toEqual(responseProduct);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const productId = 999;
      const updatedProduct = { title: 'Updated Product' };
      const mockResponse = {
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ message: 'Product not found' }),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(updateProduct(productId, updatedProduct)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error updating product:',
        expect.any(Error)
      );
    });
  });

  describe('updateProductStatus', () => {
    it('should return the updated product when the API call is successful', async () => {
      // Arrange
      const productId = 1;
      const stateId = 2; // Assuming 2 is 'SOLD'
      const updatedProduct = { id: productId, state: stateId };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(updatedProduct),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await updateProductStatus(productId, stateId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.stringContaining(`${productId}/status/${stateId}`),
        { method: 'PUT' }
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const productId = 999;
      const stateId = 2;
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Product not found')
      );

      // Act & Assert
      await expect(updateProductStatus(productId, stateId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error updating product status:',
        expect.any(Error)
      );
    });
  });

  describe('purchaseProduct', () => {
    it('should return the purchased product when the API call is successful', async () => {
      // Arrange
      const productId = 1;
      const buyerId = 2;
      const purchasedProduct = {
        id: productId,
        buyerId: buyerId,
        state: 'SOLD',
      };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(purchasedProduct),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await purchaseProduct(productId, buyerId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.stringContaining(`${productId}/purchase/${buyerId}`),
        { method: 'PUT' }
      );
      expect(result).toEqual(purchasedProduct);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const productId = 999;
      const buyerId = 2;
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Product not found')
      );

      // Act & Assert
      await expect(purchaseProduct(productId, buyerId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to purchase product:',
        expect.any(Error)
      );
    });

    it('should throw an error when productId or buyerId is missing', async () => {
      // Act & Assert
      await expect(purchaseProduct(null, 2)).rejects.toThrow(
        'Product ID and buyer ID are required'
      );
      await expect(purchaseProduct(1, null)).rejects.toThrow(
        'Product ID and buyer ID are required'
      );
    });
  });

  describe('softDeleteProduct', () => {
    it('should return the deactivated product when the API call is successful', async () => {
      // Arrange
      const productId = 1;
      const deactivatedProduct = { id: productId, active: false };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(deactivatedProduct),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await softDeleteProduct(productId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.stringContaining(`${productId}/deactivate`),
        { method: 'PUT' }
      );
      expect(result).toEqual(deactivatedProduct);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const productId = 999;
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Product not found')
      );

      // Act & Assert
      await expect(softDeleteProduct(productId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error deactivating product:',
        expect.any(Error)
      );
    });
  });

  describe('permanentlyDeleteProduct', () => {
    it('should return true when the API call is successful', async () => {
      // Arrange
      const productId = 1;
      const mockResponse = {
        ok: true,
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await permanentlyDeleteProduct(productId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.stringContaining(productId.toString()),
        { method: 'DELETE' }
      );
      expect(result).toBe(true);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const productId = 999;
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Product not found')
      );

      // Act & Assert
      await expect(permanentlyDeleteProduct(productId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error permanently deleting product:',
        expect.any(Error)
      );
    });
  });

  describe('reactivateProduct', () => {
    it('should return the reactivated product when the API call is successful', async () => {
      // Arrange
      const productId = 1;
      const newStateId = 1; // Assuming 1 is 'ACTIVE'
      const reactivatedProduct = { id: productId, state: newStateId };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(reactivatedProduct),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await reactivateProduct(productId, newStateId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.stringContaining(`${productId}/reactivate/${newStateId}`),
        { method: 'PUT' }
      );
      expect(result).toEqual(reactivatedProduct);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const productId = 999;
      const newStateId = 1;
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Product not found')
      );

      // Act & Assert
      await expect(reactivateProduct(productId, newStateId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error reactivating product:',
        expect.any(Error)
      );
    });
  });

  describe('getInactiveProducts', () => {
    it('should return inactive products when the API call is successful', async () => {
      // Arrange
      const mockProducts = [
        { id: 1, title: 'Product 1', active: false },
        { id: 2, title: 'Product 2', active: false },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await getInactiveProducts();

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        { method: 'GET' }
      );
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when the API call fails', async () => {
      // Arrange
      makeAuthenticatedRequest.mockRejectedValue(new Error('API error'));

      // Act
      const result = await getInactiveProducts();

      // Assert
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching inactive products:',
        expect.any(Error)
      );
    });
  });

  describe('getProductCount', () => {
    it('should return product count when the API call is successful', async () => {
      // Arrange
      const mockCount = 42;
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockCount),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await getProductCount();

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        { method: 'GET' }
      );
      expect(result).toEqual(mockCount);
    });

    it('should return 0 when the API call fails', async () => {
      // Arrange
      makeAuthenticatedRequest.mockRejectedValue(new Error('API error'));

      // Act
      const result = await getProductCount();

      // Assert
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching product count:',
        expect.any(Error)
      );
    });
  });

  describe('getActiveProductCount', () => {
    it('should return active product count when the API call is successful', async () => {
      // Arrange
      const mockCount = 30;
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockCount),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await getActiveProductCount();

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        { method: 'GET' }
      );
      expect(result).toEqual(mockCount);
    });

    it('should return 0 when the API call fails', async () => {
      // Arrange
      makeAuthenticatedRequest.mockRejectedValue(new Error('API error'));

      // Act
      const result = await getActiveProductCount();

      // Assert
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching active product count:',
        expect.any(Error)
      );
    });
  });
});
