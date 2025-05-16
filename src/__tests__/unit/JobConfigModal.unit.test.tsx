/**
 * Basic unit test for JobConfigurationModal
 * 
 * This test completely avoids MSW and focuses only on component rendering
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { JobConfigurationModal } from '../../pages/Jobs/components/JobConfigurationModal';

// Mock the job_service directly
vi.mock('../../services/api/job_service', () => ({
  job_service: {
    create_job: vi.fn().mockResolvedValue({ id: 'mock-job-1', name: 'Test Job' })
  }
}));

describe('JobConfigurationModal Unit Tests', () => {
  it('renders the modal with proper title', () => {
    const onCreateJobMock = vi.fn();
    const onOpenChangeMock = vi.fn();
    
    render(
      <JobConfigurationModal
        isOpen={true}
        onOpenChange={onOpenChangeMock}
        onCreateJob={onCreateJobMock}
      />
    );
    
    // Verify basic rendering
    expect(screen.getByText('Create New Scraper Job')).toBeInTheDocument();
    expect(screen.getByText('Create Job')).toBeInTheDocument();
  });
  
  it('renders with custom title when provided', () => {
    const onCreateJobMock = vi.fn();
    const onOpenChangeMock = vi.fn();
    
    render(
      <JobConfigurationModal
        isOpen={true}
        onOpenChange={onOpenChangeMock}
        onCreateJob={onCreateJobMock}
        title="Custom Job Title"
        submitButtonText="Save Configuration"
      />
    );
    
    // Verify custom text
    expect(screen.getByText('Custom Job Title')).toBeInTheDocument();
    expect(screen.getByText('Save Configuration')).toBeInTheDocument();
  });
});
