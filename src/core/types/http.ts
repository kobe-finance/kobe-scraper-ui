/**
 * HTTP Client Types
 * 
 * This module defines TypeScript interfaces for HTTP operations,
 * providing a consistent type system for HTTP requests and responses.
 */

/**
 * HTTP methods supported by the client
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

/**
 * HTTP request headers
 */
export interface HttpHeaders {
  [key: string]: string;
}

/**
 * HTTP request options
 */
export interface HttpRequestOptions {
  headers?: HttpHeaders;
  timeout?: number;
  signal?: AbortSignal;
  with_credentials?: boolean;
}

/**
 * HTTP request configuration
 */
export interface HttpRequest {
  url: string;
  method: HttpMethod;
  data?: any;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: HttpHeaders;
  timeout?: number;
  signal?: AbortSignal;
  with_credentials?: boolean;
}

/**
 * HTTP response
 */
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: HttpHeaders;
  config?: HttpRequest;
}

/**
 * HTTP client interface
 */
export interface HttpClient {
  request<T = any>(config: HttpRequest): Promise<HttpResponse<T>>;
  get<T = any>(url: string, params?: Record<string, any>, options?: HttpRequestOptions): Promise<T>;
  post<T = any>(url: string, data?: any, options?: HttpRequestOptions): Promise<T>;
  put<T = any>(url: string, data?: any, options?: HttpRequestOptions): Promise<T>;
  delete<T = any>(url: string, options?: HttpRequestOptions): Promise<T>;
  patch<T = any>(url: string, data?: any, options?: HttpRequestOptions): Promise<T>;
}

/**
 * HTTP client factory options
 */
export interface HttpClientOptions {
  base_url: string;
  default_headers?: HttpHeaders;
  timeout?: number;
  with_credentials?: boolean;
  request_interceptor?: (config: HttpRequest) => HttpRequest | Promise<HttpRequest>;
  response_interceptor?: <T>(response: HttpResponse<T>) => HttpResponse<T> | Promise<HttpResponse<T>>;
  error_interceptor?: (error: any) => any;
}

// Export all types and interfaces
export type {
  HttpHeaders,
  HttpRequestOptions,
  HttpRequest,
  HttpResponse,
  HttpClient, // Added HttpClient to the exports
  HttpClientOptions
};