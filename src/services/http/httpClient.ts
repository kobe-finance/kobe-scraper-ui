/**
 * HTTP Client Module Re-exports
 * 
 * @deprecated Please import directly from './http_client.ts' instead.
 * This file is maintained for backward compatibility only and will be removed in a future release.
 * All HTTP client functionality is implemented in http_client.ts following the project's snake_case naming convention.
 */

// Re-export everything from the proper HTTP client implementation
export * from './http_client';

// Re-export all HTTP client types from the core module for convenience
export type { 
  HttpClient, 
  HttpMethod, 
  HttpRequest, 
  HttpResponse, 
  HttpClientOptions,
  HttpRequestOptions,
  HttpHeaders 
} from '../../core/types/http';
