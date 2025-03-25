import { apiConfig } from './apiConfig.js';
import { setAuthToken, removeAuthToken } from '../utils/authUtils.js';

const { apiCall, API_ENDPOINTS } = apiConfig;

// Funções internas
const registerUser = async (userData) => {
  return apiCall(API_ENDPOINTS.users.register, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

const loginUser = async (credentials) => {
  const response = await fetch(API_ENDPOINTS.users.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const token = await response.text();
  sessionStorage.setItem('authToken', token); // Armazena o token

  try {
    const userInfo = await getUserByUsername(credentials.username);
    return { ...userInfo, token };
  } catch (profileError) {
    console.warn('Could not fetch user profile after login:', profileError);
    return { username: credentials.username, token };
  }
};

const logoutUser = async () => {
  try {
    const result = await apiCall(API_ENDPOINTS.users.logout, { method: 'POST' });
    if (result === "Successfully logged out!") {
      removeAuthToken();
      // Redirecionar para a página de login ou atualizar o estado da aplicação
      alert ("Logout realizado com sucesso! Até breve :)");
      window.location.href = '/';
    } else {
      console.error("Logout falhou:", result);
    }
  } catch (error) {
    console.error("Erro durante o logout:", error);
  }
};

const getUserById = async (userId) => {
  return apiCall(API_ENDPOINTS.users.byId(userId));
};

const updateUser = async (userId, userData) => {
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    console.error('Token de autenticação não encontrado');
    throw new Error('Usuário não autenticado');
  }
  console.log("Dados enviados para a API:", userData);
  return apiCall(API_ENDPOINTS.users.update(userId), {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

const deleteUser = async (userId) => {
  return apiCall(API_ENDPOINTS.users.delete(userId), { method: 'DELETE' });
};

const suspendUser = async (userId) => {
  return apiCall(API_ENDPOINTS.users.suspend(userId), { method: 'PATCH' });
};

const reactivateUser = async (userId) => {
  return apiCall(API_ENDPOINTS.users.reactivate(userId), { method: 'PATCH' });
};

const getUserByUsername = async (username) => {
  return apiCall(API_ENDPOINTS.users.byUsername(username));
};

const checkUsername = async (username) => {
  return apiCall(`${API_ENDPOINTS.users.base}/check-username?username=${encodeURIComponent(username)}`);
};

const getTotalUsers = async () => {
  return apiCall(API_ENDPOINTS.users.all);
};

// Exportação no final do arquivo
export const userAPI = {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  reactivateUser,
  getUserByUsername,
  checkUsername,
  getTotalUsers
};
