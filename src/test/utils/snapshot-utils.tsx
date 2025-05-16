import React from 'react';
import { render } from '@testing-library/react';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { expect } from 'vitest';
import { DataProviderProvider } from './test-utils';
import { MockDataProvider } from '../MockDataProvider';

// Extend matchers with image snapshot
expect.extend({ toMatchImageSnapshot });

/**
 * Creates consistent snapshot tests that normalize dynamic content
 * @param ui - React component to snapshot
 */
export function createConsistentSnapshot(ui: React.ReactElement): void {
  // Use a fixed mock data provider for all snapshot tests
  const dataProvider = new MockDataProvider();
  
  const { asFragment } = render(
    <DataProviderProvider dataProvider={dataProvider}>
      {ui}
    </DataProviderProvider>
  );
  
  // Create snapshot
  expect(asFragment()).toMatchSnapshot();
}

/**
 * Normalizes the component HTML for snapshot testing 
 * by removing or replacing dynamic content
 * @param html - HTML string to normalize
 */
export function normalizeSnapshotHtml(html: string): string {
  return html
    // Replace UUIDs with fixed placeholder
    .replace(/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/gi, '[UUID]')
    // Replace dates in ISO format
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/g, '[ISO-DATE]')
    // Replace numeric IDs that might change between test runs
    .replace(/id="[^"]*-\d+"/g, 'id="[DYNAMIC-ID]"')
    // Replace data-testid with numeric suffixes
    .replace(/data-testid="[^"]*-\d+"/g, 'data-testid="[DYNAMIC-TESTID]"');
}

/**
 * Creates a snapshot test with normalized dynamic content
 * @param ui - React component to snapshot
 */
export function createNormalizedSnapshot(ui: React.ReactElement): void {
  // Use a fixed mock data provider for all snapshot tests
  const dataProvider = new MockDataProvider();
  
  const { container } = render(
    <DataProviderProvider dataProvider={dataProvider}>
      {ui}
    </DataProviderProvider>
  );
  
  // Normalize and create snapshot
  const normalizedHtml = normalizeSnapshotHtml(container.innerHTML);
  expect(normalizedHtml).toMatchSnapshot();
}

/**
 * Creates a snapshot for a component in different states
 * @param Component - Component to test
 * @param states - Array of props for different states
 */
export function createMultiStateSnapshot<P>(
  Component: React.ComponentType<P>, 
  states: P[]
): void {
  states.forEach((props, index) => {
    const { asFragment } = render(<Component {...props} />);
    expect(asFragment()).toMatchSnapshot(`State ${index}`);
  });
}
