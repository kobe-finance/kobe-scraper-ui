import { defineConfig } from 'cypress';
import { configureVisualRegression } from 'cypress-visual-regression/dist/plugin';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // Visual regression testing setup
      configureVisualRegression(on, config);
      
      // Handle environment variables for data source control
      on('task', {
        // Log task for debugging
        log(message) {
          console.log(message);
          return null;
        },
        // Database seeding task - would connect to test database in real impl
        seedTestDatabase() {
          console.log('Seeding test database...');
          return null;
        },
        // Database cleanup task
        cleanTestDatabase() {
          console.log('Cleaning test database...');
          return null;
        }
      });

      // Dynamically set configurations based on test environment
      // This allows switching between mock and real data
      const testEnv = process.env.TEST_ENV || 'mock';
      config.env.dataSource = testEnv === 'real' ? 'real' : 'mock';
      
      return config;
    },
    env: {
      // Default to mock data
      dataSource: 'mock',
      // Enable accessibility testing
      accessibilityTesting: true,
      // Visual regression testing
      visualRegressionTesting: true,
      // Performance metrics to capture
      performanceMetrics: {
        capture: true,
        thresholds: {
          firstPaint: 1000, // ms
          firstContentfulPaint: 2000, // ms
          domContentLoaded: 3000, // ms
          load: 5000 // ms
        }
      }
    },
    // Test retries for flaky tests
    retries: {
      runMode: 2,
      openMode: 0
    },
    // Accessibility testing as part of screenshot and visibility assertions
    viewportWidth: 1280,
    viewportHeight: 720,
    // Video recording for CI
    video: true,
    screenshotOnRunFailure: true
  }
});
