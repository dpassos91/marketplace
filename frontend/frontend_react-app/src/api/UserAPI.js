'use strict';

import { API_ENDPOINTS } from './ApiConfig.js';
import { makeAuthenticatedRequest } from '../utils/apiUtils.js';
import { setAuthToken, removeAuthToken } from '../utils/authUtils.js';

// Register a new user
export async function registerUser(userData) {
  try {
    const response = await fetch(API_ENDPOINTS.users.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
}

// Login user
export async function loginUser(credentials) {
  try {
    const response = await fetch(API_ENDPOINTS.users.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    // Get token as plain text
    const token = await response.text();

    // Save the token
    setAuthToken(token);

    // Try to get user info with the new token
    try {
      const userInfo = await getUserByUsername(credentials.username);
      // Return combined object with token and user info
      return {
        ...userInfo,
        token: token,
      };
    } catch (profileError) {
      console.warn('Could not fetch user profile after login:', profileError);
      // Return minimal object with just the token and username
      return {
        username: credentials.username,
        token: token,
      };
    }
  } catch (error) {
    console.error('Error during login:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}

// Logout user (requires authentication)
export async function logoutUser() {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.users.logout,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      throw new Error(`Logout failed: ${response.statusText}`);
    }

    removeAuthToken();
    return await response.text();
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(userId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.users.byId(userId),
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Update user
export async function updateUser(userId, userData) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.users.update(userId),
      {
        method: 'PUT',
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error updating user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Delete user
export async function deleteUser(userId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.users.delete(userId),
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error(`Error deleting user: ${response.statusText}`);
    }

  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Suspend user
export async function suspendUser(userId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.users.suspend(userId),
      { method: 'PATCH' }
    );

    if (!response.ok) {
      throw new Error(`Error suspending user: ${response.statusText}`);
    }

  } catch (error) {
    console.error('Error suspending user:', error);
    throw error;
  }
}

// Reactivate user
export async function reactivateUser(userId) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.users.reactivate(userId),
      { method: 'PATCH' }
    );

    if (!response.ok) {
      throw new Error(`Error reactivating user: ${response.statusText}`);
    }

  } catch (error) {
    console.error('Error reactivating user:', error);
    throw error;
  }
}

// Get user by username
export async function getUserByUsername(username) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.users.byUsername(username),
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching user by username: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
}

// Check if username is available
export async function checkUsername(username) {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.users.checkUsername}?username=${encodeURIComponent(
        username
      )}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error checking username: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
}

// Get total number of users
export async function getTotalUsers() {
  try {
    const response = await fetch(API_ENDPOINTS.users.all); // Certifique-se de que o endpoint está correto
    if (!response.ok) {
      throw new Error(`Erro ao obter os utilizadores: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Formato de dados inesperado'); // Garante que os dados são um array
    }
    return data;
  } catch (error) {
    console.error('Erro ao obter os utilizadores:', error);
    throw error; // Rejeita a promessa com o erro para que o chamador possa lidar com isso
  }
}