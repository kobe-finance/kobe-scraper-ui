/**
 * HTTP Client Implementation
 * 
 * This module provides a type-safe HTTP client implementation using Axios.
 * It follows project standards and provides consistent error handling.
 */

import axios from 'axios';
import { 
  HttpClient, 
  HttpMethod, 
  HttpRequest, 
  HttpResponse, 
  HttpClientOptions,
  HttpRequestOptions
} from '../../core/types/http';
import { 
  ApiError, 
  NetworkError, 
  AuthError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  ServerError
} from '../../core/errors/api_error';
import { api_config } from '../../core/config/api_config';

/**
 * Create parameters for axios from our HttpRequest type
 */
function create_axios_config(request: HttpRequest): any {
  const { url, method, data, params, headers, timeout, signal, with_credentials } = request;
  
  return {
    url,
    method,
    data,
    params,
    headers,
    timeout,
    signal,
    withCredentials: with_credentials
  };
}

/**
 * Convert axios response to our HttpResponse type
 */
function normalize_response<T>(response: any): HttpResponse<T> {
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config
  };
}

/**
 * Format URL parameters correctly
 */
function format_params(params?: Record<string, any>): Record<string, any> | undefined {
  if (!params) return undefined;
  
  // Filter out undefined values
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
}

/**
 * Log request if debug mode is enabled
 */
function log_request(request: HttpRequest): void {
  if (api_config.debug_mode) {
    console.group(`🚀 API Request: ${request.method} ${request.url}`);
    if (request.params) console.log('Params:', request.params);
    if (request.data) console.log('Data:', request.data);
    console.groupEnd();
  }
}

/**
 * Log response if debug mode is enabled
 */
function log_response(response: HttpResponse): void {
  if (api_config.debug_mode) {
    console.group(`✅ API Response: ${response.config?.method} ${response.config?.url}`);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.groupEnd();
  }
}

/**
 * Log error if debug mode is enabled
 */
function log_error(error: any): void {
  if (api_config.debug_mode) {
    console.group(`❌ API Error`);
    console.error('Error:', error);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    console.groupEnd();
  }
}

/**
 * Handle API errors based on status code
 */
function handle_error(error: any): never {
  log_error(error);

  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with an error status
      const { status, data } = error.response;
      
      // Create the appropriate error type based on status
      switch (status) {
        case 401:
          throw new AuthError(data?.message, data);
        case 403:
          throw new ForbiddenError(data?.message, data);
        case 404:
          throw new NotFoundError(data?.message, data);
        case 422:
          throw new ValidationError(data?.message, data);
        default:
          if (status >= 500) {
            throw new ServerError(data?.message, data);
          }
          throw ApiError.http(status, data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new NetworkError('No response received from server');
    }
  }
  
  // Handle other errors
  throw ApiError.from_error(error);
}

/**
 * Implementation of the HTTP Client interface using Axios
 */
class AxiosHttpClient implements HttpClient {
  private axios_instance;
  
  /**
   * Create a new HTTP client
   */
  constructor(options: HttpClientOptions) {
    this.axios_instance = axios.create({
      baseURL: options.base_url,
      headers: options.default_headers,
      timeout: options.timeout,
      withCredentials: options.with_credentials
    });
    
    // Request interceptor
    this.axios_instance.interceptors.request.use(
      (config: any) => {
        // Apply custom request interceptor if provided
        if (options.request_interceptor) {
          return options.request_interceptor(config);
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );
    
    // Response interceptor
    this.axios_instance.interceptors.response.use(
      (response: any) => {
        // Apply custom response interceptor if provided
        if (options.response_interceptor) {
          return options.response_interceptor(response);
        }
        return response;
      },
      (error: any) => {
        // Apply custom error interceptor if provided
        if (options.error_interceptor) {
          return Promise.reject(options.error_interceptor(error));
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a request with full configuration
   */
  async request<T>(config: HttpRequest): Promise<HttpResponse<T>> {
    log_request(config);
    
    try {
      const axios_config = create_axios_config(config);
      const response = await this.axios_instance.request<T>(axios_config);
      const normalized_response = normalize_response<T>(response);
      
      log_response(normalized_response);
      return normalized_response;
    } catch (error) {
      return handle_error(error);
    }
  }

  /**
   * Make a GET request
   */
  async get<T>(
    url: string, 
    params?: Record<string, any>, 
    options?: HttpRequestOptions
  ): Promise<T> {
    const response = await this.request<T>({
      url,
      method: HttpMethod.GET,
      params: format_params(params),
      ...options
    });
    
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T>(
    url: string, 
    data?: any, 
    options?: HttpRequestOptions
  ): Promise<T> {
    const response = await this.request<T>({
      url,
      method: HttpMethod.POST,
      data,
      ...options
    });
    
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T>(
    url: string, 
    data?: any, 
    options?: HttpRequestOptions
  ): Promise<T> {
    const response = await this.request<T>({
      url,
      method: HttpMethod.PUT,
      data,
      ...options
    });
    
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(
    url: string, 
    options?: HttpRequestOptions
  ): Promise<T> {
    const response = await this.request<T>({
      url,
      method: HttpMethod.DELETE,
      ...options
    });
    
    return response.data;
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(
    url: string, 
    data?: any, 
    options?: HttpRequestOptions
  ): Promise<T> {
    const response = await this.request<T>({
      url,
      method: HttpMethod.PATCH,
      data,
      ...options
    });
    
    return response.data;
  }
}

/**
 * Create a new HTTP client
 */
export function create_http_client(options: HttpClientOptions): HttpClient {
  return new AxiosHttpClient(options);
}

/**
 * Default HTTP client instance
 */
export const http_client = create_http_client({
  base_url: api_config.base_url,
  default_headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: api_config.timeout_ms
});
