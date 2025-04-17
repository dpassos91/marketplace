import { apiConfig } from './apiConfig.js';
import { removeAuthToken } from '../utils/authUtils.js';

const { apiCall, API_ENDPOINTS } = apiConfig;

const registerUser = async (userData) => {
  return apiCall(API_ENDPOINTS.users.base, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

const loginUser = async (credentials) => {
  return apiCall(API_ENDPOINTS.auth.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then(async (response) => {
    const token = response.token;
    sessionStorage.setItem('authToken', token);
    const userInfo = await getUserByUsername(credentials.username);
    return { ...userInfo, token };
  });
};

const logoutUser = async () => {
  const result = await apiCall(API_ENDPOINTS.auth.logout, { method: 'POST' });
  if (result === "Successfully logged out!") {
    removeAuthToken();
    return true;
  } else {
    throw new Error("Logout falhou: " + result);
  }
};

const getUserById = async (userId) => {
  return apiCall(API_ENDPOINTS.users.byId(userId));
};

const updateUser = async (userId, userData) => {
  return apiCall(API_ENDPOINTS.users.update(userId), {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

const deleteUser = async (userId) => {
  return apiCall(API_ENDPOINTS.users.delete(userId), { method: 'DELETE' });
};

// Novo método genérico para ativar/suspender
const updateUserStatus = async (userId, isActive) => {
  return apiCall(API_ENDPOINTS.users.updateStatus(userId), {
    method: 'PATCH',
    body: JSON.stringify({ active: isActive }),
  });
};

const getUserByUsername = async (username) => {
  return apiCall(API_ENDPOINTS.users.byUsername(username));
};

const getAllUsers = async (active = null) => {
  const query = active !== null ? `?active=${active}` : '';
  return apiCall(`${API_ENDPOINTS.users.base}${query}`);
};

const getDeletedUsers = async () => {
  return apiCall(API_ENDPOINTS.users.deleted);
};

const updatePassword = async (userId, passwordUpdateData) => {
  return apiCall(API_ENDPOINTS.users.updatePassword(userId), {
    method: 'PATCH',
    body: JSON.stringify(passwordUpdateData),
  });
};


export const userAPI = {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  getUserByUsername,
  getAllUsers,
  getDeletedUsers,
  updatePassword
};

