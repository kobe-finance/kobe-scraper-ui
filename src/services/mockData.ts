/**
 * Mock API Responses
 * 
 * This module provides mock data for use during development or when
 * the backend API is not available.
 */

import { z } from 'zod';

// Common response schemas that are shared with apiClient
export const basicResponseSchema = z.object({
  status: z.string(),
  error: z.string().optional(),
});

// Basic scrape response schema
export const scrapeResponseSchema = basicResponseSchema.extend({
  data: z.record(z.any()).optional(),
  title: z.string().optional(),
  content_length: z.number().optional(),
});

// Job response schema
export const jobResponseSchema = basicResponseSchema.extend({
  job_id: z.string().optional(),
});

// Job status schema
export const jobStatusSchema = z.object({
  job_id: z.string(),
  status: z.string(),
  progress: z.number().optional(),
  result: z.record(z.any()).optional(),
  error: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Types based on our Zod schemas
export type ScrapeResponse = z.infer<typeof scrapeResponseSchema>;
export type JobResponse = z.infer<typeof jobResponseSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;

/**
 * Mock API responses for development
 */
export const mockApiResponses = {
  // Basic scrape response
  'scrapeUrl': (url: string): ScrapeResponse => ({
    status: 'success',
    data: {
      title: 'Example Page',
      links: [
        'https://example.com/page1',
        'https://example.com/page2',
        'https://example.com/page3',
      ],
      text: 'This is example content from the mock scraper...',
    },
    title: `Scraped Content for ${url}`,
    content_length: 1250,
  }),
  
  // Advanced scrape response
  'advancedScrape': (url: string): ScrapeResponse => ({
    status: 'success',
    data: {
      products: [
        {
          name: 'Example Product 1',
          price: '$19.99',
          description: 'This is a sample product description',
          rating: 4.5,
        },
        {
          name: 'Example Product 2',
          price: '$24.99',
          description: 'Another sample product with details',
          rating: 3.8,
        },
        {
          name: 'Example Product 3',
          price: '$15.50',
          description: 'Third mock product entry',
          rating: 5.0,
        },
      ]
    },
    title: `Advanced Scrape Results for ${url}`,
    content_length: 2500,
  }),
  
  // Full page scrape
  'scrapeFullPage': (url: string): ScrapeResponse => ({
    status: 'success',
    data: {
      html: '<html><body><h1>Example Page</h1><p>This is mock HTML content</p></body></html>',
      text: 'Example Page\nThis is mock HTML content',
      metadata: {
        title: 'Example Page',
        description: 'This is a mock page description',
        keywords: ['mock', 'example', 'test'],
      }
    },
    title: `Full Page Content for ${url}`,
    content_length: 5000,
  }),
  
  // Start job response
  'startScrapeJob': (): JobResponse => ({
    status: 'success',
    job_id: 'mock-job-' + Math.random().toString(36).substring(2, 10),
  }),
  
  // Job status response
  'getJobStatus': (jobId: string): JobStatus => ({
    job_id: jobId,
    status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)],
    progress: Math.floor(Math.random() * 100),
    result: {
      items_scraped: Math.floor(Math.random() * 100) + 1,
      duration_seconds: Math.floor(Math.random() * 60) + 5,
    },
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
  }),
  
  // List jobs response
  'listJobs': (): JobStatus[] => [
    {
      job_id: 'mock-job-abc123',
      status: 'completed',
      progress: 100,
      result: { items_scraped: 45, duration_seconds: 12 },
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86000000).toISOString(),
    },
    {
      job_id: 'mock-job-def456',
      status: 'in_progress',
      progress: 62,
      result: { items_scraped: 28, duration_seconds: 8 },
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      job_id: 'mock-job-ghi789',
      status: 'pending',
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

// Helper function to simulate API delay
export const mockApiDelay = (min = 200, max = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};
