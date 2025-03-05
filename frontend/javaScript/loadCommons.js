'use strict';

import { handleLogout } from './components/userComponent.js';
import { addModalListeners } from './components/modalComponent.js';

export async function loadCommonElements() {
  try {
    // Load header
    const headerResponse = await fetch('common/header.html');
    const headerData = await headerResponse.text();
    document.getElementById('header').innerHTML = headerData;

    // Setup welcome message
    await welcomeMessage();

    // Load modal
    const modalResponse = await fetch('common/newProductModal.html');
    const modalData = await modalResponse.text();
    document.body.insertAdjacentHTML('beforeend', modalData);

    // Add event listeners after both header and modal are loaded
    await addModalListeners();

    // Load footer
    const footerResponse = await fetch('common/footer.html');
    const footerData = await footerResponse.text();
    document.getElementById('footer').innerHTML = footerData;
  } catch (error) {
    console.error('Error loading common elements:', error);
  }
}

async function welcomeMessage() {
  let user = null;
  const profilePicture = document.getElementById('profile-picture');
  const openModalBtn = document.getElementById('openModalBtn');
  const welcomeMessage = document.getElementById('welcome-message');
  const logoutButton = document.getElementById('botao-logout');
  const loginButton = document.getElementById('botao-login');
  const adminButton = document.getElementById('adminBtn');

  try {
    user = JSON.parse(sessionStorage.getItem('user'));
  } catch (error) {
    console.error('Erro a ler user da sessionStorage', error);
  }

  if (user) {
    openModalBtn.classList.remove('hidden');
    welcomeMessage.classList.remove('hidden');
    logoutButton.classList.remove('hidden');
    loginButton.classList.add('hidden');
    profilePicture.classList.remove('hidden');
    profilePicture.src = user.picture;

    if (user.admin) {
      adminButton.classList.remove('hidden');
      adminButton.addEventListener('click', () => {
        window.location.href = 'perfil-admin.html';
      });
    } else {
      adminButton.classList.add('hidden');
    }

    // Update the welcome message link to include user ID
    welcomeMessage.innerHTML = `<a href="perfil-utilizador.html?id=${user.id}">Bem-vindo/a ${user.firstName} ${user.lastName}</a>!`;

    logoutButton.addEventListener('click', async () => {
      await handleLogout();
      window.location.href = 'index.html';
    });
  } else {
    openModalBtn.classList.add('hidden');
    loginButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
    welcomeMessage.classList.add('hidden');
    profilePicture.classList.add('hidden');
    adminButton.classList.add('hidden');
  }
}
