// ***********************************************
// This file defines custom commands for Cypress
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands';
import 'cypress-axe';

// Import type definitions for Cypress and Cypress-axe
/// <reference types="cypress" />
/// <reference types="cypress-axe" />

// Load fixture dynamically to avoid hard-coding mock data in commands
Cypress.Commands.add('loadFixture', (fixturePath: string) => {
  return cy.fixture(fixturePath);
});

// Command to switch between mock and real data
Cypress.Commands.add('useDataSource', (source: 'mock' | 'real') => {
  if (source === 'mock') {
    // Set up API mocking with fixtures
    cy.intercept('GET', '/api/jobs', { fixture: 'scheduler/jobs.json' }).as('getJobs');
    cy.intercept('GET', '/api/jobs/*', (req) => {
      const jobId = req.url.split('/').pop();
      cy.loadFixture('scheduler/jobs.json').then((jobs: any[]) => {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
          req.reply(job);
        } else {
          req.reply(404, { error: 'Job not found' });
        }
      });
    }).as('getJob');
    
    cy.intercept('GET', '/api/workflows', { fixture: 'scheduler/workflows.json' }).as('getWorkflows');
    cy.intercept('GET', '/api/workflows/*', (req) => {
      const workflowId = req.url.split('/').pop();
      cy.loadFixture('scheduler/workflows.json').then((workflows: any[]) => {
        const workflow = workflows.find(w => w.id === workflowId);
        if (workflow) {
          req.reply(workflow);
        } else {
          req.reply(404, { error: 'Workflow not found' });
        }
      });
    }).as('getWorkflow');
    
    // Mock POST, PUT, DELETE endpoints with realistic responses
    cy.intercept('POST', '/api/jobs', (req) => {
      const newJob = {
        ...req.body,
        id: `job-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      req.reply(201, newJob);
    }).as('createJob');
    
    cy.intercept('PUT', '/api/jobs/*', (req) => {
      const updatedJob = {
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      req.reply(200, updatedJob);
    }).as('updateJob');
    
    cy.intercept('DELETE', '/api/jobs/*', { statusCode: 204 }).as('deleteJob');
    
    // Add similar mocks for workflows, dependencies, and notifications
    
    cy.log('Using mock data for tests');
  } else {
    // Use real API endpoints
    cy.intercept('GET', '/api/jobs').as('getJobs');
    cy.intercept('GET', '/api/jobs/*').as('getJob');
    cy.intercept('GET', '/api/workflows').as('getWorkflows');
    cy.intercept('GET', '/api/workflows/*').as('getWorkflow');
    cy.intercept('POST', '/api/jobs').as('createJob');
    cy.intercept('PUT', '/api/jobs/*').as('updateJob');
    cy.intercept('DELETE', '/api/jobs/*').as('deleteJob');
    
    cy.log('Using real API endpoints for tests');
  }
});

// Visual testing commands
Cypress.Commands.add('visualSnapshot', (name: string) => {
  if (Cypress.env('visualRegressionTesting')) {
    cy.matchImageSnapshot(name);
  }
});

// Accessibility testing helpers
Cypress.Commands.add('checkAccessibility', (context?: string, options = {}) => {
  if (Cypress.env('accessibilityTesting')) {
    const accessibilityContext = context ? context : undefined;
    cy.checkA11y(accessibilityContext, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
      ...options
    }, null, false);
  }
});

// Common workflow testing helpers
Cypress.Commands.add('loginAsTestUser', () => {
  cy.log('Logging in as test user');
  localStorage.setItem('test-auth', JSON.stringify({
    userId: 'test-user',
    token: 'test-token',
    expires: new Date(Date.now() + 86400000).toISOString()
  }));
});

Cypress.Commands.add('visitDashboard', () => {
  cy.visit('/dashboard');
  cy.url().should('include', '/dashboard');
  cy.contains('Dashboard').should('be.visible');
});

Cypress.Commands.add('visitScheduler', () => {
  cy.visit('/scheduler');
  cy.url().should('include', '/scheduler');
  cy.contains('Job Scheduler').should('be.visible');
});

Cypress.Commands.add('visitWorkflowBuilder', () => {
  cy.visit('/workflow-builder');
  cy.url().should('include', '/workflow-builder');
  cy.contains('Workflow Builder').should('be.visible');
});

// Helper to test toast notifications
Cypress.Commands.add('expectToast', (message: string) => {
  cy.get('.toast-message').should('contain', message);
});

// --- Type definitions for custom commands ---
declare global {
  namespace Cypress {
    interface Chainable {
      loadFixture(fixturePath: string): Chainable<any>;
      useDataSource(source: 'mock' | 'real'): Chainable<void>;
      visualSnapshot(name: string): Chainable<void>;
      checkAccessibility(context?: string, options?: any): Chainable<void>;
      loginAsTestUser(): Chainable<void>;
      visitDashboard(): Chainable<void>;
      visitScheduler(): Chainable<void>;
      visitWorkflowBuilder(): Chainable<void>;
      expectToast(message: string): Chainable<void>;
      measurePerformance(): Chainable<void>;
    }
  }
}
