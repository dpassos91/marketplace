'use strict';

import { DEFAULT_OPTIONS } from '../api/ApiConfig.js';
import { getAuthToken } from '../utils/authUtils.js';

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
