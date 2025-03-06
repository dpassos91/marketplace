'use strict';

import { loadCommonElements } from './loadCommons.js';
import {
  getTotalUsers,
  suspendUser,
  reactivateUser,
  deleteUser,
} from './api/userAPI.js';
import { addCategory, getAllCategories } from './api/categoryAPI.js';
import {
  getProductsByCategory,
  getProductsBySeller,
  permanentlyDeleteProduct,
  getInactiveProducts,
  getAllEditedProducts,
} from './api/productAPI.js';

// Variáveis de paginação
const USERS_PER_PAGE = 10; // Número de utilizadores por página
let currentPage = 1; // Página atual
let allUsers = []; // Array para armazenar todos os utilizadores

// Função para exibir o modal de confirmação
function showConfirmationModal(data, action, type = 'user') {
  const modal = document.getElementById('confirmationModal');
  const confirmButton = document.getElementById('confirmButton');
  const cancelButton = document.getElementById('cancelButton');
  let message = '';

  if (type === 'user') {
    if (action === 'excluir') {
      message = `Tem certeza de que deseja excluir o utilizador ${data}?`;
    } else if (action === 'suspender') {
      message = `Tem certeza de que deseja suspender este utilizador?`;
    } else if (action === 'reativar') {
      message = `Tem certeza de que deseja reativar este utilizador?`;
    }
  } else if (type === 'product') {
    if (action === 'excluir') {
      message = `Tem certeza de que deseja excluir o produto ${data}?`;
    }
  }

  // Altera o texto do modal
  modal.querySelector('p').textContent = message;

  // Exibir o modal
  modal.style.display = 'block';

  // Adicionar event listeners aos botões do modal
  confirmButton.onclick = async function () {
    console.log(
      `Confirmação recebida. Ação: ${action}, Data: ${data}, Tipo: ${type}`
    );
    try {
      if (type === 'user') {
        if (action === 'suspender') {
          await suspendUser(data);
          console.log(`Utilizador com ID ${data} suspenso com sucesso`);
          alert('Utilizador suspenso com sucesso!');
          updateButtonState(data, true);
        } else if (action === 'excluir') {
          await deleteUser(data);
          console.log(`Utilizador ${data} excluído com sucesso`);
          alert('Utilizador excluído com sucesso!');
          loadUsers(); // Recarrega a lista de utilizadores após a exclusão
        } else if (action === 'reativar') {
          await reactivateUser(data);
          console.log(`Utilizador com ID ${data} reativado com sucesso`);
          alert('Utilizador reativado com sucesso!');
          updateButtonState(data, false);
        }
      } else if (type === 'product') {
        if (action === 'excluir') {
          await permanentlyDeleteProduct(data); // Assume que 'data' é o ID do produto
          console.log(`Produto com ID ${data} excluído com sucesso`);
          alert('Produto excluído com sucesso!');
          loadProducts(); // Recarrega a lista de produtos após a exclusão
        }
      }
    } catch (error) {
      console.error(`Erro ao ${action} o ${type}:`, error);
      alert(`Erro ao ${action} o ${type}. Ver a consola para detalhes.`);
    } finally {
      // Fechar o modal
      modal.style.display = 'none';
    }
  };

  cancelButton.onclick = function () {
    console.log(`Operação de ${action} cancelada`);
    // Fechar o modal
    modal.style.display = 'none';
  };
}

async function initPage() {
  try {
    await loadCommonElements();
    console.log('Elementos comuns carregados com sucesso');

    const links = document.querySelectorAll('.admin-sidebar a');
    const sections = document.querySelectorAll('.admin-content > section');

    // Função para esconder todas as secções
    function hideAllSections() {
      const sections = document.querySelectorAll('.admin-content > section');
      sections.forEach(section => section.classList.add('hidden'));
    }

    links.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();

        hideAllSections(); // Esconde todas as secções

        let targetId = this.getAttribute('id');
        if (targetId === 'ver-dashboard') {
          showSection('dashboard');
          loadDashboard();
        } else if (targetId === 'gestao-avaliacoes') {
          showSection('avaliacoes');
        } else if (targetId === 'gestao-produtos') {
          showSection('produtos');
        } else if (targetId === 'gestao-utilizadores') {
          showSection('utilizadores');
          loadUsers();
          showUserManagementButtons(); // Mostra os botões de gestão de utilizadores
        }
    });
});

    // Evento de clique para o botão "Filtrar"
    const filtrarButton = document.getElementById('adminFiltrarProd');
    filtrarButton.addEventListener('click', function (event) {
      event.preventDefault();

      hideAllSections(); // Esconde todas as secções
      showSection('filtros'); // Mostra a secção de filtros
    });

    // Evento de clique para o botão "Editar produtos de utilizadores"
