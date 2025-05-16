/**
 * API Configuration
 *
 * Centralizes all API-related configuration settings and provides
 * a consistent way to access them throughout the application.
 */

import { get_env_string, get_env_boolean, get_env_number } from './env';

/**
 * API version definition
 */
export enum ApiVersion {
  V1 = 'v1',
  V2 = 'v2'
}

/**
 * Core API configuration settings
 */
export interface ApiConfigOptions {
  base_url: string;
  timeout_ms: number;
  version: ApiVersion;
  retry_attempts: number;
  use_mock_data: boolean;
  debug_mode: boolean;
  use_new_api_layer: boolean;
}

/**
 * Default API configuration
 */
const default_config: ApiConfigOptions = {
  base_url: 'http://localhost:3000/api',
  timeout_ms: 30000,
  version: ApiVersion.V1,
  retry_attempts: 3,
  use_mock_data: false,
  debug_mode: false,
  use_new_api_layer: true
};

/**
 * Load API configuration from environment variables
 */
export function load_api_config(): ApiConfigOptions {
  return {
    base_url: get_env_string('VITE_API_BASE_URL', default_config.base_url),
    timeout_ms: get_env_number('VITE_API_TIMEOUT_MS', default_config.timeout_ms),
    version: get_env_string('VITE_API_VERSION', default_config.version) as ApiVersion,
    retry_attempts: get_env_number('VITE_API_RETRY_ATTEMPTS', default_config.retry_attempts),
    use_mock_data: get_env_boolean('VITE_USE_MOCK_DATA', default_config.use_mock_data),
    debug_mode: get_env_boolean('VITE_DEBUG', default_config.debug_mode),
    use_new_api_layer: get_env_boolean('VITE_USE_NEW_API_LAYER', default_config.use_new_api_layer)
  };
}

/**
 * API endpoints configuration by version
 */
export const api_endpoints = {
  [ApiVersion.V1]: {
    scrapers: {
      list: '/scrapers',
      create: '/scrapers',
      get: (id: string) => `/scrapers/${id}`,
      update: (id: string) => `/scrapers/${id}`,
      delete: (id: string) => `/scrapers/${id}`,
      preview: '/scrape/preview',
      run: (id: string) => `/scrapers/${id}/run`,
    },
    jobs: {
      list: '/jobs',
      create: '/jobs',
      get: (id: string) => `/jobs/${id}`,
      update: (id: string) => `/jobs/${id}`,
      delete: (id: string) => `/jobs/${id}`,
      status: (id: string) => `/jobs/${id}/status`,
    },
    users: {
      current: '/users/me',
      settings: '/users/settings',
    }
  },
  [ApiVersion.V2]: {
    scrapers: {
      list: '/v2/scrapers',
      create: '/v2/scrapers',
      get: (id: string) => `/v2/scrapers/${id}`,
      update: (id: string) => `/v2/scrapers/${id}`,
      delete: (id: string) => `/v2/scrapers/${id}`,
      preview: '/v2/scrape/preview',
      run: (id: string) => `/v2/scrapers/${id}/run`,
    },
    jobs: {
      list: '/v2/jobs',
      create: '/v2/jobs',
      get: (id: string) => `/v2/jobs/${id}`,
      update: (id: string) => `/v2/jobs/${id}`,
      delete: (id: string) => `/v2/jobs/${id}`,
      status: (id: string) => `/v2/jobs/${id}/status`,
    },
    users: {
      current: '/v2/users/me',
      settings: '/v2/users/settings',
    }
  }
};

/**
 * Get an API endpoint path for the specified version
 * 
 * @param version - API version
 * @param section - API section (scrapers, jobs, users)
 * @param endpoint - Endpoint name or function
 * @param params - Parameters for endpoint function
 * @returns Full API endpoint path
 */
export function get_api_endpoint(
  version: ApiVersion,
  section: keyof typeof api_endpoints[ApiVersion.V1],
  endpoint: string | ((param: any) => string),
  params?: any
): string {
  const section_endpoints = api_endpoints[version][section];
  
  if (!section_endpoints) {
    throw new Error(`Invalid API section: ${section}`);
  }
  
  const endpoint_path = section_endpoints[endpoint as keyof typeof section_endpoints];
  
  if (!endpoint_path) {
    throw new Error(`Invalid API endpoint: ${endpoint} in section ${section}`);
  }
  
  if (typeof endpoint_path === 'function' && params !== undefined) {
    return endpoint_path(params);
  }
  
  return endpoint_path as string;
}

/**
 * Singleton instance of API configuration
 */
export const api_config = load_api_config();
