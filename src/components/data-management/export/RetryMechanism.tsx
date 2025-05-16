import React from 'react';
import {
  ArrowPathIcon,
  ClockIcon,
  XCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number; // in milliseconds
  backoffFactor: number;
  maxDelay: number; // in milliseconds
}

export interface RetryAttempt {
  attemptNumber: number;
  timestamp: string;
  error: string;
  delay: number; // in milliseconds
}

export interface RetryStatus {
  exportId: string;
  exportName: string;
  status: 'pending' | 'retrying' | 'succeeded' | 'failed';
  currentAttempt: number;
  maxAttempts: number;
  nextRetryTime?: string;
  attempts: RetryAttempt[];
}

interface RetryMechanismProps {
  retryStatus: RetryStatus[];
  retryConfig: RetryConfig;
  onConfigChange: (config: RetryConfig) => void;
  onManualRetry: (exportId: string) => void;
  onCancel: (exportId: string) => void;
  className?: string;
}

/**
 * Component for handling and configuring retry logic for failed exports
 * Shows retry status and allows manual retry or configuration
 */
const RetryMechanism: React.FC<RetryMechanismProps> = ({
  retryStatus,
  retryConfig,
  onConfigChange,
  onManualRetry,
  onCancel,
  className = ''
}) => {
  // Format milliseconds to human-readable time
  const formatDelay = (ms: number): string => {
    if (ms < 1000) {
      return `${ms}ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(1)}s`;
    } else {
      return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
    }
  };

  // Get status icon based on retry status
  const getStatusIcon = (status: RetryStatus['status']) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'retrying':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  // Handle config changes
  const handleConfigChange = (key: keyof RetryConfig, value: number) => {
    onConfigChange({
      ...retryConfig,
      [key]: value
    });
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          Retry Mechanism
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Automatic retries for failed exports
        </span>
      </div>
      
      {/* Configuration */}
      <div className="bg-white rounded-lg border p-4 mb-6 dark:bg-gray-800 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Retry Configuration
        </h4>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Maximum Attempts
            </label>
            <div className="flex rounded-md shadow-sm">
              <input
                type="number"
                min="1"
                max="10"
                value={retryConfig.maxAttempts}
                onChange={(e) => handleConfigChange('maxAttempts', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Number of retry attempts before giving up
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Initial Delay (ms)
            </label>
            <div className="flex rounded-md shadow-sm">
              <input
                type="number"
                min="100"
                step="100"
                value={retryConfig.initialDelay}
                onChange={(e) => handleConfigChange('initialDelay', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Delay before first retry attempt
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Backoff Factor
            </label>
            <div className="flex rounded-md shadow-sm">
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={retryConfig.backoffFactor}
                onChange={(e) => handleConfigChange('backoffFactor', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Multiplier for delay between retries
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Maximum Delay (ms)
            </label>
            <div className="flex rounded-md shadow-sm">
              <input
                type="number"
                min="1000"
                step="1000"
                value={retryConfig.maxDelay}
                onChange={(e) => handleConfigChange('maxDelay', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Maximum delay between retries
            </p>
          </div>
        </div>
      </div>
      
      {/* Retry Status */}
      {retryStatus.length === 0 ? (
        <div className="text-center py-6 bg-white rounded-lg border dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No retry operations in progress.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {retryStatus.map((status) => (
            <div 
              key={status.exportId} 
              className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center">
                  {getStatusIcon(status.status)}
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {status.exportName}
                  </span>
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                    Attempt {status.currentAttempt} of {status.maxAttempts}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  {(status.status === 'failed' || status.status === 'pending') && (
                    <button
                      type="button"
                      onClick={() => onManualRetry(status.exportId)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
                    >
                      <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />
                      Retry Now
                    </button>
                  )}
                  
                  {status.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => onCancel(status.exportId)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              
              <div className="px-4 py-3">
                {status.status === 'pending' && status.nextRetryTime && (
                  <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                    Next retry at: {new Date(status.nextRetryTime).toLocaleTimeString()}
                  </div>
                )}
                
                {status.attempts.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Retry History
                    </h5>
                    <div className="max-h-32 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                        <thead>
                          <tr>
                            <th className="py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                              #
                            </th>
                            <th className="py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                              Time
                            </th>
                            <th className="py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                              Delay
                            </th>
                            <th className="py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                              Error
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {status.attempts.map((attempt) => (
                            <tr key={attempt.attemptNumber}>
                              <td className="py-1 whitespace-nowrap text-gray-700 dark:text-gray-300">
                                {attempt.attemptNumber}
                              </td>
                              <td className="py-1 whitespace-nowrap text-gray-700 dark:text-gray-300">
                                {new Date(attempt.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="py-1 whitespace-nowrap text-gray-700 dark:text-gray-300">
                                {formatDelay(attempt.delay)}
                              </td>
                              <td className="py-1 text-gray-700 dark:text-gray-300">
                                <span className="truncate inline-block max-w-xs" title={attempt.error}>
                                  {attempt.error}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RetryMechanism;
