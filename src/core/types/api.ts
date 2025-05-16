/**
 * Core API Types
 * 
 * This module defines common types shared across all API operations.
 */

/**
 * Generic API response type
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Common filter parameters
 */
export interface FilterParams {
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
}

/**
 * Combine pagination and filtering
 */
export type ListParams = PaginationParams & FilterParams;

/**
 * General metadata object
 */
export interface Metadata {
  [key: string]: any;
}

/**
 * Entity reference - used for relationships
 */
export interface EntityReference {
  id: string;
  type: string;
  name?: string;
}
