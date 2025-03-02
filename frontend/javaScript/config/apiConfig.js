'use strict';

/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Base URL
const API_BASE_URL = 'http://localhost:8080/jorge-nuno-diogo-proj3/rest';

// API Endpoints
const API_ENDPOINTS = {
  // Product endpoints
  products: {
    base: `${API_BASE_URL}/products`,
    all: `${API_BASE_URL}/products`, // Get all products endpoint
    active: `${API_BASE_URL}/products/active`, // Get all active products
    byId: id => `${API_BASE_URL}/products/${id}`,
    create: `${API_BASE_URL}/products`,
    update: id => `${API_BASE_URL}/products/${id}`,
    delete: id => `${API_BASE_URL}/products/${id}`,
    paginated: (page = 0, size = 10) =>
      `${API_BASE_URL}/products/paginated?page=${page}&size=${size}`,
    count: `${API_BASE_URL}/products/count`, // Get total number of products
    activeCount: `${API_BASE_URL}/products/active/count`, // Get count of active products
    byCategory: categoryId => `${API_BASE_URL}/products/category/${categoryId}`,
    bySeller: sellerId => `${API_BASE_URL}/products/seller/${sellerId}`,
    search: title =>
      `${API_BASE_URL}/products/search?title=${encodeURIComponent(title)}`, // Search by title
    byLocation: location =>
      `${API_BASE_URL}/products/location/${encodeURIComponent(location)}`,
    byStatus: status => `${API_BASE_URL}/products/status/${status}`,
    updateStatus: (productId, stateId) =>
      `${API_BASE_URL}/products/${productId}/status/${stateId}`,
    purchase: (productId, buyerId) =>
      `${API_BASE_URL}/products/${productId}/purchase/${buyerId}`, // Endpoint for purchasing products
  },

  // User endpoints
  users: {
    base: `${API_BASE_URL}/users`,
    login: `${API_BASE_URL}/users/login`,
    register: `${API_BASE_URL}/users/register`,
    logout: `${API_BASE_URL}/users/logout`,
    byId: id => `${API_BASE_URL}/users/${id}`,
    update: id => `${API_BASE_URL}/users/${id}`,
    delete: id => `${API_BASE_URL}/users/${id}`,
    byUsername: username => `${API_BASE_URL}/users/username/${username}`,
  },

  // Category endpoints
  categories: {
    all: `${API_BASE_URL}/categories`,
    byId: id => `${API_BASE_URL}/categories/${id}`,
    byName: name => `${API_BASE_URL}/categories/name/${name}`,
    create: `${API_BASE_URL}/categories`,
    update: id => `${API_BASE_URL}/categories/${id}`,
    delete: id => `${API_BASE_URL}/categories/${id}`,
    paginated: (page, size) =>
      `${API_BASE_URL}/categories/paginated?page=${page}&size=${size}`,
    count: `${API_BASE_URL}/categories/count`,
  },

  // Evaluation endpoints
  evaluations: {
    bySeller: sellerId => `${API_BASE_URL}/evaluations/seller/${sellerId}`,
    byId: id => `${API_BASE_URL}/evaluations/${id}`,
    create: `${API_BASE_URL}/evaluations`,
    update: id => `${API_BASE_URL}/evaluations/${id}`,
    delete: id => `${API_BASE_URL}/evaluations/${id}`,
  },
};

// HTTP request default options
const DEFAULT_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export { API_BASE_URL, API_ENDPOINTS, DEFAULT_OPTIONS };
