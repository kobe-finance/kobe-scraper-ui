/**
 * Job Service Tests
 * 
 * Tests for the job API service functionality, covering both new API implementation
 * and mock data scenarios.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { job_service } from '../../../services/api/job_service';
import { JobStatus, JobPriority } from '../../../core/types/job';
import { api_config } from '../../../core/config/api_config';

// Mock http client
vi.mock('../../../services/http/http_client', () => ({
  http_client: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn()
  }
}));

// Import after mock is defined
import { http_client } from '../../../services/http/http_client';

describe('job_service', () => {
  // Store original config
  const originalConfig = { ...api_config };
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    
    // Reset config to original values
    Object.assign(api_config, originalConfig);
  });
  
  afterEach(() => {
    // Restore original config after each test
    Object.assign(api_config, originalConfig);
  });
  
  describe('create_job', () => {
    const mockJobRequest = {
      name: 'Test Job',
      description: 'Test job description',
      scraper_id: 'scraper-123',
      options: {
        max_pages: 10,
        priority: JobPriority.NORMAL
      }
    };
    
    const mockResponse = {
      id: 'job-123',
      name: 'Test Job',
      description: 'Test job description',
      scraper_id: 'scraper-123',
      status: 'pending',
      created_at: '2023-05-16T10:00:00Z',
      options: {
        max_pages: 10,
        priority: 'normal'
      }
    };
    
    it('should create a job using API when use_new_api_layer is true', async () => {
      // Configure to use API
      api_config.use_new_api_layer = true;
      api_config.use_mock_data = false;
      
      // Setup mock http client response
      http_client.post.mockResolvedValue(mockResponse);
      
      // Call the service method
      const result = await job_service.create_job(mockJobRequest);
      
      // Verify http client was called correctly
      expect(http_client.post).toHaveBeenCalledWith(
        expect.stringContaining('/jobs'),
        mockJobRequest
      );
      
      // Verify result
      expect(result).toEqual(mockResponse);
    });
    
    it('should return mock data when use_mock_data is true', async () => {
      // Configure to use mock data
      api_config.use_new_api_layer = true;
      api_config.use_mock_data = true;
      
      // Call the service method
      const result = await job_service.create_job(mockJobRequest);
      
      // Verify http client was not called
      expect(http_client.post).not.toHaveBeenCalled();
      
      // Verify result has expected structure
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', mockJobRequest.name);
      expect(result).toHaveProperty('scraper_id', mockJobRequest.scraper_id);
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('created_at');
    });
    
    it('should validate input data before making API call', async () => {
      // Configure to use API
      api_config.use_new_api_layer = true;
      api_config.use_mock_data = false;
      
      // Setup mock http client
      http_client.post.mockResolvedValue(mockResponse);
      
      // Call with invalid data (missing required name)
      const invalidRequest = { scraper_id: 'scraper-123' };
      
      // Expect validation error
      await expect(job_service.create_job(invalidRequest as any)).rejects.toThrow();
      
      // Verify http client was not called due to validation failure
      expect(http_client.post).not.toHaveBeenCalled();
    });
  });
  
  describe('list_jobs', () => {
    const mockParams = {
      page: 1,
      per_page: 10,
      status: JobStatus.RUNNING
    };
    
    const mockResponse = {
      data: [
        {
          id: 'job-123',
          name: 'Test Job 1',
          scraper_id: 'scraper-123',
          status: 'running',
          created_at: '2023-05-16T10:00:00Z'
        },
        {
          id: 'job-456',
          name: 'Test Job 2',
          scraper_id: 'scraper-456',
          status: 'running',
          created_at: '2023-05-16T11:00:00Z'
        }
      ],
      total: 2,
      page: 1,
      per_page: 10,
      total_pages: 1
    };
    
    it('should list jobs using API when use_new_api_layer is true', async () => {
      // Configure to use API
      api_config.use_new_api_layer = true;
      api_config.use_mock_data = false;
      
      // Setup mock http client response
      http_client.get.mockResolvedValue(mockResponse);
      
      // Call the service method
      const result = await job_service.list_jobs(mockParams);
      
      // Verify http client was called correctly with query params
      expect(http_client.get).toHaveBeenCalledWith(
        expect.stringContaining('/jobs'),
        mockParams
      );
      
      // Verify result
      expect(result).toEqual(mockResponse);
    });
    
    it('should return mock data when use_mock_data is true', async () => {
      // Configure to use mock data
      api_config.use_new_api_layer = true;
      api_config.use_mock_data = true;
      
      // Call the service method
      const result = await job_service.list_jobs(mockParams);
      
      // Verify http client was not called
      expect(http_client.get).not.toHaveBeenCalled();
      
      // Verify result has expected structure
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('per_page');
      expect(result).toHaveProperty('total_pages');
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
  
  describe('get_job', () => {
    const jobId = 'job-123';
    
    const mockResponse = {
      id: jobId,
      name: 'Test Job',
      scraper_id: 'scraper-123',
      status: 'running',
      created_at: '2023-05-16T10:00:00Z',
      started_at: '2023-05-16T10:01:00Z'
    };
    
    it('should get a job by ID using API when use_new_api_layer is true', async () => {
      // Configure to use API
      api_config.use_new_api_layer = true;
      api_config.use_mock_data = false;
      
      // Setup mock http client response
      http_client.get.mockResolvedValue(mockResponse);
      
      // Call the service method
      const result = await job_service.get_job(jobId);
      
      // Verify http client was called correctly
      expect(http_client.get).toHaveBeenCalledWith(
        expect.stringContaining(`/jobs/${jobId}`)
      );
      
      // Verify result
      expect(result).toEqual(mockResponse);
    });
    
    it('should return mock data when use_mock_data is true', async () => {
      // Configure to use mock data
      api_config.use_new_api_layer = true;
      api_config.use_mock_data = true;
      
      // Call the service method
      const result = await job_service.get_job(jobId);
      
      // Verify http client was not called
      expect(http_client.get).not.toHaveBeenCalled();
      
      // Verify result has expected structure and ID matches request
      expect(result).toHaveProperty('id', jobId);
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('scraper_id');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('created_at');
    });
    
    it('should throw error when job ID is not provided', async () => {
      // Call with invalid ID
      await expect(job_service.get_job('')).rejects.toThrow();
      
      // Verify http client was not called
      expect(http_client.get).not.toHaveBeenCalled();
    });
  });
  
  // Add more test cases for update_job, delete_job, get_job_results, get_job_status
});
