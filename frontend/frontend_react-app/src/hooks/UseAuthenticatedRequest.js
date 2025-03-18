import { useCallback } from 'react';
import { DEFAULT_OPTIONS } from '../api/ApiConfig';
import { useAuth } from './useAuth'; // Ajuste o caminho conforme necessário

export function useAuthenticatedRequest() {
  const { getAuthToken } = useAuth();

  const makeRequest = useCallback(async (url, options = {}) => {
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
  }, [getAuthToken]);

  return makeRequest;
}
