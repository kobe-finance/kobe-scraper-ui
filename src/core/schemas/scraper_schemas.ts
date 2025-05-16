/**
 * Scraper Zod Schemas
 * 
 * This module provides Zod schemas for runtime validation of scraper-related data.
 */

import { z } from 'zod';
import {
  SelectorType,
  DataType,
  ProxyType,
  ScraperStatus
} from '../types/scraper';

/**
 * Schema for extraction field
 */
export const extraction_field_schema = z.object({
  name: z.string().min(1, 'Field name is required'),
  selector: z.string().min(1, 'Selector is required'),
  selector_type: z.nativeEnum(SelectorType),
  data_type: z.nativeEnum(DataType).optional(),
  required: z.boolean().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

/**
 * Schema for field preview result
 */
export const field_preview_result_schema = z.object({
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  success: z.boolean(),
  error: z.string().optional()
});

/**
 * Schema for scraper preview request
 */
export const scraper_preview_request_schema = z.object({
  url: z.string().url('Valid URL is required'),
  selector_type: z.nativeEnum(SelectorType),
  main_selector: z.string().optional(),
  extraction_fields: z.array(extraction_field_schema).optional(),
  javascript_enabled: z.boolean(),
  respect_robots_txt: z.boolean().optional(),
  max_depth: z.number().int().min(1).optional()
});

/**
 * Schema for scraper preview response
 */
export const scraper_preview_response_schema = z.object({
  success: z.boolean(),
  data: z.record(z.string(), field_preview_result_schema),
  errors: z.record(z.string(), z.string()).optional(),
  screenshot: z.string().optional(),
  html_content: z.string().optional(),
  execution_time_ms: z.number().optional()
});

/**
 * Schema for creating a scraper
 */
export const create_scraper_schema = z.object({
  name: z.string().min(1, 'Scraper name is required'),
  description: z.string().optional(),
  url: z.string().url('Valid URL is required'),
  selector: z.string().optional(),
  selector_type: z.nativeEnum(SelectorType).optional(),
  max_depth: z.number().int().min(1).optional().default(1),
  proxy_type: z.nativeEnum(ProxyType).optional().default(ProxyType.NONE),
  proxy_url: z.string().url('Valid proxy URL is required').optional(),
  javascript_enabled: z.boolean().optional().default(false),
  respect_robots_txt: z.boolean().optional().default(true),
  extraction_fields: z.array(extraction_field_schema).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

/**
 * Schema for updating a scraper
 */
export const update_scraper_schema = z.object({
  name: z.string().min(1, 'Scraper name is required').optional(),
  description: z.string().optional(),
  url: z.string().url('Valid URL is required').optional(),
  selector: z.string().optional(),
  selector_type: z.nativeEnum(SelectorType).optional(),
  max_depth: z.number().int().min(1).optional(),
  proxy_type: z.nativeEnum(ProxyType).optional(),
  proxy_url: z.string().url('Valid proxy URL is required').optional(),
  javascript_enabled: z.boolean().optional(),
  respect_robots_txt: z.boolean().optional(),
  status: z.nativeEnum(ScraperStatus).optional(),
  extraction_fields: z.array(extraction_field_schema).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

/**
 * Schema for a complete scraper object
 */
export const scraper_schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  url: z.string().url(),
  selector: z.string().optional(),
  selector_type: z.nativeEnum(SelectorType).optional(),
  max_depth: z.number().int().min(1),
  proxy_type: z.nativeEnum(ProxyType),
  proxy_url: z.string().url().optional(),
  javascript_enabled: z.boolean(),
  respect_robots_txt: z.boolean(),
  creation_date: z.string(),
  last_run_date: z.string().optional(),
  status: z.nativeEnum(ScraperStatus),
  extraction_fields: z.array(extraction_field_schema).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

/**
 * Schema for listing scrapers parameters
 */
export const list_scrapers_params_schema = z.object({
  page: z.number().int().min(1).optional(),
  per_page: z.number().int().min(1).max(100).optional(),
  status: z.nativeEnum(ScraperStatus).optional(),
  sort_by: z.enum(['name', 'creation_date', 'last_run_date']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional()
});

/**
 * Schema for run scraper request
 */
export const run_scraper_request_schema = z.object({
  scraper_id: z.string(),
  options: z.object({
    max_pages: z.number().int().min(1).optional(),
    delay_between_requests_ms: z.number().int().min(0).optional(),
    custom_headers: z.record(z.string(), z.string()).optional()
  }).optional()
});

/**
 * Schema for run scraper response
 */
export const run_scraper_response_schema = z.object({
  success: z.boolean(),
  job_id: z.string().optional(),
  error: z.string().optional()
});

/**
 * Type inference helpers
 */
export type ExtractionField = z.infer<typeof extraction_field_schema>;
export type ScraperPreviewRequest = z.infer<typeof scraper_preview_request_schema>;
export type ScraperPreviewResponse = z.infer<typeof scraper_preview_response_schema>;
export type CreateScraperRequest = z.infer<typeof create_scraper_schema>;
export type UpdateScraperRequest = z.infer<typeof update_scraper_schema>;
export type Scraper = z.infer<typeof scraper_schema>;
export type ListScrapersParams = z.infer<typeof list_scrapers_params_schema>;
export type RunScraperRequest = z.infer<typeof run_scraper_request_schema>;
export type RunScraperResponse = z.infer<typeof run_scraper_response_schema>;
