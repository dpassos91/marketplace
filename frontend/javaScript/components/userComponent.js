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
    alert(
      `Login bem sucedido! Bem-vindo/a ${userData.firstName} ${userData.lastName}!`
    );
    window.location.href = 'index.html';
  } catch (error) {
    alert('Login falhou! Por favor verifique as suas credenciais.');
    console.error(error);
  }
}

export async function displayUserProfile() {
  // Check if we're viewing a specific user profile from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const profileUserId = urlParams.get('id');

  // Get the current logged-in user
  const currentUser = getCurrentUser();

  // Determine which user profile to display
  let userToDisplay;
  let isOwnProfile = false;

  if (profileUserId) {
    // We're viewing a specific user's profile
    userToDisplay = await userAPI.getUserById(profileUserId);

    // Convert both IDs to strings before comparison
    isOwnProfile =
      currentUser && String(currentUser.id) === String(profileUserId);
  } else if (currentUser) {
    // No ID in URL, display the logged-in user's profile
    userToDisplay = await userAPI.getUserById(currentUser.id);
    isOwnProfile = true;
  } else {
    // No ID and no logged-in user - redirect to login
    window.location.href = 'pagina-login.html';
    return;
  }

  if (!userToDisplay) {
    document.getElementById('perfil-utilizador').innerHTML =
      '<p>Utilizador não encontrado</p>';
    return;
  }

  // Update UI based on whose profile we're viewing
  updateProfileUI(userToDisplay, isOwnProfile);

  // Load products for the displayed user
  await loadUserProducts(userToDisplay.id, isOwnProfile);

  // Load evaluations for the displayed user
  loadSellerEvaluations(userToDisplay.id, '#evaluationsContainer');

  // Only attach edit handlers if viewing own profile
  if (isOwnProfile) {
    setupProfileEditHandlers(userToDisplay.id);
  }
}

/**
 * Loads and displays products associated with a specific user
 * @param {string|number} userId - The ID of the user whose products to load
 * @param {boolean} isOwnProfile - Whether this is the current user's own profile
 */
async function loadUserProducts(userId, isOwnProfile) {
  try {
    // Get the container where products will be displayed
    const container = document.querySelector('.card-container');
    if (!container) return;

    // Fetch user's products from the API
    const products = await productAPI.getProductsBySeller(userId);

    // Clear previous content
    container.innerHTML = '';

    // Display message if no products
    if (products.length === 0) {
      container.innerHTML =
        '<p class="no-products-message">' +
        (isOwnProfile
          ? 'Não tem produtos para venda.'
          : 'Este utilizador não tem produtos para venda.') +
        '</p>';
      return;
    }

    // Create and append product cards
    products.forEach(product => {
      const card = productComponent.createCard(product);
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading user products:', error);
    document.querySelector('.card-container').innerHTML =
      '<p class="error-message">Erro ao carregar produtos.</p>';
  }
}

// Helper function to update profile UI elements
function updateProfileUI(user, isOwnProfile) {
  // Update the header text
  const productsHeader = document.querySelector('#productsHeader');
  if (productsHeader) {
    productsHeader.textContent = isOwnProfile
      ? 'Os meus Produtos'
      : 'Produtos deste vendedor';
  }

  // Update form fields
  document.getElementById('firstName').value = user.firstName;
  document.getElementById('lastName').value = user.lastName;
  document.getElementById('username').value = user.username;
  document.getElementById('phone').value = user.phone;
  document.getElementById('email').value = user.email;
  document.getElementById('picture').value = user.picture;

  // Update profile picture
  const profileImage = document.querySelector('.imagem-perfil');
  if (profileImage) {
    profileImage.src = user.picture;
  }

  // Show/hide edit buttons based on profile ownership
  const editButton = document.getElementById('toggle-readonly');
  const formInputs = document.querySelectorAll('#perfil-form input');
  const saveButton = document.querySelector('.save-user-changes');

  if (!isOwnProfile) {
    // Hide edit and save buttons
    if (editButton) editButton.classList.add('hidden');
    if (saveButton) saveButton.classList.add('hidden');

    // Ensure all fields are readonly
    formInputs.forEach(input => {
      input.setAttribute('readonly', 'readonly');
    });
  }

  // Always hide password fields initially
  const passwordWrapper = document.querySelector('.password-wrapper');
  const confirmPasswordWrapper = document.querySelector(
    '.confirm-password-wrapper'
  );
  if (passwordWrapper) passwordWrapper.classList.add('hidden');
  if (confirmPasswordWrapper) confirmPasswordWrapper.classList.add('hidden');
}

// New function to set up edit handlers for own profile
function setupProfileEditHandlers(userId) {
  const editButton = document.getElementById('toggle-readonly');
  const saveButton = document.querySelector('.save-user-changes');
  const passwordWrapper = document.querySelector('.password-wrapper');
  const confirmPasswordWrapper = document.querySelector(
    '.confirm-password-wrapper'
  );
  const formInputs = document.querySelectorAll('#perfil-form input');

  let isEditMode = false;

  // Set up edit toggle button
  editButton.addEventListener('click', function () {
    isEditMode = !isEditMode;

    // Toggle readonly attribute on input fields (except username)
    formInputs.forEach(input => {
      if (input.id !== 'username') {
        if (isEditMode) {
          input.removeAttribute('readonly');
        } else {
          input.setAttribute('readonly', 'readonly');
        }
      }
    });

    // Toggle visibility of password fields and save button
    if (isEditMode) {
      passwordWrapper.classList.remove('hidden');
      confirmPasswordWrapper.classList.remove('hidden');
      saveButton.classList.remove('hidden');
      editButton.textContent = 'Cancelar';
    } else {
      passwordWrapper.classList.add('hidden');
      confirmPasswordWrapper.classList.add('hidden');
      saveButton.classList.add('hidden');
      editButton.textContent = 'Editar Informação do Utilizador';
    }
  });

  // Set up form submission
  const form = document.getElementById('perfil-form');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!validateFormPassword()) {
      return;
    }

    const updatedUser = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      picture: document.getElementById('picture').value,
      password: document.getElementById('password').value,
    };

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
  });

  // Set up password validation
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  passwordInput.addEventListener('input', validatePasswordFields);
  confirmPasswordInput.addEventListener('input', validatePasswordFields);
}

function validatePasswordFields() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const confirmPasswordInput = document.getElementById('confirm-password');

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

// Keep the existing validateFormPassword function
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
  const userId = urlParams.get('id');

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
  const userId = urlParams.get('id');

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
