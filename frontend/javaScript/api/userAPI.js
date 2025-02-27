'use strict';

import { API_ENDPOINTS, DEFAULT_OPTIONS } from '../config/apiConfig.js';

// User API functions
export async function loginUser(username, password) {
  try {
    const response = await fetch(API_ENDPOINTS.users.login, {
      method: 'POST',
      headers: {
        ...DEFAULT_OPTIONS.headers,
        Username: username,
        Password: password,
      },
    });

    if (!response.ok) {
      throw new Error(`Login falhou: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}

export async function registerUser(newUser) {
  try {
    const response = await fetch(API_ENDPOINTS.users.register, {
      method: 'POST',
      headers: DEFAULT_OPTIONS.headers,
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error(`Erro ao registar utilizador: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao registar utilizador:', error);
    throw error;
  }
}

export async function updateUser(user) {
  try {
    const response = await fetch(API_ENDPOINTS.users.update(user.username), {
      method: 'PUT',
      headers: DEFAULT_OPTIONS.headers,
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar o usuário: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    throw error;
  }
}

export async function checkUsernameExists(username) {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.users.checkUsername}?username=${username}`
    );

    if (!response.ok) {
      throw new Error(`Erro ao verificar username: ${response.statusText}`);
    }

    const result = await response.json();
    return result.exists;
  } catch (error) {
    console.error('Erro ao verificar username:', error);
    return false;
  }
}
