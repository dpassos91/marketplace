'use strict';

import { loadCommonElements } from './loadCommons.js';

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
          targetId = 'utilizadores';
        } else if (targetId === 'gestao-produtos') {
          targetId = 'produtos';
        } else if (targetId === 'ver-dashboard') {
          targetId = 'dashboard';
          displayUserCards(users); // Carrega os cartões de utilizadores ao carregar o dashboard
        } else if (targetId === 'gestao-avaliacoes') {
          targetId = 'avaliacoes';
        }
        document.getElementById(targetId).classList.remove('hidden');
      });
    });

    // Evento de clique para o botão "Filtrar"
    const filtrarButton = document.getElementById('adminFiltrarProd');
    filtrarButton.addEventListener('click', function (event) {
      event.preventDefault();

      hideAllSections(); // Esconde todas as sections

      // Mostra a secção de filtros
      document.getElementById('filtros').classList.remove('hidden');
    });

    // Evento de clique para o botão "Editar produtos de utilizadores"
    const editarButton = document.getElementById('adminEditarProd');
    editarButton.addEventListener('click', function (event) {
      event.preventDefault();

      hideAllSections(); // Esconde todas as sections

      // Mostra a secção de editarProdutos
      document.getElementById('editarProdutos').classList.remove('hidden');
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

    // Simular uma lista de utilizadores (você pode substituir isso com uma chamada à sua API)
    const users = [
      { id: 1, nome: 'Utilizador 1', email: 'user1@example.com', cargo: 'Administrador', dataDeCriacao: '2025-03-01' },
      { id: 2, nome: 'Utilizador 2', email: 'user2@example.com', cargo: 'Editor', dataDeCriacao: '2025-02-15' },
      // Adicione mais utilizadores conforme necessário
    ];

    // Chame a função para exibir os cartões de utilizadores quando a página for carregada
    displayUserCards(users);

  } catch (error) {
    console.error('Erro ao inicializar a página:', error);
  }
}

document.addEventListener('DOMContentLoaded', initPage);
