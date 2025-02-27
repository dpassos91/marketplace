'use strict';

import { API_ENDPOINTS, DEFAULT_OPTIONS } from '../config/apiConfig.js';

// Product API functions
export async function getAllProducts() {
  try {
    const response = await fetch(API_ENDPOINTS.products.all, {
      method: 'GET',
      headers: DEFAULT_OPTIONS.headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getProductById(produtoId) {
  try {
    const response = await fetch(API_ENDPOINTS.products.byId(produtoId), {
      method: 'GET',
      headers: DEFAULT_OPTIONS.headers,
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar o produto: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar o produto:', error);
    return null;
  }
}

export async function updateProduct(produtoId, updatedProduct) {
  try {
    const response = await fetch(API_ENDPOINTS.products.update(produtoId), {
      method: 'PUT',
      headers: DEFAULT_OPTIONS.headers,
      body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar o produto: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
    throw error;
  }
}

export async function deleteProduct(produtoId) {
  try {
    const response = await fetch(API_ENDPOINTS.products.delete(produtoId), {
      method: 'DELETE',
      headers: DEFAULT_OPTIONS.headers,
    });

    if (!response.ok) {
      throw new Error(`Erro ao eliminar o produto: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Erro ao eliminar o produto:', error);
    throw error;
  }
}

export async function sendNewProductReq(product) {
  try {
    const response = await fetch(API_ENDPOINTS.products.create, {
      method: 'POST',
      headers: DEFAULT_OPTIONS.headers,
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar o produto: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar o produto:', error);
    throw error;
  }
}
