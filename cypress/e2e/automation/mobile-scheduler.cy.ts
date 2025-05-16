// End-to-End tests for the mobile scheduler interface
// Demonstrates clean separation between mock and real data

describe('Mobile Scheduler Interface (with Mock Data)', () => {
  beforeEach(() => {
    // Configure viewport for mobile
    cy.viewport('iphone-x');
    
    // Use mock data for this test suite
    cy.useDataSource('mock');
    
    // Login and visit scheduler
    cy.loginAsTestUser();
    cy.visitScheduler();
    
    // Verify mobile interface is shown
    cy.get('[data-testid="mobile-scheduler-interface"]').should('be.visible');
  });
  
  it('displays scheduled jobs from mock data', () => {
    // Verify jobs are displayed
    cy.contains('Daily Product Scraping').should('be.visible');
    cy.contains('Weekly Price Analysis').should('be.visible');
    
    // Check that it's using mock data by verifying a specific date from fixtures
    cy.contains('2025-05-14').should('be.visible');
    
    // Take a snapshot for visual regression testing
    cy.visualSnapshot('mobile-scheduler-jobs-list');
    
    // Check accessibility
    cy.checkAccessibility();
  });
  
  it('can view job details and navigate mobile tabs', () => {
    // Tap on a job to view details
    cy.contains('Daily Product Scraping').click();
    
    // Should automatically navigate to Schedule tab
    cy.get('[aria-selected="true"]').should('contain', 'Schedule');
    cy.contains('Edit Schedule').should('be.visible');
    
    // Check job details are displayed correctly
    cy.contains('Daily').should('be.visible');
    
    // Swipe to navigate to Dependencies tab (using custom tab navigation)
    cy.get('[aria-controls="tabpanel-2"]').click();
    
    // Check Dependencies tab is now active
    cy.get('[aria-selected="true"]').should('contain', 'Dependencies');
    cy.contains('Edit Dependencies').should('be.visible');
    
    // Check accessibility for each view
    cy.checkAccessibility();
    
    // Measure performance metrics
    cy.measurePerformance();
  });
  
  it('can create a new job with form wizard', () => {
    // Click create job button
    cy.contains('Create Job').click();
    
    // Should navigate to Schedule tab with edit mode
    cy.get('[aria-selected="true"]').should('contain', 'Schedule');
    
    // Fill out form wizard - Step 1: Basic Info
    cy.get('input[name="name"]').type('Mobile E2E Test Job');
    cy.get('select[name="workflowId"]').select('workflow-1');
    cy.contains('Next').click();
    
    // Step 2: Schedule Type
    cy.get('#schedule-recurring').click();
    cy.get('select[name="frequency"]').select('daily');
    cy.contains('Next').click();
    
    // Step 3: Timing
    cy.get('input[type="time"]').type('09:00');
    cy.contains('Next').click();
    
    // Step 4: Review & Submit
    cy.contains('Mobile E2E Test Job').should('be.visible');
    cy.contains('Daily').should('be.visible');
    cy.contains('Create Job').click();
    
    // Should return to calendar view and show new job
    cy.get('[aria-selected="true"]').should('contain', 'Calendar');
    cy.contains('Mobile E2E Test Job').should('be.visible');
    
    // Check accessibility
    cy.checkAccessibility();
    
    // Visual regression test
    cy.visualSnapshot('mobile-scheduler-new-job-created');
  });
  
  it('can delete a job with confirmation', () => {
    // Select a job
    cy.contains('One-time Data Export').click();
    
    // Navigate through tabs to review screen
    cy.contains('Next').click();
    cy.contains('Next').click();
    cy.contains('Next').click();
    
    // Click delete button
    cy.contains('Delete Job').click();
    
    // Should show confirmation
    cy.contains('Confirm Delete').click();
    
    // Should return to calendar view and job should be gone
    cy.get('[aria-selected="true"]').should('contain', 'Calendar');
    cy.contains('One-time Data Export').should('not.exist');
  });
});

