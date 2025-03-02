'use strict';

import * as productAPI from './api/productAPI.js';
import * as categoryAPI from './api/categoryAPI.js';

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
    addModalListeners();

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
  const cancel = document.getElementById('newProductFormCancelBtn');
  const form = document.getElementById('form-novo-produto');

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
  // Get the current user from session storage
  const user = JSON.parse(sessionStorage.getItem('user'));
  const form = document.getElementById('form-novo-produto');
  const modal = document.getElementById('modal');

  if (!user || !user.id) {
    alert('You must be logged in to add a product');
    modal.style.display = 'none';
    return;
  }

  // Remove any existing event listeners before adding a new one
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form field values
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
      sellerId: user.id,
      active: true,
    };

    try {
      // Disable the submit button to prevent multiple submissions
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
      }

      // Create the product using the API
      await productAPI.createProduct(newProduct);

      // Show success message
      alert('Product created successfully!');

      // Close modal and reset form
      modal.style.display = 'none';
      newForm.reset();

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');

      // Re-enable the submit button on error
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
    }
  });

  // Load categories for the dropdown
  try {
    const categories = await categoryAPI.getAllCategories();
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
    console.error('Error loading categories:', error);
  }
}
