import { axe, toHaveNoViolations } from 'jest-axe';
import { RenderResult } from '@testing-library/react';
import { expect } from 'vitest';

// Extend Jest matchers with accessibility matchers
expect.extend(toHaveNoViolations);

/**
 * Test component for accessibility violations using axe
 * @param renderResult - Result from render function
 * @param options - Optional axe options
 */
export async function checkAccessibility(
  renderResult: RenderResult,
  options = {}
): Promise<void> {
  const axeOptions = {
    rules: {
      // You can configure specific rules here
      'color-contrast': { enabled: true },
      'aria-hidden-focus': { enabled: true },
    },
    ...options,
  };

  const results = await axe(renderResult.container, axeOptions);
  expect(results).toHaveNoViolations();
}

/**
 * Generate a report of accessibility violations
 * @param renderResult - Result from render function
 */
export async function generateAccessibilityReport(
  renderResult: RenderResult
): Promise<string> {
  const results = await axe(renderResult.container);
  
  if (results.violations.length === 0) {
    return 'No accessibility violations found';
  }
  
  return results.violations.map(violation => {
    return `
      Rule: ${violation.id}
      Impact: ${violation.impact}
      Description: ${violation.description}
      Elements: ${violation.nodes.map(node => node.html).join('\n')}
    `;
  }).join('\n');
}

/**
 * Check for specific accessibility criteria beyond axe
 * @param renderResult - Result from render function
 */
export function checkCustomAccessibility(renderResult: RenderResult): void {
  const { container } = renderResult;
  
  // Check for image alt texts
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    expect(img.hasAttribute('alt')).toBe(true);
  });
  
  // Check for form labels
  const inputs = container.querySelectorAll('input:not([type="hidden"]), select, textarea');
  inputs.forEach(input => {
    // Either has aria-label or is associated with a label
    const hasAriaLabel = input.hasAttribute('aria-label');
    const hasAriaLabelledBy = input.hasAttribute('aria-labelledby');
    const id = input.getAttribute('id');
    const hasLabel = id ? container.querySelector(`label[for="${id}"]`) !== null : false;
    
    expect(hasAriaLabel || hasAriaLabelledBy || hasLabel).toBe(true);
  });
}
