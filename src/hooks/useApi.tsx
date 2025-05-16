/**
 * API Hook
 * 
 * This hook provides access to all API services and handles common
 * error states, loading indicators, and other shared functionality.
 */
import { useState, useCallback } from 'react';
import { ApiError } from '../core/errors/api_error';
import { scraper_service } from '../services/api/scraper_service';
import { job_service } from '../services/api/job_service';
import { api_config } from '../core/config/api_config';
import { ProxyType, SelectorType, ScraperStatus } from '../core/types/scraper';
import type { Scraper } from '../core/types/scraper';
import type { Job, JobStatus } from '../core/types/job';
import type { PaginatedResponse, ApiResponse } from '../core/types/api';
import { map_preview_request } from '../services/adapters/scraper_adapter';
import { 
  preview_extraction_adapter,
  create_scraper_adapter,
  list_scrapers_adapter, 
  get_scraper_adapter,
  update_scraper_adapter,
  delete_scraper_adapter,
  run_scraper_adapter
} from '../services/adapters/scraper_adapter';

// Types for API requests
type CreateScraperRequest = {
  name: string;
  description?: string;
  url: string;
  selector: string;
  selector_type?: string;
  max_depth?: number;
  proxy_type?: string;
  proxy_url?: string;
  javascript_enabled?: boolean;
  respect_robots_txt?: boolean;
};

type UpdateScraperRequest = Partial<CreateScraperRequest>;

type ListScrapersParams = {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  status?: string;
};

type RunScraperRequest = {
  scraper_id: string;
  options?: {
    max_pages?: number;
  };
};

type RunScraperResponse = {
  job_id: string;
  status: string;
};

type ScraperPreviewRequest = {
  url: string;
  selector: string;
  selector_type?: string;
  javascript_enabled?: boolean;
};

type ScraperPreviewResponse = {
  matches: Array<{
    content: string;
    html: string;
    attributes: Record<string, string>;
  }>;
};

// Types for job requests
type CreateJobRequest = {
  name: string;
  description?: string;
  scraper_id: string;
  options?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

type UpdateJobRequest = {
  name?: string;
  description?: string;
  status?: JobStatus;
  metadata?: Record<string, unknown>;
};

type ListJobsParams = {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  status?: string;
  scraper_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
};

type JobStatusUpdate = {
  job_id: string;
  status: JobStatus;
  progress_percentage?: number;
  current_page?: number;
  total_pages?: number;
  result_count?: number;
  error_message?: string;
  updated_at?: string;
};

type JobResultItem = {
  id: string;
  job_id: string;
  scraper_id: string;
  url: string;
  data: Record<string, unknown>;
  extracted_at: string;
  success: boolean;
  error_message?: string;
};

// Helper for error conversion
const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }
  
  return new ApiError('An unknown error occurred', 500);
};

// Define the return type of useApi for better type safety
export interface ApiHookReturn {
  isLoading: boolean;
  error: ApiError | null;
  clearError: () => void;
  scraper: {
    createScraper: (data: CreateScraperRequest) => Promise<Scraper>;
    listScrapers: (params?: ListScrapersParams) => Promise<PaginatedResponse<Scraper>>;
    getScraper: (id: string) => Promise<Scraper>;
    updateScraper: (id: string, data: UpdateScraperRequest) => Promise<Scraper>;
    deleteScraper: (id: string) => Promise<ApiResponse<void>>;
    runScraper: (data: RunScraperRequest) => Promise<RunScraperResponse>;
    previewExtraction: (data: ScraperPreviewRequest) => Promise<ScraperPreviewResponse>;
  };
  job: {
    createJob: (data: CreateJobRequest) => Promise<Job>;
    listJobs: (params?: ListJobsParams) => Promise<PaginatedResponse<Job>>;
    getJob: (id: string) => Promise<Job>;
    updateJob: (id: string, data: UpdateJobRequest) => Promise<Job>;
    deleteJob: (id: string) => Promise<ApiResponse<void>>;
    getJobResults: (jobId: string, params?: { page?: number; per_page?: number }) => Promise<PaginatedResponse<JobResultItem>>;
    getJobStatus: (jobId: string) => Promise<JobStatusUpdate>;
  };
};

/**
 * Hook for interacting with the API
 */
