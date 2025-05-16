import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Scheduler Interface component with fallback UI
 */
const OptimizedMobileSchedulerInterface: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Connection status */}
      <div className="mb-4 flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full mr-2 bg-red-500"></div>
          <span className="text-sm font-medium">
            Backend connection limited
          </span>
        </div>
        
        <div className="text-sm text-gray-500">
          Job Scheduler
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">Job Scheduler</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The scheduler allows you to create, schedule, and manage automated jobs with flexible timing options.
        </p>
        
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Calendar View</h2>
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center">
            <svg
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Calendar requires backend connection
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Schedule Types</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>One-time scheduled jobs</li>
              <li>Recurring daily/weekly/monthly jobs</li>
              <li>Cron expression scheduling</li>
              <li>Event-based triggers</li>
              <li>Dependency-based scheduling</li>
            </ul>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Job Management</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Pause and resume schedules</li>
              <li>Job dependencies configuration</li>
              <li>Notification settings</li>
              <li>Conflict detection and resolution</li>
              <li>Resource allocation management</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
          <h2 className="text-lg font-medium mb-2">Troubleshooting</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
            <li>Ensure the backend server is running</li>
            <li>Check that your network connection is stable</li>
            <li>Verify database connectivity for job storage</li>
            <li>Refresh the page to attempt reconnection</li>
            <li>Check server logs for scheduling errors</li>
          </ul>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/app/jobs')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go to Jobs
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizedMobileSchedulerInterface;
