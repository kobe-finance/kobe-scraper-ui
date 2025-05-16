/**
 * Application Bootstrap Module
 * 
 * This module provides a safe way to initialize the application
 * with fallback rendering in case of initialization errors.
 */

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';

// Import the main App component that we'll try to render
import App from './App';

// Environment variables for debugging
const DEBUG = import.meta.env.VITE_DEBUG === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const USE_NEW_API_LAYER = import.meta.env.VITE_USE_NEW_API_LAYER === 'true';

/**
 * Safety wrapper component that catches errors during rendering
 */
const SafetyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Global error handler for uncaught exceptions
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      setHasError(true);
      setError(event.error);
      event.preventDefault();
    };

    // Add global error handler
    window.addEventListener('error', handleGlobalError);
    
    // Cleanup
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  if (hasError) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Application Error</h3>
              <div className="mt-2 text-red-700">
                <p>The application has encountered an error and cannot be rendered.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Error Details</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Error Message</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{error?.message || 'Unknown error'}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Stack Trace</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-60">{error?.stack || 'No stack trace available'}</pre>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Environment Information</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Debug Mode</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{DEBUG ? 'Enabled' : 'Disabled'}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">API Base URL</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{API_BASE_URL || 'Not configured'}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Mock Data</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{USE_MOCK_DATA ? 'Enabled' : 'Disabled'}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">New API Layer</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{USE_NEW_API_LAYER ? 'Enabled' : 'Disabled'}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-6">
          <a 
            href="/minimal.html" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Launch Minimal React Test
          </a>
        </div>
      </div>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

/**
 * Bootstrap the application with error handling
 */
export function bootstrapApplication(rootElementId: string) {
  const rootElement = document.getElementById(rootElementId);
  
  if (!rootElement) {
    console.error(`Root element with ID "${rootElementId}" not found.`);
    return;
  }
  
  try {
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <SafetyWrapper>
          <App />
        </SafetyWrapper>
      </React.StrictMode>
    );
    
    // Report successful initialization
    if (DEBUG) {
      console.log('Application initialized successfully with the following configuration:', {
        DEBUG,
        API_BASE_URL,
        USE_MOCK_DATA,
        USE_NEW_API_LAYER
      });
    }
  } catch (error) {
    console.error('Failed to bootstrap application:', error);
    
    // Render fallback UI for catastrophic initialization errors
    try {
      const root = createRoot(rootElement);
      root.render(
        <div className="p-8 text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">Critical Application Error</h1>
          <p className="mb-4">The application could not be initialized due to a critical error.</p>
          <div className="bg-gray-100 p-4 rounded text-left mb-6">
            <pre className="text-sm overflow-auto">{String(error)}</pre>
          </div>
          <a 
            href="/minimal.html" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Launch Minimal React Test
          </a>
        </div>
      );
    } catch (fallbackError) {
      console.error('Failed to render fallback UI:', fallbackError);
      rootElement.innerHTML = `
        <div style="padding: 20px; color: #e53e3e; text-align: center;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">Fatal Application Error</h1>
          <p style="margin-bottom: 16px;">The application encountered a fatal error and could not recover.</p>
          <div style="background-color: #f7fafc; padding: 16px; border-radius: 4px; text-align: left; margin-bottom: 24px;">
            <pre style="overflow: auto;">${String(error)}</pre>
          </div>
          <a 
            href="/minimal.html" 
            style="display: inline-block; background-color: #4f46e5; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none;"
          >
            Launch Minimal React Test
          </a>
        </div>
      `;
    }
  }
}
