/**
 * Scraper API Adapter
 * 
 * This adapter serves as a compatibility layer between the old API client implementation
 * and the new domain-oriented API services. It allows for a gradual migration to the
 * new API architecture while maintaining backward compatibility.
 */

import { api_config } from '../../core/config/api_config';
import { scraper_service } from '../api/scraper_service';
import { ApiError } from '../../core/errors/api_error';

// Import enums directly to help with type conversions
import { SelectorType, ProxyType, ScraperStatus, DataType } from '../../core/types/scraper';

// Import new types
import type { Scraper } from '../../core/types/scraper';
import type {
  ScraperPreviewRequest,
  ListScrapersParams,
  RunScraperRequest
} from '../../core/schemas/scraper_schemas';

// Legacy type mappings (for backward compatibility)
import type {
  scraper_preview_request,
  scraper_preview_response,
  create_scraper_request,
  create_scraper_response,
  list_scrapers_params,
  list_scrapers_response,
  scraper,
  run_scraper_request,
  run_scraper_response
} from '../../types/api/scraper_types';

/**
 * Determines whether to use the new API layer based on configuration
 * 
 * @returns Boolean indicating if the new API layer should be used
 */
export function use_new_api_layer(): boolean {
  return api_config.use_new_api_layer;
}

/**
 * Maps old scraper preview request to new domain model
 * 
 * @param legacy_request - Old request format
 * @returns New domain model request
 */
export function map_preview_request(legacy_request: scraper_preview_request): ScraperPreviewRequest {
  return {
    url: legacy_request.url,
    selector_type: legacy_request.selector_type as SelectorType,
    main_selector: legacy_request.main_selector || "",
    extraction_fields: legacy_request.extraction_fields?.map(field => ({
      name: field.name,
      selector: field.selector,
      selector_type: field.selector_type as SelectorType,
      description: field.description,
      data_type: field.data_type as DataType,
      required: field.required,
      // Handle metadata if it exists, otherwise create an empty object
      metadata: field.metadata || {}
    })),
    javascript_enabled: legacy_request.javascript_enabled || false,
    respect_robots_txt: legacy_request.respect_robots_txt || true,
    max_depth: legacy_request.max_depth || 1
  };
}

/**
 * Maps new scraper type to legacy scraper type
 * 
 * @param scraper - New domain model scraper
 * @returns Legacy scraper format
 */
function map_scraper_to_legacy(scraper: Scraper): scraper {
  return {
    id: scraper.id,
    name: scraper.name,
    description: scraper.description,
    url: scraper.url,
    selector: scraper.selector,
    selector_type: scraper.selector_type as string,
    max_depth: scraper.max_depth,
    proxy_type: scraper.proxy_type as string,
    proxy_url: scraper.proxy_url,
    javascript_enabled: scraper.javascript_enabled,
    respect_robots_txt: scraper.respect_robots_txt,
    creation_date: scraper.creation_date,
    last_run_date: scraper.last_run_date,
    status: scraper.status as string,
    extraction_fields: scraper.extraction_fields
  };
}

/**
 * Maps pagination params from legacy to new format
 * 
 * @param params - Legacy pagination parameters
 * @returns New domain model pagination parameters
 */
function map_list_params(params?: list_scrapers_params): ListScrapersParams | undefined {
  if (!params) return undefined;
  
  return {
    page: params.page,
    per_page: params.per_page,
    status: params.status as ScraperStatus,
    sort_by: params.sort_by as "name" | "creation_date" | "last_run_date",
    sort_order: params.sort_order as "asc" | "desc",
    search: params.search
  };
}

/**
 * Maps list response from new domain model to legacy format
 * 
 * @param response - New domain model response
 * @returns Legacy response format
 */
function map_list_response_to_legacy(response: { items: Scraper[] } & Record<string, any>): list_scrapers_response {
  return {
    success: true,
    scrapers: response.items.map(map_scraper_to_legacy),
    total: response.total,
    page: response.page,
    per_page: response.per_page,
    total_pages: response.total_pages
  };
}

/**
 * Maps created scraper from new domain model to legacy response
 * 
 * @param scraper - New domain model scraper
 * @returns Legacy creation response
 */
