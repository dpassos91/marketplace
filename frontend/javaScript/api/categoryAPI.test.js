global.console = {
  ...console,
  error: jest.fn(),
};

import {
  getAllCategories,
  addCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from './categoryAPI.js';
import { makeAuthenticatedRequest } from '../utils/apiUtils.js';

// Mock the dependencies
jest.mock('../utils/apiUtils.js');

describe('Category API', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return categories when the API call is successful', async () => {
      // Arrange
      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockCategories),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await getAllCategories();

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        { method: 'GET' }
      );
      expect(result).toEqual(mockCategories);
    });

    it('should return empty array when the API call fails', async () => {
      // Arrange
      makeAuthenticatedRequest.mockRejectedValue(new Error('API error'));

      // Act
      const result = await getAllCategories();

      // Assert
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to fetch categories:',
        expect.any(Error)
      );
    });
  });

  describe('getCategoryById', () => {
    it('should return a category when the API call is successful', async () => {
      // Arrange
      const categoryId = 1;
      const mockCategory = { id: categoryId, name: 'Category 1' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockCategory),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await getCategoryById(categoryId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        { method: 'GET' }
      );
      expect(result).toEqual(mockCategory);
    });

    it('should return null when the API call fails', async () => {
      // Arrange
      const categoryId = 999;
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Category not found')
      );

      // Act
      const result = await getCategoryById(categoryId);

      // Assert
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching category:',
        expect.any(Error)
      );
    });
  });

  describe('addCategory', () => {
    it('should return the created category when the API call is successful', async () => {
      // Arrange
      const newCategory = { name: 'New Category' };
      const createdCategory = { id: 3, name: 'New Category' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(createdCategory),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await addCategory(newCategory);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        {
          method: 'POST',
          body: JSON.stringify(newCategory),
        }
      );
      expect(result).toEqual(createdCategory);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const newCategory = { name: 'New Category' };
      const errorMessage = 'Failed to add category';
      makeAuthenticatedRequest.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(addCategory(newCategory)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error adding category:',
        expect.any(Error)
      );
    });
  });

  describe('updateCategory', () => {
    it('should return the updated category when the API call is successful', async () => {
      // Arrange
      const categoryId = 1;
      const updatedCategory = { name: 'Updated Category' };
      const responseCategory = { id: categoryId, name: 'Updated Category' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(responseCategory),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await updateCategory(categoryId, updatedCategory);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        {
          method: 'PUT',
          body: JSON.stringify(updatedCategory),
        }
      );
      expect(result).toEqual(responseCategory);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const categoryId = 999;
      const updatedCategory = { name: 'Updated Category' };
      const errorMessage = 'Category not found';
      makeAuthenticatedRequest.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(
        updateCategory(categoryId, updatedCategory)
      ).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error updating category:',
        expect.any(Error)
      );
    });
  });

  describe('deleteCategory', () => {
    it('should return true when the API call is successful', async () => {
      // Arrange
      const categoryId = 1;
      const mockResponse = {
        ok: true,
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await deleteCategory(categoryId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        { method: 'DELETE' }
      );
      expect(result).toBe(true);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const categoryId = 999;
      const errorMessage = 'Category not found';
      makeAuthenticatedRequest.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(deleteCategory(categoryId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error deleting category:',
        expect.any(Error)
      );
    });
  });
});
