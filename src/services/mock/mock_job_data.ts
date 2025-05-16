/**
 * Mock Job Data
 * 
 * Provides mock responses for the Job API service
 * Used during development or when the backend API is not available
 */
import type { Job, JobStatus, JobPriority } from '../../core/types/job';
import type { PaginatedResponse } from '../../core/types/api';
import { generate_id } from './utils';

// Sample jobs for testing
const mock_jobs: Job[] = [
  {
    id: '1',
    name: 'Product Extraction Job',
    description: 'Extract product data from e-commerce site',
    status: JobStatus.COMPLETED,
    scraper_id: '1',
    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    updated_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    started_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: new Date(Date.now() - 43200000).toISOString(),
    result_count: 45,
    priority: JobPriority.NORMAL,
    config: {
      max_items: 50,
      url: 'https://example.com/products',
      pagination: {
        enabled: true,
        max_pages: 5
      }
    },
    metadata: {
      browser_used: 'Chrome',
      device_type: 'desktop',
      execution_time_ms: 34500
    }
  },
  {
    id: '2',
    name: 'News Articles Job',
    description: 'Extract recent news articles',
    status: JobStatus.RUNNING,
    scraper_id: '2',
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updated_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    started_at: new Date(Date.now() - 3600000).toISOString(),
    progress_percentage: 65,
    current_page: 3,
    total_pages: 5,
    result_count: 23,
    priority: JobPriority.HIGH,
    config: {
      max_items: 100,
      url: 'https://example.com/news',
      pagination: {
        enabled: true,
        max_pages: 5
      }
    }
  },
  {
    id: '3',
    name: 'Real Estate Data Collection',
    description: 'Collect property listings data',
    status: JobStatus.FAILED,
    scraper_id: '3',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 171900000).toISOString(), // Almost 2 days ago
    started_at: new Date(Date.now() - 172800000).toISOString(),
    completed_at: new Date(Date.now() - 171900000).toISOString(),
    error_message: 'Failed to access target website due to IP blocking',
    priority: JobPriority.NORMAL,
    config: {
      max_items: 200,
      url: 'https://example.com/realestate',
      javascript_required: true
    }
  },
  {
    id: '4',
    name: 'Scheduled Product Update',
    description: 'Regular product data update',
    status: JobStatus.PENDING,
    scraper_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    scheduled_start: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    priority: JobPriority.LOW,
    config: {
      max_items: 50,
      url: 'https://example.com/products',
      pagination: {
        enabled: true,
        max_pages: 5
      }
    },
    metadata: {
      recurring: true,
      frequency: 'daily'
    }
  }
];

/**
 * Mock implementations for the Job API endpoints
 */
