/**
 * Base API Service
 * 
 * Provides common functionality for all API services following the
 * project's architectural patterns and standards.
 */
import type { HttpClient, HttpRequestOptions } from '../../core/types/http';
import { http_client } from '../http/http_client';
import { 
  api_config,
  ApiVersion,
  get_api_endpoint
} from '../../core/config/api_config';
import { ApiError } from '../../core/errors/api_error';
import type { ApiResponse } from '../../core/types/api';

/**
 * Base class for API services
 */
export class BaseApiService {
  protected client: HttpClient;
  protected use_mocks: boolean;
  protected api_version: ApiVersion;
  protected mock_delay_ms: number;

  /**
   * Create a new BaseApiService
   * 
   * @param custom_client - Optional custom HTTP client
   */
  constructor(custom_client?: HttpClient) {
    this.client = custom_client || http_client;
    this.use_mocks = api_config.use_mock_data;
    this.api_version = api_config.version;
    this.mock_delay_ms = 300; // Default mock delay
  }

  /**
   * Generic method to handle API calls with error handling and mock support
   * 
   * @param endpoint - API endpoint path
   * @param method - HTTP method
   * @param data - Request data
   * @param config - Additional axios config
   * @param mock_fn - Optional mock function to use when mock mode is enabled
   * @returns Promise resolving to the response data
   */
  /**
   * Get the API endpoint with proper version and path
   * 
   * @param section - API section name (e.g., 'scrapers', 'jobs')
   * @param endpoint - Endpoint name or function
   * @param param - Optional parameter for endpoint function
   * @returns Full endpoint path
   */
  protected get_endpoint(section: string, endpoint: string | ((param: any) => string), param?: any): string {
    return get_api_endpoint(this.api_version, section as any, endpoint, param);
  }

  /**
   * Process a mock response with a delay
   * 
   * @param mock_fn - Function that returns mock data
   * @returns Mock data with artificial delay
   */
  protected async process_mock<T>(mock_fn: () => Promise<T> | T): Promise<T> {
    // Add slight delay to simulate network latency
    const delay_ms = Math.random() * this.mock_delay_ms + 100;
    await new Promise(resolve => setTimeout(resolve, delay_ms));
    return Promise.resolve(mock_fn());
  }

  /**
   * Make an API call with appropriate error handling
   * 
   * @param endpoint - Full API endpoint path
   * @param method - HTTP method
   * @param data - Request payload
   * @param options - HTTP request options
   * @param mock_fn - Optional mock function
   * @returns Promise resolving to response data
   */
  protected async api_call<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', 
    data?: any,
    options?: HttpRequestOptions,
    mock_fn?: () => Promise<T> | T
  ): Promise<T> {
    try {
      // Use mock data if enabled and mock function is provided
      if (this.use_mocks && mock_fn) {
        return await this.process_mock(mock_fn);
      }

      // Prepare the request
      let response: T;

      // Make the API call based on method
      switch (method) {
        case 'GET':
          response = await this.client.get<T>(endpoint, data, options);
          break;
        case 'POST':
          response = await this.client.post<T>(endpoint, data, options);
          break;
        case 'PUT':
          response = await this.client.put<T>(endpoint, data, options);
          break;
        case 'DELETE':
          response = await this.client.delete<T>(endpoint, options);
          break;
        case 'PATCH':
          response = await this.client.patch<T>(endpoint, data, options);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return response;
    } catch (error: any) {
      // Convert to our API error type
      throw ApiError.from_error(error);
    }
  }

  /**
   * Make a GET request
   * 
   * @param endpoint - API endpoint path 
   * @param params - Query parameters
   * @param config - Additional axios config
   * @param mock_fn - Mock function for testing/development
   * @returns Promise resolving to the response data
   */
  /**
   * Make a GET request
   * 
   * @param endpoint - API endpoint path
   * @param params - Query parameters
   * @param options - Additional HTTP options
   * @param mock_fn - Mock function for testing/development
   * @returns Promise resolving to the response data
   */
  protected async get<T>(
    endpoint: string, 
    params?: Record<string, any>,
    options?: HttpRequestOptions,
    mock_fn?: () => Promise<T> | T
  ): Promise<T> {
    return this.api_call<T>(endpoint, 'GET', params, options, mock_fn);
  }

  /**
   * Make a POST request
   * 
   * @param endpoint - API endpoint path
   * @param data - Request body
   * @param options - Additional HTTP options
   * @param mock_fn - Mock function for testing/development
   * @returns Promise resolving to the response data
   */
  protected async post<T>(
    endpoint: string, 
    data?: any,
    options?: HttpRequestOptions,
    mock_fn?: () => Promise<T> | T
  ): Promise<T> {
    return this.api_call<T>(endpoint, 'POST', data, options, mock_fn);
  }

  /**
   * Make a PUT request
   * 
   * @param endpoint - API endpoint path
   * @param data - Request body
   * @param options - Additional HTTP options
   * @param mock_fn - Mock function for testing/development
   * @returns Promise resolving to the response data
   */
  protected async put<T>(
    endpoint: string, 
    data?: any,
    options?: HttpRequestOptions,
    mock_fn?: () => Promise<T> | T
  ): Promise<T> {
    return this.api_call<T>(endpoint, 'PUT', data, options, mock_fn);
  }

  /**
   * Make a DELETE request
   * 
   * @param endpoint - API endpoint path 
   * @param options - Additional HTTP options
   * @param mock_fn - Mock function for testing/development
   * @returns Promise resolving to the response data
   */
  protected async delete<T>(
    endpoint: string,
    options?: HttpRequestOptions,
    mock_fn?: () => Promise<T> | T
  ): Promise<T> {
    return this.api_call<T>(endpoint, 'DELETE', undefined, options, mock_fn);
  }

  /**
   * Make a PATCH request
   * 
   * @param endpoint - API endpoint path
   * @param data - Request body
   * @param options - Additional HTTP options
   * @param mock_fn - Mock function for testing/development
   * @returns Promise resolving to the response data
   */
  protected async patch<T>(
    endpoint: string, 
    data?: any,
    options?: HttpRequestOptions,
    mock_fn?: () => Promise<T> | T
  ): Promise<T> {
    return this.api_call<T>(endpoint, 'PATCH', data, options, mock_fn);
  }

  /**
   * Validate the response with Zod schema
   * 
   * @param data - Response data
   * @param schema - Zod schema for validation
   * @returns Validated and typed response
   */
  protected validate<T>(data: unknown, schema: any): T {
    try {
      return schema.parse(data) as T;
    } catch (error) {
      throw new ApiError(
        'Invalid response format from API',
        422, // Validation error
        { validation_error: error }
      );
    }
  }
}
