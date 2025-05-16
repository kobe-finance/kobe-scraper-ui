# VirtualizedList Component

The `VirtualizedList` component is a high-performance list renderer that only renders items visible in the viewport, significantly improving performance when working with large datasets.

## Import

```tsx
import VirtualizedList from '../../components/common/VirtualizedList';
```

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `items` | `T[]` | Yes | - | Array of items to render in the list |
| `height` | `number` | Yes | - | Fixed height of the list container in pixels |
| `width` | `string \| number` | No | `'100%'` | Width of the list container |
| `itemHeight` | `number` | Yes | - | Height of each item in pixels (used for virtualization) |
| `renderItem` | `(item: T, index: number) => React.ReactNode` | Yes | - | Function to render each item |
| `onItemClick` | `(item: T, index: number) => void` | No | - | Callback when an item is clicked |
| `keyExtractor` | `(item: T, index: number) => string` | Yes | - | Function to extract a unique key for each item |
| `overscan` | `number` | No | `5` | Number of items to render above/below the visible area |
| `className` | `string` | No | `''` | Additional CSS class names for the list container |
| `itemClassName` | `string` | No | `''` | Additional CSS class names for each item container |
| `estimateSize` | `(index: number) => number` | No | - | Function to estimate the size of each item (if variable height) |
| `getScrollElement` | `() => HTMLElement \| null` | No | - | Function to get the scrollable element if not the list itself |

## Usage Example

```tsx
import React, { useCallback } from 'react';
import VirtualizedList from '../../components/common/VirtualizedList';
import { ScheduledJob } from '../../types/scheduler';

const JobList: React.FC<{ jobs: ScheduledJob[] }> = ({ jobs }) => {
  // Render function for each job item
  const renderJobItem = useCallback((job: ScheduledJob) => (
    <div className="border p-4 rounded-lg">
      <h3>{job.name}</h3>
      <p>{job.description}</p>
    </div>
  ), []);
  
  // Extract unique key for each job
  const getJobKey = useCallback((job: ScheduledJob) => job.id, []);
  
  // Handle job click
  const handleJobClick = useCallback((job: ScheduledJob) => {
    console.log('Job clicked:', job.name);
  }, []);
  
  return (
    <VirtualizedList
      items={jobs}
      height={500}
      itemHeight={120}
      renderItem={renderJobItem}
      keyExtractor={getJobKey}
      onItemClick={handleJobClick}
      className="border rounded-lg"
      overscan={2}
    />
  );
};

export default JobList;
```

## Performance Considerations

- Always use `useCallback` for your `renderItem` and `keyExtractor` functions to prevent unnecessary re-renders
- The `itemHeight` should be as accurate as possible for optimal performance
- For variable height items, provide a custom `estimateSize` function
- Set an appropriate `overscan` value based on your use case (higher for smoother scrolling, lower for better performance)

## Accessibility

The component implements proper accessibility attributes:
- The list has a `role="list"` attribute
- Each item has a `role="listitem"` attribute
- Each item receives `tabIndex={0}` to make it focusable
- Screen readers can navigate through the list items

## Technical Implementation

Under the hood, this component uses the `react-virtual` library to handle virtualization. It maintains a fixed container height and only renders the items that are currently visible in the viewport, plus a configurable number of items above and below (overscan).

When the user scrolls, the component calculates which items should be visible and only renders those, recycling DOM nodes for items that are no longer visible. This dramatically improves performance for large lists, reducing memory usage and rendering time.

## Browser Compatibility

- Chrome: 60+
- Firefox: 60+
- Safari: 12+
- Edge: 79+
- IE: Not supported
