/**
 * Scraper API Service
 * 
 * Handles all scraper-related API requests using the domain model and schema validation.
 * This service provides type-safe methods for all scraper operations with proper error handling.
 */
import { BaseApiService } from './base_service';
// Import mock data for dev/testing mode
import { mock_scraper_responses } from '../mock/mock_scraper_data';

// Import domain types and schemas
import type { Scraper } from '../../core/types/scraper';
import type { ApiResponse, PaginatedResponse } from '../../core/types/api';
import type {
  ScraperPreviewRequest,
  ScraperPreviewResponse,
  CreateScraperRequest,
  UpdateScraperRequest, 
  ListScrapersParams,
  RunScraperRequest,
  RunScraperResponse
} from '../../core/schemas/scraper_schemas';

// Import validation schemas
import {
  scraper_schema,
  scraper_preview_request_schema,
  scraper_preview_response_schema,
  create_scraper_schema,
  list_scrapers_params_schema, 
  run_scraper_request_schema,
  run_scraper_response_schema
} from '../../core/schemas/scraper_schemas';

/**
 * Service for handling scraper-related API operations
 * 
 * Provides methods for creating, retrieving, updating, and deleting scrapers,
 * as well as previewing and running scraper extractions.
 */
export class ScraperService extends BaseApiService {
  /**
   * Preview a scraper extraction based on provided configuration
   * 
   * @param data - Preview request data 
   * @returns Preview response with extracted data
   */
  /**
   * Preview a scraper extraction based on provided configuration
   * 
   * @param data - Preview request data with extraction configuration
   * @returns Preview response with extracted data
   */
  async preview_extraction(data: ScraperPreviewRequest): Promise<ScraperPreviewResponse> {
    // Validate request data against schema
    const validated_data = this.validate<ScraperPreviewRequest>(
      data,
      scraper_preview_request_schema
    );

    // Get appropriate endpoint
    const endpoint = this.get_endpoint('scrapers', 'preview');
    
    // Create mock function for development/testing
    const mock_fn = async () => {
      return this.validate<ScraperPreviewResponse>(
        mock_scraper_responses.preview_extraction(validated_data),
        scraper_preview_response_schema
      );
    };
    
    // Make API call
    const response = await this.post<unknown>(
      endpoint, 
      validated_data, 
      undefined, 
      mock_fn
    );
    
    // Validate response
    return this.validate<ScraperPreviewResponse>(response, scraper_preview_response_schema);
  }

  /**
   * Create a new scraper
   * 
   * @param data - Scraper creation data
   * @returns Response containing the created scraper
   */
  async create_scraper(data: CreateScraperRequest): Promise<Scraper> {
    // Validate request data against schema
    const validated_data = this.validate<CreateScraperRequest>(
      data,
      create_scraper_schema
    );

    const endpoint = this.get_endpoint('scrapers', 'create');
    
    // Create mock function
    const mock_fn = async () => {
      return this.validate<Scraper>(
        mock_scraper_responses.create_scraper(validated_data),
        scraper_schema
      );
    };
    
    // Make API call
    const response = await this.post<unknown>(endpoint, validated_data, undefined, mock_fn);
    
    // Validate response
    return this.validate<Scraper>(response, scraper_schema);
  }

