import { apiConfig } from './apiConfig.js';
import { removeAuthToken } from '../utils/authUtils.js';

const { apiCall, API_ENDPOINTS } = apiConfig;

const registerUser = async (userData) => {
  return apiCall(API_ENDPOINTS.users.register, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

const loginUser = async (credentials) => {
  return apiCall(API_ENDPOINTS.users.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then(async (token) => {
    sessionStorage.setItem('authToken', token);
    const userInfo = await getUserByUsername(credentials.username);
    return { ...userInfo, token };
  });
};

const logoutUser = async () => {
  const result = await apiCall(API_ENDPOINTS.users.logout, { method: 'POST' });
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

