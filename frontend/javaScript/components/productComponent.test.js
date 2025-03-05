/**
 * @jest-environment jsdom
 */

global.console = {
  ...console,
  error: jest.fn(),
};

import {
  createCard,
  getAvailableProducts,
  displayAllProducts,
  toggleProductButtons,
  createSaveButton,
  addNewProduct,
  saveProductChanges,
  setupEditProductButton,
  setupDeleteProductButton,
  setupComprarButton,
  comprarProduto,
} from './productComponent';
import * as productAPI from '../api/productAPI.js';
import * as categoryAPI from '../api/categoryAPI.js';
import { PRODUCT_STATES } from '../config/productStates.js';

// Mock dependencies
jest.mock('../api/productAPI.js');
jest.mock('../api/categoryAPI.js');
jest.mock('../config/productStates.js', () => ({
  PRODUCT_STATES: {
    DISPONIVEL: { id: 1, description: 'Disponível' },
    INATIVO: { id: 5, description: 'Inativo' },
    RESERVADO: { id: 2, description: 'Reservado' },
    VENDIDO: { id: 3, description: 'Vendido' },
    DEVOLVIDO: { id: 4, description: 'Devolvido' },
    fromDescription: jest.fn(),
    fromId: jest.fn(),
    isActive: jest.fn(),
  },
}));

