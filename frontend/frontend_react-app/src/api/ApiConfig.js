/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Base URL
const API_BASE_URL = 'http://localhost:8080/diogo-proj4/rest';

// API Endpoints
const API_ENDPOINTS = {
  // Product endpoints
  products: {
    base: `${API_BASE_URL}/products`,
    all: `${API_BASE_URL}/products`, // Get all products endpoint
    active: `${API_BASE_URL}/products/active`, // Get all active products
    edited: `${API_BASE_URL}/products/edited`, // Get all edited products
    byId: id => `${API_BASE_URL}/products/${id}`,
    create: `${API_BASE_URL}/products`,
    update: id => `${API_BASE_URL}/products/${id}`,
    deactivate: id => `${API_BASE_URL}/products/${id}/deactivate`,
    permanentDelete: id => `${API_BASE_URL}/products/${id}/permanent`,
    inactive: `${API_BASE_URL}/products/inactive`, // For listing inactive products
    reactivate: (id, stateId) =>
      `${API_BASE_URL}/products/${id}/reactivate/${stateId}`,
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
    all: `${API_BASE_URL}/users`,
    login: `${API_BASE_URL}/users/login`,
    register: `${API_BASE_URL}/users/register`,
    logout: `${API_BASE_URL}/users/logout`,
    byId: id => `${API_BASE_URL}/users/${id}`,
    update: id => `${API_BASE_URL}/users/${id}`,
    delete: id => `${API_BASE_URL}/users/${id}`,
    byUsername: username => `${API_BASE_URL}/users/username/${username}`,
    suspend: id => `${API_BASE_URL}/users/${id}/suspend`,
    reactivate: id => `${API_BASE_URL}/users/${id}/activate`,
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
    byId: id => `${API_BASE_URL}/evaluations/${id}`,
    create: `${API_BASE_URL}/evaluations`,
    update: id => `${API_BASE_URL}/evaluations/${id}`,
    delete: id => `${API_BASE_URL}/evaluations/${id}`,
    hasEvaluated: (buyerId, sellerId, productId) =>
      `${API_BASE_URL}/evaluations/check?buyerId=${buyerId}&sellerId=${sellerId}&productId=${productId}`,
    all: `${API_BASE_URL}/evaluations`,
    byEvaluator: evaluatorId =>
      `${API_BASE_URL}/evaluations/evaluator/${evaluatorId}`,
    byEvaluated: evaluatedId =>
      `${API_BASE_URL}/evaluations/evaluated/${evaluatedId}`,
    averageRating: userId =>
      `${API_BASE_URL}/evaluations/evaluated/${userId}/average`,
    count: `${API_BASE_URL}/evaluations/count`,
    countByEvaluated: userId =>
      `${API_BASE_URL}/evaluations/evaluated/${userId}/count`,
    eligible: userId => `${API_BASE_URL}/evaluations/eligible/${userId}`,
  },
};

// HTTP request default options
const DEFAULT_OPTIONS = {
  headers: {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  },
  };
  
  // Interceptor para adicionar token de autenticação
  const authInterceptor = (options) => {
  const token = localStorage.getItem('token');
  if (token) {
  return {
  ...options,
  headers: {
  ...options.headers,
  'Authorization': `Bearer ${token}`
  }
  };
  }
  return options;
  };
  
  // Função para lidar com erros de API de forma consistente
  const handleApiError = (error) => {
  console.error('API Error:', error);
  // Comentado para evitar alerts desnecessários
  // alert('Ocorreu um erro ao processar a sua requisição. Por favor, tente novamente mais tarde.');
  };
  
  // Função genérica para fazer chamadas de API
  const apiCall = async (url, options = {}) => {
    console.log('Chamando API:', url, 'com opções:', options);

    const token = sessionStorage.getItem('authToken');
    console.log('authToken no sessionStorage:', token);

    const finalOptions = {
        ...options,
        headers: {
            'token': sessionStorage.getItem('authToken'),
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    console.log('Headers:', finalOptions.headers);
    console.log('Opções finais:', finalOptions);

    try {
        const response = await fetch(url, finalOptions);
        console.log('Resposta da API:', response.status, response.statusText);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Corpo da resposta de erro:', errorBody);
            throw new Error(`Erro na API: ${response.status} ${response.statusText}\n${errorBody}`);
        }

        // Tenta processar a resposta como JSON, se falhar, retorna o texto
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            console.log('Dados recebidos:', data);
            return data;
        } else {
            const text = await response.text();
            console.log('Texto recebido:', text);
            return text;
        }
    } catch (error) {
        console.error('Erro completo:', error);
        handleApiError(error);
        throw error;
    }
};


  
  export const ApiConfig = {
  API_BASE_URL,
  API_ENDPOINTS,
  DEFAULT_OPTIONS,
  authInterceptor,
  apiCall,
  handleApiError
  };
