/**
 * Job API Adapter
 * 
 * This adapter serves as a compatibility layer between the old API client implementation
 * and the new domain-oriented API services. It allows for a gradual migration to the
 * new API architecture while maintaining backward compatibility.
 */

import { api_config } from '../../core/config/api_config';
import { job_service } from '../api/job_service';
import { ApiError } from '../../core/errors/api_error';

// Import enums directly to help with type conversions
import { JobStatus, JobPriority } from '../../core/types/job';

// Import new types
import type { Job } from '../../core/types/job';
import type {
  CreateJobRequest,
  UpdateJobRequest,
  ListJobsParams,
  JobStatusUpdate,
  JobResultItem
} from '../../core/schemas/job_schemas';

// Legacy type mappings (for backward compatibility)
import type {
  job_create_request,
  job_update_request,
  job_list_params,
  job_response,
  job_result_item,
  job_status_update
} from '../../types/api/job_types';
import { apiClient } from '../apiClient';

/**
 * Determines whether to use the new API layer based on configuration
 * 
 * @returns Boolean indicating if the new API layer should be used
 */
export function use_new_api_layer(): boolean {
  return api_config.use_new_api_layer;
}

/**
 * Maps legacy job to domain model job
 * 
 * @param legacy_job - Old job format
 * @returns New domain model job
 */
function map_job_to_domain(legacy_job: job_response): Job {
  // Ensure status is a valid JobStatus enum value
  const statusValue: JobStatus = (() => {
    if (typeof legacy_job.status === 'string' && Object.values(JobStatus).includes(legacy_job.status as JobStatus)) {
      return legacy_job.status as JobStatus;
    }
    // Default to pending if invalid
    console.warn(`Invalid job status value: ${legacy_job.status}, defaulting to 'pending'`);
    return JobStatus.PENDING;
  })();

  // Ensure priority is a valid JobPriority enum value if it exists
  const priorityValue = legacy_job.options?.priority ? (() => {
    if (typeof legacy_job.options?.priority === 'string' && 
        Object.values(JobPriority).includes(legacy_job.options.priority as JobPriority)) {
      return legacy_job.options.priority as JobPriority;
    }
    // Default to normal if invalid
    console.warn(`Invalid job priority value: ${legacy_job.options?.priority}, defaulting to 'normal'`);
    return JobPriority.NORMAL;
  })() : undefined;

  return {
    id: legacy_job.id,
    name: legacy_job.name,
    description: legacy_job.description,
    scraper_id: legacy_job.scraper_id,
    status: statusValue,
    created_at: legacy_job.created_at,
    started_at: legacy_job.started_at,
    completed_at: legacy_job.completed_at,
    result_count: legacy_job.result_count,
    error_message: legacy_job.error_message,
    options: legacy_job.options ? {
      max_pages: legacy_job.options.max_pages,
      delay_between_requests_ms: legacy_job.options.delay_between_requests_ms,
      custom_headers: legacy_job.options.custom_headers,
      priority: priorityValue,
      timeout_seconds: legacy_job.options.timeout_seconds
    } : undefined,
    metadata: legacy_job.metadata
  };
}

/**
 * Maps domain model job to legacy job
 * 
 * @param job - New domain model job
 * @returns Legacy job format
 */
function map_job_to_legacy(job: Job): job_response {
  return {
    id: job.id,
    name: job.name,
    description: job.description,
    scraper_id: job.scraper_id,
    status: job.status.toString(), // Directly converting enum to string
    created_at: job.created_at,
    started_at: job.started_at,
    completed_at: job.completed_at,
    result_count: job.result_count,
    error_message: job.error_message,
    options: job.options ? {
      max_pages: job.options.max_pages,
      delay_between_requests_ms: job.options.delay_between_requests_ms,
      custom_headers: job.options.custom_headers,
      priority: job.options.priority?.toString() || 'normal', // Safely convert enum to string with default
      timeout_seconds: job.options.timeout_seconds
    } : undefined,
    metadata: job.metadata
  };
}

