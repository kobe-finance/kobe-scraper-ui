import type { JobFormValues } from '../pages/Jobs/components/types';

// Import our adapter layer for transitioning between API implementations
import { preview_extraction_adapter } from './api/adapter';
import { api_base_url } from './config/api_config';

// Base API URL from environment variable (via api_config) or fallback to empty string
const API_BASE_URL = api_base_url || '';

/**
 * API error class for handling API errors
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Base fetch function with error handling
 */
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(
        data?.message || 'An unexpected error occurred',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

/**
 * API Service for Job operations
 */
export const JobsApi = {
  /**
   * Create a new job
   */
  createJob: async (jobData: JobFormValues) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  /**
   * Update an existing job
   */
  updateJob: async (jobId: string, jobData: Partial<JobFormValues>) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  /**
   * Delete a job
   */
  deleteJob: async (jobId: string) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get a list of jobs with pagination and filtering
   */
  getJobs: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return fetchWithErrorHandling(
      `${API_BASE_URL}/jobs?${searchParams.toString()}`
    );
  },

  /**
   * Get a single job by ID
   */
  getJob: async (jobId: string) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/jobs/${jobId}`);
  },

  /**
   * Run a preview extraction to test selectors
   */
  /**
   * Run a preview extraction to test selectors
   * 
   * This function has been updated to use the adapter layer which supports
   * both the legacy and new API implementation.
   */
  previewExtraction: async (previewData: {
    url: string;
    selectorType: string;
    mainSelector?: string;
    extractionFields?: Array<{
      name: string;
      selector: string;
      selectorType: string;
    }>;
    javascriptEnabled: boolean;
  }) => {
    try {
      // Using the adapter to handle the request
      // This provides a smooth transition path between implementations
      return await preview_extraction_adapter(previewData);
    } catch (error) {
      // Handle and convert errors to maintain the expected API error format
      if (error instanceof Error) {
        const apiError = error as Error & { status?: number; data?: any };
        if (apiError.status) {
          throw new ApiError(apiError.message, apiError.status, apiError.data);
        }
        throw new ApiError(error.message, 0);
      }
      throw new ApiError('Unknown error occurred', 0);
    }
  },
};

/**
 * API Service for User operations
 */
export const UsersApi = {
  /**
   * Get the current user
   */
  getCurrentUser: async () => {
    return fetchWithErrorHandling(`${API_BASE_URL}/users/me`);
  },

  /**
   * Update user settings
   */
  updateSettings: async (settings: Record<string, any>) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/users/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// Export a general purpose API client
export const apiClient = {
  get: (url: string, options = {}) => 
    fetchWithErrorHandling(`${API_BASE_URL}${url}`, { 
      ...options, 
      method: 'GET' 
    }),
  
  post: (url: string, data: any, options = {}) => 
    fetchWithErrorHandling(`${API_BASE_URL}${url}`, { 
      ...options, 
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  put: (url: string, data: any, options = {}) => 
    fetchWithErrorHandling(`${API_BASE_URL}${url}`, { 
      ...options, 
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  delete: (url: string, options = {}) => 
    fetchWithErrorHandling(`${API_BASE_URL}${url}`, { 
      ...options, 
      method: 'DELETE' 
    }),
};
