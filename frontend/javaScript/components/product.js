'use strict';

import * as productAPI from '../api/productAPI.js';
import * as userAPI from '../api/userAPI.js';
import * as helpers from '../utils/helpers.js';

export function createCard(product) {
  const rating = helpers.gerarRating(product.avaliacoes);
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${product.imagem}" alt="${product.titulo}" />
    <div>
      <h1>${product.titulo}</h1>
      <h4>${product.local}</h4>
      <h2>${product.categoria}</h2>
      <h3 class="rating">${rating.estrelas}</h3>
      <span>${parseFloat(product.preco).toFixed(2)}€</span>
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
  const products = await productAPI.getAllProducts();
  return products.filter(product => product.estado === 'DISPONIVEL');
}

export async function displayAllProducts() {
  const container = document.querySelector('.product-list');
  const products = await getAvailableProducts();

  if (!container) {
    console.log('Não está a chegar ao html');
    return;
  }
  container.innerHTML = '';
  products.forEach(product => {
    console.log('Estou a carregar os cartões dos produtos');
    const card = createCard(product);
    container.appendChild(card);
  });
}

export async function displayMostRecentProducts() {
  const mainContainer = document.querySelector('.recent-products');
  const products = await getAvailableProducts();
  const mostRecentProducts = products
    .sort((a, b) => new Date(b.dataDePublicacao) - new Date(a.dataDePublicacao))
    .slice(0, 3);
  mainContainer.innerHTML = '';
  mostRecentProducts.forEach(p => {
    const card = createCard(p);
    mainContainer.appendChild(card);
  });
}

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

export async function gerarDetalhesDoProduto() {
  const produtos = await productAPI.getAllProducts();
  const containerDetalhes = document.querySelector('.detalhes-container');
  const urlParams = new URLSearchParams(window.location.search);
  const idDoProduto = urlParams.get('id');
  containerDetalhes.innerHTML = '';

  const produto = produtos.find(prod => prod.id === idDoProduto);
  if (!produto) {
    alert('Produto não encontrado!');
    return;
  }

  const rating = helpers.gerarRating(produto.avaliacoes);

  containerDetalhes.innerHTML = `
    <div class="imagem">
      <img src="${produto.imagem}" alt="${produto.titulo}" />
    </div>
    <form id="detalhes-produto-form">
      <label for="nome-produto">Nome do Produto:</label>
      <input type="text" id="nome-produto" value="${produto.titulo}" readonly />

      <label for="localizacao">Localização:</label>
      <input type="text" id="localizacao" value="${produto.local}" readonly />

      <label for="categoria">Categoria:</label>
      <input type="text" id="categoria" value="${produto.categoria}" readonly />

      <label for="avaliacoes">Avaliações:</label>
      <a id="link-avaliacoes" href="#" title="Ver avaliações">
        <h3 id="estrelas">${
          produto.avaliacoes.length == 0 ? 'Sem avaliações' : rating.estrelas
        }
        <span id="numero-avaliacoes">(${
          produto.avaliacoes.length
        } avaliações)</span></h3>
      </a>

      <label for="preco">Preço:</label>
      <input type="text" id="preco" value="${parseFloat(produto.preco).toFixed(
        2
      )}€" readonly />

      <label for="publicado-por">Publicado por:</label>
      <input type="text" id="publicado-por" value="${
        produto.userAutor
      }" readonly />

      <label for="descricao">Descrição:</label>
      <textarea id="descricao" readonly>${produto.descricao}</textarea>

      <label for="estado-produto-readonly">Estado:</label>
      <input type="text" id="estado-produto-readonly" value="${
        produto.estado
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
          produto.id
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

  let avaliacoesVisiveis = false;
  document
    .getElementById('link-avaliacoes')
    .addEventListener('click', function (event) {
      event.preventDefault();
      const avaliacoesContainer = document.querySelector('.avaliacoes');
      if (avaliacoesVisiveis) {
        avaliacoesContainer.innerHTML = '';
      } else {
        avaliacoesContainer.innerHTML = '';
        produto.avaliacoes.forEach(avaliacao => {
          const avaliacaoElement = document.createElement('div');
          avaliacaoElement.className = 'avaliacao';
          avaliacaoElement.innerHTML = `
            <h4>
            ${avaliacao.autor}  <span>(${avaliacao.data})<span>
            </h4>
            <div class="rating">${helpers.gerarRating([avaliacao])}</div>
            <p>${avaliacao.texto}</p>
            <hr id="separador" />
          `;
          avaliacoesContainer.appendChild(avaliacaoElement);
        });
      }
      avaliacoesVisiveis = !avaliacoesVisiveis;
    });

  toggleProductButtons(produto);
  setupComprarButton();
  setupEditProductButton();
  setupDeleteProductButton();
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

          // Remove product from user's products array in sessionStorage
          const user = JSON.parse(sessionStorage.getItem('user'));
          user.produtos = user.produtos.filter(p => p.id !== produtoId);
          sessionStorage.setItem('user', JSON.stringify(user));

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

export async function saveProductChanges() {
  const urlParams = new URLSearchParams(window.location.search);
  const produtoId = urlParams.get('id');

  const updatedProduct = {
    titulo: document.getElementById('nome-produto').value,
    local: document.getElementById('localizacao').value,
    categoria: document.getElementById('categoria').value,
    preco: parseFloat(document.getElementById('preco').value.replace('€', '')),
    descricao: document.getElementById('descricao').value,
    estado: document.getElementById('estado-produto').value.toUpperCase(),
  };

  try {
    await productAPI.updateProduct(produtoId, updatedProduct);

    // Update product in user's products array in sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'));
    const productIndex = user.produtos.findIndex(p => p.id === produtoId);
    if (productIndex !== -1) {
      user.produtos[productIndex] = {
        ...user.produtos[productIndex],
        ...updatedProduct,
      };
      sessionStorage.setItem('user', JSON.stringify(user));
    }

    alert('Produto atualizado com sucesso!');
    window.location.reload();
  } catch (error) {
    alert('Erro ao atualizar o produto. Tente novamente.');
    console.error(error);
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

export function toggleProductButtons(produto) {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const comprarButton = document.getElementById('comprar-produto');
  const editarButton = document.querySelector('#editar-produto');
  const eliminarButton = document.querySelector('#eliminar-produto');
  const enviarMensagemButton = document.querySelector('#enviar-mensagem');

  if (user && user.produtos) {
    const isUserProduct = user.produtos.some(p => p.id === produto.id);

    if (isUserProduct) {
      enviarMensagemButton.classList.add('hidden');
      comprarButton.classList.add('hidden');
      editarButton.classList.remove('hidden');
      eliminarButton.classList.remove('hidden');
    } else {
      enviarMensagemButton.classList.remove('hidden');
      comprarButton.classList.remove('hidden');
      editarButton.classList.add('hidden');
      eliminarButton.classList.add('hidden');
    }
  } else {
    enviarMensagemButton.classList.remove('hidden');
    comprarButton.classList.remove('hidden');
    editarButton.classList.add('hidden');
    eliminarButton.classList.add('hidden');
  }
}

export async function getProductsByIds(ids) {
  const products = await productAPI.getAllProducts();
  return products.filter(product => ids.includes(product.id));
}