/**
 * Maps pagination params from legacy to new format
 * 
 * @param params - Legacy pagination parameters
 * @returns New domain model pagination parameters
 */
function map_list_params(params?: job_list_params): ListJobsParams | undefined {
  if (!params) return undefined;
  
  // Safely convert status to enum
  let status: JobStatus | undefined = undefined;
  if (params.status) {
    if (Object.values(JobStatus).includes(params.status as JobStatus)) {
      status = params.status as JobStatus;
    } else {
      console.warn(`Invalid job status in params: ${params.status}`);
    }
  }

  // Safely convert sort_by
  const validSortByValues = ['name', 'created_at', 'started_at', 'completed_at'];
  const sort_by = params.sort_by && validSortByValues.includes(params.sort_by) 
    ? params.sort_by as "name" | "created_at" | "started_at" | "completed_at"
    : undefined;
  
  // Safely convert sort_order
  const sort_order = params.sort_order === 'asc' || params.sort_order === 'desc'
    ? params.sort_order
    : undefined;
    
  return {
    page: params.page,
    per_page: params.per_page,
    status,
    sort_by,
    sort_order,
    scraper_id: params.scraper_id,
    start_date: params.start_date,
    end_date: params.end_date
  };
}

/**
 * Maps job create request from legacy to domain model
 * 
 * @param legacy_request - Legacy create request
 * @returns Domain model create request
 */
function map_create_request(data: job_create_request): CreateJobRequest {
  // If options contain priority, ensure it's a valid JobPriority enum value
  let options = data.options;
  if (data.options?.priority) {
    const priority = data.options.priority;
    if (!Object.values(JobPriority).includes(priority as JobPriority)) {
      console.warn(`Invalid job priority in create request: ${priority}, defaulting to 'normal'`);
      options = {
        ...data.options,
        priority: JobPriority.NORMAL
      };
    }
  }

  // Validate and transform schedule if needed
  let schedule = data.schedule;
  if (data.schedule?.frequency) {
    const validFrequencies = ['once', 'hourly', 'daily', 'weekly', 'monthly', 'custom'];
    if (!validFrequencies.includes(data.schedule.frequency)) {
      console.warn(`Invalid schedule frequency: ${data.schedule.frequency}, defaulting to 'once'`);
      schedule = {
        ...data.schedule,
        frequency: 'once'
      };
    }
  }

  return {
    name: data.name,
    description: data.description,
    scraper_id: data.scraper_id,
    options,
    schedule,
    metadata: data.metadata
  };
}

/**
 * Maps job update request from legacy to domain model
 * 
 * @param legacy_request - Legacy update request
 * @returns Domain model update request
 */
function map_update_request(data: job_update_request): UpdateJobRequest {
  // Build the update request with correct type conversions
  const update_request: UpdateJobRequest = {};
  
  // Add each field if it exists with proper validation
  if (data.name !== undefined) update_request.name = data.name;
  if (data.description !== undefined) update_request.description = data.description;
  
  // Safely convert status to enum if provided
  if (data.status !== undefined) {
    if (Object.values(JobStatus).includes(data.status as JobStatus)) {
      update_request.status = data.status as JobStatus;
    } else {
      console.warn(`Invalid job status in update request: ${data.status}`);
      // Don't set status if invalid to avoid runtime errors
    }
  }
  
  if (data.metadata !== undefined) update_request.metadata = data.metadata;
  
  // Process options if provided
  if (data.options !== undefined) {
    let options = { ...data.options };
    
    // Validate priority if present
    if (data.options.priority) {
      if (!Object.values(JobPriority).includes(data.options.priority as JobPriority)) {
        console.warn(`Invalid job priority in update request: ${data.options.priority}`);
        options.priority = JobPriority.NORMAL;
      } else {
        options.priority = data.options.priority as JobPriority;
      }
    }
    
    update_request.options = options;
  }
  
  // Process schedule if provided
  if (data.schedule !== undefined) {
    let schedule = { ...data.schedule };
    
    // Validate frequency if present
    if (data.schedule.frequency) {
      const validFrequencies = ['once', 'hourly', 'daily', 'weekly', 'monthly', 'custom'];
      if (!validFrequencies.includes(data.schedule.frequency)) {
        console.warn(`Invalid schedule frequency in update request: ${data.schedule.frequency}`);
        schedule.frequency = 'once';
      }
    }
    
    update_request.schedule = schedule;
  }
  
  return update_request;
}

