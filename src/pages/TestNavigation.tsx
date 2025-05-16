import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Simple navigation test page
 * This component provides direct links to test navigation without redirection issues
 */
const TestNavigation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Navigation Test Page
        </h1>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link 
            to="/" 
            className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-md text-center"
          >
            Dashboard (Home)
          </Link>
          
          <Link 
            to="/scheduler" 
            className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-md text-center"
          >
            Scheduler
          </Link>
          
          <Link 
            to="/workflow" 
            className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-md text-center"
          >
            Workflow Builder
          </Link>
          
          <Link 
            to="/docs" 
            className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-md text-center"
          >
            Documentation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestNavigation;
