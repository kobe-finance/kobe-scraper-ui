import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, any> | FormData;
  requireAuth?: boolean;
  skipContentType?: boolean;
}

interface ApiState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

/**
 * Custom hook for making API requests with automatic token handling
 */
export function useApi<T = any>() {
  const { accessToken, refreshAuth, logout } = useAuth();
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  /**
   * Execute API request with automatic token handling
   */
  const execute = useCallback(
    async (url: string, options: ApiOptions = {}): Promise<T | null> => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        const {
          method = 'GET',
          headers = {},
          body,
          requireAuth = true,
          skipContentType = false,
        } = options;

        // Prepare request headers
        const requestHeaders: Record<string, string> = {
          ...headers,
        };

        // Add content type header for JSON requests
        if (!skipContentType && !(body instanceof FormData)) {
          requestHeaders['Content-Type'] = 'application/json';
        }

        // Add auth token if required
        if (requireAuth && accessToken) {
          requestHeaders['Authorization'] = `Bearer ${accessToken}`;
        }

        // Prepare request options
        const requestOptions: RequestInit = {
          method,
          headers: requestHeaders,
        };

        // Add body if present
        if (body) {
          requestOptions.body = body instanceof FormData ? body : JSON.stringify(body);
        }

        // Execute request
        let response = await fetch(url, requestOptions);

        // Handle 401 Unauthorized error (token expired)
        if (response.status === 401 && requireAuth) {
          // Try to refresh token
          const refreshSuccess = await refreshAuth();

          if (refreshSuccess) {
            // Update authorization header with new token
            requestHeaders['Authorization'] = `Bearer ${accessToken}`;
            requestOptions.headers = requestHeaders;

            // Retry request with new token
            response = await fetch(url, requestOptions);
          } else {
            // Token refresh failed, logout user
            logout();
            throw new Error('Authentication expired. Please login again.');
          }
        }

        // Handle non-2xx responses
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API request failed with status ${response.status}`);
        }

        // Parse response
        const data = await response.json();

        setState({
          data,
          error: null,
          isLoading: false,
        });

        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setState({
          data: null,
          error: new Error(errorMessage),
          isLoading: false,
        });
        return null;
      }
    },
    [accessToken, refreshAuth, logout]
  );

  return {
    ...state,
    execute,
  };
}
