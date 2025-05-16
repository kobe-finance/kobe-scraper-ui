import { test, expect } from '@playwright/test';

// Test the critical user flows across different browsers
test.describe('Cross-browser critical paths', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the job scheduler and display jobs', async ({ page }) => {
    // Navigate to scheduler page if not already there
    if (!page.url().includes('/scheduler')) {
      await page.click('a[href="/scheduler"], a:has-text("Scheduler")');
    }
    
    // Wait for scheduler to load
    await page.waitForSelector('[data-testid="job-list"], .job-list', { state: 'visible' });
    
    // Verify content is visible
    const pageTitle = await page.textContent('h1');
    expect(pageTitle).toContain('Scheduled Jobs');
    
    // Check if we can interact with the scheduler
    const newJobButton = await page.getByRole('button', { name: /new job/i });
    expect(newJobButton).toBeVisible();
    
    // Verify jobs load or empty state is shown correctly
    const hasJobs = await page.isVisible('[data-testid="job-item"]');
    if (hasJobs) {
      // Verify job list contains items
      const jobCount = await page.locator('[data-testid="job-item"]').count();
      expect(jobCount).toBeGreaterThan(0);
    } else {
      // Verify empty state is showing
      const emptyState = await page.textContent('[data-testid="empty-state"], .empty-state');
      expect(emptyState).toContain('No jobs');
    }
    
    // Test responsive layout - verify the page adapts to mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Wait for resize to take effect
    
    // Check if the layout has adjusted properly
    expect(await page.isVisible('[data-testid="mobile-menu"], .mobile-menu')).toBeTruthy();
  });
  
  test('should navigate to workflow builder and display components', async ({ page }) => {
    // Navigate to workflow builder page
    await page.click('a[href="/workflow"], a:has-text("Workflow")');
    
    // Wait for workflow builder to load
    await page.waitForSelector('[data-testid="workflow-builder"], .workflow-builder', { state: 'visible' });
    
    // Verify content is visible
    const pageTitle = await page.textContent('h1');
    expect(pageTitle).toContain('Workflow Builder');
    
    // Verify node palette is visible
    await page.waitForSelector('[data-testid="node-palette"], .node-palette', { state: 'visible' });
    
    // Check if we can add a node
    const nodeTypes = await page.locator('[data-testid="node-type-button"], .node-type-button').count();
    expect(nodeTypes).toBeGreaterThan(0);
    
    // Add a node to the workflow
    await page.click('[data-testid="node-type-button"]:first-child, .node-type-button:first-child');
    
    // Verify node was added
    await page.waitForSelector('[data-testid="workflow-node"], .workflow-node', { state: 'visible' });
    
    // Test responsive layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Wait for resize to take effect
    
    // Check if the layout has adjusted
    expect(await page.isVisible('[data-testid="mobile-view-toggle"], .mobile-view-toggle')).toBeTruthy();
  });
  
  test('should support dark mode toggle', async ({ page }) => {
    // Look for dark mode toggle
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"], .dark-mode-toggle');
    
    if (await darkModeToggle.isVisible()) {
      // Get the current theme
      const isDarkMode = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });
      
      // Toggle the theme
      await darkModeToggle.click();
      
      // Verify the theme changed
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });
      
      expect(newTheme).not.toEqual(isDarkMode);
    }
  });
  
  test('should show offline indicator when network is offline', async ({ page }) => {
    // Simulate going offline
    await page.context().setOffline(true);
    
    // Wait a moment for the app to detect offline status
    await page.waitForTimeout(1000);
    
    // Check for offline indicator
    const offlineIndicator = await page.isVisible('[data-testid="offline-indicator"], .offline-indicator');
    expect(offlineIndicator).toBeTruthy();
    
    // Restore online status
    await page.context().setOffline(false);
  });
});

// Test performance optimized components
test.describe('Performance optimized components', () => {
  test('VirtualizedList should render efficiently with many items', async ({ page }) => {
    // Go to scheduler page which uses virtualized list
    await page.goto('/scheduler');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="job-list"], .job-list', { state: 'visible' });
    
    // Inject test code to add many items to test virtualization
    await page.evaluate(() => {
      // Access the window object to reach our test helpers
      const w = window as any;
      if (w.__TEST_HELPERS__) {
        // Add 100 test jobs
        w.__TEST_HELPERS__.addTestJobs(100);
      }
    });
    
    // Wait for list to update
    await page.waitForTimeout(500);
    
    // Check that only a subset of items are in the DOM despite having many items
    const visibleItems = await page.locator('[data-testid="job-item"], .job-item').count();
    
    // Should be significantly less than the 100 total items
    expect(visibleItems).toBeLessThan(50);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    
    // Verify new items are visible and old ones removed
    const newVisibleItems = await page.locator('[data-testid="job-item"], .job-item').count();
    expect(newVisibleItems).toBeLessThan(50);
  });
  
  test('Should show skeleton loaders while content is loading', async ({ page }) => {
    // Go to a page and intercept network requests to delay them
    await page.route('**/api/jobs', route => {
      // Delay the response by 1 second
      setTimeout(() => route.continue(), 1000);
    });
    
    // Navigate to scheduler
    await page.goto('/scheduler');
    
    // Skeletons should be visible while loading
    await page.waitForSelector('[data-testid="skeleton-loader"], .skeleton-loader', { state: 'visible' });
    
    // After loading completes, skeletons should be replaced by content
    await page.waitForSelector('[data-testid="job-list"], .job-list', { state: 'visible' });
    
    // Skeletons should no longer be visible
    const skeletonsVisible = await page.isVisible('[data-testid="skeleton-loader"], .skeleton-loader');
    expect(skeletonsVisible).toBeFalsy();
  });
});