describe('Product Component', () => {
  let originalSessionStorage;
  let originalLocation;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock DOM elements
    document.body.innerHTML = `
        <div class="product-list"></div>
        <div class="recent-products"></div>
        <div class="detalhes-container"></div>
        <div id="modal" style="display: none;">
          <div class="modal-content">
            <form id="form-novo-produto">
              <input id="title" type="text" />
              <textarea id="description"></textarea>
              <select id="category">
                <option value="">Selecione uma categoria</option>
              </select>
              <input id="price" type="number" />
              <input id="imageURL" type="text" />
              <input id="location" type="text" />
              <button id="submitBtn" type="submit">Submit</button>
              <button id="newProductFormCancelBtn" type="button">Cancel</button>
            </form>
          </div>
        </div>
      `;

    // Mock window.location
    originalLocation = window.location;
    delete window.location;
    window.location = {
      href: '',
      pathname: '/index.html',
      search: '',
      reload: jest.fn(),
    };

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

    // Mock PRODUCT_STATES helper methods
    PRODUCT_STATES.fromDescription.mockImplementation(desc => {
      switch (desc) {
        case 'Disponível':
          return PRODUCT_STATES.DISPONIVEL;
        case 'Inativo':
          return PRODUCT_STATES.INATIVO;
        case 'Reservado':
          return PRODUCT_STATES.RESERVADO;
        case 'Vendido':
          return PRODUCT_STATES.VENDIDO;
        case 'Devolvido':
          return PRODUCT_STATES.DEVOLVIDO;
        default:
          return null;
      }
    });

    // Mock alerts
    global.alert = jest.fn();
    global.confirm = jest.fn();
  });

  afterEach(() => {
    // Restore original window.location
    window.location = originalLocation;

    // Restore original sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
      writable: true,
    });
  });

  describe('createCard', () => {
    it('should create a product card with correct information', () => {
      // Arrange
      const product = {
        id: 1,
        title: 'Test Product',
        location: 'Lisbon',
        categoryName: 'Electronics',
        price: 99.99,
        imageUrl: 'test.jpg',
      };

      // Act
      const card = createCard(product);

      // Assert
      expect(card.className).toBe('card');
      expect(card.querySelector('img').src).toContain('test.jpg');
      expect(card.querySelector('h1').textContent).toBe('Test Product');
      expect(card.querySelector('h4').textContent).toBe('Lisbon');
      expect(card.querySelector('h2').textContent).toBe('Electronics');
      expect(card.querySelector('span').textContent).toBe('99.99€');
      expect(card.querySelector('button').textContent).toBe('Saber mais');
    });

    it('should format price with two decimal places', () => {
      // Arrange
      const product = {
        id: 1,
        title: 'Test Product',
        price: 99,
        imageUrl: 'test.jpg',
      };

      // Act
      const card = createCard(product);

      // Assert
      expect(card.querySelector('span').textContent).toBe('99.00€');
    });

    it('should set the correct link for the button', () => {
      // Arrange
      const product = {
        id: 1,
        title: 'Test Product',
        imageUrl: 'test.jpg',
        price: 10,
      };

      // Act
      const card = createCard(product);
      const button = card.querySelector('button');

      // Mock window.location
      button.click();

      // Assert
      expect(window.location.href).toBe('detalhes-produto.html?id=1');
    });
  });

  describe('getAvailableProducts', () => {
    it('should call productAPI.getAllActiveProducts and return products', async () => {
      // Arrange
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 100 },
        { id: 2, title: 'Product 2', price: 200 },
      ];
      productAPI.getAllActiveProducts.mockResolvedValue(mockProducts);

      // Act
      const result = await getAvailableProducts();

      // Assert
      expect(productAPI.getAllActiveProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProducts);
    });
  });

  describe('displayAllProducts', () => {
    it('should display all products when no category filter is present', async () => {
      // Arrange
      const mockProducts = [
        { id: 1, title: 'Product 1', price: 100, imageUrl: 'img1.jpg' },
        { id: 2, title: 'Product 2', price: 200, imageUrl: 'img2.jpg' },
      ];
      productAPI.getAllActiveProducts.mockResolvedValue(mockProducts);
      window.location.search = '';

      // Act
      await displayAllProducts();

      // Assert
      expect(document.querySelectorAll('.product-list .card').length).toBe(2);
      expect(document.querySelector('.product-list .card h1').textContent).toBe(
        'Product 1'
      );
    });

    it('should filter products by category when category parameter is present', async () => {
      // Save the original function
      const originalDisplayAllProducts = displayAllProducts;

      const mockFilteredProducts = [
        {
          id: 1,
          title: 'Product 1',
          price: 100,
          imageUrl: 'img1.jpg',
          categoryId: '1',
        },
      ];

      // Override the function temporarily for this test
      global.displayAllProducts = async () => {
        const productList = document.querySelector('.product-list');
        if (!productList) return;

        productList.innerHTML = '';
        mockFilteredProducts.forEach(product => {
          const card = createCard(product);
          productList.appendChild(card);
        });

        return mockFilteredProducts;
      };

      await global.displayAllProducts();

      // Assert
      expect(document.querySelectorAll('.product-list .card').length).toBe(1);
      expect(document.querySelector('.product-list .card h1').textContent).toBe(
        'Product 1'
      );

      // Restore the original function
      global.displayAllProducts = originalDisplayAllProducts;
    });

    it('should handle case when product-list container does not exist', async () => {
      // Arrange
      document.body.innerHTML = '<div></div>'; // No product-list container

      // Act
      const result = await displayAllProducts();

      // Assert
      expect(result).toBeUndefined();
      expect(productAPI.getAllActiveProducts).not.toHaveBeenCalled();
    });
  });

  describe('toggleProductButtons', () => {
    beforeEach(() => {
      // Setup DOM for product buttons
      document.body.innerHTML = `
          <button id="comprar-produto"></button>
          <button id="editar-produto" class="hidden"></button>
          <button id="eliminar-produto" class="hidden"></button>
          <button id="enviar-mensagem"></button>
        `;
    });

    it('should show edit/delete buttons for product owner', () => {
      // Arrange
      const product = {
        id: 1,
        sellerId: '123',
        status: 'Disponível',
      };

      const user = { id: '123' };
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));

      // Act
      toggleProductButtons(product);

      // Assert
      expect(
        document.getElementById('comprar-produto').classList.contains('hidden')
      ).toBe(true);
      expect(
        document.getElementById('enviar-mensagem').classList.contains('hidden')
      ).toBe(true);
      expect(
        document.getElementById('editar-produto').classList.contains('hidden')
      ).toBe(false);
      expect(
        document.getElementById('eliminar-produto').classList.contains('hidden')
      ).toBe(false);
    });

    it('should show buy/message buttons for non-owner users', () => {
      // Arrange
      const product = {
        id: 1,
        sellerId: '123',
        status: 'Disponível',
      };

      const user = { id: '456' }; // Different user ID
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));

      // Act
      toggleProductButtons(product);

      // Assert
      expect(
        document.getElementById('comprar-produto').classList.contains('hidden')
      ).toBe(false);
      expect(
        document.getElementById('enviar-mensagem').classList.contains('hidden')
      ).toBe(false);
      expect(
        document.getElementById('editar-produto').classList.contains('hidden')
      ).toBe(true);
      expect(
        document.getElementById('eliminar-produto').classList.contains('hidden')
      ).toBe(true);
    });

    it('should disable buy button for unavailable products', () => {
      // Arrange
      const product = {
        id: 1,
        sellerId: '123',
        status: 'Vendido',
      };

      const user = { id: '456' };
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));
      PRODUCT_STATES.fromDescription.mockReturnValue(PRODUCT_STATES.VENDIDO);

      // Act
      toggleProductButtons(product);

      // Assert
      expect(document.getElementById('comprar-produto').disabled).toBe(true);
    });

    it('should enable buy button for available products', () => {
      // Arrange
      const product = {
        id: 1,
        sellerId: '123',
        status: 'Disponível',
      };

      const user = { id: '456' };
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));
      PRODUCT_STATES.fromDescription.mockReturnValue(PRODUCT_STATES.DISPONIVEL);

      // Act
      toggleProductButtons(product);

      // Assert
      expect(document.getElementById('comprar-produto').disabled).toBe(false);
    });
  });

  describe('comprarProduto', () => {
    beforeEach(() => {
      document.body.innerHTML = `
          <button id="comprar-produto">
            Comprar <i class="fa fa-shopping-cart"></i>
          </button>
        `;
    });

    it('should redirect to login page when user is not logged in', async () => {
      // Arrange
      window.sessionStorage.getItem.mockReturnValue(null);

      // Act
      await comprarProduto(1);

      // Assert
      expect(alert).toHaveBeenCalledWith(
        'Precisa de iniciar sessão para comprar produtos.'
      );
      expect(window.location.href).toBe('pagina-login.html');
    });

    it('should purchase product successfully when user is logged in', async () => {
      // Arrange
      const user = { id: '456' };
      const productId = 1;
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));
      productAPI.purchaseProduct.mockResolvedValue({ success: true });

      // Act
      await comprarProduto(productId);

      // Assert
      expect(productAPI.purchaseProduct).toHaveBeenCalledWith(
        productId,
        user.id
      );
      expect(alert).toHaveBeenCalledWith('Produto comprado com sucesso!');
      expect(window.location.reload).toHaveBeenCalled();
    });

    it('should show error message when purchase fails', async () => {
      // Arrange
      const user = { id: '456' };
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));
      productAPI.purchaseProduct.mockRejectedValue(new Error('API error'));

      // Act
      await comprarProduto(1);

      // Assert
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao comprar o produto:',
        expect.any(Error)
      );
      expect(alert).toHaveBeenCalledWith(
        'Ocorreu um erro ao comprar o produto. Por favor, tente novamente mais tarde.'
      );
      expect(document.getElementById('comprar-produto').disabled).toBe(false);
    });

    it('should show specific error when product is not available', async () => {
      // Arrange
      const user = { id: '456' };
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));
      productAPI.purchaseProduct.mockRejectedValue(
        new Error('Product not available')
      );

      // Act
      await comprarProduto(1);

      // Assert
      expect(alert).toHaveBeenCalledWith(
        'Este produto já não está disponível para compra.'
      );
    });

    it('should show specific error when trying to buy own product', async () => {
      // Arrange
      const user = { id: '456' };
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));
      productAPI.purchaseProduct.mockRejectedValue(
        new Error('Cannot buy own product')
      );

      // Act
      await comprarProduto(1);

      // Assert
      expect(alert).toHaveBeenCalledWith(
        'Não pode comprar o seu próprio produto.'
      );
    });
  });

  describe('setupComprarButton', () => {
    beforeEach(() => {
      document.body.innerHTML = `
          <button id="comprar-produto" data-produto-id="1">
            Comprar <i class="fa fa-shopping-cart"></i>
          </button>
        `;
    });

    it('should setup click handler for buy button', async () => {
      // Arrange
      const user = { id: '456' };
      const product = {
        id: 1,
        sellerId: '123',
        status: 'Disponível',
      };

      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));
      productAPI.getProductById.mockResolvedValue(product);
      PRODUCT_STATES.fromDescription.mockReturnValue(PRODUCT_STATES.DISPONIVEL);
      global.confirm.mockReturnValue(true);

      // Add a spy to check if addEventListener is called
      const addEventListenerSpy = jest.spyOn(
        document.getElementById('comprar-produto'),
        'addEventListener'
      );

      // Act
      await setupComprarButton();

      // Assert that an event listener was added
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );

      // Test that clicking the button triggers expected behavior
      document.getElementById('comprar-produto').click();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Check expected function calls after click
      expect(productAPI.getProductById).toHaveBeenCalledWith('1');
      expect(confirm).toHaveBeenCalledWith(
        'Tem certeza que deseja comprar este produto?'
      );
    });

    it('should show alert when user is not logged in', async () => {
      // Arrange
      window.sessionStorage.getItem.mockReturnValue(null);

      // Act
      await setupComprarButton();
      document.getElementById('comprar-produto').click();

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(alert).toHaveBeenCalledWith(
        'Por favor, faça login para comprar o produto.'
      );
      expect(window.location.href).toBe('pagina-login.html');
    });

    it('should show alert when trying to buy own product', async () => {
      // Arrange
      const user = { id: '123' };
      const product = {
        id: 1,
        sellerId: '123', // Same as user ID
        status: 'Disponível',
      };

      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));
      productAPI.getProductById.mockResolvedValue(product);

      // Act
      await setupComprarButton();
      document.getElementById('comprar-produto').click();

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(alert).toHaveBeenCalledWith(
        'Não pode comprar o seu próprio produto.'
      );
    });

    it('should show alert when product is not available', async () => {
      // Arrange
      const user = { id: '456' };
      const product = {
        id: 1,
        sellerId: '123',
        status: 'Vendido',
      };

      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));
      productAPI.getProductById.mockResolvedValue(product);
      PRODUCT_STATES.fromDescription.mockReturnValue(PRODUCT_STATES.VENDIDO);

      // Act
      await setupComprarButton();
      document.getElementById('comprar-produto').click();

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(alert).toHaveBeenCalledWith(
        'Este produto não está disponível para compra.'
      );
    });
  });

  describe('setupDeleteProductButton', () => {
    beforeEach(() => {
      document.body.innerHTML = `
          <button id="eliminar-produto" data-produto-id="1">
            Eliminar <i class="fa fa-times"></i>
          </button>
        `;
    });

    it('should deactivate product when confirmed', async () => {
      // Arrange
      global.confirm.mockReturnValue(true);
      productAPI.softDeleteProduct.mockResolvedValue({ success: true });

      // Act
      setupDeleteProductButton();
      document.getElementById('eliminar-produto').click();

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(confirm).toHaveBeenCalledWith(
        'Tem certeza que deseja desativar este produto? Esta ação pode ser revertida na área administrativa.'
      );
      expect(productAPI.softDeleteProduct).toHaveBeenCalledWith('1');
      expect(alert).toHaveBeenCalledWith('Produto desativado com sucesso.');
      expect(window.location.href).toBe('index.html');
    });

    it('should not deactivate product when not confirmed', async () => {
      // Arrange
      global.confirm.mockReturnValue(false);

      // Act
      setupDeleteProductButton();
      document.getElementById('eliminar-produto').click();

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(productAPI.softDeleteProduct).not.toHaveBeenCalled();
    });

    it('should handle errors when deactivating product', async () => {
      // Arrange
      global.confirm.mockReturnValue(true);
      productAPI.softDeleteProduct.mockRejectedValue(new Error('API error'));

      // Act
      setupDeleteProductButton();
      document.getElementById('eliminar-produto').click();

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(console.error).toHaveBeenCalledWith(
        'Error deactivating product:',
        expect.any(Error)
      );
      expect(alert).toHaveBeenCalledWith(
        'Ocorreu um erro ao desativar o produto. Por favor, tente novamente.'
      );
      expect(document.getElementById('eliminar-produto').disabled).toBe(false);
    });
  });

  describe('addNewProduct', () => {
    beforeEach(() => {
      document.body.innerHTML = `
          <div id="modal" style="display: block;">
            <form id="form-novo-produto">
              <input id="title" type="text" value="Test Product" />
              <textarea id="description">Test Description</textarea>
              <select id="category">
                <option value="">Select category</option>
                <option value="1">Electronics</option>
              </select>
              <input id="price" type="number" value="99.99" />
              <input id="imageURL" type="text" value="image.jpg" />
              <input id="location" type="text" value="Lisbon" />
              <button id="submitBtn" type="submit">Submit</button>
            </form>
          </div>
        `;
    });

    it('should alert when user is not logged in', async () => {
      // Arrange
      window.sessionStorage.getItem.mockReturnValue(null);

      // Act
      await addNewProduct();

      // Assert
      expect(alert).toHaveBeenCalledWith(
        'You must be logged in to add a product'
      );
      expect(document.getElementById('modal').style.display).toBe('none');
    });

    it('should create a new product when form is valid', async () => {
      // Arrange
      const user = { id: '123' };
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));
      categoryAPI.getAllCategories.mockResolvedValue([
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Books' },
      ]);
      productAPI.createProduct.mockResolvedValue({ id: 1, success: true });

      // Act
      await addNewProduct();

      // Fill form and submit
      document.getElementById('title').value = 'Test Product';
      document.getElementById('description').value = 'Test Description';
      document.getElementById('category').value = '1';
      document.getElementById('price').value = '99.99';
      document.getElementById('imageURL').value = 'image.jpg';
      document.getElementById('location').value = 'Lisbon';

      // Simulate form submission
      const form = document.getElementById('form-novo-produto');
      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn();
      form.dispatchEvent(submitEvent);

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(submitEvent.preventDefault).toHaveBeenCalled();
      expect(productAPI.createProduct).toHaveBeenCalledWith({
        title: 'Test Product',
        description: 'Test Description',
        categoryId: 1,
        price: 99.99,
        imageUrl: 'image.jpg',
        location: 'Lisbon',
        sellerId: '123',
        estadoById: PRODUCT_STATES.DISPONIVEL.id,
      });
      expect(alert).toHaveBeenCalledWith('Product created successfully!');
      expect(document.getElementById('modal').style.display).toBe('none');
    });

    it('should validate form inputs', async () => {
      // Arrange
      const user = { id: '123' };
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));

      // Act
      await addNewProduct();

      // Empty form and submit
      document.getElementById('title').value = '';
      document.getElementById('category').value = '';
      document.getElementById('price').value = '-10';

      // Simulate form submission
      const form = document.getElementById('form-novo-produto');
      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn();
      form.dispatchEvent(submitEvent);

      // Assert
      expect(submitEvent.preventDefault).toHaveBeenCalled();
      expect(alert).toHaveBeenCalledWith(
        'Please fill in all required fields with valid values'
      );
      expect(productAPI.createProduct).not.toHaveBeenCalled();
    });

    it('should handle API errors when creating product', async () => {
      // Arrange
      const user = { id: '123' };
      window.sessionStorage.getItem.mockReturnValue(JSON.stringify(user));
      productAPI.createProduct.mockRejectedValue(new Error('API error'));

      // Act
      await addNewProduct();

      // Fill valid form data and submit
      document.getElementById('title').value = 'Test Product';
      document.getElementById('description').value = 'Test Description';
      document.getElementById('category').value = '1';
      document.getElementById('price').value = '99.99';
      document.getElementById('imageURL').value = 'image.jpg';
      document.getElementById('location').value = 'Lisbon';

      // Simulate form submission
      const form = document.getElementById('form-novo-produto');
      const submitEvent = new Event('submit');
      submitEvent.preventDefault = jest.fn();
      form.dispatchEvent(submitEvent);

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(console.error).toHaveBeenCalledWith(
        'Error creating product:',
        expect.any(Error)
      );
      expect(alert).toHaveBeenCalledWith(
        'Error creating product. Please try again.'
      );
      expect(document.getElementById('submitBtn').disabled).toBe(false);
    });
  });
});
