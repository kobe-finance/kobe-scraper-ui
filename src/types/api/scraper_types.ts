/**
 * Scraper API Types
 * 
 * Type definitions for scraper-related API requests and responses
 */

// Base types
export interface api_response<T> {
  success: boolean;
  data?: T;
  error?: string;
  status_code?: number;
}

// Extraction field definition
export interface extraction_field {
  name: string;
  selector: string;
  selector_type: string;
  data_type?: string;
  required?: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

// Scraper preview request
export interface scraper_preview_request {
  url: string;
  selector_type: string;
  main_selector?: string;
  extraction_fields?: extraction_field[];
  javascript_enabled: boolean;
  respect_robots_txt?: boolean;
  max_depth?: number;
}

// Preview result for a specific field
export interface field_preview_result {
  value: string | number | boolean | null;
  success: boolean;
  error?: string;
}

// Scraper preview response
export interface scraper_preview_response {
  success: boolean;
  data: {
    [field_name: string]: field_preview_result;
  };
  errors?: Record<string, string>;
  screenshot?: string;
  html_content?: string;
  execution_time_ms?: number;
}

// Scraper definition
export interface scraper {
  id: string;
  name: string;
  description?: string;
  url: string;
  selector?: string;
  max_depth: number;
  proxy_type: 'none' | 'http' | 'socks5';
  proxy_url?: string;
  javascript_enabled: boolean;
  respect_robots_txt: boolean;
  creation_date: string;
  last_run_date?: string;
  status: 'active' | 'inactive' | 'error';
  extraction_fields?: extraction_field[];
}

// Request to create a new scraper
export interface create_scraper_request {
  name: string;
  description?: string;
  url: string;
  selector?: string;
  selector_type?: string;
  max_depth?: number;
  proxy_type?: 'none' | 'http' | 'socks5';
  proxy_url?: string;
  javascript_enabled?: boolean;
  respect_robots_txt?: boolean;
  extraction_fields?: extraction_field[];
}

// Response when creating a scraper
export interface create_scraper_response {
  success: boolean;
  scraper?: scraper;
  error?: string;
}

// Request to run a scraper
export interface run_scraper_request {
  scraper_id: string;
  options?: {
    max_pages?: number;
    delay_between_requests_ms?: number;
    custom_headers?: Record<string, string>;
  };
}

// Response when running a scraper
export interface run_scraper_response {
  success: boolean;
  job_id?: string;
  error?: string;
}

// List scrapers request parameters
export interface list_scrapers_params {
  page?: number;
  per_page?: number;
  status?: 'active' | 'inactive' | 'error' | 'all';
  sort_by?: 'name' | 'creation_date' | 'last_run_date';
  sort_order?: 'asc' | 'desc';
  search?: string;
}

// List scrapers response
export interface list_scrapers_response {
  success: boolean;
  scrapers: scraper[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  error?: string;
}
