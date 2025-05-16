/**
 * API Configuration
 * 
 * Central configuration for API endpoints and versioning
 */

// Environment variables with defaults
export const api_base_url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const api_version = import.meta.env.VITE_API_VERSION || 'v1';
export const use_mock_data = import.meta.env.VITE_USE_MOCK_DATA === 'true';
export const debug_mode = import.meta.env.VITE_DEBUG === 'true';

// API version constants
export const API_VERSIONS = {
  v1: 'v1',
  v2: 'v2'
};

/**
 * API paths configuration by version
 * This allows for clean version transitions when needed
 */
export const API_PATHS = {
  [API_VERSIONS.v1]: {
    scrapers: {
      // Scraper endpoints
      list: '/scrapers',
      create: '/scrapers',
      get: (id: string) => `/scrapers/${id}`,
      update: (id: string) => `/scrapers/${id}`,
      delete: (id: string) => `/scrapers/${id}`,
      preview: '/scrape/preview',
      run: (id: string) => `/scrapers/${id}/run`,
    },
    jobs: {
      // Job endpoints
      list: '/jobs',
      create: '/jobs',
      get: (id: string) => `/jobs/${id}`,
      update: (id: string) => `/jobs/${id}`,
      delete: (id: string) => `/jobs/${id}`,
      status: (id: string) => `/jobs/${id}/status`,
    },
    auth: {
      // Auth endpoints
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      user: '/auth/user',
    }
  },
  // Future v2 API version can be defined here when needed
  [API_VERSIONS.v2]: {
    // Structure matches v1 but with updated paths when needed
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
    auth: {
      login: '/v2/auth/login',
      register: '/v2/auth/register',
      logout: '/v2/auth/logout',
      refresh: '/v2/auth/refresh',
      user: '/v2/auth/user',
    }
  }
};

/**
 * Get API path for the current version
 * @param section - API section (scrapers, jobs, auth)
 * @param endpoint - Endpoint name or function
 * @param params - Any parameters to pass to endpoint functions
 * @returns Full API path
 */
export function get_api_path(section: string, endpoint: string | ((params: any) => string), params?: any): string {
  // Get paths for current version
  const version_paths = API_PATHS[api_version];
  
  if (!version_paths || !version_paths[section]) {
    throw new Error(`Invalid API section: ${section}`);
  }
  
  const endpoint_path = version_paths[section][endpoint];
  
  if (!endpoint_path) {
    throw new Error(`Invalid API endpoint: ${endpoint} in section ${section}`);
  }
  
  // Handle endpoint functions that take parameters
  if (typeof endpoint_path === 'function' && params !== undefined) {
    return endpoint_path(params);
  }
  
  return endpoint_path as string;
}
