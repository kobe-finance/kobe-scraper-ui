/**
 * API Configuration
 * 
 * This module provides configuration for API usage including 
 * toggling between mock data and production API.
 */

/**
 * Determines whether to use mock data based on the environment variable
 */
export const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * API base URL from environment variables
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Debug mode setting from environment variables
 */
export const DEBUG = import.meta.env.VITE_DEBUG === 'true';

/**
 * Current environment
 */
export const ENVIRONMENT = import.meta.env.VITE_ENV || 'development';

/**
 * Helper function to log API calls in debug mode
 */
export const logApiCall = (endpoint: string, method: string, data?: any) => {
  if (DEBUG) {
    console.group(`🌐 API Call: ${method} ${endpoint}`);
    if (data) {
      console.log('Request Data:', data);
    }
    console.groupEnd();
  }
};

/**
 * Helper function to log API responses in debug mode
 */
export const logApiResponse = (endpoint: string, response: any, error?: any) => {
  if (DEBUG) {
    if (error) {
      console.group(`❌ API Error: ${endpoint}`);
      console.error(error);
      console.groupEnd();
    } else {
      console.group(`✅ API Response: ${endpoint}`);
      console.log(response);
      console.groupEnd();
    }
  }
};
