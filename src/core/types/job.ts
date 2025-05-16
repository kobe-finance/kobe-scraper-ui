/**
 * Job Domain Types
 * 
 * This module defines types related to scraping jobs.
 */

import type { Metadata } from './api';

/**
 * Job status values
 */
export const JobStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const;

export type JobStatus = typeof JobStatus[keyof typeof JobStatus];

/**
 * Job priority values
 */
export const JobPriority = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high'
} as const;

export type JobPriority = typeof JobPriority[keyof typeof JobPriority];

/**
 * Job definition
 */
export interface Job {
  id: string;
  name: string;
  description?: string;
  scraper_id: string;
  status: JobStatus | string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  result_count?: number;
  error_count?: number;
  error_message?: string;
  metadata?: Metadata;
  options?: JobOptions;
}

/**
 * Job options for customizing execution
 */
export interface JobOptions {
  max_pages?: number;
  delay_between_requests_ms?: number;
  custom_headers?: Record<string, string>;
  priority?: JobPriority;
  timeout_seconds?: number;
}

/**
 * Job creation request
 */
export interface CreateJobRequest {
  name: string;
  description?: string;
  scraper_id: string;
  schedule?: JobSchedule;
  options?: JobOptions;
  metadata?: Metadata;
}

/**
 * Job schedule configuration
 */
export interface JobSchedule {
  frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
  cron_expression?: string;
  start_date?: string;
  end_date?: string;
  max_runs?: number;
}

/**
 * Job update request
 */
export interface UpdateJobRequest {
  name?: string;
  description?: string;
  status?: JobStatus;
  schedule?: JobSchedule;
  options?: JobOptions;
  metadata?: Metadata;
}

/**
 * Job list parameters
 */
export interface ListJobsParams {
  page?: number;
  per_page?: number;
  status?: JobStatus | string;
  scraper_id?: string;
  sort_by?: 'name' | 'created_at' | 'started_at' | 'completed_at';
  sort_order?: 'asc' | 'desc';
  search?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Job result item
 */
export interface JobResultItem {
  id: string;
  job_id: string;
  scraper_id: string;
  url: string;
  data: Record<string, any>;
  extracted_at: string;
  success: boolean;
  error_message?: string;
}

/**
 * Job status update
 */
export interface JobStatusUpdate {
  job_id: string;
  status: JobStatus;
  progress_percentage?: number;
  current_page?: number;
  total_pages?: number;
  result_count?: number;
  error_count?: number;
  error_message?: string;
  updated_at: string;
}
