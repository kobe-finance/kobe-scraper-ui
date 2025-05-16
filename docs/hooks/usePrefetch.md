# usePrefetch Hook

The `usePrefetch` hook is a powerful utility for improving user experience by prefetching data before it's needed. This reduces perceived loading times by fetching data in the background while users interact with the application.

## Import

```tsx
import { usePrefetch, usePrefetchOnHover, usePrefetchSection } from '../../hooks/usePrefetch';
```

## API Reference

### usePrefetch

```tsx
function usePrefetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  deps: any[] = [],
  options: PrefetchOptions = {}
): {
  prefetch: () => Promise<T | undefined>;
  triggerPrefetch: () => void;
  getCachedData: () => T | undefined;
  isCacheValid: () => boolean;
  clearCache: () => void;
  fetchWithCache: () => Promise<T>;
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | `string` | Yes | - | Unique key to identify this prefetch operation |
| `fetchFn` | `() => Promise<T>` | Yes | - | Function that fetches the data |
| `deps` | `any[]` | No | `[]` | Dependencies that trigger prefetch when changed (similar to useEffect) |
| `options` | `PrefetchOptions` | No | `{}` | Configuration options |

#### Options

```typescript
interface PrefetchOptions {
  enabled?: boolean;           // Whether to enable prefetching
  delay?: number;              // Delay in milliseconds before prefetching
  maxAge?: number;             // Maximum cache age in milliseconds
  showLoadingIndicator?: boolean; // Whether to show loading indicators
  retry?: boolean;             // Whether to retry failed prefetch attempts
  retryCount?: number;         // Number of retry attempts
  condition?: () => boolean;   // Custom condition for when to prefetch
}
```

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `prefetch` | `() => Promise<T \| undefined>` | Function to manually trigger prefetch |
| `triggerPrefetch` | `() => void` | Trigger prefetch with configured delay |
| `getCachedData` | `() => T \| undefined` | Get currently cached data if available |
| `isCacheValid` | `() => boolean` | Check if the cache is still valid |
| `clearCache` | `() => void` | Clear the cached data |
| `fetchWithCache` | `() => Promise<T>` | Get data from cache if valid, otherwise fetch fresh data |

### usePrefetchOnHover

```tsx
function usePrefetchOnHover<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: PrefetchOptions = {}
): {
  prefetch: () => Promise<T | undefined>;
  triggerPrefetch: () => void;
  getCachedData: () => T | undefined;
  isCacheValid: () => boolean;
  clearCache: () => void;
  fetchWithCache: () => Promise<T>;
  prefetchProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onTouchStart: () => void;
  };
}
```

This variation of `usePrefetch` is specifically designed to trigger prefetching when a user hovers over or focuses on an element. It returns the same properties as `usePrefetch` plus an additional `prefetchProps` object containing event handlers.

### usePrefetchSection

```tsx
function usePrefetchSection(
  section: string,
  fetchFns: Record<string, () => Promise<any>>,
  options: PrefetchOptions = {}
): {
  prefetchSection: () => Promise<any[]>;
  prefetchProps: {
    onMouseEnter: () => Promise<any[]>;
    onFocus: () => Promise<any[]>;
  };
}
```

This hook prefetches multiple related resources for an entire section of the application. It takes a section identifier and a record of fetch functions.

## Usage Examples

### Basic Prefetching

```tsx
import { usePrefetch } from '../../hooks/usePrefetch';

const JobList: React.FC = () => {
  const { fetchWithCache, isLoading } = usePrefetch(
    'jobs-list',
    () => api.getJobs(),
    [], // No dependencies, only fetch once
    { maxAge: 5 * 60 * 1000 } // Cache for 5 minutes
  );
  
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobsData = await fetchWithCache();
        setJobs(jobsData);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      }
    };
    
    loadJobs();
  }, [fetchWithCache]);
  
  return (
    <div>
      {isLoading ? <LoadingIndicator /> : (
        <ul>
          {jobs.map(job => (
            <li key={job.id}>{job.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Prefetch on Hover

```tsx
import { usePrefetchOnHover } from '../../hooks/usePrefetch';

const NavigationLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const { prefetchProps } = usePrefetchOnHover(
    `page-${to}`,
    () => api.getPageData(to),
    { delay: 300 } // Wait 300ms before prefetching to avoid unnecessary requests
  );
  
  return (
    <Link 
      to={to}
      {...prefetchProps} // This adds onMouseEnter, onFocus, etc. handlers
    >
      {label}
    </Link>
  );
};
```

### Prefetching an Entire Section

```tsx
import { usePrefetchSection } from '../../hooks/usePrefetch';

const DashboardNavigation: React.FC = () => {
  const { prefetchProps } = usePrefetchSection(
    'dashboard',
    {
      stats: () => api.getDashboardStats(),
      recentJobs: () => api.getRecentJobs(),
      alerts: () => api.getAlerts()
    }
  );
  
  return (
    <Link to="/dashboard" {...prefetchProps}>
      Dashboard
    </Link>
  );
};
```

## Performance Considerations

1. **Cache Duration**: Set an appropriate `maxAge` based on how frequently your data changes. Static data can be cached longer than dynamic data.

2. **Avoiding Excessive Prefetches**: Use the `delay` option to prevent prefetching when users quickly hover over multiple elements.

3. **Conditional Prefetching**: Use the `condition` option to only prefetch when it makes sense (e.g., based on network conditions or user preferences).

4. **Memory Usage**: Be mindful of prefetching large datasets that could consume significant memory.

5. **Device Considerations**: Consider adjusting prefetch behavior based on the user's device capabilities or connection type.

## Browser Compatibility

The hook uses modern browser features like:

- Promises
- Maps
- setTimeout/clearTimeout

These are well-supported in modern browsers:

- Chrome: 45+
- Firefox: 44+
- Safari: 10+
- Edge: 12+

## Offline Integration

This hook works well with the `OfflineManager` service:

```tsx
const { fetchWithCache } = usePrefetch(
  'jobs-list',
  async () => {
    try {
      // Try to get from API
      const data = await api.getJobs();
      // Cache for offline use
      await offlineManager.cacheData('jobs-list', data);
      return data;
    } catch (error) {
      // Try to get from offline cache
      const cachedData = await offlineManager.getCachedData('jobs-list');
      if (cachedData) return cachedData;
      throw error;
    }
  }
);
```
