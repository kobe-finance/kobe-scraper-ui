// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-axe';
import { configureVisualRegression } from 'cypress-visual-regression';

// Configure visual regression plugin
configureVisualRegression();

// Set up global hooks
before(() => {
  // Check if we should seed the test database
  if (Cypress.env('dataSource') === 'real') {
    cy.task('seedTestDatabase');
  }
});

after(() => {
  // Clean up test database after tests
  if (Cypress.env('dataSource') === 'real') {
    cy.task('cleanTestDatabase');
  }
});

// Setup accessibility testing
beforeEach(() => {
  if (Cypress.env('accessibilityTesting')) {
    cy.injectAxe();
  }
});

// Run accessibility checks after page loads
afterEach(() => {
  if (Cypress.env('accessibilityTesting')) {
    cy.checkA11y();
  }
});

// Performance testing helpers
Cypress.Commands.add('measurePerformance', () => {
  if (Cypress.env('performanceMetrics')?.capture) {
    const metrics = Cypress.env('performanceMetrics');
    
    // Start performance measurement
    cy.window().then((win) => {
      const performance = win.performance;
      cy.task('log', 'Performance metrics captured:');
      
      const navigationTiming = performance.getEntriesByType('navigation')[0];
      const paintTiming = performance.getEntriesByType('paint');
      
      const firstPaint = paintTiming.find(entry => entry.name === 'first-paint')?.startTime || 0;
      const firstContentfulPaint = paintTiming.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const domContentLoaded = navigationTiming?.domContentLoadedEventEnd || 0;
      const loadTime = navigationTiming?.loadEventEnd || 0;
      
      const results = {
        firstPaint,
        firstContentfulPaint,
        domContentLoaded,
        loadTime
      };
      
      cy.task('log', results);
      
      // Check against thresholds
      if (metrics.thresholds) {
        if (firstPaint > metrics.thresholds.firstPaint) {
          cy.task('log', `⚠️ First Paint (${firstPaint}ms) exceeds threshold (${metrics.thresholds.firstPaint}ms)`);
        }
        if (firstContentfulPaint > metrics.thresholds.firstContentfulPaint) {
          cy.task('log', `⚠️ First Contentful Paint (${firstContentfulPaint}ms) exceeds threshold (${metrics.thresholds.firstContentfulPaint}ms)`);
        }
        if (domContentLoaded > metrics.thresholds.domContentLoaded) {
          cy.task('log', `⚠️ DOM Content Loaded (${domContentLoaded}ms) exceeds threshold (${metrics.thresholds.domContentLoaded}ms)`);
        }
        if (loadTime > metrics.thresholds.load) {
          cy.task('log', `⚠️ Load Time (${loadTime}ms) exceeds threshold (${metrics.thresholds.load}ms)`);
        }
      }
      
      // Save metrics as test artifacts
      cy.writeFile('cypress/performance-results.json', results, { flag: 'a+' });
    });
  }
});
