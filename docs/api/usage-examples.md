# API Usage Examples

This document provides practical code examples for working with the Kobe Scraper UI API. These examples demonstrate common patterns and best practices for integrating with the API layer.

## Table of Contents
- [Creating a Scraper](#creating-a-scraper)
- [Running a Scraper and Creating a Job](#running-a-scraper-and-creating-a-job)
- [Monitoring Job Status](#monitoring-job-status)
- [Retrieving Job Results](#retrieving-job-results)
- [Error Handling](#error-handling)
- [Using Feature Flags](#using-feature-flags)

## Creating a Scraper

```tsx
import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { SelectorType } from '../core/types/scraper';

const CreateScraperComponent: React.FC = () => {
  const { scraper, isLoading, error } = useApi();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newScraper = await scraper.createScraper({
        name,
        url,
        selector,
        selector_type: SelectorType.CSS,
        javascript_enabled: true
      });
      
      console.log('Created scraper:', newScraper);
      setSuccess(true);
      
      // Reset form
      setName('');
      setUrl('');
      setSelector('');
    } catch (err) {
      console.error('Failed to create scraper:', err);
    }
  };
  
  return (
    <div className="create-scraper">
      <h2>Create New Scraper</h2>
      
      {error && (
        <div className="error-message">
          Error: {error.message}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          Scraper created successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Scraper Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="url">Target URL</label>
          <input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="selector">CSS Selector</label>
          <input
            id="selector"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Scraper'}
        </button>
      </form>
    </div>
  );
};

export default CreateScraperComponent;
```

## Running a Scraper and Creating a Job

```tsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { JobPriority } from '../core/types/job';

interface RunScraperProps {
  scraperId: string;
}

const RunScraperComponent: React.FC<RunScraperProps> = ({ scraperId }) => {
  const { scraper, job, isLoading, error } = useApi();
  const [maxPages, setMaxPages] = useState(10);
  const [priority, setPriority] = useState<JobPriority>(JobPriority.NORMAL);
  const [jobId, setJobId] = useState<string | null>(null);
  
  const handleRunScraper = async () => {
    try {
      // Option 1: Run the scraper directly
      const result = await scraper.runScraper({
        scraper_id: scraperId,
        options: {
          max_pages: maxPages
        }
      });
      
      setJobId(result.job_id);
      
      // Option 2: Create a job manually
      const newJob = await job.createJob({
        name: `Job for scraper ${scraperId}`,
        description: 'Created via Run Scraper component',
        scraper_id: scraperId,
        options: {
          max_pages: maxPages,
          priority: priority
        }
      });
      
      setJobId(newJob.id);
    } catch (err) {
      console.error('Failed to run scraper:', err);
    }
  };
  
  return (
    <div className="run-scraper">
      <h2>Run Scraper</h2>
      
      {error && (
        <div className="error-message">
          Error: {error.message}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="max-pages">Maximum Pages</label>
        <input
          id="max-pages"
          type="number"
          min="1"
          max="100"
          value={maxPages}
          onChange={(e) => setMaxPages(Number(e.target.value))}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as JobPriority)}
        >
          <option value={JobPriority.LOW}>Low</option>
          <option value={JobPriority.NORMAL}>Normal</option>
          <option value={JobPriority.HIGH}>High</option>
        </select>
      </div>
      
      <button onClick={handleRunScraper} disabled={isLoading}>
        {isLoading ? 'Running...' : 'Run Scraper'}
      </button>
      
      {jobId && (
        <div className="success-message">
          Job created with ID: {jobId}
        </div>
      )}
    </div>
  );
};

export default RunScraperComponent;
```

## Monitoring Job Status

```tsx
import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { JobStatus } from '../core/types/job';

interface JobMonitorProps {
  jobId: string;
}

const JobMonitor: React.FC<JobMonitorProps> = ({ jobId }) => {
  const { job, isLoading, error } = useApi();
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Function to fetch job status
    const fetchStatus = async () => {
      try {
        const statusUpdate = await job.getJobStatus(jobId);
        setStatus(statusUpdate.status);
        
        if (statusUpdate.progress_percentage !== undefined) {
          setProgress(statusUpdate.progress_percentage);
        }
        
        // Continue polling if job is still in progress
        return statusUpdate.status === JobStatus.RUNNING || 
               statusUpdate.status === JobStatus.PENDING;
      } catch (err) {
        console.error('Failed to fetch job status:', err);
        return false;
      }
    };
    
    // Set up polling
    const pollInterval = setInterval(async () => {
      const shouldContinue = await fetchStatus();
      if (!shouldContinue) {
        clearInterval(pollInterval);
      }
    }, 5000);
    
    // Initial fetch
    fetchStatus();
    
    // Clean up on unmount
    return () => clearInterval(pollInterval);
  }, [job, jobId]);
  
  // Render different UI based on job status
  const renderStatusIndicator = () => {
    switch (status) {
      case JobStatus.PENDING:
        return <div className="status pending">Waiting to start...</div>;
        
      case JobStatus.RUNNING:
        return (
          <div className="status running">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text">{progress}% Complete</div>
          </div>
        );
        
      case JobStatus.COMPLETED:
        return <div className="status completed">Job completed successfully!</div>;
        
      case JobStatus.FAILED:
        return <div className="status failed">Job failed!</div>;
        
      case JobStatus.CANCELLED:
        return <div className="status cancelled">Job was cancelled</div>;
        
      default:
        return <div className="status unknown">Unknown status</div>;
    }
  };
  
  return (
    <div className="job-monitor">
      <h3>Job Status</h3>
      
      {error && (
        <div className="error-message">
          Error: {error.message}
        </div>
      )}
      
      {isLoading && !status ? (
        <div className="loading">Loading job status...</div>
      ) : (
        renderStatusIndicator()
      )}
    </div>
  );
};

export default JobMonitor;
```

## Retrieving Job Results

```tsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

interface JobResultsProps {
  jobId: string;
}

const JobResults: React.FC<JobResultsProps> = ({ jobId }) => {
  const { job, isLoading, error } = useApi();
  const [results, setResults] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });
  
  // Load results when component mounts or pagination changes
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await job.getJobResults(jobId, {
          page: pagination.page,
          per_page: pagination.per_page
        });
        
        setResults(response.data);
        setPagination({
          page: response.page,
          per_page: response.per_page,
          total: response.total,
          total_pages: response.total_pages
        });
      } catch (err) {
        console.error('Failed to fetch job results:', err);
      }
    };
    
    fetchResults();
  }, [job, jobId, pagination.page, pagination.per_page]);
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination({
      ...pagination,
      page: newPage
    });
  };
  
  // Render pagination controls
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.total_pages; i++) {
      pages.push(
        <button
          key={i}
          className={i === pagination.page ? 'active' : ''}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="pagination">
        <button
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Previous
        </button>
        
        {pages}
        
        <button
          disabled={pagination.page === pagination.total_pages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    );
  };
  
  // Render a single result item
  const renderResultItem = (item: any, index: number) => {
    return (
      <div className="result-item" key={item.id || index}>
        <h4>Result #{index + 1 + (pagination.page - 1) * pagination.per_page}</h4>
        <div className="result-url">URL: {item.url}</div>
        <div className="result-date">Extracted: {new Date(item.extracted_at).toLocaleString()}</div>
        <div className="result-data">
          <pre>{JSON.stringify(item.data, null, 2)}</pre>
        </div>
      </div>
    );
  };
  
  return (
    <div className="job-results">
      <h3>Job Results</h3>
      
      {error && (
        <div className="error-message">
          Error: {error.message}
        </div>
      )}
      
      {isLoading ? (
        <div className="loading">Loading results...</div>
      ) : (
        <>
          <div className="results-summary">
            Found {pagination.total} results
          </div>
          
          {results.length === 0 ? (
            <div className="no-results">No results found</div>
          ) : (
            <div className="results-list">
              {results.map(renderResultItem)}
            </div>
          )}
          
          {pagination.total_pages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default JobResults;
```

## Error Handling

```tsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { ApiError } from '../core/errors/api_error';
import { ValidationError } from '../core/errors/validation_error';
import { NetworkError } from '../core/errors/network_error';

const ErrorHandlingExample: React.FC = () => {
  const { job, isLoading, error, clearError } = useApi();
  const [errorType, setErrorType] = useState<string | null>(null);
  
  // Demonstrate different types of errors
  const triggerError = async (type: string) => {
    try {
      switch (type) {
        case 'validation':
          // Missing required fields will cause validation error
          await job.createJob({} as any);
          break;
          
        case 'network':
          // Using an invalid job ID format will cause a network error
          await job.getJob('invalid-id-format');
          break;
          
        case 'not-found':
          // Using a non-existent but valid format ID will cause a 404
          await job.getJob('job-99999999');
          break;
          
        case 'server':
          // This would normally be triggered by a server-side issue
          // For demo purposes we're just throwing an error
          throw new ApiError('Internal server error', 500);
          break;
      }
    } catch (err) {
      // Error will be automatically captured by useApi hook
      setErrorType(type);
    }
  };
  
  // Clear error after a few seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
        setErrorType(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);
  
  // Render different UI based on error type
  const renderErrorDetails = () => {
    if (!error) return null;
    
    if (error instanceof ValidationError) {
      return (
        <div className="error validation">
          <h4>Validation Error</h4>
          <p>{error.message}</p>
          {error.details && (
            <pre>{JSON.stringify(error.details, null, 2)}</pre>
          )}
        </div>
      );
    }
    
    if (error instanceof NetworkError) {
      return (
        <div className="error network">
          <h4>Network Error</h4>
          <p>{error.message}</p>
          <p>Status: {error.status || 'Unknown'}</p>
        </div>
      );
    }
    
    if (error instanceof ApiError) {
      return (
        <div className="error api">
          <h4>API Error</h4>
          <p>{error.message}</p>
          <p>Status: {error.status}</p>
          {error.details && (
            <pre>{JSON.stringify(error.details, null, 2)}</pre>
          )}
        </div>
      );
    }
    
    return (
      <div className="error generic">
        <h4>Error</h4>
        <p>{error.message}</p>
      </div>
    );
  };
  
  return (
    <div className="error-handling-example">
      <h2>Error Handling Example</h2>
      
      <div className="error-triggers">
        <button 
          onClick={() => triggerError('validation')}
          disabled={isLoading}
        >
          Trigger Validation Error
        </button>
        
        <button 
          onClick={() => triggerError('network')}
          disabled={isLoading}
        >
          Trigger Network Error
        </button>
        
        <button 
          onClick={() => triggerError('not-found')}
          disabled={isLoading}
        >
          Trigger Not Found Error
        </button>
        
        <button 
          onClick={() => triggerError('server')}
          disabled={isLoading}
        >
          Trigger Server Error
        </button>
      </div>
      
      {error && renderErrorDetails()}
      
      {!error && errorType && (
        <div className="success-message">
          Error was cleared automatically!
        </div>
      )}
    </div>
  );
};

export default ErrorHandlingExample;
```

## Using Feature Flags

```tsx
import React, { useState } from 'react';
import { api_config } from '../core/config/api_config';

const FeatureFlagsControl: React.FC = () => {
  const [useNewApi, setUseNewApi] = useState(api_config.use_new_api_layer);
  const [useMockData, setUseMockData] = useState(api_config.use_mock_data);
  
  // Update feature flags
  const handleUseNewApiToggle = () => {
    const newValue = !useNewApi;
    api_config.use_new_api_layer = newValue;
    setUseNewApi(newValue);
  };
  
  const handleUseMockDataToggle = () => {
    const newValue = !useMockData;
    api_config.use_mock_data = newValue;
    setUseMockData(newValue);
  };
  
  return (
    <div className="feature-flags-control">
      <h2>API Configuration</h2>
      
      <div className="feature-flag">
        <label>
          <input
            type="checkbox"
            checked={useNewApi}
            onChange={handleUseNewApiToggle}
          />
          Use New API Layer
        </label>
        <p className="description">
          When enabled, the application uses the new domain-driven API layer.
          When disabled, it falls back to legacy implementation.
        </p>
      </div>
      
      <div className="feature-flag">
        <label>
          <input
            type="checkbox"
            checked={useMockData}
            onChange={handleUseMockDataToggle}
          />
          Use Mock Data
        </label>
        <p className="description">
          When enabled, the application uses mock data instead of making
          actual API requests. Useful for development and testing.
        </p>
      </div>
      
      <div className="current-config">
        <h3>Current Configuration</h3>
        <pre>
{`{
  "use_new_api_layer": ${useNewApi},
  "use_mock_data": ${useMockData}
}`}
        </pre>
      </div>
    </div>
  );
};

export default FeatureFlagsControl;
```
