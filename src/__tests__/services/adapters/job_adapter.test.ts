/**
 * Job Adapter Tests
 * 
 * Tests for the job adapter layer which provides compatibility between
 * legacy API implementations and the new domain-driven design.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as job_adapter from '../../../services/adapters/job_adapter';
import { job_service } from '../../../services/api/job_service';
import { JobStatus, JobPriority } from '../../../core/types/job';
import { api_config } from '../../../core/config/api_config';
import { apiClient } from '../../../services/apiClient';

// Mock the job service and API client
vi.mock('../../../services/api/job_service', () => ({
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

vi.mock('../../../services/apiClient', () => ({
  apiClient: {
    getJobStatus: vi.fn(),
    listJobs: vi.fn(),
    startScrapeJob: vi.fn()
  }
}));

// Mock fetch for direct API calls in the adapter
global.fetch = vi.fn();

describe('job_adapter', () => {
  // Store original config
  const originalConfig = { ...api_config };
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    
    // Reset config to original values
    Object.assign(api_config, originalConfig);

    // Setup default fetch mock
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    } as Response);
  });
  
  afterEach(() => {
    // Restore original config after each test
    Object.assign(api_config, originalConfig);
  });
  
  describe('map_job_to_domain', () => {
    it('should correctly map legacy job to domain model', () => {
      // Create a test legacy job
      const legacyJob = {
        id: 'job-123',
        name: 'Test Job',
        description: 'Test description',
        scraper_id: 'scraper-123',
        status: 'running',
        created_at: '2023-05-16T10:00:00Z',
        started_at: '2023-05-16T10:01:00Z',
        options: {
          max_pages: 10,
          priority: 'normal'
        },
        metadata: {
          source: 'test'
        }
      };
      
      // Use the private function via any cast to test it
      const result = (job_adapter as any).map_job_to_domain(legacyJob);
      
      // Verify mapping
      expect(result).toEqual({
        id: 'job-123',
        name: 'Test Job',
        description: 'Test description',
        scraper_id: 'scraper-123',
        status: JobStatus.RUNNING,
        created_at: '2023-05-16T10:00:00Z',
        started_at: '2023-05-16T10:01:00Z',
        options: {
          max_pages: 10,
          priority: JobPriority.NORMAL
        },
        metadata: {
          source: 'test'
        }
      });
    });

    it('should handle invalid job status and use default', () => {
      // Create a test legacy job with invalid status
      const legacyJob = {
        id: 'job-123',
        name: 'Test Job',
        scraper_id: 'scraper-123',
        status: 'invalid_status',
        created_at: '2023-05-16T10:00:00Z',
      };
      
      // Use the private function via any cast to test it
      const result = (job_adapter as any).map_job_to_domain(legacyJob);
      
      // Verify the status defaulted to PENDING
      expect(result.status).toBe(JobStatus.PENDING);
    });

    it('should handle invalid priority and use default', () => {
      // Create a test legacy job with invalid priority
      const legacyJob = {
        id: 'job-123',
        name: 'Test Job',
        scraper_id: 'scraper-123',
        status: 'running',
        created_at: '2023-05-16T10:00:00Z',
        options: {
          priority: 'invalid_priority'
        }
      };
      
      // Use the private function via any cast to test it
      const result = (job_adapter as any).map_job_to_domain(legacyJob);
      
      // Verify the priority defaulted to NORMAL
      expect(result.options?.priority).toBe(JobPriority.NORMAL);
    });
  });
  
  describe('create_job_adapter', () => {
    it('should use job_service when use_new_api_layer is true', async () => {
      // Set config to use new API layer
      api_config.use_new_api_layer = true;
      
      // Create a test job request
      const jobRequest = {
        name: 'Test Job',
        description: 'Test description',
        scraper_id: 'scraper-123',
        options: {
          max_pages: 10,
          priority: 'normal'
        }
      };
      
      // Setup mock response
      const mockResponse = {
        id: 'job-123',
        name: 'Test Job',
        description: 'Test description',
        scraper_id: 'scraper-123',
        status: JobStatus.PENDING,
        created_at: '2023-05-16T10:00:00Z'
      };
      
      vi.mocked(job_service.create_job).mockResolvedValue(mockResponse);
      
      // Call the adapter
      const result = await job_adapter.create_job_adapter(jobRequest);
      
      // Verify job_service was called with mapped request
      expect(job_service.create_job).toHaveBeenCalledWith(expect.objectContaining({
        name: jobRequest.name,
        description: jobRequest.description,
        scraper_id: jobRequest.scraper_id
      }));
      
      // Verify result
      expect(result).toEqual(mockResponse);
    });
    
    it('should use fetch when use_new_api_layer is false', async () => {
      // Set config to use legacy API
      api_config.use_new_api_layer = false;
      
      // Create a test job request
      const jobRequest = {
        name: 'Test Job',
        description: 'Test description',
        scraper_id: 'scraper-123'
      };
      
      // Setup mock response
      const mockResponse = {
        job: {
          id: 'job-123',
          name: 'Test Job',
          description: 'Test description',
          scraper_id: 'scraper-123',
          status: 'pending',
          created_at: '2023-05-16T10:00:00Z'
        }
      };
      
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      } as Response);
      
      // Call the adapter
      const result = await job_adapter.create_job_adapter(jobRequest);
      
      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalled();
      
      // Verify the returned job has the correct structure and status is mapped to enum
      expect(result).toHaveProperty('id', 'job-123');
      expect(result).toHaveProperty('status', JobStatus.PENDING);
    });

    it('should handle errors gracefully', async () => {
      // Set config to use new API layer
      api_config.use_new_api_layer = true;
      
      // Setup error in job service
      const error = new Error('API error');
      vi.mocked(job_service.create_job).mockRejectedValue(error);
      
      // Create a test job request
      const jobRequest = {
        name: 'Test Job',
        scraper_id: 'scraper-123'
      };
      
      // Call the adapter and expect it to throw an ApiError
      await expect(job_adapter.create_job_adapter(jobRequest)).rejects.toThrow();
    });
  });
  
  describe('list_jobs_adapter', () => {
    it('should use job_service when use_new_api_layer is true', async () => {
      // Set config to use new API layer
      api_config.use_new_api_layer = true;
      
      // Create test parameters
      const params = {
        page: 1,
        per_page: 10,
        status: 'running'
      };
      
      // Setup mock response
      const mockResponse = {
        data: [
          {
            id: 'job-123',
            name: 'Test Job 1',
            scraper_id: 'scraper-123',
            status: JobStatus.RUNNING,
            created_at: '2023-05-16T10:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        per_page: 10,
        total_pages: 1
      };
      
      vi.mocked(job_service.list_jobs).mockResolvedValue(mockResponse);
      
      // Call the adapter
      const result = await job_adapter.list_jobs_adapter(params);
      
      // Verify job_service was called with mapped params
      expect(job_service.list_jobs).toHaveBeenCalledWith(expect.objectContaining({
        page: params.page,
        per_page: params.per_page
      }));
      
      // Verify the structure of the result
      expect(result).toHaveProperty('jobs');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('per_page');
      expect(result).toHaveProperty('total_pages');
      expect(result.jobs).toHaveLength(1);
      expect(result.jobs[0]).toHaveProperty('id', 'job-123');
    });
    
    it('should use apiClient when use_new_api_layer is false', async () => {
      // Set config to use legacy API
      api_config.use_new_api_layer = false;
      
      // Setup mock response
      const mockJobs = [
        {
          id: 'job-123',
          name: 'Test Job 1',
          scraper_id: 'scraper-123',
          status: 'running',
          created_at: '2023-05-16T10:00:00Z'
        }
      ];
      
      vi.mocked(apiClient.listJobs).mockResolvedValue(mockJobs);
      
      // Call the adapter
      const result = await job_adapter.list_jobs_adapter({ status: 'running' });
      
      // Verify apiClient was called
      expect(apiClient.listJobs).toHaveBeenCalledWith('running');
      
      // Verify the structure of the result
      expect(result).toHaveProperty('jobs');
      expect(result.jobs).toHaveLength(1);
      expect(result.jobs[0]).toHaveProperty('id', 'job-123');
      expect(result.jobs[0]).toHaveProperty('status', JobStatus.RUNNING);
    });
  });
  
  // Add more test cases for other adapter methods
});
