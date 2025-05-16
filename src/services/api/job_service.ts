/**
 * Job API Service
 * 
 * Handles all job-related API requests using the domain model and schema validation.
 * This service provides type-safe methods for all job operations with proper error handling.
 */
import { BaseApiService } from './base_service';
import type { Job } from '../../core/types/job';
import type { ApiResponse, PaginatedResponse } from '../../core/types/api';
import type {
  CreateJobRequest,
  UpdateJobRequest,
  ListJobsParams,
  JobStatusUpdate,
  JobResultItem
} from '../../core/schemas/job_schemas';

// Import validation schemas
import {
  job_schema,
  create_job_schema,
  update_job_schema,
  list_jobs_params_schema,
  job_status_update_schema,
  job_result_item_schema
} from '../../core/schemas/job_schemas';

// Import mock data responses
import { mock_job_responses } from '../mock';

/**
 * Service for handling job-related API operations
 * 
 * Provides methods for creating, retrieving, updating, and deleting jobs,
 * as well as retrieving job results and status updates.
 */
export class JobService extends BaseApiService {
  /**
   * Create a new job based on a scraper
   * 
   * @param data - Job creation data including scraper ID and configuration
   * @returns The created job
   */
  async create_job(data: CreateJobRequest): Promise<Job> {
    // Validate request data against schema
    const validated_data = this.validate<CreateJobRequest>(
      data,
      create_job_schema
    );

    const endpoint = this.get_endpoint('jobs', 'create');
    
    // Create mock function
    const mock_fn = async () => {
      return this.validate<Job>(
        mock_job_responses.create_job(validated_data),
        job_schema
      );
    };
    
    // Make API call
    const response = await this.post<unknown>(endpoint, validated_data, undefined, mock_fn);
    
    // Validate response
    return this.validate<Job>(response, job_schema);
  }

  /**
   * Get a list of jobs with filtering and pagination
   * 
   * @param params - List parameters including pagination, sorting and filtering
   * @returns List of jobs matching the criteria
   */
  async list_jobs(params?: ListJobsParams): Promise<PaginatedResponse<Job>> {
    // Validate params if provided
    const validated_params = params ? 
      this.validate<ListJobsParams>(params, list_jobs_params_schema) : 
      undefined;

    const endpoint = this.get_endpoint('jobs', 'list');
    
    // Create mock function
    const mock_fn = async () => {
      return mock_job_responses.list_jobs(validated_params);
    };
    
    // Make API call
    const response = await this.get<unknown>(endpoint, validated_params, undefined, mock_fn);
    
    // Validate the response structure
    if (typeof response !== 'object' || response === null) {
      throw new Error('Invalid response format from API');
    }
    
    // Cast response to basic structure with data array
    const raw_response = response as Record<string, unknown>;
    
    // Ensure data property exists and is an array
    if (!('data' in raw_response) || !Array.isArray(raw_response.data)) {
      throw new Error('API response missing data array');
    }
    
    // Validate each job in the response
    const validated_jobs: Job[] = []; 
    for (const item of raw_response.data) {
      validated_jobs.push(this.validate<Job>(item, job_schema));
    }
    
    // Create properly structured paginated response
    const paginated_response: PaginatedResponse<Job> = {
      data: validated_jobs,
      items: validated_jobs.length,
      total: typeof raw_response.total === 'number' ? raw_response.total : validated_jobs.length,
      page: typeof raw_response.page === 'number' ? raw_response.page : 1,
      per_page: typeof raw_response.per_page === 'number' ? raw_response.per_page : validated_jobs.length,
      total_pages: typeof raw_response.total_pages === 'number' ? raw_response.total_pages : 1
    };
    
    return paginated_response;
  }

  /**
   * Get a job by ID
   * 
   * @param id - Job ID
   * @returns The job details
   */
  async get_job(id: string): Promise<Job> {
    if (!id) throw new Error('Job ID is required');

    const endpoint = this.get_endpoint('jobs', 'get', { id });
    
    // Create mock function
    const mock_fn = async () => {
      return this.validate<Job>(
        mock_job_responses.get_job(id),
        job_schema
      );
    };
    
    // Make API call
    const response = await this.get<unknown>(endpoint, undefined, undefined, mock_fn);
    
    // Validate response
    return this.validate<Job>(response, job_schema);
  }

