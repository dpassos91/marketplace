import { apiConfig } from './apiConfig.js';
import { userAPI } from './userAPI.js'

const { apiCall, API_ENDPOINTS } = apiConfig;
const { getUserById } = userAPI;

const loginUser = async (credentials) => {
  const loginResponse = await apiCall(API_ENDPOINTS.auth.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const token = loginResponse.token;
  sessionStorage.setItem('authToken', token);

  // Aqui vai buscar os dados completos do utilizador
  const userDetails = await userAPI.getUserById(loginResponse.userId);

  return {
    ...userDetails,
    token,
  };
};


const logoutUser = async () => {
  const token = sessionStorage.getItem('authToken');

  if (!token) {
    throw new Error("Token inexistente no sessionStorage");
  }

  const result = await apiCall(API_ENDPOINTS.auth.logout, {
    method: 'POST',
    headers: {
      token: token, // ou 'Authorization': `Bearer ${token}` se for o caso
    },
  });

  if (result === "Successfully logged out!") {
    sessionStorage.removeItem('authToken');
    return true;
  } else {
    throw new Error("Logout falhou: " + result);
  }
};


const requestPasswordReset = async (email) => {
  return apiCall(API_ENDPOINTS.auth.requestResetPassword, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: undefined,
    },
    body: JSON.stringify({ email }),
  });
};

const resetPassword = async (token, newPassword) => {
  return apiCall(API_ENDPOINTS.auth.resetPassword, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: undefined,
    },
    body: JSON.stringify({ token, newPassword }),
  });
};

export const authAPI = {
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
};

