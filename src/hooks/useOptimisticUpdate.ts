import { useState, useCallback } from 'react';

/**
 * Custom hook for implementing optimistic updates
 * Updates the UI immediately while the API call is in progress
 * 
 * @param mutationFn - The function that performs the actual API call
 * @param onSuccess - Callback for successful API calls
 * @param onError - Callback for failed API calls
 * @returns An object with methods to perform optimistic updates
 */
export function useOptimisticUpdate<T, P = any>(
  mutationFn: (params: P) => Promise<T>,
  onSuccess?: (data: T, optimisticData: any) => void,
  onError?: (error: Error, rollbackData: any) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // The optimistic update function
  const mutate = useCallback(
    async (
      params: P,
      optimisticData: any,
      updateFn: (currentData: any, optimisticData: any) => any,
      rollbackFn: (currentData: any, previousData: any) => any,
      currentData: any
    ) => {
      setIsLoading(true);
      setError(null);
      
      // Store the previous state for potential rollback
      const previousData = {...currentData};
      
      try {
        // Apply optimistic update immediately
        const updatedData = updateFn(currentData, optimisticData);
        
        // Perform the actual API call
        const result = await mutationFn(params);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result, optimisticData);
        }
        
        setIsLoading(false);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        // Rollback to previous state
        rollbackFn(currentData, previousData);
        
        // Call error callback if provided
        if (onError) {
          onError(error, previousData);
        }
        
        setIsLoading(false);
        throw error;
      }
    },
    [mutationFn, onSuccess, onError]
  );
  
  return {
    mutate,
    isLoading,
    error,
  };
}

/**
 * Custom hook for optimistic list operations
 * Specializes in common list operations like add, update, delete
 */
export function useOptimisticList<T extends { id: string }>(
  mutationFn: (action: string, item: T) => Promise<T>,
  onSuccess?: (action: string, data: T) => void,
  onError?: (action: string, error: Error) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Optimistically add an item to a list
  const addItem = useCallback(
    async (item: T, list: T[], setList: (list: T[]) => void) => {
      setIsLoading(true);
      setError(null);
      
      // Optimistically update the list
      setList([...list, item]);
      
      try {
        // Perform the actual API call
        const result = await mutationFn('add', item);
        
        // Update with the server response (which might include generated IDs, timestamps, etc.)
        setList(list.map(i => i.id === item.id ? result : i));
        
        if (onSuccess) {
          onSuccess('add', result);
        }
        
        setIsLoading(false);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        // Rollback on error
        setList(list);
        
        if (onError) {
          onError('add', error);
        }
        
        setIsLoading(false);
        throw error;
      }
    },
    [mutationFn, onSuccess, onError]
  );
  
  // Optimistically update an item in a list
  const updateItem = useCallback(
    async (item: T, list: T[], setList: (list: T[]) => void) => {
      setIsLoading(true);
      setError(null);
      
      // Save the original item for potential rollback
      const originalItem = list.find(i => i.id === item.id);
      
      // Optimistically update the list
      setList(list.map(i => i.id === item.id ? item : i));
      
      try {
        // Perform the actual API call
        const result = await mutationFn('update', item);
        
        // Update with the server response
        setList(list.map(i => i.id === item.id ? result : i));
        
        if (onSuccess) {
          onSuccess('update', result);
        }
        
        setIsLoading(false);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        // Rollback on error
        if (originalItem) {
          setList(list.map(i => i.id === item.id ? originalItem : i));
        }
        
        if (onError) {
          onError('update', error);
        }
        
        setIsLoading(false);
        throw error;
      }
    },
    [mutationFn, onSuccess, onError]
  );
  
  // Optimistically delete an item from a list
  const deleteItem = useCallback(
    async (item: T, list: T[], setList: (list: T[]) => void) => {
      setIsLoading(true);
      setError(null);
      
      // Optimistically update the list
      setList(list.filter(i => i.id !== item.id));
      
      try {
        // Perform the actual API call
        await mutationFn('delete', item);
        
        if (onSuccess) {
          onSuccess('delete', item);
        }
        
        setIsLoading(false);
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        // Rollback on error
        setList(list);
        
        if (onError) {
          onError('delete', error);
        }
        
        setIsLoading(false);
        throw error;
      }
    },
    [mutationFn, onSuccess, onError]
  );
  
  return {
    addItem,
    updateItem,
    deleteItem,
    isLoading,
    error,
  };
}