  /**
   * Update an existing job
   * 
   * @param id - Job ID
   * @param data - Updated job data
   * @returns The updated job
   */
  async update_job(id: string, data: UpdateJobRequest): Promise<Job> {
    if (!id) throw new Error('Job ID is required');

    // Validate request data
    const validated_data = this.validate<UpdateJobRequest>(
      data,
      update_job_schema
    );

    const endpoint = this.get_endpoint('jobs', 'update', { id });
    
    // Create mock function
    const mock_fn = async () => {
      return this.validate<Job>(
        mock_job_responses.update_job(id, validated_data),
        job_schema
      );
    };
    
    // Make API call
    const response = await this.put<unknown>(endpoint, validated_data, undefined, mock_fn);
    
    // Validate response
    return this.validate<Job>(response, job_schema);
  }

  /**
   * Delete a job
   * 
   * @param id - Job ID
   * @returns Success status
   */
  async delete_job(id: string): Promise<ApiResponse<void>> {
    if (!id) throw new Error('Job ID is required');

    const endpoint = this.get_endpoint('jobs', 'delete', { id });
    
    // Create mock function
    const mock_fn = async () => {
      return mock_job_responses.delete_job(id) as unknown as ApiResponse<void>;
    };
    
    // Make API call
    const response = await this.delete<ApiResponse<void>>(endpoint, undefined, mock_fn);
    
    return response;
  }

  /**
   * Get results for a specific job
   * 
   * @param job_id - Job ID
   * @param params - Optional pagination parameters
   * @returns Paginated list of job results
   */
  async get_job_results(
    job_id: string, 
    params?: { page?: number; per_page?: number }
  ): Promise<PaginatedResponse<JobResultItem>> {
    if (!job_id) throw new Error('Job ID is required');

    const endpoint = this.get_endpoint('jobs', 'results', { id: job_id });
    
    // Create mock function
    const mock_fn = async () => {
      return mock_job_responses.get_job_results(job_id, { page: params?.page, per_page: params?.per_page });
    };
    
    // Make API call
    const response = await this.get<unknown>(endpoint, params, undefined, mock_fn);
    
    // Validate the response structure
    if (typeof response !== 'object' || response === null) {
      throw new Error('Invalid response format from API');
    }
    
    // Cast response to basic structure with data array
    const raw_response = response as Record<string, unknown>;
    
    // Ensure data property exists and is an array
    if (!('data' in raw_response) || !Array.isArray(raw_response.data)) {
      throw new Error('API response missing data array');
    }
    
    // Validate each result item
    const validated_results: JobResultItem[] = []; 
    for (const item of raw_response.data) {
      validated_results.push(this.validate<JobResultItem>(item, job_result_item_schema));
    }
    
    // Create properly structured paginated response
    const paginated_response: PaginatedResponse<JobResultItem> = {
      data: validated_results,
      items: validated_results.length,
      total: typeof raw_response.total === 'number' ? raw_response.total : validated_results.length,
      page: typeof raw_response.page === 'number' ? raw_response.page : 1,
      per_page: typeof raw_response.per_page === 'number' ? raw_response.per_page : validated_results.length,
      total_pages: typeof raw_response.total_pages === 'number' ? raw_response.total_pages : 1
    };
    
    return paginated_response;
  }

  /**
   * Get the current status of a job
   * 
   * @param job_id - Job ID
   * @returns Current job status information
   */
  async get_job_status(job_id: string): Promise<JobStatusUpdate> {
    if (!job_id) throw new Error('Job ID is required');

    const endpoint = this.get_endpoint('jobs', 'status', { id: job_id });
    
    // Create mock function
    const mock_fn = async () => {
      const status = mock_job_responses.get_job_status(job_id);
      return this.validate<JobStatusUpdate>(status, job_status_update_schema);
    };
    
    // Make API call
    const response = await this.get<unknown>(endpoint, undefined, undefined, mock_fn);
    
    // Validate response
    return this.validate<JobStatusUpdate>(response, job_status_update_schema);
  }
}

// Export a singleton instance
export const job_service = new JobService();