/**
 * Maps job result item from domain to legacy format
 * 
 * @param result_item - Domain model result item
 * @returns Legacy result item format
 */
function map_result_item_to_legacy(result_item: JobResultItem): job_result_item {
  return {
    id: result_item.id,
    job_id: result_item.job_id,
    scraper_id: result_item.scraper_id,
    url: result_item.url,
    data: result_item.data,
    extracted_at: result_item.extracted_at,
    success: result_item.success,
    error: result_item.error_message // Map error_message to error for legacy format
  };
}

/**
 * Maps job status update from domain to legacy format
 * 
 * @param status_update - Domain model status update
 * @returns Legacy status update format
 */
function map_status_update_to_legacy(status_update: JobStatusUpdate): job_status_update {
  // Create a temporary variable of job_status_update type
  const legacy_status: job_status_update = {
    job_id: status_update.job_id,
    status: status_update.status.toString(),
    progress_percentage: status_update.progress_percentage,
    current_page: status_update.current_page,
    total_pages: status_update.total_pages,
    result_count: status_update.result_count
  };
  
  // Add optional fields that need special handling
  if (status_update.error_message) {
    legacy_status.messages = [status_update.error_message];
  }
  
  // Map the updated_at to estimated_completion_time if needed
  if (status_update.updated_at) {
    legacy_status.estimated_completion_time = status_update.updated_at;
  }
  
  return legacy_status;
}

/**
 * Adapter function for creating a job
 * 
 * @param data - Legacy create request
 * @returns New domain model job
 */
export async function create_job_adapter(data: job_create_request): Promise<Job> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation with proper type conversion
      const mapped_request = map_create_request(data);
      return await job_service.create_job(mapped_request);
    } else {
      // Use legacy implementation
      const response = await api_client.post('/jobs', data);
      return map_job_to_domain(response.data.job);
    }
  } catch (error) {
    console.error('Error in create job adapter:', error);
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to create job',
      400
    );
  }
}

/**
 * Adapter function for listing jobs
 * 
 * @param params - Legacy list parameters
 * @returns List of domain model jobs
 */
export async function list_jobs_adapter(params?: job_list_params): Promise<{
  jobs: Job[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation with proper type conversion
      const mapped_params = map_list_params(params);
      const response = await job_service.list_jobs(mapped_params);
      
      return {
        jobs: response.items,
        total: response.total,
        page: response.page,
        per_page: response.per_page,
        total_pages: response.total_pages
      };
    } else {
      // Use legacy implementation
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
      if (params?.scraper_id) queryParams.append('scraper_id', params.scraper_id);
      if (params?.start_date) queryParams.append('start_date', params.start_date);
      if (params?.end_date) queryParams.append('end_date', params.end_date);

      const response = await apiClient.get(`/jobs?${queryParams.toString()}`);
      const jobs = response.data.jobs.map(map_job_to_domain);
      
      return {
        jobs,
        total: response.data.total,
        page: response.data.page,
        per_page: response.data.per_page,
        total_pages: response.data.total_pages
      };
    }
  } catch (error) {
    console.error('Error in list jobs adapter:', error);
    
    // Return empty list with error info
    return {
      jobs: [],
      total: 0,
      page: params?.page || 1,
      per_page: params?.per_page || 10,
      total_pages: 0
    };
  }
}

/**
 * Adapter function for getting a job
 * 
 * @param id - Job ID
 * @returns Domain model job
 */
