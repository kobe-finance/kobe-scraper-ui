/**
 * Basic test for JobConfigurationModal without using MSW
 * 
 * This test focuses on the component functionality without complex server mocking
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobConfigurationModal } from '../../pages/Jobs/components/JobConfigurationModal';
import { JobStatus } from '../../core/types/job';
import { SelectorType } from '../../core/types/scraper';

// Mock the API hook at the module level
const mockCreateJob = vi.fn();
const mockClearError = vi.fn();

vi.mock('../../hooks/useApi', () => ({
  useApi: () => ({
    isLoading: false,
    error: null,
    clearError: mockClearError,
    job: {
      createJob: mockCreateJob,
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
  })
}));

// We don't need to import useApi since we're not using vi.mocked on it
// This avoids potential circular dependencies with MSW

describe('JobConfigurationModal Basic Tests', () => {
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
    // Configure the mock to return a successful response
    mockCreateJob.mockResolvedValue({
      id: 'job-123',
      name: 'Test Job',
      status: JobStatus.PENDING
    });
    
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
      expect(mockCreateJob).toHaveBeenCalledWith(expect.objectContaining({
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
    mockCreateJob.mockRejectedValue(new Error(errorMessage));
    
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
    expect(mockCreateJob).not.toHaveBeenCalled();
  });
});
