import React, { Suspense, lazy, ComponentType } from 'react';

interface FallbackProps {
  height?: string | number;
  width?: string | number;
  className?: string;
}

/**
 * Default fallback component for lazy loading
 */
const DefaultFallback: React.FC<FallbackProps> = ({ 
  height = '400px', 
  width = '100%',
  className = ''
}) => (
  <div 
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md ${className}`}
    style={{ height, width }}
    aria-label="Loading content"
    role="status"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

interface LazyLoadProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  fallbackProps?: FallbackProps;
  props?: Record<string, any>;
}

/**
 * LazyLoad component for dynamic imports with Suspense
 * Helps with code splitting and improves performance
 */
const LazyLoad: React.FC<LazyLoadProps> = ({ 
  component, 
  fallback, 
  fallbackProps = {}, 
  props = {}
}) => {
  const LazyComponent = lazy(component);
  
  return (
    <Suspense fallback={fallback || <DefaultFallback {...fallbackProps} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default LazyLoad;
