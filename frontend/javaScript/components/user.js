'use strict';

import * as userAPI from '../api/userAPI.js';
import * as productAPI from '../api/productAPI.js';
import * as productComponent from './product.js';

export async function submitLoginForm() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  try {
    const result = await userAPI.loginUser(username, password);
    alert('Login bem sucedido! Bem- vindo/a, ' + result.nome);
    console.log('login successful', result);

    const userProducts = await productComponent.getProductsByIds(
      result.produtos
    );
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        username: result.username,
        password: result.password,
        nome: result.nome,
        email: result.email,
        telefone: result.telefone,
        localizacao: result.localizacao,
        imagem: result.imagem,
        produtos: userProducts,
      })
    );
    window.location.href = 'index.html';
  } catch (error) {
    alert('Login falhou! Por favor verifique as suas credenciais.');
    console.error(error);
  }
}

export async function displayUser() {
  const user = JSON.parse(sessionStorage.getItem('user')) || [];
  if (!user) {
    document.getElementById('perfil-utilizador').innerHTML =
      '<p>Utilizador não encontrado</p>';
    return;
  }
  document.getElementById('nome').value = user.nome;
  document.getElementById('username').value = user.username;
  document.getElementById('telefone').value = user.telefone;
  document.getElementById('email').value = user.email;
  document.getElementById('profile-pic').value = user.imagem;
  document.querySelector('.imagem-perfil').src = user.imagem;

  const productsContainer = document.querySelector('.card-container');
  productsContainer.innerHTML = '';
  const products = user.produtos || [];
  if (products.length === 0) {
    productsContainer.innerHTML =
      '<h2>Ainda não adicionou nenhum produto para venda!</h2>';
  } else {
    products.forEach(product => {
      const card = productComponent.createCard(product);
      productsContainer.appendChild(card);
    });
  }
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
        const usernameExists = await userAPI.checkUsernameExists(username);
        if (usernameExists) {
          const usernameInput = document.getElementById('username');
          usernameInput.setCustomValidity(
            'O username já existe. Por favor escolha outro.'
          );
          usernameInput.reportValidity();
          return;
        }

        const newUser = {
          nome: document.getElementById('nome').value,
          username: document.getElementById('username').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
          telefone: document.getElementById('telefone').value,
          imagem: document.getElementById('fotografia').value,
        };

        try {
          await userAPI.registerUser(newUser);
          alert('Utilizador registado! Bem-vindo/a, ' + newUser.nome);
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
  const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
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
        nome: document.getElementById('nome').value,
        username: loggedInUser.username, // Username não pode ser alterado
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        imagem: document.getElementById('profile-pic').value,
        password: password,
      };
      console.log('As passwords foram validadas');
      console.log(updatedUser);
    }
  }

  document
    .getElementById('perfil-form')
    .addEventListener('submit', async function (event) {
      event.preventDefault();

      if (validateFormPassword() == true) {
        try {
          const result = await userAPI.updateUser(updatedUser);
          if (result.produtos && result.produtos.length > 0) {
            const userProducts = await productComponent.getProductsByIds(
              result.produtos
            );
            result.produtos = userProducts;
          } else {
            result.produtos = [];
          }
          alert('Dados atualizados com sucesso!');
          sessionStorage.setItem('user', JSON.stringify(result));
          window.location.reload();
        } catch (error) {
          alert('Erro ao atualizar os dados. Tente novamente.');
          console.error(error);
        }
      }
    });
}
