# OptimizedMobileWorkflowBuilder Component

The `OptimizedMobileWorkflowBuilder` component provides a high-performance, mobile-friendly interface for creating and editing workflow automation pipelines. It uses a combination of optimization techniques like memoization, virtualization, and code splitting to ensure smooth performance even on mobile devices.

## Import

```tsx
import OptimizedMobileWorkflowBuilder from '../../components/automation/OptimizedMobileWorkflowBuilder';
```

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `workflowId` | `string` | No | `'default-workflow'` | ID of the workflow to load or create |

## Features

- **Node Palette**: Easy-to-use palette of available node types
- **Virtualized Node List**: Performance-optimized list view for all workflow nodes
- **Canvas View**: Visual representation of the workflow with connections
- **Offline Support**: Works without internet connection with automatic sync
- **Optimistic Updates**: UI updates immediately before API calls complete
- **Lazy Loading**: Only loads necessary components when needed

## Usage Example

```tsx
import React from 'react';
import OptimizedMobileWorkflowBuilder from '../../components/automation/OptimizedMobileWorkflowBuilder';

const WorkflowBuilderPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Workflow Builder</h1>
      <OptimizedMobileWorkflowBuilder workflowId="my-custom-workflow" />
    </div>
  );
};

export default WorkflowBuilderPage;
```

## Technical Implementation

### Performance Optimizations

1. **React Context with Selectors**: Uses an optimized context pattern that only re-renders components when their specific data changes
2. **Memoization**: All rendering functions and event handlers are memoized with `useCallback` and `useMemo`
3. **Virtualized Lists**: Node lists use virtualization to render only visible items
4. **Code Splitting**: Component uses lazy loading to reduce initial bundle size
5. **Optimistic Updates**: Changes appear immediately with background API synchronization

### Workflow Data Structure

The workflow builder operates on this data structure:

```typescript
interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  connected: { sources: string[]; targets: string[] };
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: Array<{ id: string; source: string; target: string }>;
  created: string;
  updated: string;
}
```

### Node Types

The component supports these built-in node types:

1. **Web Scraper**: Extract data from websites
2. **Data Filter**: Filter and transform data
3. **Database**: Store data in a database
4. **Notification**: Send alerts and notifications
5. **API Connector**: Connect to external APIs

### State Management

The component uses a reducer pattern with these actions:

- `SET_WORKFLOW`: Load a complete workflow
- `ADD_NODE`: Add a new node to the workflow
- `UPDATE_NODE`: Update an existing node
- `DELETE_NODE`: Remove a node from the workflow
- `ADD_EDGE`: Connect two nodes
- `DELETE_EDGE`: Remove a connection between nodes
- `SET_LOADING`: Set loading state
- `SET_ERROR`: Handle errors

## Accessibility

This component implements the following accessibility features:

- All interactive elements have appropriate ARIA attributes
- Keyboard navigation between nodes
- High contrast colors for node types
- Screen reader support for workflow structure
- Error messages are announced to screen readers

## Browser Compatibility

- Chrome for Android: 92+
- Safari iOS: 14+
- Samsung Internet: 14+
- Opera Mobile: 64+
- Firefox for Android: 90+

## Offline Capability

The workflow builder uses IndexedDB through the `OfflineManager` service to:

1. Cache workflow data for offline use
2. Queue changes when offline
3. Synchronize changes when back online
4. Provide offline indicators and notifications

## Best Practices

1. **Keep workflows manageable**: Large workflows with many nodes can impact performance
2. **Use node descriptions**: Adding descriptions helps with workflow documentation
3. **Test workflows**: Use the validation feature to ensure workflows will execute correctly
4. **Group related nodes**: Organize nodes logically for better maintainability
