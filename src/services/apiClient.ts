/**
 * API Client for Kobe Scraper Backend
 * 
 * This module provides a consistent interface for communicating with the
 * Kobe Scraper API endpoints.
 */

import { z } from 'zod';
import { API_BASE_URL, useMockData, logApiCall, logApiResponse } from './apiConfig';
import { 
  mockApiResponses, 
  mockApiDelay, 
  // Import schemas from mockData
  scrapeResponseSchema, 
  jobResponseSchema,
  jobStatusSchema
} from './mockData';

// Error type
export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

/**
 * Generic API request function with error handling
 */
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {},
  schema?: z.ZodType<T>,
  mockFn?: (...args: any[]) => T,
  mockArgs?: any[]
): Promise<T> {
  // Extract method for logging
  const method = options.method || 'GET';
  
  // Log the API call if in debug mode
  const requestData = options.body ? JSON.parse(options.body as string) : undefined;
  logApiCall(endpoint, method, requestData);
  
  // Use mock data if enabled and mock function is provided
  if (useMockData && mockFn) {
    try {
      // Simulate network delay
      await mockApiDelay();
      
      // Call the mock function with provided arguments
      const mockData = mockFn(...(mockArgs || []));
      
      // Log the mock response
      logApiResponse(endpoint, mockData);
      
      // Return validated data if schema is provided
      if (schema) {
        return schema.parse(mockData);
      }
      
      return mockData;
    } catch (error) {
      // Log mock errors
      logApiResponse(endpoint, null, error);
      throw error;
    }
  }
  
  // Otherwise proceed with real API call
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.detail || data.error || 'An unexpected error occurred',
        details: data,
      };
      
      // Log the API error
      logApiResponse(endpoint, null, error);
      
      throw error;
    }
    
    // Log the successful response
    logApiResponse(endpoint, data);
    
    // Validate response with schema if provided
    if (schema) {
      return schema.parse(data);
    }
    
    return data as T;
  } catch (error) {
    if ((error as ApiError).status) {
      throw error;
    }
    
    // Handle other errors (network, parsing, etc.)
    const networkError = {
      status: 0,
      message: (error as Error).message || 'Network error',
    } as ApiError;
    
    // Log the network error
    logApiResponse(endpoint, null, networkError);
    
    throw networkError;
  }
}

/**
 * API Client object with methods for each endpoint
 */
export const apiClient = {
  /**
   * Perform basic scraping of a URL
   */
  scrapeUrl: async (url: string, selector?: string, maxDepth: number = 1) => {
    return apiRequest(
      '/api/scrape', 
      {
        method: 'POST',
        body: JSON.stringify({
          url,
          selector,
          max_depth: maxDepth,
          respect_robots_txt: true,
        }),
      },
      scrapeResponseSchema,
      mockApiResponses.scrapeUrl,
      [url]
    );
  },
  
  /**
   * Perform advanced scraping with schema-based extraction
   */
  advancedScrape: async (url: string, schema: Record<string, any>, javascriptEnabled: boolean = false) => {
    return apiRequest(
      '/api/scrape/advanced', 
      {
        method: 'POST',
        body: JSON.stringify({
          url,
          schema,
          javascript_enabled: javascriptEnabled,
          max_depth: 1,
          respect_robots_txt: true,
        }),
      },
      scrapeResponseSchema,
      mockApiResponses.advancedScrape,
      [url]
    );
  },
  
  /**
   * Perform full page scraping
   */
  scrapeFullPage: async (url: string) => {
    return apiRequest(
      '/api/scrape/full', 
      {
        method: 'POST',
        body: JSON.stringify({
          url,
          respect_robots_txt: true,
        }),
      },
      scrapeResponseSchema,
      mockApiResponses.scrapeFullPage,
      [url]
    );
  },
  
  /**
   * Start a background scraping job
   */
  startScrapeJob: async (url: string, schema: Record<string, any>) => {
    return apiRequest(
      '/api/jobs/start', 
      {
        method: 'POST',
        body: JSON.stringify({
          url,
          schema,
          javascript_enabled: true,
        }),
      },
      jobResponseSchema,
      mockApiResponses.startScrapeJob
    );
  },
  
  /**
   * Get job status
   */
  getJobStatus: async (jobId: string) => {
    return apiRequest(
      `/api/jobs/${jobId}`, 
      {
        method: 'GET',
      },
      jobStatusSchema,
      mockApiResponses.getJobStatus,
      [jobId]
    );
  },
  
  /**
   * List all jobs
   */
  listJobs: async (statusFilter?: string) => {
    const queryParams = statusFilter ? `?status=${statusFilter}` : '';
    return apiRequest<z.infer<typeof jobStatusSchema>[]>(
      `/api/jobs${queryParams}`, 
      {
        method: 'GET',
      },
      undefined,
      mockApiResponses.listJobs
    );
  },
};
