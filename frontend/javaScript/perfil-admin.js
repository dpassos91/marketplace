'use strict';

import { loadCommonElements } from './loadCommons.js';
import { getTotalUsers } from './api/userAPI.js';

async function initPage() {
  try {
    await loadCommonElements();
    console.log('Elementos comuns carregados com sucesso');

    const links = document.querySelectorAll('.admin-sidebar a');
    const sections = document.querySelectorAll('.admin-content > section');

    // Função para esconder todas as sections
    function hideAllSections() {
      console.log("Escondendo todas as secções");
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
          showUserManagementButtons(); // Mostra os botões de gestão de utilizadores
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
        const users = await getTotalUsers(); // Usa a função getTotalUsers para obter os utilizadores
        console.log('Utilizadores obtidos:', users);
        if (!Array.isArray(users)) {
          throw new Error('Formato de dados inesperado');
        }
        displayUsersTable(users); // Chama a função para exibir a tabela de utilizadores
      } catch (error) {
        console.error('Erro:', error);
      }
    }

    // Função para exibir os utilizadores numa tabela
    function displayUsersTable(users) {
      console.log('Função displayUsersTable chamada');
      console.log('Dados dos utilizadores:', users);
      const container = document.getElementById('tabelaUtilizadores'); // Alterado para o novo container
      console.log('Contêiner da tabela de utilizadores:', container);
      container.innerHTML = ''; // Limpa o container
      
      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>${user.firstName} ${user.lastName}</td>
            </tr>
          `).join('')}
        </tbody>
      `;
      console.log('Tabela criada:', table);
      container.appendChild(table);
      console.log('Tabela adicionada ao contêiner');
    }

    // Função para mostrar os botões de gestão de utilizadores
    function showUserManagementButtons() {
      const userManagementButtons = document.querySelector('.user-management-buttons');
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

document.addEventListener('DOMContentLoaded', initPage);



