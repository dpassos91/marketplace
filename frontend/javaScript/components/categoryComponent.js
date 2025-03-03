'use strict';

import * as categoryAPI from '../api/categoryAPI.js';

export function createCategoryCard(category) {
  const card = document.createElement('div');
  card.className = 'card category-card';

  const imageUrl =
    category.imageUrl ||
    'https://ps.w.org/gazchaps-woocommerce-auto-category-product-thumbnails/assets/icon-256x256.png?rev=1848416';

  card.innerHTML = `
    <img src="${imageUrl}" alt="${category.name}" />
    <div>
      <h1>${category.name}</h1>
      <p>${category.description || 'Explore produtos desta categoria'}</p>
      <button type="button" title="Ver produtos">Ver produtos</button>
    </div>
  `;

  const button = card.querySelector('button');
  button.addEventListener('click', () => {
    window.location.href = `produto-total.html?category=${category.id}`;
  });

  return card;
}

export async function displayCategories() {
  const container = document.querySelector('.categories-container');
  if (!container) return;

  try {
    const categories = await categoryAPI.getAllCategories();

    // Create carousel structure
    container.innerHTML = `
      <div class="categories-carousel-wrapper">
        <button class="carousel-control prev">&lt;</button>
        <div class="categories-carousel">
          <div class="categories-carousel-inner"></div>
        </div>
        <button class="carousel-control next">&gt;</button>
      </div>
    `;

    const carouselInner = container.querySelector('.categories-carousel-inner');
    const prevButton = container.querySelector('.carousel-control.prev');
    const nextButton = container.querySelector('.carousel-control.next');

    if (categories.length === 0) {
      carouselInner.innerHTML = '<p>Nenhuma categoria disponível.</p>';
      return;
    }

    categories.forEach(category => {
      const card = createCategoryCard(category);
      carouselInner.appendChild(card);
    });

    // Add event listeners for navigation buttons
    prevButton.addEventListener('click', () => {
      carouselInner.scrollBy({ left: -300, behavior: 'smooth' });
    });

    nextButton.addEventListener('click', () => {
      carouselInner.scrollBy({ left: 300, behavior: 'smooth' });
    });
  } catch (error) {
    console.error('Error displaying categories:', error);
    container.innerHTML = '<p>Erro ao carregar categorias.</p>';
  }
}

// Function to filter products by category ID
export async function displayProductsByCategory(products, categoryId) {
  const container = document.querySelector('.product-list');
  if (!container) return;

  try {
    // Get category details
    const category = await categoryAPI.getCategoryById(categoryId);

    // Filter products by the selected category
    const filteredProducts = products.filter(
      product =>
        product.categoryId === categoryId || product.category.id === categoryId
    );

    // Update page heading if possible
    const pageHeading = document.querySelector('main h1');
    if (pageHeading && category) {
      pageHeading.textContent = `Produtos - ${category.name}`;
    }

    container.innerHTML = '';

    if (filteredProducts.length === 0) {
      container.innerHTML =
        '<p class="no-products-message">Nenhum produto disponível nesta categoria.</p>';
      return;
    }

    return filteredProducts;
  } catch (error) {
    console.error('Error filtering products by category:', error);
    container.innerHTML =
      '<p class="error-message">Erro ao carregar produtos desta categoria.</p>';
    return [];
  }
}
