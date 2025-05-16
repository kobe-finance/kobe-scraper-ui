/**
 * API Services Compatibility Layer
 * 
 * This module provides a compatibility layer between the frontend components
 * and the API services, handling the transition between the old and new API architectures.
 * It uses feature flags to determine which implementation to use.
 */

import { job_service } from './job_service';
import { get_env_boolean } from '../../core/config/env';

// Determine if we should use the new API layer based on feature flag
const useNewApiLayer = get_env_boolean('VITE_USE_NEW_API_LAYER', false);

// Legacy API client interface
export interface LegacyJobClient {
  getJobs: (params?: any) => Promise<any>;
  getJob: (id: string) => Promise<any>;
  createJob: (data: any) => Promise<any>;
  updateJob: (id: string, data: any) => Promise<any>;
  deleteJob: (id: string) => Promise<any>;
}

/**
 * Creates a client that exposes the job service methods with the legacy interface
 * This ensures that components using the old interface can still work
 */
export const createLegacyJobClient = (): LegacyJobClient => {
  if (!useNewApiLayer) {
    // If not using the new API layer, use the global apiClient
    // which should be defined elsewhere in the application
    return (window as any).apiClient?.jobs || {
      // Fallback implementation in case apiClient isn't available
      getJobs: async () => ([]),
      getJob: async () => ({}),
      createJob: async (data: any) => data,
      updateJob: async (id: string, data: any) => ({ id, ...data }),
      deleteJob: async () => ({ success: true })
    };
  }

  // Adapter to the new job_service implementation
  return {
    getJobs: (params?: any) => job_service.list_jobs(params),
    getJob: (id: string) => job_service.get_job(id),
    createJob: (data: any) => job_service.create_job(data),
    updateJob: (id: string, data: any) => job_service.update_job(id, data),
    deleteJob: (id: string) => job_service.delete_job(id)
  };
};

// Create an instance of the legacy client for use in components
export const legacyJobClient = createLegacyJobClient();
