import { useCallback, useEffect, useRef } from 'react';

/**
 * Configuration options for prefetching
 */
interface PrefetchOptions {
  // Whether to enable prefetching (useful for toggling based on user preferences or network conditions)
  enabled?: boolean;
  
  // Delay in milliseconds before triggering the prefetch
  delay?: number;
  
  // Maximum cache age in milliseconds
  maxAge?: number;
  
  // Whether to show loading indicators when prefetching
  showLoadingIndicator?: boolean;
  
  // Whether to retry failed prefetch attempts
  retry?: boolean;
  
  // Number of retry attempts
  retryCount?: number;
  
  // Custom condition for when to prefetch
  condition?: () => boolean;
}

// Store for cached prefetch results
const prefetchCache = new Map<string, { 
  data: any; 
  timestamp: number;
  promise?: Promise<any>;
}>();

/**
 * Custom hook for prefetching data before it's needed
 * Improves perceived performance by loading data in the background
 * 
 * @param key - Unique key for this prefetch operation
 * @param fetchFn - The function that fetches the data
 * @param deps - Dependencies array (similar to useEffect)
 * @param options - Configuration options
 * @returns Object with prefetch methods and prefetched data
 */
export function usePrefetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  deps: any[] = [],
  options: PrefetchOptions = {}
) {
  const {
    enabled = true,
    delay = 0,
    maxAge = 5 * 60 * 1000, // 5 minutes default
    showLoadingIndicator = false,
    retry = true,
    retryCount = 3,
    condition = () => true,
  } = options;
  
  const timerRef = useRef<number | null>(null);
  const retryAttemptRef = useRef(0);
  
  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Check if data is cached and still valid
  const isCacheValid = useCallback(() => {
    const cached = prefetchCache.get(key);
    if (!cached) return false;
    
    const now = Date.now();
    return now - cached.timestamp < maxAge;
  }, [key, maxAge]);
  
  // Get cached data
  const getCachedData = useCallback(() => {
    const cached = prefetchCache.get(key);
    return cached?.data;
  }, [key]);
  
  // Prefetch data and store in cache
  const prefetch = useCallback(async () => {
    // Don't prefetch if disabled or condition not met
    if (!enabled || !condition()) {
      return;
    }
    
    // Check if we already have valid cached data
    if (isCacheValid()) {
      return prefetchCache.get(key)?.data;
    }
    
    // Check if we're already fetching this data
    const existing = prefetchCache.get(key);
    if (existing?.promise) {
      return existing.promise;
    }
    
    // Create the fetch promise
    const fetchPromise = async () => {
      try {
        const data = await fetchFn();
        prefetchCache.set(key, {
          data,
          timestamp: Date.now(),
          promise: undefined // Clear the promise reference
        });
        retryAttemptRef.current = 0; // Reset retry counter on success
        return data;
      } catch (error) {
        // Handle retries
        if (retry && retryAttemptRef.current < retryCount) {
          retryAttemptRef.current++;
          
          // Exponential backoff
          const backoffDelay = Math.min(1000 * Math.pow(2, retryAttemptRef.current), 30000);
          
          // Retry after backoff
          timerRef.current = window.setTimeout(() => {
            prefetchCache.delete(key); // Remove failed attempt
            prefetch(); // Try again
          }, backoffDelay);
          
          throw error;
        } else {
          // Clear the promise reference on final failure
          const cached = prefetchCache.get(key);
          if (cached) {
            cached.promise = undefined;
          }
          throw error;
        }
      }
    };
    
    // Store the promise in the cache
    const promise = fetchPromise();
    prefetchCache.set(key, {
      data: undefined,
      timestamp: Date.now(),
      promise
    });
    
    return promise;
  }, [key, fetchFn, enabled, condition, isCacheValid, retry, retryCount]);
  
  // Trigger prefetch after delay
  const triggerPrefetch = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    
    if (delay > 0) {
      timerRef.current = window.setTimeout(() => {
        prefetch();
      }, delay);
    } else {
      prefetch();
    }
  }, [prefetch, delay]);
  
  // Prefetch on deps change if enabled
  useEffect(() => {
    if (enabled && condition()) {
      triggerPrefetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  
  // Clear cached data
  const clearCache = useCallback(() => {
    prefetchCache.delete(key);
  }, [key]);
  
  return {
    prefetch,
    triggerPrefetch,
    getCachedData,
    isCacheValid,
    clearCache,
    // Fetch with cache
    fetchWithCache: async () => {
      if (isCacheValid()) {
        return getCachedData();
      }
      return await prefetch();
    }
  };
}

/**
 * Hook for prefetching data on hover or other user interactions
 */
export function usePrefetchOnHover<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: PrefetchOptions = {}
) {
  const prefetchHook = usePrefetch(key, fetchFn, [], {
    ...options,
    enabled: false, // Don't prefetch automatically
  });
  
  // Event handlers for hover
  const handleMouseEnter = useCallback(() => {
    prefetchHook.triggerPrefetch();
  }, [prefetchHook]);
  
  const handleMouseLeave = useCallback(() => {
    // Optionally cancel prefetch if not started yet
  }, []);
  
  return {
    ...prefetchHook,
    prefetchProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleMouseEnter,
      onTouchStart: handleMouseEnter,
    },
  };
}

/**
 * Hook for prefetching API data for entire sections
 */
export function usePrefetchSection(
  section: string,
  fetchFns: Record<string, () => Promise<any>>,
  options: PrefetchOptions = {}
) {
  const prefetchSection = useCallback(async () => {
    const promises = Object.entries(fetchFns).map(([key, fetchFn]) => {
      return usePrefetch(`${section}:${key}`, fetchFn, [], options).prefetch();
    });
    
    return Promise.all(promises);
  }, [section, fetchFns, options]);
  
  return {
    prefetchSection,
    // Prefetch when user is likely to navigate to this section
    prefetchProps: {
      onMouseEnter: prefetchSection,
      onFocus: prefetchSection,
    },
  };
}
