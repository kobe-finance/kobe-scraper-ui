/**
 * Job Zod Schemas
 * 
 * This module provides Zod schemas for runtime validation of job-related data.
 */

import { z } from 'zod';
import { JobStatus } from '../types/job';

/**
 * Schema for job options
 */
export const job_options_schema = z.object({
  max_pages: z.number().int().min(1).optional(),
  delay_between_requests_ms: z.number().int().min(0).optional(),
  custom_headers: z.record(z.string(), z.string()).optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
  timeout_seconds: z.number().int().min(1).optional()
});

/**
 * Schema for job schedule
 */
export const job_schedule_schema = z.object({
  frequency: z.enum(['once', 'hourly', 'daily', 'weekly', 'monthly', 'custom']),
  cron_expression: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  max_runs: z.number().int().min(1).optional()
});

/**
 * Schema for creating a job
 */
export const create_job_schema = z.object({
  name: z.string().min(1, 'Job name is required'),
  description: z.string().optional(),
  scraper_id: z.string(),
  schedule: job_schedule_schema.optional(),
  options: job_options_schema.optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

/**
 * Schema for updating a job
 */
export const update_job_schema = z.object({
  name: z.string().min(1, 'Job name is required').optional(),
  description: z.string().optional(),
  status: z.nativeEnum(JobStatus).optional(),
  schedule: job_schedule_schema.optional(),
  options: job_options_schema.optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

/**
 * Schema for a complete job object
 */
export const job_schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  scraper_id: z.string(),
  status: z.nativeEnum(JobStatus),
  created_at: z.string(),
  started_at: z.string().optional(),
  completed_at: z.string().optional(),
  result_count: z.number().int().min(0).optional(),
  error_count: z.number().int().min(0).optional(),
  error_message: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  options: job_options_schema.optional()
});

/**
 * Schema for job result item
 */
export const job_result_item_schema = z.object({
  id: z.string(),
  job_id: z.string(),
  scraper_id: z.string(),
  url: z.string().url(),
  data: z.record(z.string(), z.any()),
  extracted_at: z.string(),
  success: z.boolean(),
  error_message: z.string().optional()
});

/**
 * Schema for job status update
 */
export const job_status_update_schema = z.object({
  job_id: z.string(),
  status: z.nativeEnum(JobStatus),
  progress_percentage: z.number().min(0).max(100).optional(),
  current_page: z.number().int().min(0).optional(),
  total_pages: z.number().int().min(0).optional(),
  result_count: z.number().int().min(0).optional(),
  error_count: z.number().int().min(0).optional(),
  error_message: z.string().optional(),
  updated_at: z.string()
});

/**
 * Schema for listing jobs parameters
 */
export const list_jobs_params_schema = z.object({
  page: z.number().int().min(1).optional(),
  per_page: z.number().int().min(1).max(100).optional(),
  status: z.nativeEnum(JobStatus).optional(),
  scraper_id: z.string().optional(),
  sort_by: z.enum(['name', 'created_at', 'started_at', 'completed_at']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

/**
 * Type inference helpers
 */
export type JobOptions = z.infer<typeof job_options_schema>;
export type JobSchedule = z.infer<typeof job_schedule_schema>;
export type CreateJobRequest = z.infer<typeof create_job_schema>;
export type UpdateJobRequest = z.infer<typeof update_job_schema>;
export type Job = z.infer<typeof job_schema>;
export type JobResultItem = z.infer<typeof job_result_item_schema>;
export type JobStatusUpdate = z.infer<typeof job_status_update_schema>;
export type ListJobsParams = z.infer<typeof list_jobs_params_schema>;
