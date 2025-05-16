import React, { useState } from 'react';
import { ErrorWithSolution, useMonitoring } from '../../context/MonitoringContext';

interface ErrorDisplayProps {
  jobId?: string;
  maxHeight?: string;
  className?: string;
  showAllErrors?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  jobId,
  maxHeight = '400px',
  className = '',
  showAllErrors = false
}) => {
  const { errors, markErrorResolved } = useMonitoring();
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);

  // Filter errors by jobId if specified, and by resolved status
  const filteredErrors = errors.filter(error => {
    // Filter by job ID if specified
    if (jobId && error.jobId !== jobId) {
      return false;
    }
    
    // Filter out resolved errors unless showAllErrors is true
    if (!showAllErrors && error.resolved) {
      return false;
    }
    
    return true;
  });

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const toggleExpand = (errorId: string) => {
    if (expandedErrorId === errorId) {
      setExpandedErrorId(null);
    } else {
      setExpandedErrorId(errorId);
    }
  };

  const handleMarkResolved = (errorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markErrorResolved(errorId);
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Errors{jobId ? ` for Job ${jobId}` : ''}</h3>
        <div className="flex space-x-2">
          {showAllErrors ? (
            <span className="text-sm text-gray-500">
              Showing all errors ({filteredErrors.length})
            </span>
          ) : (
            <span className="text-sm text-gray-500">
              Showing unresolved errors ({filteredErrors.length})
            </span>
          )}
        </div>
      </div>

      <div 
        className="overflow-auto"
        style={{ maxHeight }}
      >
        {filteredErrors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No errors found</h3>
            <p className="mt-1 text-sm text-gray-500">Everything is running smoothly!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredErrors.map((error) => (
              <li 
                key={error.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${error.resolved ? 'bg-gray-50' : ''}`}
                onClick={() => toggleExpand(error.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-4 w-4 rounded-full ${error.resolved ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{error.message}</p>
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(error.timestamp)} 
                        {error.source && ` • ${error.source}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {!error.resolved && (
                      <button
                        className="mr-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                        onClick={(e) => handleMarkResolved(error.id, e)}
                      >
                        Mark Resolved
                      </button>
                    )}
                    <svg 
                      className={`h-5 w-5 text-gray-400 transform transition-transform ${expandedErrorId === error.id ? 'rotate-180' : ''}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {expandedErrorId === error.id && (
                  <div className="mt-4 border-t pt-4 pl-7">
                    {error.code && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-gray-500">Error Code:</span>
                        <code className="ml-2 text-xs bg-gray-100 px-1 py-0.5 rounded">{error.code}</code>
                      </div>
                    )}
                    
                    {error.stack && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-gray-500">Stack Trace:</span>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {error.solutions && error.solutions.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-gray-500">Suggested Solutions:</span>
                        <ul className="mt-1 ml-4 text-sm list-disc">
                          {error.solutions.map((solution, index) => (
                            <li key={index} className="text-xs mt-1">{solution}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
