import { ApiConfig } from './ApiConfig.js';
import { setAuthToken, removeAuthToken } from '../utils/authUtils.js';

const { apiCall, API_ENDPOINTS } = ApiConfig;

const registerUser = async (userData) => {
  console.log('A função registerUser está sendo chamada com:', userData);
  return apiCall(API_ENDPOINTS.users.register, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

const loginUser = async (credentials) => {
  try {
    const response = await apiCall(API_ENDPOINTS.users.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const token = response;
    setAuthToken(token);

    try {
      const userInfo = await getUserByUsername(credentials.username);
      return {
        ...userInfo,
        token: token,
      };
    } catch (profileError) {
      console.warn('Could not fetch user profile after login:', profileError);
      return {
        username: credentials.username,
        token: token,
      };
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

const logoutUser = async () => {
  try {
    await apiCall(API_ENDPOINTS.users.logout, { method: 'POST' });
    removeAuthToken();
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

const getUserById = (userId) => apiCall(API_ENDPOINTS.users.byId(userId));

const updateUser = (userId, userData) => apiCall(API_ENDPOINTS.users.update(userId), {
  method: 'PUT',
  body: JSON.stringify(userData),
});

const deleteUser = (userId) => apiCall(API_ENDPOINTS.users.delete(userId), { method: 'DELETE' });

const suspendUser = (userId) => apiCall(API_ENDPOINTS.users.suspend(userId), { method: 'PATCH' });

const reactivateUser = (userId) => apiCall(API_ENDPOINTS.users.reactivate(userId), { method: 'PATCH' });

const getUserByUsername = (username) => apiCall(API_ENDPOINTS.users.byUsername(username));

const checkUsername = (username) => apiCall(`${API_ENDPOINTS.users.checkUsername}?username=${encodeURIComponent(username)}`);

const getTotalUsers = async () => {
  const data = await apiCall(API_ENDPOINTS.users.all);
  if (!Array.isArray(data)) {
    throw new Error('Formato de dados inesperado');
  }
  return data;
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
