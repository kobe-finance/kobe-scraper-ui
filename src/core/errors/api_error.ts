/**
 * API Error Types and Utilities
 * 
 * This module provides standardized error handling for API operations.
 * It defines error types and utilities for consistent error handling across the application.
 */

/**
 * Base API error with enhanced properties
 */
export class ApiError extends Error {
  /**
   * Create a new API error
   * 
   * @param message - Error message
   * @param status - HTTP status code
   * @param data - Optional error data from the API
   */
  constructor(
    public message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Create an API error from a network error
   * 
   * @param message - Error message
   * @returns ApiError with status 0 (indicating network error)
   */
  static network(message: string): ApiError {
    return new ApiError(message, 0);
  }

  /**
   * Create an API error from an HTTP error response
   * 
   * @param status - HTTP status code
   * @param data - Response data
   * @returns ApiError with appropriate message
   */
  static http(status: number, data?: any): ApiError {
    const message = data?.message || api_error_message_for_status(status);
    return new ApiError(message, status, data);
  }

  /**
   * Convert any error to an ApiError
   * 
   * @param error - Original error (any type)
   * @returns ApiError instance
   */
  static from_error(error: unknown): ApiError {
    // If it's already an ApiError, return it
    if (error instanceof ApiError) {
      return error;
    }

    // If it's an Error object, use its message
    if (error instanceof Error) {
      return new ApiError(error.message, 0);
    }

    // For any other type, convert to string
    return new ApiError(
      typeof error === 'string' ? error : 'An unknown error occurred',
      0
    );
  }
}

/**
 * Network connectivity error
 */
export class NetworkError extends ApiError {
  constructor(message: string = 'Network error occurred') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

/**
 * Authorization error (401)
 */
export class AuthError extends ApiError {
  constructor(message: string = 'Authentication required', data?: any) {
    super(message, 401, data);
    this.name = 'AuthError';
  }
}

/**
 * Permission error (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Permission denied', data?: any) {
    super(message, 403, data);
    this.name = 'ForbiddenError';
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found', data?: any) {
    super(message, 404, data);
    this.name = 'NotFoundError';
  }
}

/**
 * Validation error (422)
 */
export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', data?: any) {
    super(message, 422, data);
    this.name = 'ValidationError';
  }
}

/**
 * Server error (500)
 */
export class ServerError extends ApiError {
  constructor(message: string = 'Server error', data?: any) {
    super(message, 500, data);
    this.name = 'ServerError';
  }
}

/**
 * Get a human-readable error message for HTTP status codes
 * 
 * @param status - HTTP status code
 * @returns User-friendly error message
 */
function api_error_message_for_status(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request';
    case 401:
      return 'Authentication required';
    case 403:
      return 'Permission denied';
    case 404:
      return 'Resource not found';
    case 409:
      return 'Conflict with current state';
    case 422:
      return 'Validation failed';
    case 429:
      return 'Too many requests';
    case 500:
      return 'Server error';
    case 502:
      return 'Bad gateway';
    case 503:
      return 'Service unavailable';
    case 504:
      return 'Gateway timeout';
    default:
      return status >= 400 && status < 500
        ? 'Client error'
        : status >= 500
          ? 'Server error'
          : 'Unknown error';
  }
}

/**
 * Determine if an error is a specific API error type
 * 
 * @param error - Error to check
 * @param status - HTTP status code to match
 * @returns True if error matches the status code
 */
export function is_api_error_with_status(error: unknown, status: number): boolean {
  return error instanceof ApiError && error.status === status;
}

/**
 * Check if an error is an authentication error
 * 
 * @param error - Error to check
 * @returns True if it's an auth error
 */
export function is_auth_error(error: unknown): boolean {
  return is_api_error_with_status(error, 401);
}

/**
 * Check if an error is a permission error
 * 
 * @param error - Error to check
 * @returns True if it's a forbidden error
 */
export function is_forbidden_error(error: unknown): boolean {
  return is_api_error_with_status(error, 403);
}

/**
 * Check if an error is a not found error
 * 
 * @param error - Error to check
 * @returns True if it's a not found error
 */
export function is_not_found_error(error: unknown): boolean {
  return is_api_error_with_status(error, 404);
}

/**
 * Check if an error is a validation error
 * 
 * @param error - Error to check
 * @returns True if it's a validation error
 */
export function is_validation_error(error: unknown): boolean {
  return is_api_error_with_status(error, 422);
}

/**
 * Check if an error is a server error
 * 
 * @param error - Error to check
 * @returns True if it's a server error
 */
export function is_server_error(error: unknown): boolean {
  return error instanceof ApiError && error.status >= 500;
}
