import '@testing-library/jest-dom';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './msw/server';

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Start MSW server before tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests are done
afterAll(() => {
  server.close();
});

// Set up environment variable to control data source
process.env.VITE_USE_MOCK_DATA = process.env.VITE_USE_MOCK_DATA || 'true';

// Make sure we're actually in test mode
process.env.NODE_ENV = 'test';

// Mock matchMedia for components that might use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
