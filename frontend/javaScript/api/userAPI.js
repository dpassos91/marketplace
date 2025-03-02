'use strict';

import { API_ENDPOINTS } from '../config/apiConfig.js';
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
  console.log("chamou o método")
  try {
    // TODO: vou para já ignorar o makeAuthenticatedRequest (tenho que estudar esta função)
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.users.byId(userId),
      {
        method: 'GET',
      }
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
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`Error deleting user: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Get user by username
export async function getUserByUsername(username) {
  try {
    const response = await makeAuthenticatedRequest(
      API_ENDPOINTS.users.byUsername(username),
      {
        method: 'GET',
      }
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
