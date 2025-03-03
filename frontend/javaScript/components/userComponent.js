'use strict';

import * as userAPI from '../api/userAPI.js';
import * as productAPI from '../api/productAPI.js';
import * as productComponent from './productComponent.js';
import { logout, setCurrentUser, getCurrentUser } from '../utils/authUtils.js';
import { loadSellerEvaluations } from './evaluationComponent.js';

export async function submitLoginForm() {
  const credentials = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
  };

  try {
    const userData = await userAPI.loginUser(credentials);

    setCurrentUser(userData);

    alert('Login bem sucedido! Bem-vindo/a, ' + userData.firstName);
    console.log('login successful', userData);

    window.location.href = 'index.html';
  } catch (error) {
    alert('Login falhou! Por favor verifique as suas credenciais.');
    console.error(error);
  }
}

export async function displayUser() {
  // TODO: comentei a instrução anterior que ia buscar os detalhes à sessionStorage
  // const user = getCurrentUser();

  const userData = sessionStorage.getItem('user');
  const user = JSON.parse(userData);

  // TODO: log depuração
  console.log('user: ', user);

  const userId = user.id;
  // TODO: log depuração
  console.log('userId: ', userId);

  const userDetails = await userAPI.getUserById(userId); // agora vai buscar os detalhes a esta função
  // TODO: log depuração
  console.log('userDetails: ', userDetails);
  if (!user) {
    document.getElementById('perfil-utilizador').innerHTML =
      '<p>Utilizador não encontrado</p>';
    return;
  }

  // TODO: logs de depuração:
  console.log('First Name:', userDetails.firstName);
  console.log('Last Name:', userDetails.lastName);
  console.log('Username:', userDetails.username);
  console.log('Phone:', userDetails.phone);
  console.log('Email:', userDetails.email);
  console.log('Picture URL:', userDetails.picture);

  // TODO: Verificar se os campos do formulário existem antes de tentar preencher
  console.log('Verificando elementos do DOM:');
  console.log('firstName:', document.getElementById('firstName'));
  console.log('lastName:', document.getElementById('lastName'));
  console.log('username:', document.getElementById('username'));
  console.log('phone:', document.getElementById('phone'));
  console.log('email:', document.getElementById('email'));
  console.log('picture:', document.getElementById('picture'));
  console.log('imagem-perfil:', document.querySelector('.imagem-perfil'));

  document.getElementById('firstName').value = userDetails.firstName;
  document.getElementById('lastName').value = userDetails.lastName;
  document.getElementById('username').value = userDetails.username;
  document.getElementById('phone').value = userDetails.phone;
  document.getElementById('email').value = userDetails.email;
  document.getElementById('picture').value = userDetails.picture;
  document.querySelector('.imagem-perfil').src = userDetails.picture;

  // TODO: o objeto user também vai trazer consigo a confirmação de se o user é Admin (usar isso para moldar a página consoante)

  const productsContainer = document.querySelector('.card-container');
  productsContainer.innerHTML = '';

  try {
    // Fetch products by seller ID from the API
    const products = await productAPI.getProductsBySeller(user.id);

    if (!products || products.length === 0) {
      productsContainer.innerHTML =
        '<h2>Ainda não adicionou nenhum produto para venda!</h2>';
    } else {
      products.forEach(product => {
        const card = productComponent.createCard(product);
        productsContainer.appendChild(card);
      });
    }
  } catch (error) {
    console.error('Error fetching user products:', error);
    productsContainer.innerHTML =
      '<h2>Não foi possível carregar os produtos</h2>';
  }
  loadSellerEvaluations(user.id, '#evaluationsContainer');
}

export async function toggleFormUserEdit() {
  document
    .getElementById('toggle-readonly')
    .addEventListener('click', function () {
      const formElements = document.querySelectorAll('#perfil-form input');
      const passwordWrapper = document.querySelector('.password-wrapper');
      const confirmPasswordWrapper = document.querySelector(
        '.confirm-password-wrapper'
      );
      const saveChangesToUser = document.querySelector('.save-user-changes');

      let isReadOnly = true;

      formElements.forEach(element => {
        if (element.id !== 'username') {
          if (element.hasAttribute('readonly')) {
            element.removeAttribute('readonly');
            isReadOnly = false;
          } else {
            element.setAttribute('readonly', 'readonly');
          }
        }
      });

      if (isReadOnly) {
        passwordWrapper.classList.add('hidden');
        confirmPasswordWrapper.classList.add('hidden');
        saveChangesToUser.classList.add('hidden');
      } else {
        passwordWrapper.classList.remove('hidden');
        confirmPasswordWrapper.classList.remove('hidden');
        saveChangesToUser.classList.remove('hidden');
        updateExistentUser();
      }

      const button = document.getElementById('toggle-readonly');
      if (isReadOnly) {
        button.textContent = 'Editar';
      } else {
        button.textContent = 'Cancelar';
      }
    });
}