export async function get_job_adapter(id: string): Promise<Job> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation
      return await job_service.get_job(id);
    } else {
      // Use legacy implementation
      // Use the getJobStatus function as a proxy since we don't have a direct getJob method
      const response = await apiClient.getJobStatus(id);
      // Create a minimal job object from the status response
      return map_job_to_domain({
        id,
        name: `Job ${id}`,
        scraper_id: '',  // We don't have this in the status response
        status: response.status,
        created_at: new Date().toISOString(),
        // Add other fields as needed
      });
    }
  } catch (error) {
    console.error('Error in get job adapter:', error);
    throw new ApiError(
      error instanceof Error ? error.message : `Failed to get job ${id}`,
      404,
      { job_id: id }
    );
  }
}

/**
 * Adapter function for updating a job
 * 
 * @param id - Job ID
 * @param data - Legacy update request
 * @returns Updated domain model job
 */
export async function update_job_adapter(id: string, data: job_update_request): Promise<Job> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation with proper type conversion
      const mapped_request = map_update_request(data);
      return await job_service.update_job(id, mapped_request);
    } else {
      // Use legacy implementation
      // Since apiClient doesn't have a direct job update method,
      // we'll need to implement one or use a general request
      // This is a placeholder for the actual implementation
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      return map_job_to_domain(responseData.job);
    }
  } catch (error) {
    console.error('Error in update job adapter:', error);
    throw new ApiError(
      error instanceof Error ? error.message : `Failed to update job ${id}`,
      400,
      { job_id: id }
    );
  }
}

/**
 * Adapter function for deleting a job
 * 
 * @param id - Job ID
 * @returns Success response
 */
export async function delete_job_adapter(id: string): Promise<{ success: boolean }> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation
      const response = await job_service.delete_job(id);
      return { success: response.success };
    } else {
      // Use legacy implementation
      // Since apiClient doesn't have a direct job delete method,
      // we'll need to implement one or use a general request
      // This is a placeholder for the actual implementation
      await fetch(`/api/jobs/${id}`, {
        method: 'DELETE'
      });
      return { success: true };
    }
  } catch (error) {
    console.error('Error in delete job adapter:', error);
    return { success: false };
  }
}

/**
 * Adapter function for getting job results
 * 
 * @param job_id - Job ID
 * @param params - Pagination parameters
 * @returns Job results
 */
export async function get_job_results_adapter(
  job_id: string, 
  params?: { page?: number; per_page?: number }
): Promise<{
  results: JobResultItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation
      const response = await job_service.get_job_results(job_id, params);
      
      return {
        results: response.items,
        total: response.total,
        page: response.page,
        per_page: response.per_page,
        total_pages: response.total_pages
      };
    } else {
      // Use legacy implementation - for now create mock data since we don't have a direct API
      const page = params?.page || 1;
      const per_page = params?.per_page || 10;
      
      // Create mock results for testing purposes
      const mockResults = Array(3).fill(null).map((_, i) => ({
        id: `result-${i + 1}`,
        job_id,
        scraper_id: 'mock-scraper',
        url: `https://example.com/page/${i + 1}`,
        data: { title: `Result ${i + 1}`, content: `Content for result ${i + 1}` },
        extracted_at: new Date().toISOString(),
        success: true,
        error_message: undefined
      }));
      
      return {
        results: mockResults,
        total: mockResults.length,
        page,
        per_page,
        total_pages: Math.ceil(mockResults.length / per_page)
      };
    }
  } catch (error) {
    console.error('Error in get job results adapter:', error);
    
    // Return empty list with error info
    return {
      results: [],
      total: 0,
      page: params?.page || 1,
      per_page: params?.per_page || 10,
      total_pages: 0
    };
  }
}

/**
 * Adapter function for getting job status
 * 
 * @param job_id - Job ID
 * @returns Job status update
 */
export async function get_job_status_adapter(job_id: string): Promise<job_status_update> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation
      const status = await job_service.get_job_status(job_id);
      return map_status_update_to_legacy(status);
    } else {
      // Use legacy implementation
      const response = await apiClient.getJobStatus(job_id);
      return response;
    }
  } catch (error) {
    console.error('Error in get job status adapter:', error);
    
    // Return a default status with error
    return {
      job_id,
      status: 'error',
      progress_percentage: 0,
      messages: [`Error retrieving job status: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}
