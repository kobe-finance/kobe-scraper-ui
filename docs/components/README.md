# Component Documentation

This directory contains detailed documentation for all major components in the Kobe Scraper UI application. The components are organized by functional area and include performance optimizations, props reference, usage examples, and best practices.

## Table of Contents

1. [Common Components](./common/README.md)
   - [VirtualizedList](./common/VirtualizedList.md)
   - [SkeletonLoaders](./common/SkeletonLoaders.md)
   - [LazyLoad](./common/LazyLoad.md)

2. [Automation Components](./automation/README.md)
   - [OptimizedMobileSchedulerInterface](./automation/OptimizedMobileSchedulerInterface.md)
   - [OptimizedMobileWorkflowBuilder](./automation/OptimizedMobileWorkflowBuilder.md)
   - [NodeEditor](./automation/NodeEditor.md)

3. [Context Providers](./context/README.md)
   - [OptimizedContextProvider](./context/OptimizedContextProvider.md)

4. [Hooks](./hooks/README.md)
   - [useOptimisticUpdate](./hooks/useOptimisticUpdate.md)
   - [usePrefetch](./hooks/usePrefetch.md)

5. [Services](./services/README.md)
   - [DataProvider](./services/DataProvider.md)
   - [OfflineManager](./services/OfflineManager.md)

## Component Standards

All components in this application follow these standards:

1. **Performance Optimization**: Components use memoization, virtualization, and code splitting where appropriate
2. **Accessibility**: All components meet WCAG 2.1 AA standards
3. **Testing**: Components have unit and integration tests
4. **Responsive Design**: Components work on all screen sizes
5. **Type Safety**: All components use TypeScript with proper type definitions
