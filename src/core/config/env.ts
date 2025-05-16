/**
 * Environment Variable Utilities
 * 
 * This module provides utilities for accessing environment variables
 * with proper typing and default values.
 */

/**
 * Get a string environment variable with fallback
 * 
 * @param key - Environment variable name
 * @param default_value - Default value if not found
 * @returns The environment variable value or default
 */
export function get_env_string(key: string, default_value: string = ''): string {
  return import.meta.env[key] || default_value;
}

/**
 * Get a boolean environment variable with fallback
 * 
 * @param key - Environment variable name
 * @param default_value - Default value if not found
 * @returns The environment variable as boolean
 */
export function get_env_boolean(key: string, default_value: boolean = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return default_value;
  return value === 'true';
}

/**
 * Get a number environment variable with fallback
 * 
 * @param key - Environment variable name
 * @param default_value - Default value if not found
 * @returns The environment variable as number
 */
export function get_env_number(key: string, default_value: number = 0): number {
  const value = import.meta.env[key];
  if (value === undefined) return default_value;
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? default_value : parsed;
}

/**
 * Get a JSON environment variable with fallback
 * 
 * @param key - Environment variable name
 * @param default_value - Default value if not found or invalid
 * @returns The parsed environment variable or default
 */
export function get_env_json<T>(key: string, default_value: T): T {
  const value = import.meta.env[key];
  if (!value) return default_value;
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to parse env var ${key} as JSON:`, error);
    return default_value;
  }
}

/**
 * Check if running in development mode
 * 
 * @returns True if in development mode
 */
export function is_development(): boolean {
  return import.meta.env.DEV === true || import.meta.env.MODE === 'development';
}

/**
 * Check if running in production mode
 * 
 * @returns True if in production mode
 */
export function is_production(): boolean {
  return import.meta.env.PROD === true || import.meta.env.MODE === 'production';
}

/**
 * Check if running in test mode
 * 
 * @returns True if in test mode
 */
export function is_test(): boolean {
  return import.meta.env.MODE === 'test';
}
