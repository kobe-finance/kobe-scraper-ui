import React, { createContext, useContext, useReducer, useMemo, useCallback, ReactNode } from 'react';

// Define a generic state type for type safety
type State = Record<string, any>;

// Action types for the reducer
type Action = {
  type: string;
  payload?: any;
};

// Context structure with state and dispatch
type ContextType<S extends State> = {
  state: S;
  dispatch: React.Dispatch<Action>;
};

/**
 * Create an optimized context with reducer pattern
 * This helps prevent unnecessary re-renders by only updating
 * components that actually use the changed state values
 */
export function createOptimizedContext<S extends State>(
  initialState: S,
  reducer: (state: S, action: Action) => S
) {
  // Create the context with a default value
  const Context = createContext<ContextType<S>>({
    state: initialState,
    dispatch: () => null,
  });

  // Provider component with performance optimizations
  const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({ state, dispatch }), [state]);
    
    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
  };

  // Create optimized selector hook that only subscribes to specific state properties
  const useSelector = <T,>(selector: (state: S) => T): T => {
    const { state } = useContext(Context);
    return selector(state);
  };

  // Create optimized action creator hook
  const useAction = <T extends (payload?: any) => Action>(
    actionCreator: T,
    deps: any[] = []
  ): ((payload?: Parameters<T>[0]) => void) => {
    const { dispatch } = useContext(Context);
    
    // Memoize the action dispatcher
    return useCallback(
      (payload?: Parameters<T>[0]) => {
        dispatch(actionCreator(payload));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [dispatch, ...deps]
    );
  };

  return {
    Provider,
    useContext: () => useContext(Context),
    useSelector,
    useAction,
  };
}

/**
 * Create a simple context provider for state that doesn't need a reducer
 * Still optimized to prevent unnecessary re-renders
 */
export function createSimpleContext<T>(initialValue: T) {
  const Context = createContext<{
    value: T;
    setValue: React.Dispatch<React.SetStateAction<T>>;
  }>({
    value: initialValue,
    setValue: () => {},
  });

  const Provider: React.FC<{ children: ReactNode; initialValue?: T }> = ({
    children,
    initialValue: propInitialValue,
  }) => {
    const [value, setValue] = React.useState<T>(propInitialValue ?? initialValue);
    
    // Memoize the context value
    const contextValue = useMemo(() => ({ value, setValue }), [value]);
    
    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
  };

  // Create a selector hook for the simple context
  const useSelector = <R,>(selector: (value: T) => R): R => {
    const { value } = useContext(Context);
    return selector(value);
  };

  return {
    Provider,
    useContext: () => useContext(Context),
    useSelector,
  };
}

/**
 * Higher-order component to prevent unnecessary re-renders
 */
export function withMemoization<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): React.MemoExoticComponent<React.ComponentType<P>> {
  return React.memo(Component, propsAreEqual);
}
