import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/test-utils';
import { createConsistentSnapshot } from '../../../utils/snapshot-utils';
import { checkAccessibility } from '../../../utils/accessibility-utils';
import MobileScheduleForm from '../../../../components/automation/scheduler/MobileScheduleForm';
import { ScheduledJob } from '../../../../components/automation/scheduler/types';

// Create a sample job for testing
const mockJob: ScheduledJob = {
  id: 'test-job-1',
  name: 'Test Job',
  workflowId: 'workflow-1',
  workflowName: 'E-commerce Scraper',
  scheduleType: 'recurring',
  frequency: 'daily',
  startTime: '2025-05-13T08:00:00.000Z',
  endTime: null,
  hourOfDay: 8,
  minuteOfHour: 0,
  timezone: 'UTC',
  status: 'scheduled',
  nextRunTime: '2025-05-14T08:00:00.000Z',
  createdAt: '2025-05-10T00:00:00.000Z',
  updatedAt: '2025-05-10T00:00:00.000Z',
  dependencies: [],
  notifications: [],
  parameters: {}
};

describe('MobileScheduleForm', () => {
  // Mock handlers
  const onSaveMock = vi.fn();
  const onDeleteMock = vi.fn();
  const onCancelMock = vi.fn();
  
  beforeEach(() => {
    // Clear mocks before each test
    onSaveMock.mockClear();
    onDeleteMock.mockClear();
    onCancelMock.mockClear();
  });
  
  it('renders correctly', async () => {
    // Render the component
    const { container } = render(
      <MobileScheduleForm 
        job={mockJob} 
        isNewJob={false}
        onSave={onSaveMock}
        onDelete={onDeleteMock}
        onCancel={onCancelMock}
      />
    );
    
    // Check if the component renders with the job name
    expect(screen.getByText('Edit Job Schedule')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Job')).toBeInTheDocument();
  });

  it('submits form with updated values', async () => {
    const user = userEvent.setup();
    
    // Render the component
    render(
      <MobileScheduleForm 
        job={mockJob} 
        isNewJob={false}
        onSave={onSaveMock}
        onDelete={onDeleteMock}
        onCancel={onCancelMock}
      />
    );
    
    // Navigate through the form steps
    // Step 1: Basic Info
    await user.clear(screen.getByLabelText(/job name/i));
    await user.type(screen.getByLabelText(/job name/i), 'Updated Job Name');
    await user.click(screen.getByText('Next'));
    
    // Step 2: Schedule Type
    await user.click(screen.getByLabelText(/recurring job/i));
    await user.click(screen.getByText('Next'));
    
    // Step 3: Timing
    await user.click(screen.getByText('Next'));
    
    // Step 4: Review & Submit
    await user.click(screen.getByText('Save Changes'));
    
    // Check if onSave was called with updated values
    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledTimes(1);
      const savedJob = onSaveMock.mock.calls[0][0];
      expect(savedJob.name).toBe('Updated Job Name');
      expect(savedJob.scheduleType).toBe('recurring');
    });
  });
  
  it('handles delete confirmation correctly', async () => {
    const user = userEvent.setup();
    
    // Render the component
    render(
      <MobileScheduleForm 
        job={mockJob} 
        isNewJob={false}
        onSave={onSaveMock}
        onDelete={onDeleteMock}
        onCancel={onCancelMock}
      />
    );
    
    // Navigate to the review step
    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('Next'));
    
    // First click should show confirmation
    await user.click(screen.getByText('Delete Job'));
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    
    // Second click should delete
    await user.click(screen.getByText('Confirm Delete'));
    
    // Check if onDelete was called with correct ID
    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledTimes(1);
      expect(onDeleteMock).toHaveBeenCalledWith('test-job-1');
    });
  });
  
  it('validates form fields correctly', async () => {
    const user = userEvent.setup();
    
    // Render the component with a new job (empty form)
    render(
      <MobileScheduleForm 
        job={{
          ...mockJob,
          id: 'new-job',
          name: '',
          workflowId: '',
        }} 
        isNewJob={true}
        onSave={onSaveMock}
        onDelete={onDeleteMock}
        onCancel={onCancelMock}
      />
    );
    
    // Try to navigate to next step without filling required fields
    await user.click(screen.getByText('Next'));
    
    // Check for validation errors
    expect(screen.getByText('Job name is required')).toBeInTheDocument();
    expect(screen.getByText('Workflow is required')).toBeInTheDocument();
    
    // Fill required fields and try again
    await user.type(screen.getByLabelText(/job name/i), 'New Test Job');
    await user.selectOptions(screen.getByLabelText(/workflow/i), 'workflow-1');
    await user.click(screen.getByText('Next'));
    
    // Should proceed to next step
    expect(screen.getByText('Schedule Type')).toBeInTheDocument();
  });
  
  it('matches snapshot', () => {
    createConsistentSnapshot(
      <MobileScheduleForm 
        job={mockJob} 
        isNewJob={false}
        onSave={onSaveMock}
        onDelete={onDeleteMock}
        onCancel={onCancelMock}
      />
    );
  });
  
  it('is accessible', async () => {
    const { container } = render(
      <MobileScheduleForm 
        job={mockJob} 
        isNewJob={false}
        onSave={onSaveMock}
        onDelete={onDeleteMock}
        onCancel={onCancelMock}
      />
    );
    
    // Check accessibility using the utility function
    await checkAccessibility({ container });
  });
});
