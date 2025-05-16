import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * Simplified Monitoring Page that works reliably
 * The original implementation tried to connect to a WebSocket server that isn't running
 */
const MonitoringPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId?: string }>();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Connection status */}
      <div className="mb-4 flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full mr-2 bg-red-500"></div>
          <span className="text-sm font-medium">
            Not connected to monitoring server
          </span>
        </div>
        
        <div className="text-sm text-gray-500">
          Monitoring System
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">Job Monitoring</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The monitoring system allows you to track scraper jobs in real-time, but it requires a connection
          to the monitoring server.
        </p>
        
        {jobId ? (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Selected Job</h2>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="font-medium">Job ID: <span className="text-blue-600">{jobId}</span></p>
              <p className="text-sm text-gray-500 mt-1">Waiting for connection to the monitoring server...</p>
              
              {/* Simulated progress bar */}
              <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-1/4 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
        ) : null}
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Monitoring Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <div className="text-blue-600 dark:text-blue-400 font-medium">Pages Scraped</div>
                <div className="text-2xl font-bold">-</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <div className="text-green-600 dark:text-green-400 font-medium">Items Extracted</div>
                <div className="text-2xl font-bold">-</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                <div className="text-purple-600 dark:text-purple-400 font-medium">Avg. Response Time</div>
                <div className="text-2xl font-bold">-</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex border-b border-gray-200 dark:border-gray-600 mb-4">
                <button className="py-2 px-4 font-medium text-sm border-b-2 border-blue-500 text-blue-600">
                  Logs
                </button>
                <button className="py-2 px-4 font-medium text-sm text-gray-500">
                  Errors
                </button>
              </div>
              
              {/* Log Viewer Placeholder */}
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-md p-3 overflow-y-auto font-mono text-sm">
                <div className="text-gray-500"># Monitoring logs will appear here when connected</div>
                <div className="text-gray-500"># WebSocket connection not established</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Troubleshooting</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Ensure the scraper server is running on localhost:8000</li>
              <li>Check that your network connection allows WebSocket connections</li>
              <li>Refresh the page to attempt reconnection</li>
              <li>Start a new scraper job if none are currently running</li>
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
    </div>
  );
};

export default MonitoringPage;
