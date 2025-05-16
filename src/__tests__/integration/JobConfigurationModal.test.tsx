/**
 * JobConfigurationModal Integration Tests
 * 
 * Tests the integration between the JobConfigurationModal component
 * and the API services, ensuring proper form-to-service flow.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { JobConfigurationModal } from '../../pages/Jobs/components/JobConfigurationModal';
import { JobStatus } from '../../core/types/job';
import { SelectorType } from '../../core/types/scraper';

// Import our custom test utilities that include mocks for the API hook
import { render, screen, waitFor, useApi } from '../utils/test-utils';

describe('JobConfigurationModal Integration', () => {
  // Mock callbacks
  const onCreateJobMock = vi.fn();
  const onOpenChangeMock = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should render the modal with all form fields', () => {
    render(
      <JobConfigurationModal
        isOpen={true}
        onOpenChange={onOpenChangeMock}
        onCreateJob={onCreateJobMock}
      />
    );
    
    // Check that the modal and key form elements are rendered
    expect(screen.getByText('Create New Scraper Job')).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText('Create Job')).toBeInTheDocument();
  });
  
  it('should submit the form with valid data and call the API', async () => {
    // Create a mock for the job creation API function
    const createJobMock = vi.fn().mockResolvedValue({
      id: 'job-123',
      name: 'Test Job',
      status: JobStatus.PENDING
    });
    
    // Set up useApi mock implementation
    vi.mocked(useApi).mockReturnValue({
      isLoading: false,
      error: null,
      clearError: vi.fn(),
      job: {
        createJob: createJobMock,
        listJobs: vi.fn(),
        getJob: vi.fn(),
        updateJob: vi.fn(),
        deleteJob: vi.fn(),
        getJobResults: vi.fn(),
        getJobStatus: vi.fn()
      },
      scraper: {
        createScraper: vi.fn(),
        listScrapers: vi.fn(),
        getScraper: vi.fn(),
        updateScraper: vi.fn(),
        deleteScraper: vi.fn(),
        runScraper: vi.fn(),
        previewExtraction: vi.fn()
      }
    } as any);
    
    render(
      <JobConfigurationModal
        isOpen={true}
        onOpenChange={onOpenChangeMock}
        onCreateJob={onCreateJobMock}
      />
    );
    
    // Fill out the form
    const user = userEvent.setup();
    
    // Fill required fields
    await user.type(screen.getByLabelText(/Job Name/i), 'Test Job');
    await user.type(screen.getByLabelText(/Description/i), 'Test job description');
    await user.type(screen.getByLabelText(/URL/i), 'https://example.com');
    await user.type(screen.getByLabelText(/Main Selector/i), '.product-item');
    
    // Submit the form
    await user.click(screen.getByText('Create Job'));
    
    // Verify the API was called with the correct data
    await waitFor(() => {
      expect(createJobMock).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Job',
        description: 'Test job description',
        url: 'https://example.com',
        main_selector: '.product-item',
        selector_type: SelectorType.CSS,
      }));
    });
    
    // Verify onCreateJob callback was called
    expect(onCreateJobMock).toHaveBeenCalled();
    
    // Verify modal was closed
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
  
  it('should display error message when API call fails', async () => {
    // Set up createJob to reject with an error
    const errorMessage = 'Failed to create job';
    const createJobMock = vi.fn().mockRejectedValue(new Error(errorMessage));
    
    // Set up useApi mock implementation with error case
    vi.mocked(useApi).mockReturnValue({
      isLoading: false,
      error: null,
      clearError: vi.fn(),
      job: {
        createJob: createJobMock,
        listJobs: vi.fn(),
        getJob: vi.fn(),
        updateJob: vi.fn(),
        deleteJob: vi.fn(),
        getJobResults: vi.fn(),
        getJobStatus: vi.fn()
      },
      scraper: {
        createScraper: vi.fn(),
        listScrapers: vi.fn(),
        getScraper: vi.fn(),
        updateScraper: vi.fn(),
        deleteScraper: vi.fn(),
        runScraper: vi.fn(),
        previewExtraction: vi.fn()
      }
    } as any);
    
    render(
      <JobConfigurationModal
        isOpen={true}
        onOpenChange={onOpenChangeMock}
        onCreateJob={onCreateJobMock}
      />
    );
    
    // Fill out the form
    const user = userEvent.setup();
    
    // Fill required fields
    await user.type(screen.getByLabelText(/Job Name/i), 'Test Job');
    await user.type(screen.getByLabelText(/URL/i), 'https://example.com');
    await user.type(screen.getByLabelText(/Main Selector/i), '.product-item');
    
    // Submit the form
    await user.click(screen.getByText('Create Job'));
    
    // Verify the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage, { exact: false })).toBeInTheDocument();
    });
    
    // Verify modal remains open
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
  });
  
  it('should validate form fields and show validation errors', async () => {
    // Set up a mock for the API call
    const createJobMock = vi.fn().mockResolvedValue({});
    
    // Set up useApi mock implementation
    vi.mocked(useApi).mockReturnValue({
      isLoading: false,
      error: null,
      clearError: vi.fn(),
      job: {
        createJob: createJobMock,
        listJobs: vi.fn(),
        getJob: vi.fn(),
        updateJob: vi.fn(),
        deleteJob: vi.fn(),
        getJobResults: vi.fn(),
        getJobStatus: vi.fn()
      },
      scraper: {
        createScraper: vi.fn(),
        listScrapers: vi.fn(),
        getScraper: vi.fn(),
        updateScraper: vi.fn(),
        deleteScraper: vi.fn(),
        runScraper: vi.fn(),
        previewExtraction: vi.fn()
      }
    } as any);
    
    render(
      <JobConfigurationModal
        isOpen={true}
        onOpenChange={onOpenChangeMock}
        onCreateJob={onCreateJobMock}
      />
    );
    
    const user = userEvent.setup();
    
    // Submit the form without filling required fields
    await user.click(screen.getByText('Create Job'));
    
    // Verify validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/Job name is required/i)).toBeInTheDocument();
    });
    
    // Verify API was not called due to validation errors
    expect(createJobMock).not.toHaveBeenCalled();
  });
});
