import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Mock server setup using MSW
 * This intercepts network requests during tests
 * and responds with our predefined mock responses
 */
export const server = setupServer(...handlers);

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers between tests
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
