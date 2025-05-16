import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Define user interface based on your API response structure
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// Auth state interface
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth context interface with auth state and methods
interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Auth storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

// Provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initial auth state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // DEVELOPMENT MODE: Auto-login bypass
        if (process.env.NODE_ENV === 'development') {
          console.log('DEVELOPMENT MODE: Auto-authenticating...');
          
          // Create mock user data for development
          const devUser: User = {
            id: 'dev-user-123',
            email: 'dev@example.com',
            name: 'Development User',
            role: 'admin'
          };
          
          // Create mock tokens
          const devAccessToken = 'dev-access-token-123';
          const devRefreshToken = 'dev-refresh-token-123';
          
          // Store in localStorage
          localStorage.setItem(AUTH_TOKEN_KEY, devAccessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, devRefreshToken);
          localStorage.setItem(USER_KEY, JSON.stringify(devUser));
          
          // Update auth state
          setAuthState({
            user: devUser,
            accessToken: devAccessToken,
            refreshToken: devRefreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Skip normal authentication in dev mode
          return;
        }
        
        // PRODUCTION MODE: Normal authentication
        // Get stored tokens and user data
        const storedAccessToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedAccessToken && storedRefreshToken && storedUser) {
          // Parse user data
          const user = JSON.parse(storedUser);
          
          // Update auth state
          setAuthState({
            user,
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // No stored auth data
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Reset auth state on error
        setAuthState({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Login method
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Send login request to API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Extract tokens and user data
      const { access_token, refresh_token, user } = data;
      
      // Store in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      // Update auth state
      setAuthState({
        user,
        accessToken: access_token,
        refreshToken: refresh_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Register method
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Send register request to API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      
      // Extract tokens and user data
      const { access_token, refresh_token, user } = data;
      
      // Store in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      // Update auth state
      setAuthState({
        user,
        accessToken: access_token,
        refreshToken: refresh_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Registration error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Refresh auth method
  const refreshAuth = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        return false;
      }
      
      // Send refresh token request to API
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Extract new access token
      const { access_token } = data;
      
      // Update in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, access_token);
      
      // Update auth state
      setAuthState(prev => ({
        ...prev,
        accessToken: access_token,
      }));
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  // Logout method
  const logout = (): void => {
    // Clear localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Reset auth state
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Combine state and methods for context value
  const contextValue: AuthContextProps = {
    ...authState,
    login,
    logout,
    register,
    refreshAuth,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