  /**
   * Get a list of scrapers with filtering and pagination
   * 
   * @param params - List parameters including pagination, sorting and filtering
   * @returns List of scrapers matching the criteria
   */
  async list_scrapers(params?: ListScrapersParams): Promise<PaginatedResponse<Scraper>> {
    // Validate params if provided
    const validated_params = params ? 
      this.validate<ListScrapersParams>(params, list_scrapers_params_schema) : 
      undefined;

    const endpoint = this.get_endpoint('scrapers', 'list');
    
    // Create mock function
    const mock_fn = async () => {
      const mock_response = mock_scraper_responses.list_scrapers(validated_params);
      
      // Validate each scraper in the response
      const validated_scrapers = mock_response.data.map(scraper => 
        this.validate<Scraper>(scraper, scraper_schema)
      );
      
      return {
        ...mock_response,
        data: validated_scrapers
      };
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
    
    // Validate each scraper in the response with explicit typing
    const validated_scrapers: Scraper[] = []; 
    for (const item of raw_response.data) {
      validated_scrapers.push(this.validate<Scraper>(item, scraper_schema));
    }
    
    // Create properly structured paginated response
    const paginated_response: PaginatedResponse<Scraper> = {
      data: validated_scrapers,
      items: validated_scrapers.length,
      total: typeof raw_response.total === 'number' ? raw_response.total : validated_scrapers.length,
      page: typeof raw_response.page === 'number' ? raw_response.page : 1,
      per_page: typeof raw_response.per_page === 'number' ? raw_response.per_page : validated_scrapers.length,
      total_pages: typeof raw_response.total_pages === 'number' ? raw_response.total_pages : 1
    };
    
    return paginated_response;
  }

  /**
   * Get a scraper by ID
   * 
   * @param id - Scraper ID
   * @returns The scraper details
   */
  async get_scraper(id: string): Promise<Scraper> {
    if (!id) throw new Error('Scraper ID is required');

    const endpoint = this.get_endpoint('scrapers', 'get', { id });
    
    // Create mock function
    const mock_fn = async () => {
      return this.validate<Scraper>(
        mock_scraper_responses.get_scraper(id),
        scraper_schema
      );
    };
    
    // Make API call
    const response = await this.get<unknown>(endpoint, undefined, undefined, mock_fn);
    
    // Validate response
    return this.validate<Scraper>(response, scraper_schema);
  }

  /**
   * Update an existing scraper
   * 
   * @param id - Scraper ID
   * @param data - Updated scraper data
   * @returns The updated scraper
   */
  async update_scraper(id: string, data: UpdateScraperRequest): Promise<Scraper> {
    if (!id) throw new Error('Scraper ID is required');

    const endpoint = this.get_endpoint('scrapers', 'update', { id });
    
    // Create mock function
    const mock_fn = async () => {
      return this.validate<Scraper>(
        mock_scraper_responses.update_scraper(id, data),
        scraper_schema
      );
    };
    
    // Make API call
    const response = await this.put<unknown>(endpoint, data, undefined, mock_fn);
    
    // Validate response
    return this.validate<Scraper>(response, scraper_schema);
  }

  /**
   * Delete a scraper
   * 
   * @param id - Scraper ID
   * @returns Success status
   */
  async delete_scraper(id: string): Promise<ApiResponse<void>> {
    if (!id) throw new Error('Scraper ID is required');

    const endpoint = this.get_endpoint('scrapers', 'delete', { id });
    
    // Create mock function
    const mock_fn = async () => {
      const response = mock_scraper_responses.delete_scraper(id);
      return {
        success: response.success,
        message: 'Scraper deleted successfully',
        data: undefined
      };
    };
    
    // Make API call
    const response = await this.delete<ApiResponse<void>>(endpoint, undefined, mock_fn);
    
    return response;
  }

  /**
   * Run a scraper
   * 
   * @param data - Run request data including scraper ID and options
   * @returns Response containing the job ID
   */
  async run_scraper(data: RunScraperRequest): Promise<RunScraperResponse> {
    // Validate request data
    const validated_data = this.validate<RunScraperRequest>(
      data, 
      run_scraper_request_schema
    );

    const endpoint = this.get_endpoint('scrapers', 'run', { id: validated_data.scraper_id });
    
    // Create mock function
    const mock_fn = async () => {
      return this.validate<RunScraperResponse>(
        mock_scraper_responses.run_scraper(validated_data),
        run_scraper_response_schema
      );
    };
    
    // Make API call
    const response = await this.post<unknown>(
      endpoint, 
      validated_data.options, 
      undefined, 
      mock_fn
    );
    
    // Validate response
    return this.validate<RunScraperResponse>(response, run_scraper_response_schema);
  }
}

// Export a singleton instance
export const scraper_service = new ScraperService();
