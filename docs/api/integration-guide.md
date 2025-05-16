# API Integration Guide

This guide provides practical instructions for integrating with the Kobe Scraper UI API architecture. It includes code examples, best practices, and common patterns to follow when working with the API layer.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Using the API Hook](#using-the-api-hook)
3. [Working with Scrapers](#working-with-scrapers)
4. [Working with Jobs](#working-with-jobs)
5. [Error Handling](#error-handling)
6. [Adding New API Methods](#adding-new-api-methods)
7. [Testing API Integration](#testing-api-integration)

## Getting Started

The Kobe Scraper UI API is designed around a domain-driven model with type-safe abstractions and clear separation of concerns. Follow these steps to get started:

### Prerequisites

Ensure you have the following dependencies in your `package.json`:

```json
{
  "dependencies": {
    "axios": "^1.9.0",
    "zod": "^3.24.4"
  }
}
```

### Configuration

The API behavior is controlled by configuration flags in `src/core/config/api_config.ts`:

```typescript
// Toggle between new API implementation and legacy code
api_config.use_new_api_layer = true;

// Toggle between real API calls and mock data
api_config.use_mock_data = false;
```

You can set these values based on environment variables in your `.env` file:

```
USE_NEW_API=true
USE_MOCK_DATA=false
```

## Using the API Hook

The `useApi` hook is the primary entry point for components to interact with the API:

```tsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { JobStatus } from '../core/types/job';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { job, isLoading, error, clearError } = useApi();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await job.listJobs({ status: JobStatus.RUNNING });
        setJobs(response.data);
      } catch (err) {
        console.error('Failed to load jobs:', err);
      }
    };
    
    loadJobs();
  }, [job]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Active Jobs</h1>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>{job.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

### Available API Methods

The `useApi` hook provides access to two main API groups:

1. **job**: Methods for job management
2. **scraper**: Methods for scraper management

Each group contains CRUD operations and additional domain-specific methods.

## Working with Scrapers

### Creating a Scraper

```tsx
import { useApi } from '../hooks/useApi';
import { SelectorType } from '../core/types/scraper';

const CreateScraperForm = () => {
  const { scraper, isLoading, error } = useApi();
  
  const handleSubmit = async (formData) => {
    try {
      const newScraper = await scraper.createScraper({
        name: formData.name,
        description: formData.description,
        url: formData.url,
        selector: formData.selector,
        selector_type: SelectorType.CSS,
        javascript_enabled: formData.javascriptEnabled,
      });
      
      console.log('Created scraper:', newScraper);
    } catch (err) {
      console.error('Failed to create scraper:', err);
    }
  };
  
  // Form JSX...
};
```

### Listing Scrapers

```tsx
const ScrapersList = () => {
  const { scraper } = useApi();
  const [scrapers, setScrapers] = useState([]);
  
  useEffect(() => {
    const loadScrapers = async () => {
      const response = await scraper.listScrapers({
        page: 1,
        per_page: 10,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      
      setScrapers(response.data);
    };
    
    loadScrapers();
  }, [scraper]);
  
  // Render scrapers list...
};
```

### Previewing Extraction

```tsx
const ScraperPreview = () => {
  const { scraper, isLoading } = useApi();
  const [previewResults, setPreviewResults] = useState([]);
  
  const handlePreview = async (url, selector) => {
    const results = await scraper.previewExtraction({
      url,
      selector,
      selector_type: SelectorType.CSS,
      javascript_enabled: true
    });
    
    setPreviewResults(results.matches);
  };
  
  // Render preview UI...
};
```

## Working with Jobs

### Creating a Job

```tsx
const CreateJobForm = () => {
  const { job } = useApi();
  
  const handleSubmit = async (formData) => {
    const newJob = await job.createJob({
      name: formData.name,
      description: formData.description,
      scraper_id: formData.scraperId,
      options: {
        max_pages: formData.maxPages,
        priority: formData.priority,
        delay_between_requests_ms: formData.delay
      },
      schedule: formData.runSchedule ? {
        frequency: formData.frequency,
        start_date: formData.startDate
      } : undefined
    });
    
    console.log('Job created:', newJob);
  };
  
  // Form JSX...
};
```

### Monitoring Job Status

```tsx
const JobMonitor = ({ jobId }) => {
  const { job } = useApi();
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const statusUpdate = await job.getJobStatus(jobId);
      setStatus(statusUpdate);
      
      // Stop polling when job completes
      if (statusUpdate.status === 'completed' || 
          statusUpdate.status === 'failed' ||
          statusUpdate.status === 'cancelled') {
        clearInterval(interval);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [job, jobId]);
  
  // Render job status UI...
};
```

### Viewing Job Results

```tsx
const JobResults = ({ jobId }) => {
  const { job } = useApi();
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10
  });
  
  const loadResults = async () => {
    const response = await job.getJobResults(jobId, pagination);
    setResults(response.data);
    setPagination({
      ...pagination,
      total_pages: response.total_pages,
      total: response.total
    });
  };
  
  useEffect(() => {
    loadResults();
  }, [job, jobId, pagination.page, pagination.per_page]);
  
  // Render results UI with pagination...
};
```

## Error Handling

The API architecture includes a robust error handling system:

```tsx
const JobOperations = () => {
  const { job, error, clearError } = useApi();
  
  const handleDeleteJob = async (jobId) => {
    try {
      await job.deleteJob(jobId);
      // Show success notification
    } catch (err) {
      // Error is automatically captured by useApi hook
      // and will be available in the error state
    }
  };
  
  // Display any errors from API operations
  useEffect(() => {
    if (error) {
      // Show error notification
      console.error('API Error:', error.message, error.status);
      
      // Clear error after displaying
      setTimeout(clearError, 5000);
    }
  }, [error, clearError]);
  
  // UI components...
};
```

### Error Types

The API can produce several error types:

1. **ApiError**: Base error for all API-related issues
2. **ValidationError**: For Zod schema validation failures
3. **NetworkError**: For connectivity issues
4. **AuthError**: For authentication/authorization failures
5. **NotFoundError**: For resource not found issues

## Adding New API Methods

Follow these steps to add a new API method:

1. **Define the domain model**:

```typescript
// src/core/types/report.ts
export interface Report {
  id: string;
  job_id: string;
  created_at: string;
  format: 'csv' | 'json' | 'excel';
  download_url: string;
}
```

2. **Create Zod schemas**:

```typescript
// src/core/schemas/report_schemas.ts
import { z } from 'zod';

export const report_schema = z.object({
  id: z.string(),
  job_id: z.string(),
  created_at: z.string(),
  format: z.enum(['csv', 'json', 'excel']),
  download_url: z.string().url()
});

export type Report = z.infer<typeof report_schema>;
```

3. **Implement the service method**:

```typescript
// src/services/api/report_service.ts
import { BaseApiService } from './base_service';
import { Report } from '../../core/types/report';
import { report_schema } from '../../core/schemas/report_schemas';

export class ReportService extends BaseApiService {
  async generate_report(job_id: string, format: 'csv' | 'json' | 'excel'): Promise<Report> {
    if (!job_id) throw new Error('Job ID is required');
    
    const endpoint = this.get_endpoint('reports', 'generate');
    const response = await this.post<unknown>(endpoint, { job_id, format });
    
    return this.validate<Report>(response, report_schema);
  }
}

export const report_service = new ReportService();
```

4. **Create an adapter if needed**:

```typescript
// src/services/adapters/report_adapter.ts
import { report_service } from '../api/report_service';
import { api_config } from '../../core/config/api_config';
import { Report } from '../../core/types/report';

export async function generate_report_adapter(
  job_id: string, 
  format: 'csv' | 'json' | 'excel'
): Promise<Report> {
  if (api_config.use_new_api_layer) {
    return await report_service.generate_report(job_id, format);
  } else {
    // Legacy implementation
    const response = await fetch(`/api/jobs/${job_id}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format })
    });
    
    const data = await response.json();
    return data;
  }
}
```

5. **Expose the method in the useApi hook**:

```typescript
// src/hooks/useApi.tsx
import { generate_report_adapter } from '../services/adapters/report_adapter';
import { report_service } from '../services/api/report_service';

// Inside the useApi hook
const reportApi = {
  generateReport: useCallback(async (jobId: string, format: 'csv' | 'json' | 'excel') => {
    return executeApiCall(async () => {
      if (api_config.use_new_api_layer) {
        return report_service.generate_report(jobId, format);
      } else {
        return generate_report_adapter(jobId, format);
      }
    });
  }, [executeApiCall])
};

// Add to return value
return {
  isLoading,
  error,
  clearError,
  job: jobApi,
  scraper: scraperApi,
  report: reportApi
};
```

6. **Add tests**:

```typescript
// src/__tests__/services/api/report_service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { report_service } from '../../../services/api/report_service';

describe('report_service', () => {
  describe('generate_report', () => {
    it('should generate a report with the specified format', async () => {
      // Test implementation...
    });
  });
});
```

## Testing API Integration

### Unit Testing Services

```typescript
import { describe, it, expect, vi } from 'vitest';
import { job_service } from '../../../services/api/job_service';
import { http_client } from '../../../services/http/http_client';

// Mock the HTTP client
vi.mock('../../../services/http/http_client');

describe('job_service', () => {
  it('should create a job', async () => {
    // Setup mock response
    vi.mocked(http_client.post).mockResolvedValue({
      id: 'job-123',
      name: 'Test Job',
      // ... other job data
    });
    
    // Call the service
    const result = await job_service.create_job({
      name: 'Test Job',
      scraper_id: 'scraper-123'
    });
    
    // Verify HTTP client was called correctly
    expect(http_client.post).toHaveBeenCalledWith(
      expect.stringContaining('/jobs'),
      expect.objectContaining({
        name: 'Test Job',
        scraper_id: 'scraper-123'
      })
    );
    
    // Verify the result
    expect(result).toHaveProperty('id', 'job-123');
    expect(result).toHaveProperty('name', 'Test Job');
  });
});
```

### Integration Testing Components

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobsList } from '../../components/JobsList';
import { useApi } from '../../hooks/useApi';

// Mock the useApi hook
vi.mock('../../hooks/useApi');

describe('JobsList', () => {
  it('should list jobs when loaded', async () => {
    // Setup mock data
    const mockJobs = [
      { id: 'job-1', name: 'Job 1', status: 'running' },
      { id: 'job-2', name: 'Job 2', status: 'completed' }
    ];
    
    // Setup mock hook implementation
    vi.mocked(useApi).mockReturnValue({
      job: {
        listJobs: vi.fn().mockResolvedValue({
          data: mockJobs,
          total: 2,
          page: 1,
          per_page: 10,
          total_pages: 1
        }),
        // ...other methods
      },
      isLoading: false,
      error: null,
      clearError: vi.fn(),
      // ...other properties
    } as any);
    
    // Render the component
    render(<JobsList />);
    
    // Check that jobs are displayed
    await waitFor(() => {
      expect(screen.getByText('Job 1')).toBeInTheDocument();
      expect(screen.getByText('Job 2')).toBeInTheDocument();
    });
  });
});
```

For more detailed examples and best practices, see the unit and integration tests in the `src/__tests__/` directory.
