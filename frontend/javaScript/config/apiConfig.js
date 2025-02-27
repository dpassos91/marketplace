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
    all: `${API_BASE_URL}/products/all`,
    byId: id => `${API_BASE_URL}/products/${id}`,
    create: `${API_BASE_URL}/products`,
    update: id => `${API_BASE_URL}/products/${id}`,
    delete: id => `${API_BASE_URL}/products/${id}`,
    mostRecent: `${API_BASE_URL}/products/recent`,
    mostRated: `${API_BASE_URL}/products/rated`,
  },

  // User endpoints
  users: {
    base: `${API_BASE_URL}/users`,
    login: `${API_BASE_URL}/users/login`,
    register: `${API_BASE_URL}/users/register`,
    byUsername: username => `${API_BASE_URL}/users/${username}`,
    update: username => `${API_BASE_URL}/users/${username}`,
    checkUsername: `${API_BASE_URL}/users/check-username`,
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
