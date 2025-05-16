/**
 * useApi Hook Tests
 * 
 * Tests for the central API hook which provides access to all API services
 * and handles common error states, loading indicators, and other shared functionality.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApi } from '../../hooks/useApi';
import { job_service } from '../../services/api/job_service';
import { scraper_service } from '../../services/api/scraper_service';
import { api_config } from '../../core/config/api_config';
import { JobStatus } from '../../core/types/job';
import { ApiError } from '../../core/errors/api_error';

// Mock the services
vi.mock('../../services/api/job_service', () => ({
  job_service: {
    create_job: vi.fn(),
    list_jobs: vi.fn(),
    get_job: vi.fn(),
    update_job: vi.fn(),
    delete_job: vi.fn(),
    get_job_results: vi.fn(),
    get_job_status: vi.fn()
  }
}));

vi.mock('../../services/api/scraper_service', () => ({
  scraper_service: {
    create_scraper: vi.fn(),
    list_scrapers: vi.fn(),
    get_scraper: vi.fn(),
    update_scraper: vi.fn(),
    delete_scraper: vi.fn(),
    run_scraper: vi.fn(),
    preview_extraction: vi.fn()
  }
}));

// Mock the adapter imports
vi.mock('../../services/adapters/scraper_adapter', () => ({
  create_scraper_adapter: vi.fn(),
  list_scrapers_adapter: vi.fn(),
  get_scraper_adapter: vi.fn(),
  update_scraper_adapter: vi.fn(),
  delete_scraper_adapter: vi.fn(),
  run_scraper_adapter: vi.fn(),
  preview_extraction_adapter: vi.fn(),
  map_preview_request: vi.fn()
}));

describe('useApi', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset the API config
    api_config.use_new_api_layer = true;
  });

  it('should return the API structure with job and scraper services', () => {
    // Render the hook
    const { result } = renderHook(() => useApi());
    
    // Check that the hook returns the expected structure
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('clearError');
    expect(result.current).toHaveProperty('job');
    expect(result.current).toHaveProperty('scraper');
    
    // Check job service methods
    expect(result.current.job).toHaveProperty('createJob');
    expect(result.current.job).toHaveProperty('listJobs');
    expect(result.current.job).toHaveProperty('getJob');
    expect(result.current.job).toHaveProperty('updateJob');
    expect(result.current.job).toHaveProperty('deleteJob');
    expect(result.current.job).toHaveProperty('getJobResults');
    expect(result.current.job).toHaveProperty('getJobStatus');
    
    // Check scraper service methods
    expect(result.current.scraper).toHaveProperty('createScraper');
    expect(result.current.scraper).toHaveProperty('listScrapers');
    expect(result.current.scraper).toHaveProperty('getScraper');
    expect(result.current.scraper).toHaveProperty('updateScraper');
    expect(result.current.scraper).toHaveProperty('deleteScraper');
    expect(result.current.scraper).toHaveProperty('runScraper');
    expect(result.current.scraper).toHaveProperty('previewExtraction');
  });

  describe('job API', () => {
    it('should call job_service.create_job when creating a job', async () => {
      // Setup mock data
      const jobData = {
        name: 'Test Job',
        scraper_id: 'scraper-123'
      };
      
      const mockResponse = {
        id: 'job-123',
        name: 'Test Job',
        scraper_id: 'scraper-123',
        status: JobStatus.PENDING,
        created_at: new Date().toISOString()
      };
      
      // Setup mocks
      vi.mocked(job_service.create_job).mockResolvedValue(mockResponse);
      
      // Render the hook
      const { result } = renderHook(() => useApi());
      
      // Call the createJob method
      let returnedJob;
      await act(async () => {
        returnedJob = await result.current.job.createJob(jobData);
      });
      
      // Verify the service was called with the correct data
      expect(job_service.create_job).toHaveBeenCalledWith(jobData);
      
      // Verify the returned data
      expect(returnedJob).toEqual(mockResponse);
      
      // Verify loading state was handled correctly
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
    
    it('should handle errors when creating a job', async () => {
      // Setup mock data
      const jobData = {
        name: 'Test Job',
        scraper_id: 'scraper-123'
      };
      
      // Setup error mock
      const mockError = new ApiError('Failed to create job', 500);
      vi.mocked(job_service.create_job).mockRejectedValue(mockError);
      
      // Render the hook
      const { result } = renderHook(() => useApi());
      
      // Call the createJob method and expect it to throw
      await act(async () => {
        await expect(result.current.job.createJob(jobData)).rejects.toThrow();
      });
      
      // Verify error state was set
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.message).toBe('Failed to create job');
      expect(result.current.isLoading).toBe(false);
    });
    
    it('should clear error state when clearError is called', async () => {
      // Setup mock data
      const jobData = {
        name: 'Test Job',
        scraper_id: 'scraper-123'
      };
      
      // Setup error mock
      const mockError = new ApiError('Failed to create job', 500);
      vi.mocked(job_service.create_job).mockRejectedValue(mockError);
      
      // Render the hook
      const { result } = renderHook(() => useApi());
      
      // Call the createJob method and expect it to throw
      await act(async () => {
        try {
          await result.current.job.createJob(jobData);
        } catch (error) {
          // Ignore the error
        }
      });
      
      // Verify error state was set
      expect(result.current.error).not.toBeNull();
      
      // Clear the error
      act(() => {
        result.current.clearError();
      });
      
      // Verify error state was cleared
      expect(result.current.error).toBeNull();
    });

    it('should list jobs with correct parameters', async () => {
      // Setup mock data
      const params = {
        page: 1,
        per_page: 10,
        status: JobStatus.RUNNING
      };
      
      const mockResponse = {
        data: [
          {
            id: 'job-123',
            name: 'Test Job',
            scraper_id: 'scraper-123',
            status: JobStatus.RUNNING,
            created_at: new Date().toISOString()
          }
        ],
        total: 1,
        page: 1,
        per_page: 10,
        total_pages: 1
      };
      
      // Setup mocks
      vi.mocked(job_service.list_jobs).mockResolvedValue(mockResponse);
      
      // Render the hook
      const { result } = renderHook(() => useApi());
      
      // Call the listJobs method
      let returnedJobs;
      await act(async () => {
        returnedJobs = await result.current.job.listJobs(params);
      });
      
      // Verify the service was called with the correct data
      expect(job_service.list_jobs).toHaveBeenCalledWith(params);
      
      // Verify the returned data
      expect(returnedJobs).toEqual(mockResponse);
    });
  });

  describe('scraper API', () => {
    // Add tests for scraper API methods here
    // Similar to the job API tests above
  });
});
