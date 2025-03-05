global.console = {
  ...console,
  error: jest.fn(),
};

import {
  getEvaluationsForSeller,
  getEvaluationById,
  addEvaluation,
  updateEvaluation,
  deleteEvaluation,
  hasUserEvaluatedSeller,
  getEligibleProductsForEvaluation,
} from './evaluationAPI.js';
import { makeAuthenticatedRequest } from '../utils/apiUtils.js';

// Mock the dependencies
jest.mock('../utils/apiUtils.js');

describe('Evaluation API', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvaluationsForSeller', () => {
    it('should return evaluations when the API call is successful', async () => {
      // Arrange
      const sellerId = 1;
      const mockEvaluations = [
        { id: 1, rating: 4, comment: 'Great service' },
        { id: 2, rating: 5, comment: 'Excellent seller' },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockEvaluations),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await getEvaluationsForSeller(sellerId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        { method: 'GET' }
      );
      expect(result).toEqual(mockEvaluations);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const sellerId = 999;
      makeAuthenticatedRequest.mockRejectedValue(new Error('API error'));

      // Act & Assert
      await expect(getEvaluationsForSeller(sellerId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching evaluations:',
        expect.any(Error)
      );
    });
  });

  describe('getEvaluationById', () => {
    it('should return an evaluation when the API call is successful', async () => {
      // Arrange
      const evaluationId = 1;
      const mockEvaluation = {
        id: evaluationId,
        rating: 4,
        comment: 'Great service',
      };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockEvaluation),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await getEvaluationById(evaluationId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        { method: 'GET' }
      );
      expect(result).toEqual(mockEvaluation);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const evaluationId = 999;
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Evaluation not found')
      );

      // Act & Assert
      await expect(getEvaluationById(evaluationId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching evaluation:',
        expect.any(Error)
      );
    });
  });

  describe('addEvaluation', () => {
    it('should return the created evaluation when the API call is successful', async () => {
      // Arrange
      const newEvaluation = {
        sellerId: 1,
        rating: 5,
        comment: 'Excellent service',
      };
      const createdEvaluation = {
        id: 3,
        sellerId: 1,
        rating: 5,
        comment: 'Excellent service',
      };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(createdEvaluation),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await addEvaluation(newEvaluation);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        {
          method: 'POST',
          body: JSON.stringify(newEvaluation),
        }
      );
      expect(result).toEqual(createdEvaluation);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const newEvaluation = {
        sellerId: 999,
        rating: 5,
        comment: 'Excellent service',
      };
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Failed to create evaluation')
      );

      // Act & Assert
      await expect(addEvaluation(newEvaluation)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error creating evaluation:',
        expect.any(Error)
      );
    });
  });

  describe('updateEvaluation', () => {
    it('should return the updated evaluation when the API call is successful', async () => {
      // Arrange
      const updatedEvaluation = {
        id: 1,
        rating: 4,
        comment: 'Updated comment',
      };
      const responseEvaluation = {
        id: 1,
        rating: 4,
        comment: 'Updated comment',
      };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(responseEvaluation),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await updateEvaluation(updatedEvaluation);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        {
          method: 'PUT',
          body: JSON.stringify(updatedEvaluation),
        }
      );
      expect(result).toEqual(responseEvaluation);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const updatedEvaluation = {
        id: 999,
        rating: 4,
        comment: 'Updated comment',
      };
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Evaluation not found')
      );

      // Act & Assert
      await expect(updateEvaluation(updatedEvaluation)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error updating evaluation:',
        expect.any(Error)
      );
    });
  });

  describe('deleteEvaluation', () => {
    it('should return the response text when the API call is successful', async () => {
      // Arrange
      const evaluationId = 1;
      const mockResponse = {
        ok: true,
        text: jest.fn().mockResolvedValue('Evaluation deleted successfully'),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await deleteEvaluation(evaluationId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        { method: 'DELETE' }
      );
      expect(result).toBe('Evaluation deleted successfully');
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const evaluationId = 999;
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Evaluation not found')
      );

      // Act & Assert
      await expect(deleteEvaluation(evaluationId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error deleting evaluation:',
        expect.any(Error)
      );
    });
  });

  describe('hasUserEvaluatedSeller', () => {
    it('should return the evaluation status when the API call is successful', async () => {
      // Arrange
      const sellerId = 1;
      const mockEvaluationStatus = { hasEvaluated: true };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockEvaluationStatus),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await hasUserEvaluatedSeller(sellerId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.stringContaining(`?sellerId=${sellerId}`),
        { method: 'GET' }
      );
      expect(result).toEqual(mockEvaluationStatus);
    });

    it('should return false when the API call fails', async () => {
      // Arrange
      const sellerId = 999;
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Failed to check evaluation status')
      );

      // Act
      const result = await hasUserEvaluatedSeller(sellerId);

      // Assert
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error checking evaluation status:',
        expect.any(Error)
      );
    });
  });

  describe('getEligibleProductsForEvaluation', () => {
    it('should return eligible products when the API call is successful', async () => {
      // Arrange
      const userId = 1;
      const mockEligibleProducts = [
        { id: 1, name: 'Product 1', sellerId: 2 },
        { id: 2, name: 'Product 2', sellerId: 3 },
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockEligibleProducts),
      };
      makeAuthenticatedRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await getEligibleProductsForEvaluation(userId);

      // Assert
      expect(makeAuthenticatedRequest).toHaveBeenCalledTimes(1);
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(
        expect.any(String),
        { method: 'GET' }
      );
      expect(result).toEqual(mockEligibleProducts);
    });

    it('should throw an error when the API call fails', async () => {
      // Arrange
      const userId = 999;
      makeAuthenticatedRequest.mockRejectedValue(
        new Error('Failed to fetch eligible products')
      );

      // Act & Assert
      await expect(getEligibleProductsForEvaluation(userId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching eligible products:',
        expect.any(Error)
      );
    });
  });
});
