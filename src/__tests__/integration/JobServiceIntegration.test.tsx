/**
 * Job Service Integration Tests
 * 
 * Tests the integration between components, hooks, and service layers
 * without relying on MSW server setup.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { JobStatus, JobPriority } from '../../core/types/job';
import { api_config } from '../../core/config/api_config';

// Mock the HTTP client instead of using MSW
vi.mock('../../services/http/http_client', () => ({
  http_client: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn()
  }
}));

// Import after mock is defined
import { http_client } from '../../services/http/http_client';
import { useApi } from '../../hooks/useApi';

describe('Job Service Integration', () => {
  // Store original config
  const originalConfig = { ...api_config };
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    
    // Configure to use API and not mock data
    api_config.use_new_api_layer = true;
    api_config.use_mock_data = false;
  });
  
  afterEach(() => {
    // Restore original config
    Object.assign(api_config, originalConfig);
  });
  
  describe('Job API Flow', () => {
    it('should create a job and properly transform the data', async () => {
      // Setup test data
      const jobData = {
        name: 'Test Job',
        description: 'Integration test job',
        scraper_id: 'scraper-123',
        options: {
          max_pages: 10,
          priority: JobPriority.NORMAL
        }
      };
      
      const mockResponse = {
        id: 'job-789',
        name: 'Test Job',
        description: 'Integration test job',
        scraper_id: 'scraper-123',
        status: JobStatus.PENDING,
        created_at: '2025-05-16T00:25:00Z',
        options: {
          max_pages: 10,
          priority: 'normal'
        }
      };
      
      // Setup mock http response
      http_client.post.mockResolvedValue(mockResponse);
      
      // Render the hook
      const { result, waitForNextUpdate } = renderHook(() => useApi());
      
      // Use the hook to call the createJob method
      let createdJob;
      await act(async () => {
        createdJob = await result.current.job.createJob(jobData);
      });
      
      // Verify HTTP client was called with correct data
      expect(http_client.post).toHaveBeenCalledWith(
        expect.stringContaining('/jobs'),
        jobData
      );
      
      // Verify the returned job matches the mock response
      expect(createdJob).toEqual(mockResponse);
    });
    
    it('should list jobs with proper filtering', async () => {
      // Setup test data
      const listParams = {
        page: 1,
        per_page: 10,
        status: JobStatus.RUNNING
      };
      
      const mockResponse = {
        data: [
          {
            id: 'job-123',
            name: 'First Job',
            scraper_id: 'scraper-123',
            status: JobStatus.RUNNING,
            created_at: '2025-05-15T00:00:00Z'
          },
          {
            id: 'job-456',
            name: 'Second Job',
            scraper_id: 'scraper-123',
            status: JobStatus.RUNNING,
            created_at: '2025-05-16T00:00:00Z'
          }
        ],
        total: 2,
        page: 1,
        per_page: 10,
        total_pages: 1
      };
      
      // Setup mock http response
      http_client.get.mockResolvedValue(mockResponse);
      
      // Render the hook
      const { result } = renderHook(() => useApi());
      
      // Use the hook to call the listJobs method
      let jobsList;
      await act(async () => {
        jobsList = await result.current.job.listJobs(listParams);
      });
      
      // Verify HTTP client was called with correct params
      expect(http_client.get).toHaveBeenCalledWith(
        expect.stringContaining('/jobs'),
        listParams
      );
      
      // Verify the returned list matches the mock response
      expect(jobsList).toEqual(mockResponse);
    });
    
    it('should handle API errors appropriately', async () => {
      // Setup test data
      const jobData = {
        name: 'Error Job',
        scraper_id: 'invalid-id'
      };
      
      // Setup mock http response to simulate error
      const errorMessage = 'Invalid scraper ID';
      http_client.post.mockRejectedValue(new Error(errorMessage));
      
      // Render the hook
      const { result } = renderHook(() => useApi());
      
      // Use the hook to call the createJob method and expect error
      let error;
      await act(async () => {
        try {
          await result.current.job.createJob(jobData);
        } catch (err) {
          error = err;
        }
      });
      
      // Verify we received an error
      expect(error).toBeDefined();
      expect(error.message).toEqual(errorMessage);
    });
    
    it('should validate job data before making API call', async () => {
      // Setup mock http response
      http_client.post.mockResolvedValue({});
      
      // Render the hook
      const { result } = renderHook(() => useApi());
      
      // Call with invalid data (missing required name)
      const invalidData = { 
        scraper_id: 'scraper-123' 
      };
      
      // Expect validation error when calling with invalid data
      let error;
      await act(async () => {
        try {
          await result.current.job.createJob(invalidData as any);
        } catch (err) {
          error = err;
        }
      });
      
      // Verify we got a validation error
      expect(error).toBeDefined();
      expect(error.message).toMatch(/validation/i);
      
      // Verify HTTP client was not called due to validation failure
      expect(http_client.post).not.toHaveBeenCalled();
    });
  });
});
