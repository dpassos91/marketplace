import { apiConfig } from '../api/apiConfig.js';
import { getAuthToken } from '../utils/authUtils.js';

const { DEFAULT_OPTIONS } = apiConfig;

// Make an authenticated request to the API
export async function makeAuthenticatedRequest(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...DEFAULT_OPTIONS.headers,
    ...(token && { token: token }),
    ...options.headers,
  };

  const requestOptions = {
    ...options,
    headers,
  };

  return fetch(url, requestOptions);
}
