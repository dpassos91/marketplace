'use strict';

import * as userAPI from './api/userAPI.js';
import * as productAPI from './api/productAPI.js';

export async function loadCommonElements() {
  fetch('common/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
    })
    .then(() => {
      welcomeMessage();
    })
    .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
    .then(() => {
      addModalListeners();
    })
    .catch(error => console.error('Erro ao carregar o cabeçalho:', error));
  // Wait for 1 second
  fetch('common/newProductModal.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
    })
    .catch(error => console.error('Erro ao carregar o modal:', error));

  fetch('common/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Erro ao carregar o rodapé:', error));
}

async function welcomeMessage() {
  let user = null;
  const profilePicture = document.getElementById('profile-picture');
  const openModalBtn = document.getElementById('openModalBtn');
  const welcomeMessage = document.getElementById('welcome-message');
  const logoutButton = document.getElementById('botao-logout');
  const loginButton = document.getElementById('botao-login');

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
    welcomeMessage.innerHTML = `<a href="perfil-utilizador.html">Bem-vindo/a ${user.firstName} ${user.lastName}</a>!`;

    logoutButton.addEventListener('click', () => {
      sessionStorage.clear();
      window.location.href = 'index.html';
    });
  } else {
    openModalBtn.classList.add('hidden');
    loginButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
    welcomeMessage.classList.add('hidden');
    profilePicture.classList.add('hidden');
  }
}

async function addModalListeners() {
  const modal = document.getElementById('modal');
  const btn = document.getElementById('openModalBtn');
  const span = document.getElementsByClassName('close')[0];
  const cancel = document.getElementById('cancelar');
  const form = document.getElementById('form-novo-produto');

  // Clear any existing onclick handlers
  btn.onclick = null;
  span.onclick = null;
  cancel.onclick = null;
  window.onclick = null;

  btn.onclick = function () {
    modal.style.display = 'block';
    addNewProduct();
  };

  cancel.onclick = function () {
    modal.style.display = 'none';
    form.reset();
  };

  span.onclick = function () {
    modal.style.display = 'none';
    form.reset();
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      form.reset();
    }
  };
}

async function addNewProduct() {
  const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
  const form = document.getElementById('form-novo-produto');
  const modal = document.getElementById('modal');

  // Remove any existing event listeners before adding a new one
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Updated to match new IDs in newProductModal.html
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const categorySelect = document.getElementById('category');
    const categoryId = parseInt(categorySelect.value);
    const price = document.getElementById('price').value;
    const imageUrl = document.getElementById('imageURL').value;
    const location = document.getElementById('location').value;
    const publicationDate = new Date().toISOString().split('T')[0];

    // Create the product object according to your backend API expectations
    const newProduct = {
      title: title,
      description: description,
      categoryId: categoryId,
      price: parseFloat(price),
      imageUrl: imageUrl,
      location: location,
      publicationDate: publicationDate,
      sellerId: loggedInUser.id,
      active: true,
    };

    try {
      // Use the productAPI to create the product using the existing createProduct method
      const result = await productAPI.createProduct(newProduct);

      // Update user in session storage with the new product
      if (!loggedInUser.produtos) {
        loggedInUser.produtos = [];
      }
      loggedInUser.produtos.push(result);
      sessionStorage.setItem('user', JSON.stringify(loggedInUser));

      // Show success message
      alert('Produto criado com sucesso!');

      // Close modal and reset form
      modal.style.display = 'none';
      newForm.reset();

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Erro ao enviar o produto:', error);
      alert('Erro ao criar o produto. Por favor, tente novamente.');
    }
  });

  // Load categories for the dropdown
  try {
    const categories = await categoryAPI.getAllCategories();
    // Updated to match new ID in newProductModal.html
    const categorySelect = document.getElementById('category');

    // Clear existing options except the first one
    while (categorySelect.options.length > 1) {
      categorySelect.remove(1);
    }

    // Add new options
    if (categories && categories.length > 0) {
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}
