/**
 * Scraper Domain Types
 * 
 * This module defines types related to scrapers and extractions.
 */

import { Metadata } from './api';

/**
 * Selector types supported by the scraper
 */
export enum SelectorType {
  CSS = 'css',
  XPATH = 'xpath',
  REGEX = 'regex',
  JSON_PATH = 'json_path'
}

/**
 * Data types for extracted fields
 */
export enum DataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  URL = 'url',
  IMAGE = 'image'
}

/**
 * Proxy types supported by the scraper
 */
export enum ProxyType {
  NONE = 'none',
  HTTP = 'http',
  SOCKS5 = 'socks5'
}

/**
 * Scraper status
 */
export enum ScraperStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error'
}

/**
 * Extraction field definition
 */
export interface ExtractionField {
  name: string;
  selector: string;
  selector_type: SelectorType | string;
  data_type?: DataType | string;
  required?: boolean;
  description?: string;
  metadata?: Metadata;
}

/**
 * Scraper definition
 */
export interface Scraper {
  id: string;
  name: string;
  description?: string;
  url: string;
  selector?: string;
  selector_type?: SelectorType | string;
  max_depth: number;
  proxy_type: ProxyType | string;
  proxy_url?: string;
  javascript_enabled: boolean;
  respect_robots_txt: boolean;
  creation_date: string;
  last_run_date?: string;
  status: ScraperStatus | string;
  extraction_fields?: ExtractionField[];
  metadata?: Metadata;
}

/**
 * Scraper creation request
 */
export interface CreateScraperRequest {
  name: string;
  description?: string;
  url: string;
  selector?: string;
  selector_type?: SelectorType | string;
  max_depth?: number;
  proxy_type?: ProxyType | string;
  proxy_url?: string;
  javascript_enabled?: boolean;
  respect_robots_txt?: boolean;
  extraction_fields?: ExtractionField[];
  metadata?: Metadata;
}

/**
 * Scraper update request
 */
export interface UpdateScraperRequest {
  name?: string;
  description?: string;
  url?: string;
  selector?: string;
  selector_type?: SelectorType | string;
  max_depth?: number;
  proxy_type?: ProxyType | string;
  proxy_url?: string;
  javascript_enabled?: boolean;
  respect_robots_txt?: boolean;
  status?: ScraperStatus | string;
  extraction_fields?: ExtractionField[];
  metadata?: Metadata;
}

/**
 * Scraper list parameters
 */
export interface ListScrapersParams {
  page?: number;
  per_page?: number;
  status?: ScraperStatus | string;
  sort_by?: 'name' | 'creation_date' | 'last_run_date';
  sort_order?: 'asc' | 'desc';
  search?: string;
}

/**
 * Preview extraction request
 */
export interface ScraperPreviewRequest {
  url: string;
  selector_type: SelectorType | string;
  main_selector?: string;
  extraction_fields?: ExtractionField[];
  javascript_enabled: boolean;
  respect_robots_txt?: boolean;
  max_depth?: number;
}

/**
 * Preview extraction field result
 */
export interface FieldPreviewResult {
  value: string | number | boolean | null;
  success: boolean;
  error?: string;
}

/**
 * Preview extraction response
 */
export interface ScraperPreviewResponse {
  success: boolean;
  data: {
    [field_name: string]: FieldPreviewResult;
  };
  errors?: Record<string, string>;
  screenshot?: string;
  html_content?: string;
  execution_time_ms?: number;
}

/**
 * Run scraper request
 */
export interface RunScraperRequest {
  scraper_id: string;
  options?: {
    max_pages?: number;
    delay_between_requests_ms?: number;
    custom_headers?: Record<string, string>;
  };
}

/**
 * Run scraper response
 */
export interface RunScraperResponse {
  success: boolean;
  job_id?: string;
  error?: string;
}
