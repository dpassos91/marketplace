'use strict';

import * as categoryAPI from '../api/categoryAPI.js';
import * as productAPI from '../api/productAPI.js';
import { PRODUCT_STATES } from '../config/productStates.js';

export function createCard(product) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.title}" />
    <div>
      <h1>${product.title}</h1>
      <h4>${product.location}</h4>
      <h2>${product.categoryName}</h2>
      <span>${parseFloat(product.price).toFixed(2)}€</span>
      <button type="button" title="descricao">Saber mais</button>
    </div>
  `;
  const button = card.querySelector('button');
  button.addEventListener('click', () => {
    window.location.href = `detalhes-produto.html?id=${product.id}`;
  });
  return card;
}

export async function getAvailableProducts() {
  const products = await productAPI.getAllActiveProducts();
  return products;
}

export async function displayAllProducts() {
  const container = document.querySelector('.product-list');
  if (!container) {
    return;
  }

  // Check if there's a category filter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('category');

  const products = await getAvailableProducts();

  // If we have a category filter
  if (categoryId) {
    // Import the categoryComponent dynamically to avoid circular dependencies
    const categoryComponent = await import('./categoryComponent.js');

    // Get filtered products
    const filteredProducts = await categoryComponent.displayProductsByCategory(
      products,
      categoryId
    );

    if (filteredProducts && filteredProducts.length > 0) {
      // Display the filtered products
      filteredProducts.forEach(product => {
        const card = createCard(product);
        container.appendChild(card);
      });
    }
  } else {
    // No filter, show all products
    container.innerHTML = '';
    products.forEach(product => {
      const card = createCard(product);
      container.appendChild(card);
    });
  }
}

export async function displayMostRecentProducts() {
  const mainContainer = document.querySelector('.recent-products');
  const products = await getAvailableProducts();
  const mostRecentProducts = products
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  mainContainer.innerHTML = '';
  mostRecentProducts.forEach(p => {
    const card = createCard(p);
    mainContainer.appendChild(card);
  });
}

/* avaliação de produtos não implementada
export async function displayMostRatedProducts() {
  const mainContainer = document.querySelector('.most-rated-products');
  const products = await getAvailableProducts();
  const mostRatedProducts = products
    .map(product => ({
      ...product,
      mediaEstrelas: helpers.gerarRating(product.avaliacoes).mediaEstrelas,
    }))
    .sort((a, b) => b.mediaEstrelas - a.mediaEstrelas)
    .slice(0, 3);
  mainContainer.innerHTML = '';
  mostRatedProducts.forEach(p => {
    const card = createCard(p);
    mainContainer.appendChild(card);
  });
}
  */

export async function displayProductDetails() {
  const containerDetails = document.querySelector('.detalhes-container');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  containerDetails.innerHTML = '';

  try {
    const product = await productAPI.getProductById(productId);

    if (!product) {
      alert('Produto não encontrado!');
      return;
    }

    containerDetails.innerHTML = `
      <div class="imagem">
        <img src="${product.imageUrl}" alt="${product.title}" />
      </div>
      <form id="detalhes-produto-form">
        <label for="nome-produto">Nome do Produto:</label>
        <input type="text" id="nome-produto" value="${
          product.title
        }" readonly />

        <label for="localizacao">Localização:</label>
        <input type="text" id="localizacao" value="${
          product.location
        }" readonly />

        <label for="categoria-readonly">Categoria:</label>
        <input type="text" id="categoria-readonly" value="${
          product.categoryName
        }" readonly />
        
        <!-- Hidden category dropdown that will be shown in edit mode -->
        <label class="hidden" for="categoria">Categoria:</label>
        <select class="hidden" id="categoria" title="Categoria do Produto">
          <option value="">Selecione uma categoria</option>
        </select>

        <label for="preco">Preço:</label>
        <input type="text" id="preco" value="${parseFloat(
          product.price
        ).toFixed(2)}€" readonly />

        <label for="publicado-por">Publicado por:</label>
        <div class="seller-info">
          <input type="text" id="publicado-por" value="${
            product.sellerUsername
          }" readonly />
          <a href="perfil-utilizador.html?id=${
            product.sellerId
          }" class="seller-profile-link" title="Ver perfil do vendedor">
            <i class="fa fa-user" aria-hidden="true"></i> Ver perfil
          </a>
        </div>

        <label for="descricao">Descrição:</label>
        <textarea id="descricao" readonly>${product.description}</textarea>

        <label for="estado-produto-readonly">Estado:</label>
        <input type="text" id="estado-produto-readonly" value="${
          product.status
        }" readonly />

        <label class="hidden" for="estado-produto">Estado:</label>
        <select class="hidden" name="estado-produto" id="estado-produto" title="Estado do Produto">
          <!-- Options will be populated in setupEditProductButton -->
        </select>

        <section class="detalhes-form-buttons">
          <button id="enviar-mensagem" type="button" title="Enviar Mensagem\nFuncionalidade não implementada">
            Enviar Mensagem <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
          </button>

          <button id="comprar-produto" type="button" title="Comprar" data-produto-id="${
            product.id
          }">
            Comprar <i class="fa fa-shopping-cart" aria-hidden="true"></i>
          </button>

          <button class="hidden" id="editar-produto" type="button" title="Editar Produto">
            Editar <i class="fa fa-pencil" aria-hidden="true"></i>
          </button>
          <button class="hidden" id="eliminar-produto" type="button" title="Eliminar Produto">
            Eliminar <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </section>

        <!-- Hidden field to store the original categoryId -->
        <input type="hidden" id="categoria-id" value="${product.categoryId}" />
      </form>
    `;

    toggleProductButtons(product);
    setupComprarButton();
    setupEditProductButton();
    setupDeleteProductButton();
  } catch (error) {
    console.error('Error loading product details:', error);
    containerDetails.innerHTML = '<p>Erro ao carregar detalhes do produto.</p>';
  }
}

export function setupDeleteProductButton() {
  const eliminarButton = document.getElementById('eliminar-produto');
  if (eliminarButton) {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    eliminarButton.addEventListener('click', async () => {
      const confirmDelete = confirm(
        'Tem certeza que deseja eliminar este produto?'
      );
      if (confirmDelete) {
        try {
          // Get product details to get seller ID
          const product = await productAPI.getProductById(produtoId);
          const sellerId = product.sellerId;

          // Delete the product
          await productAPI.deleteProduct(produtoId);
          alert('Produto eliminado com sucesso!');

          // Redirect to seller's profile
          window.location.href = `perfil-utilizador.html?id=${sellerId}`;
        } catch (error) {
          alert('Erro ao eliminar o produto. Tente novamente.');
          console.error(error);
        }
      }
    });
  }
}

export function setupEditProductButton() {
  const editBtn = document.getElementById('editar-produto');
  const textInputs = document.querySelectorAll(
    '#detalhes-produto-form input[type="text"]:not(#publicado-por), #detalhes-produto-form textarea'
  );
  const prodStateReadonly = document.getElementById('estado-produto-readonly');
  const prodStateSelect = document.getElementById('estado-produto');
  const catReadonly = document.getElementById('categoria-readonly');
  const catSelect = document.getElementById('categoria');

  if (editBtn) {
    editBtn.addEventListener('click', async () => {
      // Make form elements editable
      textInputs.forEach(el => (el.readOnly = false));

      // Handle price field specially to remove € symbol when editing
      const priceField = document.getElementById('preco');
      if (priceField) {
        priceField.value = priceField.value.replace('€', '').trim();
      }

      // Hide readonly state and show dropdown
      prodStateReadonly.classList.add('hidden');
      prodStateSelect.classList.remove('hidden');

      // Hide readonly category and show dropdown
      catReadonly.classList.add('hidden');
      catSelect.classList.remove('hidden');

      // Fetch categories and populate the dropdown
      try {
        const categories = await categoryAPI.getAllCategories();

        // Clear previous options except the default one
        while (catSelect.options.length > 1) {
          catSelect.remove(1);
        }

        // Add categories to dropdown
        if (categories && categories.length > 0) {
          categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            catSelect.appendChild(option);
          });
        }

        // Select the current category
        const currentCategoryId = document.getElementById('categoria-id').value;
        for (let i = 0; i < catSelect.options.length; i++) {
          if (catSelect.options[i].value === currentCategoryId) {
            catSelect.selectedIndex = i;
            break;
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }

      // Populate product state dropdown
      if (prodStateSelect.options.length === 0) {
        // Add all states except INATIVO
        for (const key in PRODUCT_STATES) {
          if (
            typeof PRODUCT_STATES[key] === 'object' &&
            PRODUCT_STATES[key].id !== PRODUCT_STATES.INATIVO.id
          ) {
            const option = document.createElement('option');
            option.value = PRODUCT_STATES[key].description;
            option.textContent = PRODUCT_STATES[key].description;
            prodStateSelect.appendChild(option);
          }
        }
      }

      // Set the current value in the state dropdown
      const currentState = prodStateReadonly.textContent.trim();
      for (let i = 0; i < prodStateSelect.options.length; i++) {
        if (prodStateSelect.options[i].value === currentState) {
          prodStateSelect.selectedIndex = i;
          break;
        }
      }

      // Replace edit button with save button
      const saveBtn = createSaveButton();
      editBtn.parentNode.replaceChild(saveBtn, editBtn);
    });
  }
}

export function createSaveButton() {
  const saveBtn = document.createElement('button');
  saveBtn.id = 'guardar-produto';
  saveBtn.type = 'button';
  saveBtn.title = 'Guardar Alterações';
  saveBtn.innerHTML = 'Guardar <i class="fa fa-save" aria-hidden="true"></i>';

  saveBtn.addEventListener('click', saveProductChanges);

  return saveBtn;
}

export async function addNewProduct() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const form = document.getElementById('form-novo-produto');
  const modal = document.getElementById('modal');

  if (!user || !user.id) {
    alert('You must be logged in to add a product');
    modal.style.display = 'none';
    return;
  }

  form.reset();

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const categorySelect = document.getElementById('category');
    const categoryId = parseInt(categorySelect.value);
    const price = document.getElementById('price').value;
    const imageUrl = document.getElementById('imageURL').value;
    const location = document.getElementById('location').value;

    const newProduct = {
      title: title,
      description: description,
      categoryId: categoryId,
      price: parseFloat(price),
      imageUrl: imageUrl,
      location: location,
      sellerId: user.id,
      active: true,
    };

    try {
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
      }
      await productAPI.createProduct(newProduct);
      alert('Product created successfully!');
      modal.style.display = 'none';
      form.reset();
      window.location.reload();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');

      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
    }
  });

  try {
    const categories = await categoryAPI.getAllCategories();
    const categorySelect = document.getElementById('category');

    while (categorySelect.options.length > 1) {
      categorySelect.remove(1);
    }

    if (categories && categories.length > 0) {
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

export async function saveProductChanges() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  const title = document.getElementById('nome-produto').value;
  const description = document.getElementById('descricao').value;
  const location = document.getElementById('localizacao').value;
  const categoryId = parseInt(document.getElementById('categoria').value);
  const price = parseFloat(
    document.getElementById('preco').value.replace('€', '').trim()
  );

  // Get the status text from the dropdown
  const statusText = document.getElementById('estado-produto').value;

  // Convert status text to the corresponding state ID
  const state = PRODUCT_STATES.fromDescription(statusText);

  if (!state) {
    console.error('Invalid product state:', statusText);
    alert('Estado do produto inválido!');
    return;
  }

  const updatedProduct = {
    title: title,
    description: description,
    categoryId: categoryId,
    price: price,
    location: location,
    status: state.description, // Send the canonical description
    stateId: state.id, // Also send the numeric ID
  };

  try {
    const saveBtn = document.getElementById('guardar-produto');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML =
        'A guardar... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';
    }

    await productAPI.updateProduct(productId, updatedProduct);
    alert('Produto atualizado com sucesso!');
    window.location.reload();
  } catch (error) {
    alert('Erro ao atualizar o produto. Tente novamente.');
    console.error(error);

    const saveBtn = document.getElementById('guardar-produto');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML =
        'Guardar <i class="fa fa-save" aria-hidden="true"></i>';
    }
  }
}

export async function comprarProduto(produtoId) {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.id) {
      alert('Precisa de iniciar sessão para comprar produtos.');
      window.location.href = 'login.html';
      return;
    }

    // Show loading state
    const buyProdBtn = document.getElementById('comprar-produto');
    if (buyProdBtn) {
      buyProdBtn.disabled = true;
      buyProdBtn.innerHTML =
        'A processar... <i class="fa fa-spinner fa-spin"></i>';
    }

    // Use the purchase endpoint
    await productAPI.purchaseProduct(produtoId, user.id);

    alert('Produto comprado com sucesso!');

    // Redirect to user's purchases or product details with updated status
    window.location.reload();
  } catch (error) {
    console.error('Erro ao comprar o produto:', error);

    // Handle specific error cases based on error message
    if (error.message && error.message.includes('not available')) {
      alert('Este produto já não está disponível para compra.');
    } else if (error.message && error.message.includes('own product')) {
      alert('Não pode comprar o seu próprio produto.');
    } else {
      alert(
        'Ocorreu um erro ao comprar o produto. Por favor, tente novamente mais tarde.'
      );
    }

    // Reset the button
    const buyProdBtn = document.getElementById('comprar-produto');
    if (buyProdBtn) {
      buyProdBtn.disabled = false;
      buyProdBtn.innerHTML =
        'Comprar <i class="fa fa-shopping-cart" aria-hidden="true"></i>';
    }
  }
}

export async function setupComprarButton() {
  const buyProdBtn = document.getElementById('comprar-produto');
  if (buyProdBtn) {
    const productId = buyProdBtn.getAttribute('data-produto-id');
    buyProdBtn.addEventListener('click', async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
          alert('Por favor, faça login para comprar o produto.');
          window.location.href = 'login.html';
          return;
        }

        const product = await productAPI.getProductById(productId);

        // Check if user is trying to buy their own product
        if (String(user.id) === String(product.sellerId)) {
          alert('Não pode comprar o seu próprio produto.');
          return;
        }

        // Check product availability using our PRODUCT_STATES helper
        const productState = PRODUCT_STATES.fromDescription(product.status);

        if (!productState || productState.id !== PRODUCT_STATES.DISPONIVEL.id) {
          alert('Este produto não está disponível para compra.');
          return;
        }

        const confirmPurchase = confirm(
          'Tem certeza que deseja comprar este produto?'
        );

        if (confirmPurchase) {
          await comprarProduto(productId);
        }
      } catch (error) {
        console.error('Error in purchase setup:', error);
        alert(
          'Ocorreu um erro ao processar a compra. Por favor, tente novamente.'
        );
      }
    });
  }
}

export async function toggleProductButtons(product) {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const buyProdBtn = document.getElementById('comprar-produto');
  const editProdBtn = document.querySelector('#editar-produto');
  const delProdBtn = document.querySelector('#eliminar-produto');
  const sendMsgBtn = document.querySelector('#enviar-mensagem');

  if (!buyProdBtn || !editProdBtn || !delProdBtn || !sendMsgBtn) {
    console.warn('One or more product buttons not found in the DOM');
    return;
  }

  // Default state - for non-logged users or non-owner users
  const isUserLoggedIn = !!user;
  const isUserProductOwner =
    isUserLoggedIn && String(user.id) === String(product.sellerId);

  // Hide edit/delete buttons by default
  editProdBtn.classList.add('hidden');
  delProdBtn.classList.add('hidden');

  // Show buy/message buttons by default
  buyProdBtn.classList.remove('hidden');
  sendMsgBtn.classList.remove('hidden');

  // If user is the product owner, toggle the buttons accordingly
  if (isUserProductOwner) {
    buyProdBtn.classList.add('hidden');
    sendMsgBtn.classList.add('hidden');
    editProdBtn.classList.remove('hidden');
    delProdBtn.classList.remove('hidden');
  }

  // Check if product is available using our PRODUCT_STATES helper
  const productState = PRODUCT_STATES.fromDescription(product.status);

  if (!productState || productState.id !== PRODUCT_STATES.DISPONIVEL.id) {
    // Product is not available
    buyProdBtn.disabled = true;
    // buyProdBtn.classList.add('disabled');
    buyProdBtn.title = 'Este produto não está disponível para compra';
  } else {
    buyProdBtn.disabled = false;
    // buyProdBtn.classList.remove('disabled');
    buyProdBtn.title = 'Comprar este produto';
  }
}

export async function getProductsByIds(ids) {
  const products = await productAPI.getAllProducts();
  return products.filter(product => ids.includes(product.id));
}