export const useApi = (): ApiHookReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * Helper to execute API calls with loading state and error handling
   */
  const executeApiCall = useCallback(async <T,>(
    apiCall: () => Promise<T>
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err: unknown) {
      const apiError = handleApiError(err);
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Scraper-related API methods
   */
  // Cast input params to match expected types when using the service or adapter
  const adaptCreateScraperRequest = (data: CreateScraperRequest) => {
    return {
      name: data.name,
      description: data.description,
      url: data.url,
      selector: data.selector,
      selector_type: data.selector_type as SelectorType || SelectorType.CSS,
      max_depth: data.max_depth || 1, // Default to 1 if not provided
      proxy_type: data.proxy_type as ProxyType || ProxyType.NONE,
      proxy_url: data.proxy_url,
      javascript_enabled: data.javascript_enabled || false,
      respect_robots_txt: data.respect_robots_txt || true,
      extraction_fields: data.extraction_fields || []
    };
  };
  
  // Cast params for listing scrapers
  const adaptListScrapersParams = (params?: ListScrapersParams) => {
    if (!params) return undefined;
    return {
      page: params.page,
      per_page: params.per_page,
      status: params.status as ScraperStatus,
      sort_by: params.sort_by as "name" | "creation_date" | "last_run_date" | undefined,
      sort_order: params.sort_by ? "asc" : undefined // Default sort order
    };
  };
  
  // Cast params for listing jobs
  const adaptListJobsParams = (params?: ListJobsParams) => {
    if (!params) return undefined;
    return {
      page: params.page,
      per_page: params.per_page,
      status: params.status as JobStatus,
      sort_by: params.sort_by as "name" | "created_at" | "started_at" | "completed_at" | undefined,
      sort_order: params.sort_by ? "asc" : undefined // Default sort order
    };
  };
  
  // Cast preview request
  const adaptPreviewRequest = (data: ScraperPreviewRequest) => {
    // Use the existing adapter function that handles all the field mappings correctly
    return map_preview_request(data);
  };

  const scraperApi = {
    /**
     * Create a new scraper
     */
    createScraper: useCallback(async (data: CreateScraperRequest) => {
      return executeApiCall(async () => {
        if (api_config.use_new_api_layer) {
          return scraper_service.create_scraper(adaptCreateScraperRequest(data));
        } else {
          return create_scraper_adapter(adaptCreateScraperRequest(data));
        }
      });
    }, [executeApiCall]),
    
    /**
     * List all scrapers with optional filtering
     */
    listScrapers: useCallback(async (params?: ListScrapersParams) => {
      return executeApiCall(async () => {
        if (api_config.use_new_api_layer) {
          return scraper_service.list_scrapers(adaptListScrapersParams(params));
        } else {
          return list_scrapers_adapter(params);
        }
      });
    }, [executeApiCall]),
    
    /**
     * Get a scraper by ID
     */
    getScraper: useCallback(async (id: string) => {
      return executeApiCall(async () => {
        if (api_config.use_new_api_layer) {
          return scraper_service.get_scraper(id);
        } else {
          return get_scraper_adapter(id);
        }
      });
    }, [executeApiCall]),
    
    /**
     * Update an existing scraper
     */
    updateScraper: useCallback(async (id: string, data: UpdateScraperRequest) => {
      return executeApiCall(async () => {
        if (api_config.use_new_api_layer) {
          return scraper_service.update_scraper(id, data);
        } else {
          return update_scraper_adapter(id, data);
        }
      });
    }, [executeApiCall]),
    
    /**
     * Delete a scraper
     */
    deleteScraper: useCallback(async (id: string) => {
      return executeApiCall(async () => {
        if (api_config.use_new_api_layer) {
          return scraper_service.delete_scraper(id);
        } else {
          return delete_scraper_adapter(id);
        }
      });
    }, [executeApiCall]),
    
    /**
     * Run a scraper
     */
    runScraper: useCallback(async (data: RunScraperRequest) => {
      return executeApiCall(async () => {
        if (api_config.use_new_api_layer) {
          return scraper_service.run_scraper(data);
        } else {
          return run_scraper_adapter(data);
        }
      });
    }, [executeApiCall]),
    
    /**
     * Preview extraction results
     */
    previewExtraction: useCallback(async (data: ScraperPreviewRequest) => {
      return executeApiCall(async () => {
        if (api_config.use_new_api_layer) {
          return scraper_service.preview_extraction(adaptPreviewRequest(data));
        } else {
          return preview_extraction_adapter(data);
        }
      });
    }, [executeApiCall])
  };
  
  /**
   * Job-related API methods
   */
  const jobApi = {
    /**
     * Create a new job
     */
    createJob: useCallback(async (data: CreateJobRequest) => {
      return executeApiCall(async () => {
        return job_service.create_job(data);
      });
    }, [executeApiCall]),
    
    /**
     * List all jobs with optional filtering
     */
    listJobs: useCallback(async (params?: ListJobsParams) => {
      return executeApiCall(async () => {
        return job_service.list_jobs(adaptListJobsParams(params));
      });
    }, [executeApiCall]),
    
    /**
     * Get a job by ID
     */
    getJob: useCallback(async (id: string) => {
      return executeApiCall(async () => {
        return job_service.get_job(id);
      });
    }, [executeApiCall]),
    
    /**
     * Update a job
     */
    updateJob: useCallback(async (id: string, data: Partial<Job>) => {
      return executeApiCall(async () => {
        return job_service.update_job(id, data);
      });
    }, [executeApiCall]),
    
    /**
     * Delete a job
     */
    deleteJob: useCallback(async (id: string) => {
      return executeApiCall(async () => {
        return job_service.delete_job(id);
      });
    }, [executeApiCall]),
    
    /**
     * Get job results
     */
    getJobResults: useCallback(async (jobId: string, params?: { page?: number; per_page?: number }) => {
      return executeApiCall(async () => {
        return job_service.get_job_results(jobId, params);
      });
    }, [executeApiCall]),
    
    /**
     * Get job status
     */
    getJobStatus: useCallback(async (jobId: string) => {
      return executeApiCall(async () => {
        return job_service.get_job_status(jobId);
      });
    }, [executeApiCall])
  };
  
  return {
    isLoading,
    error,
    clearError: () => setError(null),
    scraper: scraperApi,
    job: jobApi
  };
};
