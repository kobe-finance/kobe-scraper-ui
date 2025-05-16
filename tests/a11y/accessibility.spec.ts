import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Define the pages we want to test for accessibility
const pagesToTest = [
  { path: '/', name: 'Home Page' },
  { path: '/scheduler', name: 'Scheduler Page' },
  { path: '/workflow', name: 'Workflow Builder Page' },
];

// Run accessibility tests on each page
for (const { path, name } of pagesToTest) {
  test(`${name} should not have any automatically detectable accessibility issues`, async ({ page }) => {
    // Navigate to the page
    await page.goto(path);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check for screen readers to ensure content is ready
    await page.waitForSelector('[role="main"], main, #root', { state: 'visible' });
    
    // Run the accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
      
    // Generate a more detailed report
    const formattedViolations = accessibilityScanResults.violations.map(violation => {
      return {
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map(node => ({
          html: node.html,
          failureSummary: node.failureSummary,
        })),
      };
    });
    
    // Log detailed information about violations
    if (formattedViolations.length > 0) {
      console.log(`Accessibility violations on ${name}:`, JSON.stringify(formattedViolations, null, 2));
    }
    
    // Check for no violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  // Test keyboard navigation
  test(`${name} should be navigable with keyboard`, async ({ page }) => {
    // Navigate to the page
    await page.goto(path);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Focus on body to start
    await page.focus('body');
    
    // Press Tab to move focus through the page
    // Check that something gets focused when tabbing
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      
      // Get the active element
      const activeElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName.toLowerCase(),
          hasVisibleOutline: window.getComputedStyle(el || document.body).outlineStyle !== 'none',
          isVisible: el !== document.body && el !== document.documentElement,
        };
      });
      
      // If we're on a focusable element that's not just the body, it's working
      if (activeElement.isVisible) {
        expect(activeElement.hasVisibleOutline).toBeTruthy();
        break;
      }
      
      // If we've gone through 10 tabs and nothing is focused, fail the test
      if (i === 9) {
        expect(activeElement.isVisible).toBeTruthy();
      }
    }
  });
  
  // Test color contrast
  test(`${name} should have proper color contrast`, async ({ page }) => {
    // Navigate to the page
    await page.goto(path);
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Run a more specific accessibility scan for color contrast
    const contrastResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .options({
        runOnly: {
          type: 'rule',
          values: ['color-contrast'],
        },
      })
      .analyze();
    
    // Check for no violations
    expect(contrastResults.violations).toEqual([]);
  });
}

// Test for mobile viewport accessibility
test('Mobile view should be accessible', async ({ page }) => {
  // Set viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });
  
  // Navigate to the home page
  await page.goto('/');
  
  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Run the accessibility scan
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  // Check for no violations
  expect(accessibilityScanResults.violations).toEqual([]);
  
  // Check that the mobile navigation is usable
  await page.click('button[aria-label="Open menu"], button[aria-label="Menu"]');
  
  // Wait for navigation menu to be visible
  await page.waitForSelector('nav, [role="navigation"]', { state: 'visible' });
  
  // Ensure that navigation items are accessible
  const navLinks = await page.$$('nav a, [role="navigation"] a');
  expect(navLinks.length).toBeGreaterThan(0);
});