export async function addNewUser() {
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  passwordInput.addEventListener('input', validatePasswords);
  confirmPasswordInput.addEventListener('input', validatePasswords);

  function validatePasswords() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      confirmPasswordInput.setCustomValidity(
        'A password deve ter pelo menos 8 caracteres, incluindo números e letras.'
      );
    } else if (password !== confirmPassword) {
      confirmPasswordInput.setCustomValidity('As passwords não coincidem.');
    } else {
      confirmPasswordInput.setCustomValidity('');
    }
  }

  document
    .getElementById('formulario_novo_registo')
    .addEventListener('submit', async function (event) {
      event.preventDefault();

      if (validateFormPassword() === true) {
        const username = document.getElementById('username').value;
        // Verificar se o username já existe
        const usernameExists = await userAPI.checkUsername(username);
        if (usernameExists) {
          const usernameInput = document.getElementById('username');
          usernameInput.setCustomValidity(
            'O username já existe. Por favor escolha outro.'
          );
          usernameInput.reportValidity();
          return;
        }

        const newUser = {
          firstName: document.getElementById('primeiro nome').value,
          lastName: document.getElementById('ultimo nome').value,
          username: document.getElementById('username').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
          phone: document.getElementById('telefone').value,
          picture: document.getElementById('fotografia').value,
        };

        try {
          await userAPI.registerUser(newUser);
          alert('Utilizador registado! Bem-vindo/a, ' + newUser.firstName);
          window.location.href = 'pagina-login.html';
        } catch (error) {
          alert('Erro ao registar utilizador. Tente novamente.');
          console.error(error);
        }
      } else {
        alert('Erro ao registar utilizador. Tente novamente.');
        return;
      }
    });
}

export function validateFormPassword() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!passwordRegex.test(password)) {
    alert(
      'A password deve ter pelo menos 8 caracteres, incluindo números e letras.'
    );
    return false;
  }

  if (password !== confirmPassword) {
    alert('As passwords não coincidem.');
    return false;
  }

  return true;
}

export async function updateExistentUser() {
  let updatedUser = {};
  const loggedInUser = getCurrentUser();
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  passwordInput.addEventListener('input', validatePasswords);
  confirmPasswordInput.addEventListener('input', validatePasswords);

  function validatePasswords() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      confirmPasswordInput.setCustomValidity(
        'A password deve ter pelo menos 8 caracteres, incluindo números e letras.'
      );
    } else if (password !== confirmPassword) {
      confirmPasswordInput.setCustomValidity('As passwords não coincidem.');
    } else {
      confirmPasswordInput.setCustomValidity('');
      updatedUser = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        username: loggedInUser.username, // Username não pode ser alterado
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        picture: document.getElementById('picture').value,
        password: password,
      };
      console.log('As passwords foram validadas');
      console.log(updatedUser);
    }
  }

  const userData = sessionStorage.getItem('user');
  const user = JSON.parse(userData);

  const userId = user.id;

  document
    .getElementById('perfil-form')
    .addEventListener('submit', async function (event) {
      event.preventDefault();

      if (validateFormPassword() == true) {
        try {
          const result = await userAPI.updateUser(userId, updatedUser);
          if (result.produtos && result.produtos.length > 0) {
            const userProducts = await productComponent.getProductsByIds(
              result.produtos
            );
            result.produtos = userProducts;
          } else {
            result.produtos = [];
          }
          alert('Dados atualizados com sucesso!');
          setCurrentUser(result);
          window.location.reload();
        } catch (error) {
          alert('Erro ao atualizar os dados. Tente novamente.');
          console.error(error);
        }
      }
    });
}

export async function handleLogout() {
  try {
    await userAPI.logoutUser();
    logout(); // This will clear both token and user data
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

export async function hardDeleteUser() {
  const urlParams = new URLSearchParams(window.location.search);
  const userId =  urlParams.get("id");

  if (!userId) {
    alert('Invalid user ID!');
    return;
  }

  try {
    await userAPI.deleteUser(userId);

    alert('User deleted with success!');

    window.location.href = 'perfil-admin.html';
  } catch (error) {
    alert('Error trying to delete user. Please try again!');
    console.error(error);
  }
}

export async function softDeleteUser() {
  const urlParams = new URLSearchParams(window.location.search);
  const userId =  urlParams.get("id");

  if (!userId) {
    alert('Invalid user ID!');
    return;
  }

  try {
    await userAPI.suspendUser(userId);

    alert('User suspended with success!');

    window.location.href = 'perfil-admin.html';
  } catch (error) {
    alert('Error trying to delete user. Please try again!');
    console.error(error);
  }
}