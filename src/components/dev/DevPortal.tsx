import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Development Portal for quick navigation testing
 * This component provides direct links to all main routes for testing navigation
 */
const DevPortal: React.FC = () => {
  const routes = [
    { name: 'Dashboard', path: '/', description: 'Main dashboard view' },
    { name: 'Scheduler', path: '/scheduler', description: 'Job scheduling interface' },
    { name: 'Workflow Builder', path: '/workflow', description: 'Visual workflow creation' },
    { name: 'Documentation', path: '/docs', description: 'App documentation' },
    { name: 'Landing Page', path: '/landing', description: 'Marketing landing page' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            <span className="text-primary-600 dark:text-primary-500">Kobe Scraper UI</span> - Dev Portal
          </h1>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
            Quick navigation to application routes for development
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Application Routes
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-5 shadow-sm hover:border-primary-400 dark:hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <div className="min-w-0 flex-1">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-xl font-medium text-gray-900 dark:text-white">
                      {route.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {route.description}
                    </p>
                    <p className="mt-1 text-xs text-primary-600 dark:text-primary-400">
                      {route.path}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-gray-400 dark:text-gray-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg mt-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Application Status
            </h2>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Environment</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">Development</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Authentication</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Bypassed for Development
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevPortal;
