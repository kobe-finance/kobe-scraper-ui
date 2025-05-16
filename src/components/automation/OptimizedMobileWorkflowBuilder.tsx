import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Workflow Builder component with fallback UI
 */
const OptimizedMobileWorkflowBuilder: React.FC = () => {
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
          Workflow Builder
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">Workflow Builder</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The workflow builder allows you to create and manage data processing workflows through a visual interface.
        </p>
        
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Visual Workflow Editor</h2>
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
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
              />
            </svg>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Workflow editor requires backend connection
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Key Features</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Visual drag-and-drop workflow creation</li>
              <li>Data extraction and transformation nodes</li>
              <li>Conditional logic and branching</li>
              <li>API integrations and connectors</li>
              <li>Workflow testing and debugging</li>
            </ul>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Workflow Examples</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Website data extraction</li>
              <li>Data cleaning and normalization</li>
              <li>Automated reporting</li>
              <li>Alert monitoring and notifications</li>
              <li>Data synchronization between systems</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
          <h2 className="text-lg font-medium mb-2">Troubleshooting</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
            <li>Ensure the backend server is running</li>
            <li>Check that your network connection is stable</li>
            <li>Verify API credentials are configured correctly</li>
            <li>Refresh the page to attempt reconnection</li>
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

export default OptimizedMobileWorkflowBuilder;
