'use strict';

import * as categoryAPI from '../api/categoryAPI.js';
import * as productAPI from '../api/productAPI.js';

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

export async function gerarDetalhesDoProduto() {
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

        <label for="categoria">Categoria:</label>
        <input type="text" id="categoria" value="${
          product.categoryName
        }" readonly />

        <label for="preco">Preço:</label>
        <input type="text" id="preco" value="${parseFloat(
          product.price
        ).toFixed(2)}€" readonly />

        <label for="publicado-por">Publicado por:</label>
        <input type="text" id="publicado-por" value="${
          product.sellerUsername
        }" readonly />

        <label for="descricao">Descrição:</label>
        <textarea id="descricao" readonly>${product.description}</textarea>

        <label for="estado-produto-readonly">Estado:</label>
        <input type="text" id="estado-produto-readonly" value="${
          product.status
        }" readonly />

        <label class="hidden" for="estado-produto">Estado:</label>
        <select class="hidden" name="estado-produto" id="estado-produto" title="Estado do Produto">
          <option value="rascunho">Rascunho</option>
          <option value="disponivel" selected>Disponível</option>
          <option value="reservado">Reservado</option>
          <option value="comprado">Comprado</option>
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
          await productAPI.deleteProduct(produtoId);
          alert('Produto eliminado com sucesso!');
          window.location.href = 'perfil-utilizador.html';
        } catch (error) {
          alert('Erro ao eliminar o produto. Tente novamente.');
          console.error(error);
        }
      }
    });
  }
}

export function setupEditProductButton() {
  const editarButton = document.getElementById('editar-produto');
  const formElements = document.querySelectorAll(
    '#detalhes-produto-form input, #detalhes-produto-form textarea'
  );
  const estadoReadonly = document.getElementById('estado-produto-readonly');
  const estadoSelect = document.getElementById('estado-produto');

  if (editarButton) {
    editarButton.addEventListener('click', () => {
      // Remove readonly from all form elements
      formElements.forEach(element => {
        if (element.id !== 'publicado-por') {
          // Keep author field readonly
          element.removeAttribute('readonly');
        }
      });

      // Show select and hide readonly input for estado
      estadoReadonly.classList.add('hidden');
      estadoSelect.classList.remove('hidden');
      document
        .querySelector('label[for="estado-produto"]')
        .classList.remove('hidden');
      document
        .querySelector('label[for="estado-produto-readonly"]')
        .classList.add('hidden');

      // Hide edit button and show save button
      editarButton.classList.add('hidden');
      const guardarButton = createSaveButton();
      editarButton.parentNode.insertBefore(guardarButton, editarButton);
    });
  }
}

export function createSaveButton() {
  const guardarButton = document.createElement('button');
  guardarButton.id = 'guardar-produto';
  guardarButton.type = 'button';
  guardarButton.title = 'Guardar Alterações';
  guardarButton.innerHTML =
    'Guardar <i class="fa fa-save" aria-hidden="true"></i>';

  guardarButton.addEventListener('click', saveProductChanges);

  return guardarButton;
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

  newForm.addEventListener('submit', async function (event) {
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
      newForm.reset();
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
  const status = document.getElementById('estado-produto').value.toUpperCase();

  const updatedProduct = {
    title: title,
    description: description,
    categoryId: categoryId,
    price: price,
    location: location,
    status: status,
  };

  try {
    const saveButton = document.getElementById('guardar-produto');
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.innerHTML =
        'A guardar... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';
    }

    await productAPI.updateProduct(productId, updatedProduct);
    alert('Produto atualizado com sucesso!');
    window.location.reload();
  } catch (error) {
    alert('Erro ao atualizar o produto. Tente novamente.');
    console.error(error);

    const saveButton = document.getElementById('guardar-produto');
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.innerHTML =
        'Guardar <i class="fa fa-save" aria-hidden="true"></i>';
    }
  }
}

export async function comprarProduto(produtoId) {
  try {
    await productAPI.updateProduct(produtoId, { estado: 'COMPRADO' });
    alert('Produto comprado com sucesso!');
    window.location.href = 'index.html';
  } catch (error) {
    alert('Erro ao comprar o produto. Tente novamente.');
    console.error(error);
  }
}

export async function setupComprarButton() {
  const comprarButton = document.getElementById('comprar-produto');
  if (comprarButton) {
    const produtoId = comprarButton.getAttribute('data-produto-id');
    comprarButton.addEventListener('click', async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) {
        alert('Por favor, faça login para comprar o produto.');
        window.location.href = 'pagina-login.html';
        return;
      }

      const produto = await productAPI.getProductById(produtoId);
      if (produto.estado !== 'DISPONIVEL') {
        alert('Este produto não está disponível para compra.');
        return;
      }

      comprarProduto(produtoId);
    });
  }
}

export async function toggleProductButtons(product) {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const comprarButton = document.getElementById('comprar-produto');
  const editarButton = document.querySelector('#editar-produto');
  const eliminarButton = document.querySelector('#eliminar-produto');
  const enviarMensagemButton = document.querySelector('#enviar-mensagem');

  if (
    !comprarButton ||
    !editarButton ||
    !eliminarButton ||
    !enviarMensagemButton
  ) {
    console.warn('One or more product buttons not found in the DOM');
    return;
  }

  // Default state - for non-logged users or non-owner users
  const isUserLoggedIn = !!user;
  const isUserProductOwner = isUserLoggedIn && user.id === product.sellerId;

  // Hide edit/delete buttons by default
  editarButton.classList.add('hidden');
  eliminarButton.classList.add('hidden');

  // Show buy/message buttons by default
  comprarButton.classList.remove('hidden');
  enviarMensagemButton.classList.remove('hidden');

  // If user is the product owner, toggle the buttons accordingly
  if (isUserProductOwner) {
    comprarButton.classList.add('hidden');
    enviarMensagemButton.classList.add('hidden');
    editarButton.classList.remove('hidden');
    eliminarButton.classList.remove('hidden');
  }

  // If product is not available, disable buy button
  if (product.estado !== 'DISPONIVEL' && product.status !== 'DISPONIVEL') {
    comprarButton.disabled = true;
    comprarButton.title = 'Este produto não está disponível para compra';
  }
}

export async function getProductsByIds(ids) {
  const products = await productAPI.getAllProducts();
  return products.filter(product => ids.includes(product.id));
}