const editarButton = document.getElementById('adminEditarProd');
editarButton.addEventListener('click', function (event) {
    event.preventDefault();

    hideAllSections(); // Esconde todas as secções
    showSection('editarProdutos'); // Mostra a secção de editarProdutos
    loadProducts(); // Carrega a tabela de produtos
});

// Evento de clique para o botão "Produtos alterados"
const alteradoButton = document.getElementById('produtoAlterado');
alteradoButton.addEventListener('click', function (event) {
    event.preventDefault();

    hideAllSections(); // Esconde todas as secções
    showSection('alterarProdutos'); // Mostra a secção de editarProdutos
    loadProductsAlterados(); // Carrega a tabela de produtos
});


    // Função genérica para mostrar uma secção
    function showSection(targetId) {
      hideAllSections();
      const section = document.getElementById(targetId);
      if (section) {
        section.classList.remove('hidden');
      }
    }

    // Função para criar um cartão de utilizador
    function createUserCard(user) {
      const card = document.createElement('div');
      card.className = 'user-card';
      card.innerHTML = `
            <div>
                <h1>${user.nome}</h1>
                <h4>${user.email}</h4>
                <h2>${user.cargo}</h2>
                <span>${user.dataDeCriacao}</span>
                <button type="button" title="perfil">Ver Perfil</button>
            </div>
        `;
      const button = card.querySelector('button');
      button.addEventListener('click', () => {
        window.location.href = `perfil-utilizador.html?id=${user.id}`;
      });
      return card;
    }

    // Função para adicionar cartões de utilizadores ao container no dashboard
    function displayUserCards(users) {
      const container = document.getElementById('userCardsContainer');
      container.innerHTML = ''; // Limpa o container

      users.forEach(user => {
        const card = createUserCard(user);
        container.appendChild(card);
      });
    }

    // Função para carregar os utilizadores a partir do backend
    async function loadUsers() {
      try {
        console.log('Função loadUsers chamada');
        allUsers = await getTotalUsers(); // Usa a função getTotalUsers para obter todos os utilizadores
        console.log('Utilizadores obtidos:', allUsers);
        if (!Array.isArray(allUsers)) {
          throw new Error('Formato de dados inesperado');
        }
        currentPage = 1; // Resetar para a primeira página ao carregar os utilizadores
        displayUsersTable(getUsersForPage(currentPage)); // Chama a função para exibir a tabela de utilizadores
        displayPaginationButtons(); // Exibe os botões de paginação
      } catch (error) {
        console.error('Erro:', error);
      }
    }

    // Função para obter os utilizadores para a página atual
    function getUsersForPage(page) {
      const startIndex = (page - 1) * USERS_PER_PAGE;
      const endIndex = startIndex + USERS_PER_PAGE;
      return allUsers.slice(startIndex, endIndex);
    }

    // Função para atualizar o estado do botão
    function updateButtonState(userId, isSuspended) {
      const button = document.querySelector(
        `.suspend-user[data-user-id="${userId}"]`
      );
      if (button) {
        button.classList.toggle('btn-success', isSuspended);
        button.classList.toggle('btn-info', !isSuspended);
        button.textContent = isSuspended ? 'Reativar' : 'Suspender';

        // Encontrar a linha da tabela (tr) correspondente ao botão
        const tableRow = button.closest('tr');

        // Adicionar ou remover a classe 'suspended-user' na linha da tabela
        if (isSuspended) {
          tableRow.classList.add('suspended-user');
        } else {
          tableRow.classList.remove('suspended-user');
        }
      }
    }

    // Função para exibir os utilizadores numa tabela
    function displayUsersTable(users) {
      console.log('Função displayUsersTable chamada');
      console.log('Dados dos utilizadores:', users);

      // Ordenar os utilizadores por username em ordem alfabética ascendente
      users.sort((a, b) => a.username.localeCompare(b.username));

      const container = document.getElementById('tabelaUtilizadores');
      console.log('Contêiner da tabela de utilizadores:', container);
      container.innerHTML = '';

      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th style="text-align: center;">Username</th>
            <th style="text-align: center;">Email</th>
            <th style="text-align: center;">Ações</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              user => `
                <tr class="${user.active ? '' : 'suspended-user'}">
                  <td style="text-align: center;">${user.username}</td>
                  <td style="text-align: center;">${user.email}</td>
                  <td style="text-align: center;">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                      <button class="btn-card tabela-btn btn-danger redirect-user" data-user-id="${
                        user.id
                      }">Consultar perfil</button>
                      <button class="btn-card tabela-btn ${
                        user.active ? 'btn-info' : 'btn-success'
                      } suspend-user" data-user-id="${user.id}">${
                user.active ? 'Suspender' : 'Reativar'
              }</button>
                      <button class="btn-card tabela-btn btn-edit" data-user-id="${
                        user.id
                      }" data-username="${user.username}">Excluir</button>
                    </div>
                  </td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      `;
      console.log('Tabela criada:', table);
      container.appendChild(table);
      console.log('Tabela adicionada ao contêiner');

      // Adiciona event listeners para os botões "Consultar Perfil"
      const redirectUserButtons = table.querySelectorAll('.redirect-user');
      redirectUserButtons.forEach(button => {
        button.addEventListener('click', function () {
          const userId = this.dataset.userId;
          console.log(
            `Redirecionar para o perfil do utilizador com ID: ${userId}`
          );
          // Redirecionar para a página de perfil do utilizador
          window.location.href = `http://localhost:8080/frontend/perfil-utilizador.html?id=${userId}`;
        });
      });

      // Adiciona event listeners para os botões "Apagar/Reativar"
      const suspendUserButtons = table.querySelectorAll('.suspend-user');
      suspendUserButtons.forEach(button => {
        // Remover event listeners antigos
        button.removeEventListener('click', button.handleClick);
        // Adiciona novos event listeners
        button.handleClick = async function () {
          const userId = this.dataset.userId;
          const isActive = this.classList.contains('btn-info'); // Verifica se o botão tem a classe 'btn-info'

          if (isActive) {
            // Suspender utilizador
            console.log(
              `Solicitar confirmação para suspender utilizador com ID: ${userId}`
            );
            showConfirmationModal(userId, 'suspender', 'user'); // Exibe o modal de confirmação com a ação "suspender"
          } else {
            // Reativar utilizador
            console.log(
              `Solicitar confirmação para reativar utilizador com ID: ${userId}`
            );
            showConfirmationModal(userId, 'reativar', 'user'); // Exibe o modal de confirmação com a ação "reativar"
          }
        };
        button.addEventListener('click', button.handleClick);
      });

      // Adiciona event listeners para os botões "Excluir"
      const deleteUserButtons = table.querySelectorAll('.btn-edit');
      deleteUserButtons.forEach(button => {
        button.addEventListener('click', function () {
          const userId = this.dataset.userId; // Obtenha o userId do atributo data
          const username = this.dataset.username;
          console.log(
            `Solicitar confirmação para excluir utilizador: ${username} com ID: ${userId}`
          );
          showConfirmationModal(userId, 'excluir', 'user'); // Exibe o modal de confirmação com a ação "excluir"
        });
      });
    }

    // Função para exibir os botões de paginação
    function displayPaginationButtons() {
      const totalPages = Math.ceil(allUsers.length / USERS_PER_PAGE);
      const container = document.getElementById('tabelaUtilizadores');

      // Verificar se os botões de paginação já existem
      let paginationButtonsExist = false;
      if (container.querySelector('.pagination-button')) {
        paginationButtonsExist = true;
      }

      if (!paginationButtonsExist) {
        // Criar botões de paginação
        for (let i = 1; i <= totalPages; i++) {
          const button = document.createElement('button');
          button.textContent = i;
          button.className = 'btn-card pagination-button'; // Adicionar a classe 'btn-card'
          button.addEventListener('click', () => {
            currentPage = i;
            displayUsersTable(getUsersForPage(currentPage));
            updateActiveButton(i); // Atualizar o botão ativo
          });
          container.appendChild(button);
        }
      }

      // Marcar o botão da página atual como ativo
      updateActiveButton(currentPage);
    }

    // Função para atualizar o botão ativo
    function updateActiveButton(activePage) {
      const container = document.getElementById('tabelaUtilizadores');
      const buttons = container.querySelectorAll('.pagination-button');
      buttons.forEach(button => {
        button.classList.remove('active'); // Remover a classe 'active' de todos os botões
        if (parseInt(button.textContent) === activePage) {
          button.classList.add('active'); // Adicionar a classe 'active' ao botão da página atual
        }
      });
    }

    // Função para mostrar os botões de gestão de utilizadores
    function showUserManagementButtons() {
      const userManagementButtons = document.querySelector(
        '.user-management-buttons'
      );
      if (userManagementButtons) {
        userManagementButtons.classList.remove('hidden');
      }
    }

    // Função para carregar o dashboard
    async function loadDashboard() {
      try {
        const users = await getTotalUsers();
        displayUserCards(users);
      } catch (error) {
        console.error('Erro ao carregar o dashboard:', error);
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar a página:', error);
  }

  // Função para exibir o modal e adicionar uma nova categoria
  function showAddCategoryModal() {
    const modal = document.getElementById('confirmationModal');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    // Criar um label e um campo de entrada para o nome da categoria
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.marginBottom = '5px';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'categoryNameInput';
    inputField.placeholder = 'Ex: Tecnologia, Desporto, etc.';
    inputField.style.width = '100%';
    inputField.style.padding = '8px';
    inputField.style.marginBottom = '10px';
    inputField.style.border = '1px solid #ccc';
    inputField.style.borderRadius = '5px';
    inputField.style.fontSize = '16px';

    // Altera o texto do modal
    const message = 'Insira o nome da nova categoria:';
    modal.querySelector('p').textContent = message;

    // Adicionar o label e o campo de entrada
    modal.querySelector('p').appendChild(label);
    modal.querySelector('p').appendChild(inputField);

    // Exibir o modal
    modal.style.display = 'block';

    // Adicionar event listeners aos botões do modal
    confirmButton.onclick = async function () {
      console.log('Confirmação recebida para adicionar categoria');
      try {
        const categoryName = document.getElementById('categoryNameInput').value;
        if (!categoryName) {
          alert('Por favor, insira um nome para a categoria');
          return;
        }
        await addCategory(categoryName); // Implementar esta função conforme sua lógica
        console.log(`Nova categoria "${categoryName}" adicionada com sucesso`);
        alert('Nova categoria adicionada com sucesso!');
      } catch (error) {
        console.error('Erro ao adicionar categoria:', error);
        alert('Erro ao adicionar categoria. Ver a consola para detalhes.');
      } finally {
        // Fechar o modal
        modal.style.display = 'none';
      }
    };

    cancelButton.onclick = function () {
      console.log('Operação de adicionar categoria cancelada');
      // Fechar o modal
      modal.style.display = 'none';
    };
  }

  // Adicionar evento ao botão "Adicionar nova categoria"
  const addCategoryButton = document.querySelector('.btn-add'); // Seleciona o botão pelo seletor da classe

  addCategoryButton.addEventListener('click', function () {
    console.log('Botão "Adicionar nova categoria" clicado');
    showAddCategoryModal(); // Chama a função que exibe o modal para adicionar uma categoria
  });

  const filterByCategoryButton = document.getElementById('filtrarPorCategoria');
  const productCategoryModal = document.getElementById('productCategoryModal');
  const productCategorySelect = document.getElementById(
    'productCategorySelect'
  );
  const productDisplay = document.getElementById('productDisplay');

  // Event listener para o botão "Filtrar por Categoria"
  filterByCategoryButton.addEventListener('click', function () {
    console.log('Botão "Filtrar por Categoria" clicado');
    loadCategories();
  });

  // Função para carregar categorias no select dentro do modal
  async function loadCategories() {
    try {
      const categories = await getAllCategories();
      console.log('Categorias recebidas:', categories);

      if (!Array.isArray(categories) || categories.length === 0) {
        console.warn('Nenhuma categoria encontrada.');
        return;
      }

      productCategorySelect.innerHTML =
        '<option value="">Selecione uma categoria</option>';
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        productCategorySelect.appendChild(option);
      });

      // Exibir o modal
      productCategoryModal.style.display = 'block';
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }

  // Event listener para o select dentro do modal
  productCategorySelect.addEventListener('change', handleCategoryChange);

  // Função para lidar com a mudança de categoria no select
  async function handleCategoryChange(event) {
    const categoryId = event.target.value;
    if (categoryId) {
      try {
        const products = await getProductsByCategory(categoryId);
        displayProducts(products);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    } else {
      productDisplay.innerHTML = '';
    }
  }

  // Função para exibir os produtos dentro do modal
  function displayProducts(products) {
    productDisplay.innerHTML = ''; // Limpa produtos anteriores

    if (products.length === 0) {
      productDisplay.innerHTML =
        '<p style="text-align: center;">Nenhum produto encontrado nesta categoria.</p>';
      return;
    }

    const table = document.createElement('table');
    table.className = 'products-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ['Título', 'Preço'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.textAlign = 'center';
      th.style.padding = '10px';
      th.style.backgroundColor = '#f2f2f2';
      headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    products.forEach(product => {
      const row = tbody.insertRow();
      ['title', 'price'].forEach((prop, index) => {
        const cell = row.insertCell();
        cell.textContent =
          prop === 'price' ? `${product[prop]}€` : product[prop];
        cell.style.textAlign = 'center';
        cell.style.padding = '8px';
        cell.style.borderBottom = '1px solid #ddd';
      });
    });

    productDisplay.appendChild(table);
  }

  // Fechar o modal quando clicar no X
  const closeButtons = document.querySelectorAll(
    '#productCategoryModal .close'
  );
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('productCategoryModal').style.display = 'none';
    });
  });

  // Filtar por vendedor
  const filterBySellerButton = document.getElementById('filtrarPorPreco');
  const productSellerModal = document.getElementById('productSellerModal');
  const sellerProductDisplay = document.getElementById('sellerProductDisplay');

  // Event listener para abrir o modal de vendedores
  filterBySellerButton.addEventListener('click', function () {
    console.log('Botão "Filtrar por Vendedor" clicado');
    openSellerModal();
  });

  function openSellerModal() {
    sellerProductDisplay.innerHTML = '';

    const sellerIdInput = document.createElement('input');
    sellerIdInput.type = 'text';
    sellerIdInput.placeholder = 'Insira o ID do vendedor';
    sellerIdInput.style.marginBottom = '10px';

    const searchButton = document.createElement('button');
    searchButton.textContent = 'Pesquisar';
    searchButton.onclick = () => searchSellerProducts(sellerIdInput.value);

    const inputContainer = document.createElement('div');
    inputContainer.appendChild(sellerIdInput);
    inputContainer.appendChild(searchButton);

    sellerProductDisplay.appendChild(inputContainer);

    productSellerModal.style.display = 'block';
  }

  async function searchSellerProducts(sellerId) {
    if (!sellerId.trim()) {
      alert('Por favor, insira um ID de vendedor válido.');
      return;
    }

    try {
      const products = await getProductsBySeller(sellerId);
      if (products === null || products.length === 0) {
        if (products === null) {
          displayNoUserFound(sellerId);
        } else {
          displayNoProducts(sellerId);
        }
      } else {
        displaySellerProducts(products, sellerId);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos do vendedor:', error);
      displayError('Erro ao buscar produtos. Por favor, tente novamente.');
    }
  }

  function displayNoUserFound(sellerId) {
    clearDisplayAndKeepSearch();
    const message = document.createElement('p');
    message.textContent = `O utilizador com ID ${sellerId} não existe.`;
    message.style.textAlign = 'center';
    message.style.color = 'red';
    sellerProductDisplay.appendChild(message);
  }

  function displayNoProducts(sellerId) {
    clearDisplayAndKeepSearch();
    const message = document.createElement('p');
    message.textContent = `O vendedor com ID ${sellerId} não tem produtos disponíveis.`;
    message.style.textAlign = 'center';
    sellerProductDisplay.appendChild(message);
  }

  function clearDisplayAndKeepSearch() {
    const searchContainer =
      document.getElementById('sellerSearchContainer') ||
      createSearchContainer();
    sellerProductDisplay.innerHTML = '';
    sellerProductDisplay.appendChild(searchContainer);
  }

  function displaySellerProducts(products, sellerId) {
    clearDisplayAndKeepSearch();

    const firstProduct = products[0];
    const sellerName = firstProduct.sellerUsername || `Vendedor ${sellerId}`;
    const actualSellerId = firstProduct.sellerId;

    const title = document.createElement('h2');
    title.textContent = `Produtos do Vendedor ${sellerName} (ID: ${actualSellerId})`;
    title.style.textAlign = 'center';
    title.style.marginTop = '20px';
    sellerProductDisplay.appendChild(title);

    const table = createProductTable(products);
    sellerProductDisplay.appendChild(table);
  }

  function createSearchContainer() {
    const container = document.createElement('div');
    container.id = 'sellerSearchContainer';
    container.style.marginBottom = '20px';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'sellerIdInput';
    input.placeholder = 'Insira o ID do vendedor';
    input.style.marginRight = '10px';

    const button = document.createElement('button');
    button.textContent = 'Buscar Produtos';
    button.onclick = () => searchSellerProducts(input.value);

    container.appendChild(input);
    container.appendChild(button);

    return container;
  }

  function createProductTable(products) {
    const table = document.createElement('table');
    table.className = 'products-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '10px';

    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ['Título', 'Preço', 'Categoria'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.textAlign = 'center';
      th.style.padding = '10px';
      th.style.backgroundColor = '#f2f2f2';
      headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    products.forEach(product => {
      const row = tbody.insertRow();
      ['title', 'price', 'categoryName'].forEach(prop => {
        const cell = row.insertCell();
        if (prop === 'price') {
          cell.textContent = `${product[prop]}€`;
        } else {
          cell.textContent = product[prop];
        }
        cell.style.textAlign = 'center';
        cell.style.padding = '8px';
        cell.style.borderBottom = '1px solid #ddd';
      });
    });

    return table;
  }

  // Fechar o modal
  const closeButtonsSellerModal = document.querySelectorAll(
    '#productSellerModal .close'
  );
  closeButtonsSellerModal.forEach(button => {
    button.addEventListener('click', () => {
      productSellerModal.style.display = 'none';
    });
  });

// Gestão de produtos

let allProducts = [];
const PRODUCTS_PER_PAGE = 10; // Define quantos produtos queres mostrar por página


  // Function to load products from the backend
  async function loadProducts() {
    try {
      console.log('loadProducts function called');
      allProducts = await getInactiveProducts(); // Usa a função getAllProducts para obter todos os produtos
      console.log('Products obtained:', allProducts);
      if (!Array.isArray(allProducts)) {
        throw new Error('Unexpected data format');
      }
      currentPage = 1; // Reset to the first page when loading products
      displayProductsTable(getProductsForPage(currentPage)); // Calls the function to display the product tables
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Function to get the products for the current page
  function getProductsForPage(page) {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return allProducts.slice(startIndex, endIndex);
  }

  // Function to display the products in a table
  function displayProductsTable(products) {
    console.log('displayProductsTable function called');
    console.log('Products data:', products);

    // Sort products by name in ascending alphabetical order
    products.sort((a, b) => {
      const nomeA = a.nome ? a.nome.toLowerCase() : ''; // Converter para minúsculas para ordenação insensível a maiúsculas e minúsculas
      const nomeB = b.nome ? b.nome.toLowerCase() : '';

      if (nomeA < nomeB) {
        return -1;
      }
      if (nomeA > nomeB) {
        return 1;
      }
      return 0; // Se os nomes forem iguais ou ambos estiverem ausentes
    });

    const container = document.getElementById('editProductsContainer');
    console.log('Products table container:', container);
    container.innerHTML = '';

    const table = document.createElement('table');
    table.innerHTML = `
    <thead>
      <tr>
        <th style="text-align: center;">Nome</th>
        <th style="text-align: center;">Preço</th>
        <th style="text-align: center;">ID Produto</th>
        <th style="text-align: center;">Username</th>
        <th style="text-align: center;">Ações</th>
      </tr>
    </thead>
    <tbody>
      ${products
        .map(
          product => `
            <tr>
              <td style="text-align: center;">${product.title}</td>
              <td style="text-align: center;">${product.price}</td>
              <td style="text-align: center;">${product.id}</td>
              <td style="text-align: center;">${product.sellerUsername}</td>
              <td style="text-align: center;">
                <div style="display: flex; justify-content: space-around; align-items: center;">
                  <button class="btn-card tabela-btn btn-edit" data-product-id="${product.id}" data-product-name="${product.name}">Excluir</button>
                </div>
              </td>
            </tr>
          `
        )
        .join('')}
    </tbody>
  `;
    console.log('Table created:', table);
    container.appendChild(table);
    console.log('Table added to container');

    // Add event listeners for the "Delete" buttons
    const deleteProductButtons = table.querySelectorAll('.btn-edit');
    deleteProductButtons.forEach(button => {
      button.addEventListener('click', function () {
        const productId = this.dataset.productId; // Get the productId from the data attribute
        const productName = this.dataset.productName;
        console.log(
          `Request confirmation to delete product: ${productName} with ID: ${productId}`
        );
        showConfirmationModal(productId, 'excluir', 'product'); // Displays the confirmation modal with the action "delete"
      });
    });
  }

  // Function to display the confirmation modal for products
  function productModal(data, action) {
    const modal = document.getElementById('confirmationModal'); // Certifique-se de que o ID do modal é consistente
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');
    let message = '';

    if (action === 'delete') {
      message = `Are you sure you want to delete the product ${data}?`;
    }

    // Changes the modal text
    modal.querySelector('p').textContent = message;

    // Show the modal
    modal.style.display = 'block';

    // Add event listeners to the modal buttons
    confirmButton.onclick = async function () {
      console.log(`Confirmation received. Action: ${action}, Data: ${data}`);
      try {
        if (action === 'delete') {
          await permanentlyDeleteProduct(data); // 'data' is the productId
          console.log(`Product ${data} deleted successfully`);
          alert('Product deleted successfully!');
          loadProducts(); // Reload the list of products after deletion
        }
      } catch (error) {
        console.error(`Error deleting the product:`, error);
        alert(`Error deleting the product. See the console for details.`);
        // Handle the error as needed
      } finally {
        // Close the modal
        modal.style.display = 'none';
      }
    };

    cancelButton.onclick = function () {
      console.log(`${action} operation canceled`);
      // Close the modal
      modal.style.display = 'none';
    };
  }

  // Function to display the pagination buttons
  function displayPaginationButtons() {
    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
    const container = document.getElementById('productsTable');

    // Check if the pagination buttons already exist
    let paginationButtonsExist = false;
    if (container.querySelector('.pagination-button')) {
      paginationButtonsExist = true;
    }

    if (!paginationButtonsExist) {
      // Create pagination buttons
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'btn-card pagination-button'; // Add the 'btn-card' class
        button.addEventListener('click', () => {
          currentPage = i;
          displayProductsTable(getProductsForPage(currentPage));
          updateActiveButton(i); // Update the active button
        });
        container.appendChild(button);
      }
    }

    // Mark the current page button as active
    updateActiveButton(currentPage);
  }

// Function to update the active button
function updateActiveButton(activePage) {
  const container = document.getElementById('productsTable');
  const buttons = container.querySelectorAll('.pagination-button');
  buttons.forEach(button => {
    button.classList.remove('active'); // Remove the 'active' class from all buttons
    if (parseInt(button.textContent) === activePage) {
      button.classList.add('active'); // Add the 'active' class to the current page button
    }
  });
}

// Produtos alterados

let allProductsAlterados = [];

  // Function to load products from the backend
  async function loadProductsAlterados() {
    try {
      console.log('loadProducts function called');
      allProducts = await getAllEditedProducts(); // Usa a função getAllProducts para obter todos os produtos
      console.log('Products obtained:', allProducts);
      if (!Array.isArray(allProducts)) {
        throw new Error('Unexpected data format');
      }
      currentPage = 1; // Reset to the first page when loading products
      displayProductsAlteradosTable(getProductsAlteradosForPage(currentPage)); // Calls the function to display the product tables
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Function to get the products for the current page
  function getProductsAlteradosForPage(page) {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return allProducts.slice(startIndex, endIndex);
  }

  // Function to display the products in a table
  function displayProductsAlteradosTable(products) {
    console.log('displayProductsAlteradosTable function called');
    console.log('Products data:', products);

    // Sort products by name in ascending alphabetical order
    products.sort((a, b) => {
      const nomeA = a.nome ? a.nome.toLowerCase() : ''; // Converter para minúsculas para ordenação insensível a maiúsculas e minúsculas
      const nomeB = b.nome ? b.nome.toLowerCase() : '';

      if (nomeA < nomeB) {
        return -1;
      }
      if (nomeA > nomeB) {
        return 1;
      }
      return 0; // Se os nomes forem iguais ou ambos estiverem ausentes
    });

    const containerAlterado = document.getElementById('alterarProductsContainer');
    console.log('Products table container:', containerAlterado);
    containerAlterado.innerHTML = '';

    const tableAlterado = document.createElement('table');
    tableAlterado.innerHTML = `
    <thead>
      <tr>
        <th style="text-align: center;">Nome</th>
        <th style="text-align: center;">Preço</th>
        <th style="text-align: center;">ID Produto</th>
        <th style="text-align: center;">Username</th>
        <th style="text-align: center;">Data de Alteração</th>
      </tr>
    </thead>
    <tbody>
      ${products
        .map(
          product => `
            <tr>
              <td style="text-align: center;">${product.title}</td>
              <td style="text-align: center;">${product.price}</td>
              <td style="text-align: center;">${product.id}</td>
              <td style="text-align: center;">${product.sellerUsername}</td>
              <td style="text-align: center;">${product.editDate}</td>
            </tr>
          `
        )
        .join('')}
    </tbody>
  `;
    console.log('Table created:', tableAlterado);
    containerAlterado.appendChild(tableAlterado);
    console.log('Table added to container');
  }

  // Function to display the pagination buttons
  function displayPaginationButtons() {
    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
    const container = document.getElementById('productsTable');

    // Check if the pagination buttons already exist
    let paginationButtonsExist = false;
    if (container.querySelector('.pagination-button')) {
      paginationButtonsExist = true;
    }

    if (!paginationButtonsExist) {
      // Create pagination buttons
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'btn-card pagination-button'; // Add the 'btn-card' class
        button.addEventListener('click', () => {
          currentPage = i;
          displayProductsTable(getProductsForPage(currentPage));
          updateActiveButton(i); // Update the active button
        });
        container.appendChild(button);
      }
    }

    // Mark the current page button as active
    updateActiveButton(currentPage);
  }

// Function to update the active button
function updateActiveButton(activePage) {
  const container = document.getElementById('productsTable');
  const buttons = container.querySelectorAll('.pagination-button');
  buttons.forEach(button => {
    button.classList.remove('active'); // Remove the 'active' class from all buttons
    if (parseInt(button.textContent) === activePage) {
      button.classList.add('active'); // Add the 'active' class to the current page button
    }
  });
}

}
// Aguarda o carregamento completo do DOM antes de executar a função initPage
document.addEventListener('DOMContentLoaded', initPage);


/* Button for administrators to permanently delete inactive products */
/*
export function setupPermanentDeleteButton(productId) {
  const permDeleteBtn = document.getElementById('permanent-delete-product');
  
  if (permDeleteBtn) {
    permDeleteBtn.addEventListener('click', async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      
      // Check if user is an admin
      if (!user || !user.isAdmin) {
        alert('Only administrators can permanently delete products.');
        return;
      }
      
      const confirmDelete = confirm(
        'Are you sure you want to PERMANENTLY delete this product? This action CANNOT be undone!'
      );

      if (confirmDelete) {
        try {
          // Show processing state
          permDeleteBtn.disabled = true;
          permDeleteBtn.innerHTML = 'Processing... <i class="fa fa-spinner fa-spin"></i>';
          
          // Call the permanent deletion endpoint
          await productAPI.permanentlyDeleteProduct(productId);
          
          alert('Product permanently deleted successfully.');
          window.location.href = 'admin-products.html'; // Troca por uma página que queiras redirecionar
        } catch (error) {
          console.error('Error permanently deleting product:', error);
          
          if (error.message.includes('not in inactive state')) {
            alert('This product must be deactivated before it can be permanently deleted.');
          } else {
            alert('An error occurred while trying to delete the product. Please try again.');
          }
          
          // Reset button
          permDeleteBtn.disabled = false;
          permDeleteBtn.innerHTML = 'Permanently Delete';
        }
      }
    });
  }
}
  */
