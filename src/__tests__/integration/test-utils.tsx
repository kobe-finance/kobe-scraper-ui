/**
 * Integration Test Utilities
 * 
 * This file provides utilities for integration testing, including
 * proper providers, mocks, and setup functions.
 */

import React from 'react';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';

// Create a custom render function to wrap components with necessary providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const AllProviders: React.FC<{children: React.ReactNode}> = ({children}) => {
    return (
      <>
        {children}
      </>
    );
  };
  
  return render(ui, { wrapper: AllProviders, ...options });
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method
export { customRender as render };
