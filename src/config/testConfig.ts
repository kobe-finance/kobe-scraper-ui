/**
 * Test configuration system
 * Provides a centralized way to control test behavior and data sources
 */

export interface TestConfig {
  // Whether to use mock data or real data for tests
  useMockData: boolean;
  
  // Base URL for API calls when using real data
  apiBaseUrl: string;
  
  // Path to test fixtures for mock data
  testFixturesPath: string;
  
  // Enable visual regression testing
  visualRegression: boolean;
  
  // Enable accessibility testing
  accessibilityTesting: boolean;
  
  // Whether to run performance benchmarks
  performanceBenchmarks: boolean;
}

// Default configuration, can be overridden with environment variables
const defaultConfig: TestConfig = {
  useMockData: true,
  apiBaseUrl: 'http://localhost:3000/api',
  testFixturesPath: './src/test/fixtures',
  visualRegression: false,
  accessibilityTesting: true,
  performanceBenchmarks: false,
};

/**
 * Get configuration from environment variables
 * Following the "Single Source of Truth" principle
 */
export function getTestConfig(): TestConfig {
  return {
    useMockData: process.env.VITE_USE_MOCK_DATA !== 'false',
    apiBaseUrl: process.env.VITE_API_BASE_URL || defaultConfig.apiBaseUrl,
    testFixturesPath: process.env.VITE_TEST_FIXTURES_PATH || defaultConfig.testFixturesPath,
    visualRegression: process.env.VITE_VISUAL_REGRESSION === 'true',
    accessibilityTesting: process.env.VITE_ACCESSIBILITY_TESTING !== 'false',
    performanceBenchmarks: process.env.VITE_PERFORMANCE_BENCHMARKS === 'true',
  };
}

// Export current configuration
export const testConfig = getTestConfig();