export const mock_job_responses = {
  /**
   * Mock create job response
   */
  create_job(data: any): Job {
    const new_job: Job = {
      id: generate_id(),
      name: data.name,
      description: data.description || '',
      status: JobStatus.PENDING,
      scraper_id: data.scraper_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      priority: data.priority || JobPriority.NORMAL,
      config: data.config || {},
      metadata: data.metadata || {}
    };
    
    mock_jobs.push(new_job);
    return { ...new_job };
  },
  
  /**
   * Mock list jobs response
   */
  list_jobs(params?: any): PaginatedResponse<Job> {
    let filtered_jobs = [...mock_jobs];
    
    // Apply filters if provided
    if (params) {
      // Filter by status
      if (params.status) {
        filtered_jobs = filtered_jobs.filter(job => job.status === params.status);
      }
      
      // Filter by scraper_id
      if (params.scraper_id) {
        filtered_jobs = filtered_jobs.filter(job => job.scraper_id === params.scraper_id);
      }
      
      // Filter by date range
      if (params.date_from) {
        const date_from = new Date(params.date_from).getTime();
        filtered_jobs = filtered_jobs.filter(job => {
          const job_date = new Date(job.created_at).getTime();
          return job_date >= date_from;
        });
      }
      
      if (params.date_to) {
        const date_to = new Date(params.date_to).getTime();
        filtered_jobs = filtered_jobs.filter(job => {
          const job_date = new Date(job.created_at).getTime();
          return job_date <= date_to;
        });
      }
      
      // Search
      if (params.search) {
        const search_query = params.search.toLowerCase();
        filtered_jobs = filtered_jobs.filter(job => {
          return (
            job.name.toLowerCase().includes(search_query) ||
            (job.description && job.description.toLowerCase().includes(search_query))
          );
        });
      }
    }
    
    // Apply pagination
    const page = params?.page || 1;
    const per_page = params?.per_page || 10;
    const start = (page - 1) * per_page;
    const end = start + per_page;
    const paged_jobs = filtered_jobs.slice(start, end);
    
    // Structure response according to PaginatedResponse interface
    return {
      data: paged_jobs,
      items: paged_jobs.length, // Number of items in current page
      total: filtered_jobs.length, // Total number of items across all pages
      page, // Current page number
      per_page, // Items per page
      total_pages: Math.ceil(filtered_jobs.length / per_page) // Total number of pages
    };
  },
  
  /**
   * Mock get job by ID
   */
  get_job(id: string): Job {
    const job = mock_jobs.find(j => j.id === id);
    
    if (!job) {
      throw new Error(`Job with ID ${id} not found`);
    }
    
    return { ...job };
  },
  
  /**
   * Mock update job
   */
  update_job(id: string, data: Partial<Job>): Job {
    const index = mock_jobs.findIndex(j => j.id === id);
    
    if (index === -1) {
      throw new Error(`Job with ID ${id} not found`);
    }
    
    // Update job with new data
    const updated_job = {
      ...mock_jobs[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    // Update in mock data
    mock_jobs[index] = updated_job;
    
    return { ...updated_job };
  },
  
  /**
   * Mock delete job
   */
  delete_job(id: string): { success: boolean } {
    const index = mock_jobs.findIndex(j => j.id === id);
    
    if (index === -1) {
      return { success: false };
    }
    
    // Remove from mock data
    mock_jobs.splice(index, 1);
    
    return { success: true };
  },
  
  /**
   * Mock get job status
   */
  get_job_status(id: string): { status: JobStatus; progress_percentage?: number } {
    const job = mock_jobs.find(j => j.id === id);
    
    if (!job) {
      throw new Error(`Job with ID ${id} not found`);
    }
    
    return {
      status: job.status,
      progress_percentage: job.progress_percentage
    };
  },
  
  /**
   * Mock get job results
   */
  get_job_results(job_id: string, params?: { page?: number; per_page?: number }): PaginatedResponse<any> {
    const job = mock_jobs.find(j => j.id === job_id);
    
    if (!job) {
      throw new Error(`Job with ID ${job_id} not found`);
    }
    
    // Create mock results
    const total_results = job.result_count || 0;
    const mock_results = [];
    
    // Only generate results if the job is completed
    if (job.status === JobStatus.COMPLETED && total_results > 0) {
      for (let i = 0; i < total_results; i++) {
        mock_results.push({
          id: `result-${job_id}-${i}`,
          job_id,
          scraper_id: job.scraper_id,
          url: `https://example.com/item/${i}`,
          data: {
            title: `Sample Item ${i}`,
            price: `$${(Math.random() * 100).toFixed(2)}`,
            description: `This is a sample description for item ${i}`,
            rating: Math.floor(Math.random() * 5) + 1
          },
          extracted_at: job.completed_at || new Date().toISOString(),
          success: true
        });
      }
    }
    
    // Apply pagination
    const page = params?.page || 1;
    const per_page = params?.per_page || 20;
    const start = (page - 1) * per_page;
    const end = start + per_page;
    const paged_results = mock_results.slice(start, end);
    
    return {
      data: paged_results,
      items: paged_results.length,
      total: mock_results.length,
      page,
      per_page,
      total_pages: Math.ceil(mock_results.length / per_page)
    };
  }
};
