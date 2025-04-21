import { apiConfig } from './apiConfig.js';

const { apiCall, API_ENDPOINTS } = apiConfig;

const registerUser = async (userData) => {
  return apiCall(API_ENDPOINTS.users.base, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

const confirmUser = async (token) => {
  return apiCall(API_ENDPOINTS.users.confirm(token), {
    method: 'POST',
  });
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
  return apiCall(API_ENDPOINTS.users.delete(userId), {
    method: 'DELETE',
  });
};

const updateUserStatus = async (userId, isActive) => {
  return apiCall(API_ENDPOINTS.users.updateStatus(userId), {
    method: 'PATCH',
    body: JSON.stringify({ active: isActive }),
  });
};

const getUserByUsername = async (username) => {
  return apiCall(API_ENDPOINTS.users.byUsername(username));
};

const getUserProfile = (username) => {
  return apiCall(API_ENDPOINTS.users.profile(username));
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
  confirmUser,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  getUserByUsername,
  getUserProfile,
  getAllUsers,
  getDeletedUsers,
  updatePassword,
};


