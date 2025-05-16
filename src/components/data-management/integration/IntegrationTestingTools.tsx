import React, { useState } from 'react';
import { 
  ArrowPathIcon,
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ClockIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { Integration } from './IntegrationCard';

export interface TestResult {
  id: string;
  integrationId: string;
  timestamp: string;
  success: boolean;
  duration: number; // in milliseconds
  message: string;
  responseData?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export interface TestConfig {
  operation: 'read' | 'write' | 'auth' | 'connection';
  sampleData?: Record<string, any>;
  timeout?: number; // in milliseconds
  options?: Record<string, any>;
}

interface IntegrationTestingToolsProps {
  integration: Integration;
  onRunTest: (integration: Integration, config: TestConfig) => Promise<TestResult>;
  previousResults?: TestResult[];
  className?: string;
}

/**
 * Component for testing and verifying integrations
 * Provides tools for connection tests, data validation, and error analysis
 */
const IntegrationTestingTools: React.FC<IntegrationTestingToolsProps> = ({
  integration,
  onRunTest,
  previousResults = [],
  className = ''
}) => {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testConfig, setTestConfig] = useState<TestConfig>({
    operation: 'connection',
    timeout: 10000
  });
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [sampleDataInput, setSampleDataInput] = useState(
    JSON.stringify(getDefaultSampleData(integration), null, 2)
  );
  
  // Get operation options based on integration type
  const getOperationOptions = (): { value: TestConfig['operation']; label: string }[] => {
    const commonOptions = [
      { value: 'connection', label: 'Connection Test' },
      { value: 'auth', label: 'Authentication Test' }
    ];
    
    // Add read/write options based on integration category
    switch (integration.category) {
      case 'cloud_storage':
      case 'database':
        return [
          ...commonOptions,
          { value: 'read', label: 'Read Test' },
          { value: 'write', label: 'Write Test' }
        ];
      case 'notification':
        return [
          ...commonOptions,
          { value: 'write', label: 'Send Test' }
        ];
      case 'analytics':
        return [
          ...commonOptions,
          { value: 'read', label: 'Data Retrieval Test' },
          { value: 'write', label: 'Data Push Test' }
        ];
      default:
        return commonOptions;
    }
  };
  
  // Handle running the test
  const runTest = async () => {
    setIsRunningTest(true);
    setTestResult(null);
    
    try {
      // Parse sample data if needed
      let config = { ...testConfig };
      
      if (config.operation === 'write' || config.operation === 'read') {
        try {
          config.sampleData = JSON.parse(sampleDataInput);
        } catch (error) {
          setTestResult({
            id: `test_${Date.now()}`,
            integrationId: integration.id,
            timestamp: new Date().toISOString(),
            success: false,
            duration: 0,
            message: 'Invalid JSON in sample data',
            error: {
              code: 'INVALID_JSON',
              message: error instanceof Error ? error.message : 'Failed to parse JSON'
            }
          });
          setIsRunningTest(false);
          return;
        }
      }
      
      const result = await onRunTest(integration, config);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        id: `test_${Date.now()}`,
        integrationId: integration.id,
        timestamp: new Date().toISOString(),
        success: false,
        duration: 0,
        message: 'Test failed with an exception',
        error: {
          code: 'TEST_EXCEPTION',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      });
    } finally {
      setIsRunningTest(false);
    }
  };
  
  // Format duration in ms to human-readable format
  const formatDuration = (ms: number): string => {
    if (ms < 1000) {
      return `${ms}ms`;
    } else {
      return `${(ms / 1000).toFixed(2)}s`;
    }
  };
  
  // Handle operation change
  const handleOperationChange = (operation: TestConfig['operation']) => {
    setTestConfig({
      ...testConfig,
      operation
    });
    
    // Reset sample data based on operation
    if (operation === 'write' || operation === 'read') {
      setSampleDataInput(JSON.stringify(getDefaultSampleData(integration), null, 2));
    }
  };
  
  // Get integration-specific test description
  const getTestDescription = (): string => {
    switch (testConfig.operation) {
      case 'connection':
        return `Verifies basic connectivity to ${integration.name} servers.`;
      case 'auth':
        return `Validates authentication credentials for ${integration.name}.`;
      case 'read':
        return `Tests ability to read data from ${integration.name}.`;
      case 'write':
        return `Tests ability to write data to ${integration.name}.`;
      default:
        return `Tests ${integration.name} integration.`;
    }
  };
  
  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          Test {integration.name} Integration
        </h3>
        
        <div className="mt-3 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          <p>{getTestDescription()}</p>
        </div>
        
        <div className="mt-5 space-y-6">
          {/* Test Operation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Test Operation
            </label>
            <div className="mt-2 space-y-2">
              {getOperationOptions().map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`operation-${option.value}`}
                    type="radio"
                    name="test-operation"
                    checked={testConfig.operation === option.value}
                    onChange={() => handleOperationChange(option.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                  />
                  <label htmlFor={`operation-${option.value}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sample Data (for read/write operations) */}
          {(testConfig.operation === 'read' || testConfig.operation === 'write') && (
            <div>
              <label htmlFor="sample-data" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sample Data
              </label>
              <div className="mt-1">
                <textarea
                  id="sample-data"
                  rows={6}
                  value={sampleDataInput}
                  onChange={(e) => setSampleDataInput(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                JSON data to use in your test operation
              </p>
            </div>
          )}
          
          {/* Advanced Options */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
            </button>
            
            {showAdvancedOptions && (
              <div className="mt-3 space-y-4">
                <div>
                  <label htmlFor="test-timeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Test Timeout (ms)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="test-timeout"
                      min="1000"
                      max="60000"
                      step="1000"
                      value={testConfig.timeout}
                      onChange={(e) => setTestConfig({
                        ...testConfig,
                        timeout: Number(e.target.value)
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Maximum time in milliseconds to wait for test completion
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Test Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={runTest}
              disabled={isRunningTest}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              {isRunningTest ? (
                <>
                  <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Running Test...
                </>
              ) : (
                'Run Test'
              )}
            </button>
          </div>
        </div>
        
        {/* Test Result */}
        {testResult && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Test Result
            </h4>
            
            <div className={`rounded-md p-4 ${
              testResult.success
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {testResult.success ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-400 dark:text-green-500" />
                  ) : (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400 dark:text-red-500" />
                  )}
                </div>
                
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    testResult.success
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {testResult.success ? 'Test Passed' : 'Test Failed'}
                  </h3>
                  
                  <div className="mt-2 text-sm">
                    <p className={testResult.success 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-red-700 dark:text-red-300'
                    }>
                      {testResult.message}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex space-x-3 text-xs">
                      <div className="text-gray-500 dark:text-gray-400 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatDuration(testResult.duration)}
                      </div>
                      
                      <div className="text-gray-500 dark:text-gray-400">
                        {new Date(testResult.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {testResult.error && (
                    <div className="mt-2">
                      <details className="text-xs">
                        <summary className="text-red-700 dark:text-red-300 cursor-pointer">
                          Error Details
                        </summary>
                        <div className="mt-2 p-2 bg-red-100 rounded-md dark:bg-red-900/30">
                          <p><strong>Code:</strong> {testResult.error.code}</p>
                          <p><strong>Message:</strong> {testResult.error.message}</p>
                          
                          {testResult.error.details && (
                            <div className="mt-1">
                              <p><strong>Details:</strong></p>
                              <pre className="text-xs overflow-x-auto mt-1">
                                {JSON.stringify(testResult.error.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </details>
                    </div>
                  )}
                  
                  {testResult.responseData && (
                    <div className="mt-2">
                      <details className="text-xs">
                        <summary className="text-gray-700 dark:text-gray-300 cursor-pointer flex items-center">
                          <CodeBracketIcon className="h-4 w-4 mr-1" />
                          Response Data
                        </summary>
                        <div className="mt-2 p-2 bg-gray-100 rounded-md dark:bg-gray-700">
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(testResult.responseData, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Previous Test Results */}
        {previousResults.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Previous Tests
            </h4>
            
            <div className="border rounded-md overflow-hidden dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Time
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Operation
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Result
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {previousResults.map((result) => (
                    <tr key={result.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {new Date(result.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {result.id.split('_')[0]}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          result.success
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {result.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {formatDuration(result.duration)}
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
  );
};

// Get default sample data based on integration type
const getDefaultSampleData = (integration: Integration): Record<string, any> => {
  switch (integration.category) {
    case 'cloud_storage':
      return {
        filename: 'test_data.json',
        content: {
          sample: 'test data',
          timestamp: new Date().toISOString(),
          metadata: {
            source: 'integration test',
            version: '1.0'
          }
        },
        options: {
          overwrite: true,
          public: false,
          folder: 'integration_tests'
        }
      };
    
    case 'database':
      return {
        collection: 'test_collection',
        document: {
          id: `test_${Date.now()}`,
          name: 'Test Document',
          created_at: new Date().toISOString(),
          properties: {
            test: true,
            source: 'integration test'
          }
        },
        options: {
          upsert: true
        }
      };
    
    case 'notification':
      return {
        recipient: '#testing-channel',
        message: 'This is a test notification from the integration test tool',
        attachments: [
          {
            title: 'Test Attachment',
            text: 'This is a sample attachment for testing purposes',
            color: '#36a64f'
          }
        ]
      };
    
    case 'analytics':
      return {
        event: 'test_event',
        properties: {
          category: 'integration',
          action: 'test',
          label: 'automated test',
          value: 1
        },
        user: {
          id: 'test_user'
        },
        timestamp: new Date().toISOString()
      };
    
    default:
      return {
        test: true,
        timestamp: new Date().toISOString(),
        data: 'Sample test data'
      };
  }
};

export default IntegrationTestingTools;
