import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { usePrefetchSection } from './hooks/usePrefetch';
import offlineManager from './services/OfflineManager';
import { JobListSkeleton, NodeListSkeleton } from './components/common/SkeletonLoaders';

// Lazy load components for code splitting
const OptimizedMobileSchedulerInterface = lazy(() => 
  import('./components/automation/scheduler/OptimizedMobileSchedulerInterface')
);

const OptimizedMobileWorkflowBuilder = lazy(() => 
  import('./components/automation/OptimizedMobileWorkflowBuilder')
);

// Use existing components if available, otherwise use the optimized versions
const MobileSchedulerInterface = lazy(() => {
  try {
    return import('./components/automation/scheduler/MobileSchedulerInterface');
  } catch (e) {
    return import('./components/automation/scheduler/OptimizedMobileSchedulerInterface');
  }
});

const MobileWorkflowBuilder = lazy(() => {
  try {
    return import('./components/automation/MobileWorkflowBuilder');
  } catch (e) {
    return import('./components/automation/OptimizedMobileWorkflowBuilder');
  }
});

// Documentation page
const DocumentationPage = lazy(() => import('./components/documentation/DocumentationPage'));

// Developer Portal for testing navigation
const DevPortal = lazy(() => import('./components/dev/DevPortal'));

// Simple test navigation page
const TestNavigation = lazy(() => import('./pages/TestNavigation'));

// MainLayout component with performance optimizations
const MainLayout = lazy(() => import('./layouts/MainLayout'));

/**
 * Loading fallback component with meaningful skeleton UI
 */
const LoadingFallback: React.FC<{ type?: 'scheduler' | 'workflow' }> = ({ type = 'scheduler' }) => (
  <div className="p-4">
    <div className="animate-pulse mb-6">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
    
    {type === 'scheduler' ? (
      <JobListSkeleton count={3} />
    ) : (
      <NodeListSkeleton count={4} />
    )}
  </div>
);

/**
 * Performance-optimized App component
 * Handles code splitting, prefetching, and offline support
 */
const AppPerformanceOptimizations: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize offline support
  useEffect(() => {
    offlineManager.initialize().catch(err => {
      console.error('Failed to initialize offline support:', err);
    });
    
    // Cleanup on unmount
    return () => {
      offlineManager.destroy();
    };
  }, []);
  
  // Listen for online/offline status changes
  useEffect(() => {
    const handleAppOnline = () => {
      // Notify user they're back online
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Back Online', {
          body: 'Your connection has been restored. All changes have been synced.',
          icon: '/favicon.ico'
        });
      }
    };
    
    const handleAppOffline = () => {
      // Notify user they're offline but can continue working
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Working Offline', {
          body: 'You are currently offline. Changes will be saved and synced when you reconnect.',
          icon: '/favicon.ico'
        });
      }
    };
    
    window.addEventListener('app-online', handleAppOnline);
    window.addEventListener('app-offline', handleAppOffline);
    
    return () => {
      window.removeEventListener('app-online', handleAppOnline);
      window.removeEventListener('app-offline', handleAppOffline);
    };
  }, []);
  
  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
  
  // Prefetch data for sections based on current location
  // This prepares data before the user navigates to a section
  const { prefetchSection: prefetchScheduler } = usePrefetchSection('scheduler', {
    jobs: () => window.dataProvider.getJobs(),
  });
  
  const { prefetchSection: prefetchWorkflow } = usePrefetchSection('workflow', {
    workflows: () => window.dataProvider.getWorkflows(),
    defaultWorkflow: () => window.dataProvider.getWorkflow('default-workflow'),
  });
  
  // Handle prefetching based on current path
  useEffect(() => {
    if (location.pathname.includes('workflow')) {
      // User is in workflow section, prefetch scheduler data
      prefetchScheduler();
    } else if (location.pathname.includes('scheduler') || location.pathname === '/') {
      // User is in scheduler section or home, prefetch workflow data
      prefetchWorkflow();
    }
  }, [location.pathname, prefetchScheduler, prefetchWorkflow]);
  
  // Handle network errors with error boundary
  const handleNetworkError = (error: Error) => {
    console.error('Network error:', error);
    
    // Check if the app is offline
    if (!navigator.onLine) {
      // We're offline, try to get cached data instead
      return;
    }
    
    // Otherwise, show an error message
    navigate('/error', { 
      state: { 
        error: error.message,
        retry: () => navigate(location.pathname)
      } 
    });
  };
  
  // For simplicity, no authentication checks for now

  return (
    <ErrorBoundary onError={handleNetworkError}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Simple test page for direct navigation */}
          <Route path="/test" element={<TestNavigation />} />
          
          {/* Dev Portal route for quick navigation testing */}
          <Route path="/dev" element={<DevPortal />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={
              <Suspense fallback={<LoadingFallback type="scheduler" />}>
                <OptimizedMobileSchedulerInterface />
              </Suspense>
            } />
            <Route path="scheduler" element={
              <Suspense fallback={<LoadingFallback type="scheduler" />}>
                <OptimizedMobileSchedulerInterface />
              </Suspense>
            } />
            <Route path="workflow/:id?" element={
              <Suspense fallback={<LoadingFallback type="workflow" />}>
                <OptimizedMobileWorkflowBuilder />
              </Suspense>
            } />
            <Route path="docs" element={
              <Suspense fallback={<LoadingFallback />}>
                <DocumentationPage />
              </Suspense>
            } />
            <Route path="error" element={<ErrorPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

/**
 * Custom error boundary component
 */
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  onError?: (error: Error) => void;
}> {
  state = { hasError: false, error: null as Error | null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error boundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error);
    }
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} />;
    }
    
    return this.props.children;
  }
}

/**
 * Error page component
 */
const ErrorPage: React.FC<{ error?: Error | null }> = ({ error }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { error?: string; retry?: () => void } | null;
  
  const errorMessage = error?.message || state?.error || 'An unexpected error occurred';
  
  const handleRetry = () => {
    if (state?.retry) {
      state.retry();
    } else {
      navigate('/');
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">{errorMessage}</p>
      
      <div className="space-y-4">
        <button
          onClick={handleRetry}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors w-full"
        >
          Try Again
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors w-full"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

/**
 * 404 Not Found page
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Go to Home
      </button>
    </div>
  );
};

export default AppPerformanceOptimizations;