function map_created_scraper_to_legacy(scraper: Scraper): create_scraper_response {
  return {
    success: true,
    scraper: map_scraper_to_legacy(scraper)
  };
}

/**
 * Maps run request from legacy to new domain model
 * 
 * @param request - Legacy run request
 * @returns New domain model run request
 */
function map_run_request(request: run_scraper_request): RunScraperRequest {
  return {
    scraper_id: request.scraper_id,
    options: request.options
  };
}

/**
 * Adapter function for preview extraction
 * 
 * @param data - Legacy preview request
 * @returns Legacy preview response
 */
export async function preview_extraction_adapter(data: scraper_preview_request): Promise<scraper_preview_response> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation
      const mapped_request = map_preview_request(data);
      const response = await scraper_service.preview_extraction(mapped_request);
      
      // Return response in legacy format (already compatible)
      return response as scraper_preview_response;
    } else {
      // Use legacy implementation (direct API call)
      // This would call the original API client implementation
      throw new Error('Legacy API implementation not available');
    }
  } catch (error) {
    console.error('Error in preview extraction adapter:', error);
    
    // Convert to legacy error format
    return {
      success: false,
      data: {},
      errors: { general: error instanceof Error ? error.message : 'Unknown error occurred' }
    };
  }
}

/**
 * Adapter function for creating a scraper
 * 
 * @param data - Legacy create request
 * @returns Legacy create response
 */
// Type-safe mapping for scraper creation request
function map_create_request(data: create_scraper_request): {
  name: string;
  description?: string;
  url: string;
  selector?: string;
  selector_type: SelectorType;
  max_depth?: number;
  proxy_type: ProxyType;
  proxy_url?: string;
  javascript_enabled: boolean;
  respect_robots_txt: boolean;
  extraction_fields?: {
    name: string;
    selector: string;
    selector_type: SelectorType;
    description?: string;
    data_type?: DataType;
    required?: boolean;
  }[];
} {
  return {
    name: data.name,
    description: data.description,
    url: data.url,
    selector: data.selector,
    selector_type: data.selector_type as SelectorType || SelectorType.CSS,
    max_depth: data.max_depth || 1,
    proxy_type: data.proxy_type as ProxyType || ProxyType.NONE,
    proxy_url: data.proxy_url,
    javascript_enabled: data.javascript_enabled || false,
    respect_robots_txt: data.respect_robots_txt ?? true,
    extraction_fields: data.extraction_fields?.map(field => ({
      name: field.name,
      selector: field.selector,
      selector_type: field.selector_type as SelectorType,
      description: field.description,
      data_type: field.data_type as DataType,
      required: field.required
    }))
  };
}

export async function create_scraper_adapter(data: create_scraper_request): Promise<create_scraper_response> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation
      const scraper = await scraper_service.create_scraper(map_create_request(data));
      return map_created_scraper_to_legacy(scraper);
    } else {
      // Use legacy implementation
      throw new Error('Legacy API implementation not available');
    }
  } catch (error) {
    console.error('Error in create scraper adapter:', error);
    
    // Convert to legacy error format
    throw new ApiError(
      error instanceof Error ? error.message : 'Failed to create scraper',
      400,
      { original_error: error }
    );
  }
}

/**
 * Adapter function for listing scrapers
 * 
 * @param params - Legacy list parameters
 * @returns Legacy list response
 */
export async function list_scrapers_adapter(params?: list_scrapers_params): Promise<list_scrapers_response> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation
      const response = await scraper_service.list_scrapers(map_list_params(params));
      // The response is already in PaginatedResponse<Scraper> format, needs to be converted to legacy
      return map_list_response_to_legacy(response);
    } else {
      // Use legacy implementation
      throw new Error('Legacy API implementation not available');
    }
  } catch (error) {
    console.error('Error in list scrapers adapter:', error);
    
    // Return empty list with error info
    return {
      success: false,
      scrapers: [],
      total: 0,
      page: params?.page || 1,
      per_page: params?.per_page || 10,
      total_pages: 0,
      error: error instanceof Error ? error.message : 'Failed to list scrapers'
    };
  }
}

/**
 * Adapter function for getting a scraper
 * 
 * @param id - Scraper ID
 * @returns Legacy scraper format
 */
