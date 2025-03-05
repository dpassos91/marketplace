/**
 * @jest-environment jsdom
 */

global.console = {
  ...console,
  error: jest.fn(),
};

import {
  loadSellerEvaluations,
  showAddEvaluationModal,
  showEditEvaluationModal,
} from './evaluationComponent';
import * as evaluationAPI from '../api/evaluationAPI.js';
import { formatDate } from '../utils/dateUtils.js';

// Mock dependencies
jest.mock('../api/evaluationAPI.js');
jest.mock('../utils/dateUtils.js');

describe('Evaluation Component', () => {
  let originalSessionStorage;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock DOM elements that the functions interact with
    document.body.innerHTML = `
        <div id="evaluationsContainer"></div>
        <div id="sellerProfile"></div>
      `;

    // Mock formatDate function
    formatDate.mockImplementation(date => '01/01/2023');

    // Mock sessionStorage
    originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true,
    });
  });

  describe('loadSellerEvaluations', () => {
    it('should display evaluations when API call is successful', async () => {
      // Arrange
      const sellerId = 1;
      const mockEvaluations = [
        {
          id: 1,
          title: 'Great seller',
          rating: 5,
          comment: 'Excellent service!',
          evaluationDate: '2023-01-01',
          userId: 10,
        },
        {
          id: 2,
          title: 'Good product',
          rating: 4,
          comment: 'As described',
          evaluationDate: '2023-01-02',
          userId: 11,
        },
      ];
      const mockUser = { id: 10, name: 'Test User' };

      evaluationAPI.getEvaluationsForSeller.mockResolvedValue(mockEvaluations);
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      // Act
      await loadSellerEvaluations(sellerId, '#evaluationsContainer');

      // Assert
      expect(evaluationAPI.getEvaluationsForSeller).toHaveBeenCalledWith(
        sellerId
      );
      expect(document.querySelector('#evaluationsContainer')).not.toBeNull();
      expect(document.querySelector('.average-rating')).not.toBeNull();
      expect(
        document.querySelector('.average-rating h3').textContent
      ).toContain('4.5');
      expect(document.querySelectorAll('.evaluation-card').length).toBe(2);
      expect(
        document.querySelector('.evaluation-card[data-evaluation-id="1"]')
      ).not.toBeNull();
      expect(
        document.querySelector('.evaluation-card[data-evaluation-id="2"]')
      ).not.toBeNull();
    });

    it('should display message when no evaluations exist', async () => {
      // Arrange
      const sellerId = 1;
      evaluationAPI.getEvaluationsForSeller.mockResolvedValue([]);
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify({ id: 10 }));

      // Act
      await loadSellerEvaluations(sellerId, '#evaluationsContainer');

      // Assert
      expect(
        document.querySelector('#evaluationsContainer').innerHTML
      ).toContain('Este vendedor ainda não foi avaliado.');
    });

    it('should add edit/delete buttons for user who created the evaluation', async () => {
      // Arrange
      const sellerId = 1;
      const mockEvaluations = [
        {
          id: 1,
          title: 'Great seller',
          rating: 5,
          comment: 'Excellent service!',
          evaluationDate: '2023-01-01',
          userId: 10,
        },
      ];
      const mockUser = { id: 10, name: 'Test User' };

      evaluationAPI.getEvaluationsForSeller.mockResolvedValue(mockEvaluations);
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      // Act
      await loadSellerEvaluations(sellerId, '#evaluationsContainer');

      // Assert
      expect(document.querySelector('.evaluation-actions')).not.toBeNull();
      expect(document.querySelector('.edit-evaluation-btn')).not.toBeNull();
      expect(document.querySelector('.delete-evaluation-btn')).not.toBeNull();
    });

    it('should not show edit/delete buttons for other users evaluations', async () => {
      // Arrange
      const sellerId = 1;
      const mockEvaluations = [
        {
          id: 1,
          title: 'Great seller',
          rating: 5,
          comment: 'Excellent service!',
          evaluationDate: '2023-01-01',
          userId: 10,
        },
      ];
      const mockUser = { id: 11, name: 'Different User' }; // Different user ID

      evaluationAPI.getEvaluationsForSeller.mockResolvedValue(mockEvaluations);
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      // Act
      await loadSellerEvaluations(sellerId, '#evaluationsContainer');

      // Assert
      expect(document.querySelector('.evaluation-actions')).toBeNull();
    });

    it('should show "add evaluation" button for logged-in users viewing another seller', async () => {
      // Arrange
      const sellerId = 1;
      const mockEvaluations = [
        {
          id: 1,
          title: 'Great seller',
          rating: 5,
          comment: 'Excellent service!',
          evaluationDate: '2023-01-01',
          userId: 10,
        },
      ];
      const mockUser = { id: 11, name: 'Different User' }; // Different user ID from seller

      evaluationAPI.getEvaluationsForSeller.mockResolvedValue(mockEvaluations);
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      // Act
      await loadSellerEvaluations(sellerId, '#evaluationsContainer');

      // Assert
      expect(document.querySelector('.add-evaluation-btn')).not.toBeNull();
      expect(document.querySelector('.add-evaluation-btn').textContent).toBe(
        'Avaliar Vendedor'
      );
    });

    it('should not show "add evaluation" button when viewing own profile', async () => {
      // Arrange
      const sellerId = 10;
      const mockEvaluations = [
        {
          id: 1,
          title: 'Great seller',
          rating: 5,
          comment: 'Excellent service!',
          evaluationDate: '2023-01-01',
          userId: 11,
        },
      ];
      const mockUser = { id: 10, name: 'Test User' }; // Same ID as seller

      evaluationAPI.getEvaluationsForSeller.mockResolvedValue(mockEvaluations);
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      // Act
      await loadSellerEvaluations(sellerId, '#evaluationsContainer');

      // Assert
      expect(document.querySelector('.add-evaluation-btn')).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      // Arrange
      const sellerId = 1;
      evaluationAPI.getEvaluationsForSeller.mockRejectedValue(
        new Error('API error')
      );

      // Act
      await loadSellerEvaluations(sellerId, '#evaluationsContainer');

      // Assert
      expect(
        document.querySelector('#evaluationsContainer').innerHTML
      ).toContain('Falha ao carregar avaliações');
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao carregar avaliações:',
        expect.any(Error)
      );
    });
  });

  describe('showAddEvaluationModal', () => {
    it('should display modal with eligible products for evaluation', async () => {
      // Arrange
      const sellerId = 1;
      const mockUser = { id: 10, name: 'Test User' };
      const mockEligibleProducts = [
        { id: 1, title: 'Product 1', sellerId: 1 },
        { id: 2, title: 'Product 2', sellerId: 1 },
      ];

      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
      evaluationAPI.getEligibleProductsForEvaluation.mockResolvedValue(
        mockEligibleProducts
      );

      // Act
      await showAddEvaluationModal(sellerId);

      // Assert
      expect(
        evaluationAPI.getEligibleProductsForEvaluation
      ).toHaveBeenCalledWith(mockUser.id);
      expect(document.querySelector('#evaluationModal')).not.toBeNull();
      expect(document.querySelectorAll('#productSelect option').length).toBe(3); // Including the placeholder
      expect(
        document.querySelector('#productSelect option[value="1"]').textContent
      ).toBe('Product 1');
      expect(
        document.querySelector('#productSelect option[value="2"]').textContent
      ).toBe('Product 2');
    });

    it('should alert when user is not authenticated', async () => {
      // Arrange
      const sellerId = 1;
      window.sessionStorage.getItem.mockReturnValue(null);
      global.alert = jest.fn();

      // Act
      await showAddEvaluationModal(sellerId);

      // Assert
      expect(alert).toHaveBeenCalledWith(
        'Precisa de estar autenticado para submeter uma avaliação.'
      );
      expect(document.querySelector('#evaluationModal')).toBeNull();
    });

    it('should alert when no eligible products exist', async () => {
      // Arrange
      const sellerId = 1;
      const mockUser = { id: 10, name: 'Test User' };

      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
      evaluationAPI.getEligibleProductsForEvaluation.mockResolvedValue([]);
      global.alert = jest.fn();

      // Act
      await showAddEvaluationModal(sellerId);

      // Assert
      expect(alert).toHaveBeenCalledWith(
        'Não existem produtos elegíveis para avaliar este vendedor.'
      );
      expect(document.querySelector('#evaluationModal')).toBeNull();
    });

    it('should submit evaluation when form is filled correctly', async () => {
      // Arrange
      const sellerId = 1;
      const mockUser = { id: 10, name: 'Test User' };
      const mockEligibleProducts = [{ id: 1, title: 'Product 1', sellerId: 1 }];

      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
      evaluationAPI.getEligibleProductsForEvaluation.mockResolvedValue(
        mockEligibleProducts
      );
      evaluationAPI.addEvaluation.mockResolvedValue({ id: 1, success: true });
      global.alert = jest.fn();

      // Act
      await showAddEvaluationModal(sellerId);

      // Fill form fields
      document.getElementById('productSelect').value = '1';
      document.getElementById('evaluationTitle').value = 'Great product';
      document.getElementById('evaluationRating').value = '5';
      document.getElementById('evaluationComment').value =
        'Excellent condition';

      // Click submit button
      document.getElementById('submitEvaluation').click();

      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(evaluationAPI.addEvaluation).toHaveBeenCalledWith({
        title: 'Great product',
        rating: 5,
        comment: 'Excellent condition',
        evaluatedId: 1,
        evaluatorId: 10,
        productId: 1,
      });
      expect(alert).toHaveBeenCalledWith('Review submetida com sucesso!');
    });

    it('should validate form before submission', async () => {
      // Arrange
      const sellerId = 1;
      const mockUser = { id: 10, name: 'Test User' };
      const mockEligibleProducts = [{ id: 1, title: 'Product 1', sellerId: 1 }];

      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
      evaluationAPI.getEligibleProductsForEvaluation.mockResolvedValue(
        mockEligibleProducts
      );
      global.alert = jest.fn();

      // Act
      await showAddEvaluationModal(sellerId);

      // Submit without filling any fields
      document.getElementById('submitEvaluation').click();

      // Assert
      expect(alert).toHaveBeenCalledWith(
        'Por favor selecione um produto para avaliar.'
      );
      expect(evaluationAPI.addEvaluation).not.toHaveBeenCalled();

      // Fill product but not title
      document.getElementById('productSelect').value = '1';
      document.getElementById('submitEvaluation').click();
      expect(alert).toHaveBeenCalledWith('Por favor preencha o título.');

      // Fill title but not rating
      document.getElementById('evaluationTitle').value = 'Great product';
      document.getElementById('submitEvaluation').click();
      expect(alert).toHaveBeenCalledWith(
        'Por favor selecione um rating para esta review.'
      );

      // Fill rating but not comment
      document.getElementById('evaluationRating').value = '5';
      document.getElementById('submitEvaluation').click();
      expect(alert).toHaveBeenCalledWith('Por favor preencha o comentário.');
    });

    it('should handle API errors when submitting evaluation', async () => {
      // Arrange
      const sellerId = 1;
      const mockUser = { id: 10, name: 'Test User' };
      const mockEligibleProducts = [{ id: 1, title: 'Product 1', sellerId: 1 }];

      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
      evaluationAPI.getEligibleProductsForEvaluation.mockResolvedValue(
        mockEligibleProducts
      );
      evaluationAPI.addEvaluation.mockRejectedValue(
        new Error('Failed to add evaluation')
      );
      global.alert = jest.fn();

      // Act
      await showAddEvaluationModal(sellerId);

      // Fill form fields
      document.getElementById('productSelect').value = '1';
      document.getElementById('evaluationTitle').value = 'Great product';
      document.getElementById('evaluationRating').value = '5';
      document.getElementById('evaluationComment').value =
        'Excellent condition';

      // Click submit button
      document.getElementById('submitEvaluation').click();

      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(alert).toHaveBeenCalledWith(
        'Falha na submissão da avaliação: Failed to add evaluation'
      );
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao submeter a avaliação:',
        expect.any(Error)
      );
    });
  });

  describe('showEditEvaluationModal', () => {
    it('should display modal with existing evaluation data', () => {
      // Arrange
      const sellerId = 1;
      const mockEvaluation = {
        id: 1,
        title: 'Great product',
        rating: 4,
        comment: 'Very good condition',
      };

      // Act
      showEditEvaluationModal(mockEvaluation, sellerId);

      // Assert
      expect(document.querySelector('#editEvaluationModal')).not.toBeNull();
      expect(document.getElementById('editEvaluationTitle').value).toBe(
        'Great product'
      );
      expect(document.getElementById('editEvaluationRating').value).toBe('4');
      expect(document.getElementById('editEvaluationComment').value).toBe(
        'Very good condition'
      );
      expect(document.getElementById('evaluationId').value).toBe('1');

      // Check that stars are correctly filled
      const stars = document.querySelectorAll('.stars .star');
      expect(stars[0].textContent).toBe('★'); // Filled
      expect(stars[1].textContent).toBe('★'); // Filled
      expect(stars[2].textContent).toBe('★'); // Filled
      expect(stars[3].textContent).toBe('★'); // Filled
      expect(stars[4].textContent).toBe('☆'); // Empty
    });

    it('should update evaluation when form is submitted', async () => {
      // Arrange
      const sellerId = 1;
      const mockEvaluation = {
        id: 1,
        title: 'Original title',
        rating: 3,
        comment: 'Original comment',
      };

      evaluationAPI.updateEvaluation.mockResolvedValue({
        id: 1,
        success: true,
      });
      global.alert = jest.fn();

      // Act
      showEditEvaluationModal(mockEvaluation, sellerId);

      // Update form fields
      document.getElementById('editEvaluationTitle').value = 'Updated title';
      document.getElementById('editEvaluationRating').value = '5';
      document.getElementById('editEvaluationComment').value =
        'Updated comment';

      // Click update button
      document.getElementById('updateEvaluation').click();

      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(evaluationAPI.updateEvaluation).toHaveBeenCalledWith({
        id: '1',
        title: 'Updated title',
        rating: 5,
        comment: 'Updated comment',
      });
      expect(alert).toHaveBeenCalledWith('Avaliação atualizada com sucesso!');
    });

    it('should validate form before submission', async () => {
      // Arrange
      const sellerId = 1;
      const mockEvaluation = {
        id: 1,
        title: 'Original title',
        rating: 3,
        comment: 'Original comment',
      };

      global.alert = jest.fn();

      // Act
      showEditEvaluationModal(mockEvaluation, sellerId);

      // Clear fields and try to submit
      document.getElementById('editEvaluationTitle').value = '';
      document.getElementById('updateEvaluation').click();

      // Assert
      expect(alert).toHaveBeenCalledWith('Por favor preencha o título.');
      expect(evaluationAPI.updateEvaluation).not.toHaveBeenCalled();

      // Set title but clear rating
      document.getElementById('editEvaluationTitle').value = 'Updated title';
      document.getElementById('editEvaluationRating').value = '0';
      document.getElementById('updateEvaluation').click();
      expect(alert).toHaveBeenCalledWith(
        'Por favor selecione um rating para esta review.'
      );

      // Set rating but clear comment
      document.getElementById('editEvaluationRating').value = '4';
      document.getElementById('editEvaluationComment').value = '';
      document.getElementById('updateEvaluation').click();
      expect(alert).toHaveBeenCalledWith('Por favor preencha o comentário.');
    });

    it('should handle API errors when updating evaluation', async () => {
      // Arrange
      const sellerId = 1;
      const mockEvaluation = {
        id: 1,
        title: 'Original title',
        rating: 3,
        comment: 'Original comment',
      };

      evaluationAPI.updateEvaluation.mockRejectedValue(
        new Error('Failed to update evaluation')
      );
      global.alert = jest.fn();

      // Act
      showEditEvaluationModal(mockEvaluation, sellerId);

      // Fill valid form data
      document.getElementById('editEvaluationTitle').value = 'Updated title';
      document.getElementById('editEvaluationRating').value = '4';
      document.getElementById('editEvaluationComment').value =
        'Updated comment';

      // Click update button
      document.getElementById('updateEvaluation').click();

      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(alert).toHaveBeenCalledWith('Falha a atualizar a avaliação.');
      expect(console.error).toHaveBeenCalledWith(
        'Erro a atualizar a avaliação:',
        expect.any(Error)
      );
    });
  });
});
