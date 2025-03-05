/**
 * @jest-environment jsdom
 */

global.console = {
  ...console,
  error: jest.fn(),
};

import {
  createCategoryCard,
  displayProductsByCategory,
} from './categoryComponent';
import * as categoryAPI from '../api/categoryAPI.js';

// Mock dependencies
jest.mock('../api/categoryAPI.js');

describe('Category Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock DOM elements that the functions interact with
    document.body.innerHTML = `
      <div class="product-list"></div>
      <h1 id="page-title"></h1>
    `;
  });

  describe('createCategoryCard', () => {
    it('should create a card with the category information', () => {
      // Arrange
      const category = {
        id: 1,
        name: 'Test Category',
        description: 'Test Description',
      };

      // Act
      const card = createCategoryCard(category);

      // Assert
      expect(card.className).toBe('card category-card');
      expect(card.querySelector('h1').textContent).toBe('Test Category');
      expect(card.querySelector('p').textContent).toBe('Test Description');
      expect(card.querySelector('button').textContent).toBe('Ver produtos');
    });

    it('should use default image and description when not provided', () => {
      // Arrange
      const category = {
        id: 1,
        name: 'Test Category',
      };

      // Act
      const card = createCategoryCard(category);

      // Assert
      expect(card.querySelector('img').src).toContain('gazchaps-woocommerce');
      expect(card.querySelector('p').textContent).toBe(
        'Explore produtos desta categoria'
      );
    });

    it('should set the correct link for the button', () => {
      // Arrange
      const category = { id: 1, name: 'Test Category' };

      // Act
      const card = createCategoryCard(category);
      const button = card.querySelector('button');

      // Mock window.location
      const originalLocation = window.location;
      delete window.location;
      window.location = { href: '' };

      // Trigger the click event
      button.click();

      // Assert
      expect(window.location.href).toBe('produto-total.html?category=1');

      // Restore original window.location
      window.location = originalLocation;
    });
  });

  describe('displayProductsByCategory', () => {
    it('should filter products by category ID', async () => {
      // Arrange
      const categoryId = '1';
      const products = [
        { id: 1, title: 'Product 1', categoryId: '1' },
        { id: 2, title: 'Product 2', categoryId: '2' },
        { id: 3, title: 'Product 3', categoryId: '1' },
      ];
      const category = { id: 1, name: 'Test Category' };

      categoryAPI.getCategoryById.mockResolvedValue(category);

      // Act
      const filteredProducts = await displayProductsByCategory(
        products,
        categoryId
      );

      // Assert
      expect(filteredProducts).toHaveLength(2);
      expect(filteredProducts[0].id).toBe(1);
      expect(filteredProducts[1].id).toBe(3);
      expect(document.getElementById('page-title').textContent).toBe(
        'Produtos - Test Category'
      );
    });

    it('should display a message when no products match the category', async () => {
      // Arrange
      const categoryId = '3';
      const products = [
        { id: 1, title: 'Product 1', categoryId: '1' },
        { id: 2, title: 'Product 2', categoryId: '2' },
      ];
      const category = { id: 3, name: 'Empty Category' };

      categoryAPI.getCategoryById.mockResolvedValue(category);

      // Act
      const filteredProducts = await displayProductsByCategory(
        products,
        categoryId
      );

      // Assert
      expect(filteredProducts).toBeUndefined();
      expect(document.querySelector('.product-list').innerHTML).toContain(
        'Nenhum produto disponível'
      );
    });

    it('should handle API errors gracefully', async () => {
      // Arrange
      const categoryId = '1';
      const products = [{ id: 1, title: 'Product 1', categoryId: '1' }];

      categoryAPI.getCategoryById.mockRejectedValue(new Error('API error'));

      // Act
      const filteredProducts = await displayProductsByCategory(
        products,
        categoryId
      );

      // Assert
      expect(filteredProducts).toEqual([]);
      expect(document.querySelector('.product-list').innerHTML).toContain(
        'Erro ao carregar produtos'
      );
    });
  });
});