export async function get_scraper_adapter(id: string): Promise<scraper> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation
      const scraper = await scraper_service.get_scraper(id);
      return map_scraper_to_legacy(scraper);
    } else {
      // Use legacy implementation
      throw new Error('Legacy API implementation not available');
    }
  } catch (error) {
    console.error('Error in get scraper adapter:', error);
    
    // Convert to legacy error format
    throw new ApiError(
      error instanceof Error ? error.message : `Failed to get scraper ${id}`,
      404,
      { scraper_id: id }
    );
  }
}

/**
 * Adapter function for updating a scraper
 * 
 * @param id - Scraper ID
 * @param data - Legacy update data
 * @returns Legacy scraper format
 */
// Type-safe mapping for scraper update request
function map_update_request(data: Partial<create_scraper_request>): Partial<{
  name: string;
  description?: string;
  url: string;
  selector?: string;
  selector_type: SelectorType;
  max_depth?: number;
  proxy_type: ProxyType;
  proxy_url?: string;
  javascript_enabled: boolean;
  respect_robots_txt: boolean;
  extraction_fields?: {
    name: string;
    selector: string;
    selector_type: SelectorType;
    description?: string;
    data_type?: DataType;
    required?: boolean;
  }[];
}> {
  const result: any = {};
  
  // Only include properties that are present
  if (data.name !== undefined) result.name = data.name;
  if (data.description !== undefined) result.description = data.description;
  if (data.url !== undefined) result.url = data.url;
  if (data.selector !== undefined) result.selector = data.selector;
  if (data.max_depth !== undefined) result.max_depth = data.max_depth;
  if (data.proxy_url !== undefined) result.proxy_url = data.proxy_url;
  if (data.javascript_enabled !== undefined) result.javascript_enabled = data.javascript_enabled;
  if (data.respect_robots_txt !== undefined) result.respect_robots_txt = data.respect_robots_txt;
  
  // Handle enum conversions
  if (data.selector_type !== undefined) result.selector_type = data.selector_type as SelectorType;
  if (data.proxy_type !== undefined) result.proxy_type = data.proxy_type as ProxyType;
  
  // Handle extraction fields if present
  if (data.extraction_fields) {
    result.extraction_fields = data.extraction_fields.map(field => ({
      name: field.name,
      selector: field.selector,
      selector_type: field.selector_type as SelectorType,
      description: field.description,
      data_type: field.data_type as DataType,
      required: field.required
    }));
  }
  
  return result;
}

export async function update_scraper_adapter(id: string, data: Partial<create_scraper_request>): Promise<scraper> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation
      const scraper = await scraper_service.update_scraper(id, map_update_request(data));
      return map_scraper_to_legacy(scraper);
    } else {
      // Use legacy implementation
      throw new Error('Legacy API implementation not available');
    }
  } catch (error) {
    console.error('Error in update scraper adapter:', error);
    
    // Convert to legacy error format
    throw new ApiError(
      error instanceof Error ? error.message : `Failed to update scraper ${id}`,
      400,
      { scraper_id: id }
    );
  }
}

/**
 * Adapter function for deleting a scraper
 * 
 * @param id - Scraper ID
 * @returns Legacy success response
 */
export async function delete_scraper_adapter(id: string): Promise<{ success: boolean }> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation
      const response = await scraper_service.delete_scraper(id);
      return { success: response.success };
    } else {
      // Use legacy implementation
      throw new Error('Legacy API implementation not available');
    }
  } catch (error) {
    console.error('Error in delete scraper adapter:', error);
    
    // Convert to legacy error format
    return { success: false };
  }
}

/**
 * Adapter function for running a scraper
 * 
 * @param data - Legacy run request
 * @returns Legacy run response
 */
export async function run_scraper_adapter(data: run_scraper_request): Promise<run_scraper_response> {
  try {
    if (use_new_api_layer()) {
      // Use new API implementation
      const mapped_request = map_run_request(data);
      const response = await scraper_service.run_scraper(mapped_request);
      
      // Return response in legacy format (already compatible)
      return response as run_scraper_response;
    } else {
      // Use legacy implementation
      throw new Error('Legacy API implementation not available');
    }
  } catch (error) {
    console.error('Error in run scraper adapter:', error);
    
    // Convert to legacy error format
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to run scraper'
    };
  }
}