// Example of how to run the same tests with real data
// This demonstrates proper separation of mock vs real data
describe('Mobile Scheduler Interface (with Real Data)', { tags: ['real-data'] }, () => {
  beforeEach(() => {
    // Skip these tests unless explicitly enabled
    // This prevents accidental runs against real APIs
    if (Cypress.env('RUN_REAL_DATA_TESTS') !== 'true') {
      cy.log('Skipping real data tests');
      cy.skip();
    }
    
    // Configure viewport for mobile
    cy.viewport('iphone-x');
    
    // Use real data API endpoints
    cy.useDataSource('real');
    
    // Login and visit scheduler
    cy.loginAsTestUser();
    cy.visitScheduler();
  });
  
  // The same tests can be run against real data
  // This demonstrates the clean separation between data sources
  it('displays scheduled jobs from real API', () => {
    // Wait for real API response
    cy.wait('@getJobs');
    
    // Verify jobs are displayed (this time from real API)
    cy.get('[data-testid="job-item"]').should('have.length.at.least', 1);
    
    // Check accessibility
    cy.checkAccessibility();
  });
  
  // More tests would follow the same pattern as the mock data tests
  // The key difference is that we're using real API endpoints
});

// Mobile-specific accessibility tests
describe('Mobile Scheduler Accessibility', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.useDataSource('mock');
    cy.loginAsTestUser();
    cy.visitScheduler();
  });
  
  it('has proper ARIA attributes', () => {
    // Check for proper ARIA roles
    cy.get('[role="tablist"]').should('be.visible');
    cy.get('[role="tab"]').should('have.length', 5);
    cy.get('[role="tabpanel"]').should('be.visible');
    
    // Ensure all buttons have accessible names
    cy.get('button').each($button => {
      const ariaLabel = $button.attr('aria-label');
      const buttonText = $button.text().trim();
      
      expect(ariaLabel || buttonText, 'Button should have accessible name').to.not.be.empty;
    });
    
    // Check proper focus order
    cy.get('[data-testid="mobile-scheduler-interface"]').focus();
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'aria-label', 'Create New Job');
    
    // Check color contrast meets WCAG standards
    cy.checkAccessibility();
  });
  
  it('supports keyboard navigation', () => {
    // Tab through all interactive elements
    cy.get('[data-testid="mobile-scheduler-interface"]').focus();
    cy.realPress('Tab');
    cy.focused().click(); // Create job button
    
    // Should be able to navigate form with keyboard
    cy.get('input[name="name"]').should('be.visible');
    cy.focused().type('Keyboard Navigation Test');
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'name', 'workflowId');
    
    // Complete form with keyboard
    cy.realType('{downarrow}{enter}'); // Select first workflow
    cy.realPress('Tab');
    cy.focused().trigger('click'); // Next button
    
    // Check that we moved to next step
    cy.get('[aria-selected="true"]').should('contain', 'Schedule Type');
  });
});

// Performance testing with metrics
describe('Mobile Scheduler Performance', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.useDataSource('mock');
  });
  
  it('loads within performance thresholds', () => {
    // Clear performance metrics from previous runs
    cy.task('log', 'Starting performance test');
    
    // Measure initial load performance
    cy.visit('/scheduler', {
      onBeforeLoad(win) {
        // Create performance observer
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            cy.task('log', `Performance entry: ${entry.name} - ${entry.startTime}`);
          });
        });
        observer.observe({ entryTypes: ['paint', 'navigation', 'resource'] });
      }
    });
    
    // Wait for content to be fully loaded
    cy.contains('Job Scheduler').should('be.visible');
    
    // Capture and validate metrics
    cy.measurePerformance();
    
    // Test interaction performance - tab switching
    cy.get('[aria-controls="tabpanel-1"]').click();
    cy.measurePerformance();
    
    // Test form loading performance
    cy.contains('Create Job').click();
    cy.get('input[name="name"]').should('be.visible');
    cy.measurePerformance();
  });
});
