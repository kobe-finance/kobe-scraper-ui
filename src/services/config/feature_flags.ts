/**
 * Feature Flags Configuration
 * 
 * This module provides a centralized place to manage feature flags for the application.
 * These flags control which implementation of a feature is used at runtime.
 */

// Get environment variables with fallbacks
const get_env_flag = (name: string, default_value: boolean): boolean => {
  const value = import.meta.env[`VITE_${name}`];
  if (value === undefined) return default_value;
  return value === 'true';
};

// Feature flags
export const feature_flags = {
  // API Layer flags
  use_new_api_layer: get_env_flag('USE_NEW_API_LAYER', false), // Default to false for safety
  use_mock_data: get_env_flag('USE_MOCK_DATA', false),
  
  // Additional feature flags can be added here
};

// Feature flag helper methods
export const feature_flags_service = {
  /**
   * Check if a feature flag is enabled
   * @param flag_name - Name of the feature flag to check
   * @returns boolean indicating if the feature is enabled
   */
  is_enabled(flag_name: keyof typeof feature_flags): boolean {
    return feature_flags[flag_name];
  },
  
  /**
   * Toggle a feature flag (only works in development mode)
   * @param flag_name - Name of the feature flag to toggle
   * @returns The new state of the feature flag
   */
  toggle(flag_name: keyof typeof feature_flags): boolean {
    if (import.meta.env.DEV) {
      feature_flags[flag_name] = !feature_flags[flag_name];
      console.log(`Feature flag ${flag_name} toggled to ${feature_flags[flag_name]}`);
      return feature_flags[flag_name];
    }
    
    console.warn('Feature flags cannot be toggled in production mode');
    return feature_flags[flag_name];
  },
  
  /**
   * Get all feature flags and their current values
   * @returns Object containing all feature flags and their values
   */
  get_all(): typeof feature_flags {
    return { ...feature_flags };
  }
};
