'use strict';

import { loadCommonElements } from './loadCommons.js';
import { getTotalUsers, suspendUser } from './api/userAPI.js';

// Variáveis de paginação
const USERS_PER_PAGE = 10; // Número de utilizadores por página
let currentPage = 1; // Página atual
let allUsers = []; // Array para armazenar todos os utilizadores

async function initPage() {
  try {
    await loadCommonElements();
    console.log('Elementos comuns carregados com sucesso');

    const links = document.querySelectorAll('.admin-sidebar a');
    const sections = document.querySelectorAll('.admin-content > section');

    // Função para esconder todas as sections
    function hideAllSections() {
      console.log('Escondendo todas as secções');
      sections.forEach(section => {
        section.classList.add('hidden');
      });
    }

    // Evento de clique para os links do sidebar
    links.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();

        hideAllSections(); // Esconde todas as sections

        // Mostra a section correspondente ao link clicado
        let targetId = this.getAttribute('id');
        if (targetId === 'gestao-utilizadores') {
          showSection('utilizadores'); // Garante que a secção de utilizadores está visível
          loadUsers(); // Carrega e exibe a tabela de utilizadores
        } else if (targetId === 'gestao-produtos') {
          showSection('produtos'); // Garante que a secção de produtos está visível
        } else if (targetId === 'ver-dashboard') {
          showSection('dashboard'); // Garante que a secção do dashboard está visível
          loadDashboard(); // Carrega os cartões de utilizadores ao carregar o dashboard
        } else if (targetId === 'gestao-avaliacoes') {
          showSection('avaliacoes'); // Garante que a secção de avaliações está visível
        }
      });
    });

    // Evento de clique para o botão "Consultar perfil de utilizador"
    const viewUserProfileButton = document.getElementById('viewUserProfile');
    viewUserProfileButton.addEventListener('click', function (event) {
      event.preventDefault();
      console.log('Botão "Consultar perfil de utilizador" clicado');
      showSection('utilizadores'); // Mostra a seção de utilizadores
      loadUsers(); // Carrega os utilizadores quando o botão é clicado
    });

    // Evento de clique para o botão "Filtrar"
    const filtrarButton = document.getElementById('adminFiltrarProd');
    filtrarButton.addEventListener('click', function (event) {
      event.preventDefault();

      hideAllSections(); // Esconde todas as sections
      showSection('filtros'); // Mostra a secção de filtros
    });

    // Evento de clique para o botão "Editar produtos de utilizadores"
    const editarButton = document.getElementById('adminEditarProd');
    editarButton.addEventListener('click', function (event) {
      event.preventDefault();

      hideAllSections(); // Esconde todas as sections
      showSection('editarProdutos'); // Mostra a secção de editarProdutos
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

    // Função para exibir os utilizadores numa tabela
    function displayUsersTable(users) {
      console.log('Função displayUsersTable chamada');
      console.log('Dados dos utilizadores:', users);
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
                    <tr>
                      <td style="text-align: center;">${user.username}</td>
                      <td style="text-align: center;">${user.email}</td>
                      <td style="text-align: center;">
                        <div style="display: flex; justify-content: space-around; align-items: center;">
                          <button class="btn-card tabela-btn btn-danger redirect-user" data-user-id="${user.id}">Consultar perfil</button>
                          <button class="btn-card tabela-btn btn-info suspend-user" data-user-id="${user.id}">Apagar</button>
                          <button class="btn-card tabela-btn btn-edit" data-username="${user.username}">Excluir</button>
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

      // Adiciona event listeners para os botões "Consultar perfil"
      const redirectUserButtons = table.querySelectorAll('.redirect-user');
      redirectUserButtons.forEach(button => {
        button.addEventListener('click', function () {
          const userId = this.dataset.userId;
          console.log(
            `Redirecionar para o perfil do usuário com ID: ${userId}`
          );
          // Redirecionar para a página de perfil do usuário
          window.location.href = `http://localhost:8080/frontend/perfil-utilizador.html?id=${userId}`;
        });
      });

      // Adiciona event listeners para os botões "Apagar"
      const suspendUserButtons = table.querySelectorAll('.suspend-user');
      suspendUserButtons.forEach(button => {
        button.addEventListener('click', function () {
          const userId = this.dataset.userId;
          console.log(
            `Solicitar confirmação para suspender usuário com ID: ${userId}`
          );
          // Exibir modal de confirmação
          showConfirmationModal(userId);
        });
      });
    }

    // Função para exibir o modal de confirmação
    function showConfirmationModal(userId) {
      const modal = document.getElementById('confirmationModal');
      const confirmButton = document.getElementById('confirmButton');
      const cancelButton = document.getElementById('cancelButton');

      // Exibir o modal
      modal.style.display = 'block';

      // Adicionar event listeners aos botões do modal
      confirmButton.onclick = async function () {
        console.log(
          `Confirmação recebida. Suspender usuário com ID: ${userId}`
        );
        try {
          await suspendUser(userId);
          console.log(`Usuário com ID ${userId} suspenso com sucesso`);
          // Exibir alerta de sucesso
          alert('Usuário suspenso com sucesso!');
          // Recarregar a lista de usuários após a suspensão
          loadUsers();
        } catch (error) {
          console.error('Erro ao suspender o usuário:', error);
          // Tratar o erro conforme necessário
        } finally {
          // Fechar o modal
          modal.style.display = 'none';
        }
      };

      cancelButton.onclick = function () {
        console.log('Operação de suspensão cancelada');
        // Fechar o modal
        modal.style.display = 'none';
      };
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
