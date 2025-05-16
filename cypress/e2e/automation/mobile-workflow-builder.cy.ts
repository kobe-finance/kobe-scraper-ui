// End-to-End tests for the mobile workflow builder
// Demonstrates clean separation between mock and real data

describe('Mobile Workflow Builder (with Mock Data)', () => {
  beforeEach(() => {
    // Configure viewport for mobile
    cy.viewport('iphone-x');
    
    // Use mock data for this test suite
    cy.useDataSource('mock');
    
    // Login and visit workflow builder
    cy.loginAsTestUser();
    cy.visitWorkflowBuilder();
    
    // Verify mobile interface is shown
    cy.get('[data-testid="mobile-workflow-builder"]').should('be.visible');
  });
  
  it('displays workflow nodes from mock data', () => {
    // Select a workflow from the list
    cy.contains('E-commerce Scraper').click();
    
    // Verify nodes are displayed in the React Flow canvas
    cy.get('.react-flow__node').should('have.length.at.least', 1);
    
    // Take a snapshot for visual regression testing
    cy.visualSnapshot('mobile-workflow-builder-nodes');
    
    // Check accessibility
    cy.checkAccessibility();
  });
  
  it('can add a new node to the workflow', () => {
    // Select a workflow from the list
    cy.contains('Price Analyzer').click();
    
    // Open the add node menu
    cy.get('[aria-label="Add Node"]').click();
    
    // Menu should be visible
    cy.get('[aria-labelledby="node-menu-heading"]').should('be.visible');
    
    // Add a condition node
    cy.contains('Condition').click();
    
    // Node menu should close
    cy.get('[aria-labelledby="node-menu-heading"]').should('not.be.visible');
    
    // New node should be added
    cy.get('.react-flow__node').should('have.length.at.least', 5);
    
    // Save the workflow
    cy.get('[aria-label="Save Workflow"]').click();
    
    // Should show success message
    cy.expectToast('Workflow saved successfully');
    
    // Visual regression test
    cy.visualSnapshot('mobile-workflow-builder-new-node');
  });
  
  it('can select and delete a node', () => {
    // Select a workflow from the list
    cy.contains('E-commerce Scraper').click();
    
    // Count initial nodes
    cy.get('.react-flow__node').then($nodes => {
      const initialCount = $nodes.length;
      
      // Click on a node to select it
      cy.get('.react-flow__node').eq(1).click();
      
      // Node should be selected
      cy.get('.react-flow__node.selected').should('have.length', 1);
      
      // Delete panel should appear
      cy.contains('Node selected').should('be.visible');
      
      // Delete the node
      cy.contains('Delete').click();
      
      // Should have one less node
      cy.get('.react-flow__node').should('have.length', initialCount - 1);
    });
  });

  it('supports touchscreen gestures', () => {
    // Select a workflow
    cy.contains('Price Analyzer').click();
    
    // Test swipe right to open node menu
    cy.get('.react-flow').trigger('touchstart', { touches: [{ clientX: 100, clientY: 200 }] });
    cy.get('.react-flow').trigger('touchmove', { touches: [{ clientX: 300, clientY: 200 }] });
    cy.get('.react-flow').trigger('touchend');
    
    // Node menu should open
    cy.get('[aria-labelledby="node-menu-heading"]').should('be.visible');
    
    // Test swipe left to close node menu
    cy.get('.react-flow').trigger('touchstart', { touches: [{ clientX: 300, clientY: 200 }] });
    cy.get('.react-flow').trigger('touchmove', { touches: [{ clientX: 100, clientY: 200 }] });
    cy.get('.react-flow').trigger('touchend');
    
    // Node menu should close
    cy.get('[aria-labelledby="node-menu-heading"]').should('not.be.visible');
  });
});

// Real data tests - separate from mock data tests
describe('Mobile Workflow Builder (with Real Data)', { tags: ['real-data'] }, () => {
  beforeEach(() => {
    // Skip these tests unless explicitly enabled
    if (Cypress.env('RUN_REAL_DATA_TESTS') !== 'true') {
      cy.log('Skipping real data tests');
      cy.skip();
    }
    
    // Configure viewport for mobile
    cy.viewport('iphone-x');
    
    // Use real data API endpoints
    cy.useDataSource('real');
    
    // Login and visit workflow builder
    cy.loginAsTestUser();
    cy.visitWorkflowBuilder();
  });
  
  it('displays workflows from real API', () => {
    // Wait for real API response
    cy.wait('@getWorkflows');
    
    // Verify workflows are displayed (this time from real API)
    cy.get('[data-testid="workflow-item"]').should('have.length.at.least', 1);
    
    // Check accessibility
    cy.checkAccessibility();
  });
  
  // Additional real data tests would follow the same pattern
});

// Accessibility-specific tests
describe('Mobile Workflow Builder Accessibility', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.useDataSource('mock');
    cy.loginAsTestUser();
    cy.visitWorkflowBuilder();
  });
  
  it('has proper focus management', () => {
    // Select a workflow from the list
    cy.contains('E-commerce Scraper').click();
    
    // Check that React Flow canvas is keyboard navigable
    cy.get('.react-flow__renderer').focus();
    
    // Test keyboard interaction with the add button
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'aria-label', 'Add Node');
    
    // Open node menu with keyboard
    cy.focused().type('{enter}');
    cy.get('[aria-labelledby="node-menu-heading"]').should('be.visible');
    
    // Navigate to a node type with keyboard
    cy.realPress('Tab');
    cy.focused().should('contain', 'Trigger');
    
    // Add a node with keyboard
    cy.focused().type('{enter}');
    
    // Node should be added and menu closed
    cy.get('[aria-labelledby="node-menu-heading"]').should('not.be.visible');
  });
  
  it('supports screen readers', () => {
    // Select a workflow from the list
    cy.contains('E-commerce Scraper').click();
    
    // Check for proper ARIA labels on nodes
    cy.get('.react-flow__node').each($node => {
      // Each node should have proper role and label
      cy.wrap($node).should('have.attr', 'role', 'button');
      cy.wrap($node).should('have.attr', 'aria-label');
    });
    
    // Controls should have proper labeling
    cy.get('.react-flow__controls button').each($button => {
      cy.wrap($button).should('have.attr', 'aria-label');
    });
    
    // Run comprehensive accessibility check
    cy.checkAccessibility();
  });
});

// Visual regression and UI consistency tests
describe('Mobile Workflow Builder Visual Tests', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.useDataSource('mock');
    cy.loginAsTestUser();
    cy.visitWorkflowBuilder();
  });
  
  it('maintains consistent visuals across different workflows', () => {
    // Visual test first workflow
    cy.contains('E-commerce Scraper').click();
    cy.visualSnapshot('workflow-1-visuals');
    
    // Go back to list
    cy.go('back');
    
    // Visual test second workflow
    cy.contains('Price Analyzer').click();
    cy.visualSnapshot('workflow-2-visuals');
  });
  
  it('maintains UI consistency in dark mode', () => {
    // Toggle dark mode
    cy.get('[data-testid="theme-toggle"]').click();
    
    // Check workflow builder in dark mode
    cy.contains('E-commerce Scraper').click();
    cy.visualSnapshot('workflow-builder-dark-mode');
    
    // Check node appearance in dark mode
    cy.get('.react-flow__node').should('have.length.at.least', 1);
    
    // Verify high contrast for accessibility
    cy.checkAccessibility();
  });
});
