/**
 * Test utilities for both unit and integration testing
 */
import React from 'react';
import type { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the useApi hook without using MSW
vi.mock('../../hooks/useApi', () => ({
  useApi: vi.fn(() => ({
    isLoading: false,
    error: null,
    clearError: vi.fn(),
    job: {
      createJob: vi.fn(),
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
  }))
}));

// Re-export the useApi mock for easy access in tests
export { useApi } from '../../hooks/useApi';

// Create a custom render function to wrap components with necessary providers
function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const AllProviders: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
      <>
        {children}
      </>
    );
  };
  
  return rtlRender(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method
export { render };
