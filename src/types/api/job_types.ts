/**
 * Job API Types
 * 
 * Type definitions for job-related API requests and responses
 * This file defines legacy API types for backwards compatibility.
 */

// Base types
export interface api_response<T> {
  success: boolean;
  data?: T;
  error?: string;
  status_code?: number;
}

// Job definition
export interface job_response {
  id: string;
  name: string;
  description?: string;
  scraper_id: string;
  status: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  result_count?: number;
  error_message?: string;
  options?: {
    max_pages?: number;
    delay_between_requests_ms?: number;
    custom_headers?: Record<string, string>;
    priority?: string;
    timeout_seconds?: number;
  };
  metadata?: Record<string, any>;
}

// Job result item
export interface job_result_item {
  id: string;
  job_id: string;
  scraper_id: string;
  url: string;
  data: Record<string, any>;
  extracted_at: string;
  success: boolean;
  error?: string;
}

// Job status update
export interface job_status_update {
  job_id: string;
  status: string;
  progress_percentage?: number;
  current_page?: number;
  total_pages?: number;
  result_count?: number;
  estimated_completion_time?: string;
  messages?: string[];
}

// Job create request
export interface job_create_request {
  name: string;
  description?: string;
  scraper_id: string;
  options?: {
    max_pages?: number;
    delay_between_requests_ms?: number;
    custom_headers?: Record<string, string>;
    priority?: string;
    timeout_seconds?: number;
  };
  schedule?: {
    frequency: string;
    cron_expression?: string;
    start_date?: string;
    end_date?: string;
    max_runs?: number;
  };
  metadata?: Record<string, any>;
}

// Job update request
export interface job_update_request {
  name?: string;
  description?: string;
  status?: string;
  options?: {
    max_pages?: number;
    delay_between_requests_ms?: number;
    custom_headers?: Record<string, string>;
    priority?: string;
    timeout_seconds?: number;
  };
  schedule?: {
    frequency?: string;
    cron_expression?: string;
    start_date?: string;
    end_date?: string;
    max_runs?: number;
  };
  metadata?: Record<string, any>;
}

// Job list parameters
export interface job_list_params {
  page?: number;
  per_page?: number;
  status?: string;
  scraper_id?: string;
  sort_by?: string;
  sort_order?: string;
  start_date?: string;
  end_date?: string;
}

// Job list response
export interface job_list_response {
  success: boolean;
  jobs: job_response[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  error?: string;
}
