import React, { useState } from 'react';
import { ClipboardIcon, ArrowPathIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export interface WebhookEvent {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  example: Record<string, any>;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  secret: string;
  events: WebhookEvent[];
  active: boolean;
  version: 'v1' | 'v2';
  headers: Record<string, string>;
  createdAt: string;
}

interface WebhookConfigurationProps {
  endpoints: WebhookEndpoint[];
  onSaveEndpoint: (endpoint: WebhookEndpoint) => Promise<void>;
  onDeleteEndpoint: (id: string) => Promise<void>;
  onTestEndpoint: (id: string) => Promise<{ success: boolean; message: string }>;
  className?: string;
}

/**
 * Component for configuring webhooks to send data to external services
 * Allows setting up endpoints, managing secrets, and configuring events
 */
const WebhookConfiguration: React.FC<WebhookConfigurationProps> = ({
  endpoints,
  onSaveEndpoint,
  onDeleteEndpoint,
  onTestEndpoint,
  className = ''
}) => {
  const [activeEndpoint, setActiveEndpoint] = useState<WebhookEndpoint | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);
  
  // Create a new endpoint template
  const createNewEndpoint = () => {
    const newEndpoint: WebhookEndpoint = {
      id: `webhook_${Date.now()}`,
      url: '',
      secret: generateSecret(),
      events: getDefaultEvents().map(event => ({ ...event, enabled: false })),
      active: false,
      version: 'v1',
      headers: {},
      createdAt: new Date().toISOString()
    };
    
    setActiveEndpoint(newEndpoint);
    setIsCreating(true);
    setIsEditing(true);
  };
  
  // Edit an existing endpoint
  const editEndpoint = (endpoint: WebhookEndpoint) => {
    setActiveEndpoint({ ...endpoint });
    setIsEditing(true);
    setIsCreating(false);
  };
  
  // Generate a secure random string for webhook secret
  const generateSecret = (): string => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };
  
  // Regenerate the secret
  const regenerateSecret = () => {
    if (activeEndpoint) {
      setActiveEndpoint({
        ...activeEndpoint,
        secret: generateSecret()
      });
    }
  };
  
  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  // Toggle event enabled state
  const toggleEvent = (eventId: string) => {
    if (activeEndpoint) {
      setActiveEndpoint({
        ...activeEndpoint,
        events: activeEndpoint.events.map(event => 
          event.id === eventId ? { ...event, enabled: !event.enabled } : event
        )
      });
    }
  };
  
  // Update webhook URL
  const updateUrl = (url: string) => {
    if (activeEndpoint) {
      setActiveEndpoint({
        ...activeEndpoint,
        url
      });
    }
  };
  
  // Toggle active state
  const toggleActive = () => {
    if (activeEndpoint) {
      setActiveEndpoint({
        ...activeEndpoint,
        active: !activeEndpoint.active
      });
    }
  };
  
  // Update webhook version
  const updateVersion = (version: 'v1' | 'v2') => {
    if (activeEndpoint) {
      setActiveEndpoint({
        ...activeEndpoint,
        version
      });
    }
  };
  
  // Save the current endpoint
  const saveEndpoint = async () => {
    if (!activeEndpoint) return;
    
    // Validate URL
    if (!activeEndpoint.url || !isValidUrl(activeEndpoint.url)) {
      alert('Please enter a valid webhook URL');
      return;
    }
    
    setIsSaving(true);
    try {
      await onSaveEndpoint(activeEndpoint);
      setIsEditing(false);
      setIsCreating(false);
      setActiveEndpoint(null);
    } catch (error) {
      console.error('Error saving webhook:', error);
      alert('Failed to save webhook endpoint');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Delete the current endpoint
  const deleteEndpoint = async () => {
    if (!activeEndpoint || isCreating) return;
    
    if (!confirm('Are you sure you want to delete this webhook endpoint?')) {
      return;
    }
    
    try {
      await onDeleteEndpoint(activeEndpoint.id);
      setIsEditing(false);
      setActiveEndpoint(null);
    } catch (error) {
      console.error('Error deleting webhook:', error);
      alert('Failed to delete webhook endpoint');
    }
  };
  
  // Test the endpoint
  const testEndpoint = async (id: string) => {
    setIsTesting(id);
    setTestResult(null);
    
    try {
      const result = await onTestEndpoint(id);
      setTestResult({ id, ...result });
    } catch (error) {
      setTestResult({
        id,
        success: false,
        message: 'Failed to test webhook: ' + (error instanceof Error ? error.message : 'Unknown error')
      });
    } finally {
      setIsTesting(null);
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setIsCreating(false);
    setActiveEndpoint(null);
  };
  
  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          Webhook Configuration
        </h3>
        <button
          type="button"
          onClick={createNewEndpoint}
          disabled={isEditing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
        >
          Add Webhook
        </button>
      </div>
      
      {isEditing ? (
        <div className="bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Webhook URL
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    id="webhook-url"
                    value={activeEndpoint?.url || ''}
                    onChange={(e) => updateUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter the URL where webhook payloads should be sent
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="webhook-secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Webhook Secret
                  </label>
                  <button
                    type="button"
                    onClick={regenerateSecret}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-600 hover:text-primary-500 focus:outline-none dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <ArrowPathIcon className="h-3 w-3 mr-1" />
                    Regenerate
                  </button>
                </div>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type={showSecret ? "text" : "password"}
                    id="webhook-secret"
                    value={activeEndpoint?.secret || ''}
                    readOnly
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:text-gray-600 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
                  >
                    {showSecret ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(activeEndpoint?.secret || '')}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-600 hover:text-primary-500 focus:outline-none dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <ClipboardIcon className="h-3 w-3 mr-1" />
                    Copy
                  </button>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    Keep this secret secure. It will be used to verify webhook payloads.
                  </span>
                </div>
              </div>
              
              <div>
                <fieldset>
                  <legend className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Webhook Version
                  </legend>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="version-v1"
                        type="radio"
                        name="webhook-version"
                        checked={activeEndpoint?.version === 'v1'}
                        onChange={() => updateVersion('v1')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                      />
                      <label htmlFor="version-v1" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        v1 (Standard payload)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="version-v2"
                        type="radio"
                        name="webhook-version"
                        checked={activeEndpoint?.version === 'v2'}
                        onChange={() => updateVersion('v2')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                      />
                      <label htmlFor="version-v2" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        v2 (Enhanced with metadata)
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
              
              <div>
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="webhook-active"
                      type="checkbox"
                      checked={activeEndpoint?.active || false}
                      onChange={toggleActive}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="webhook-active" className="font-medium text-gray-700 dark:text-gray-300">
                      Active
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Webhook will only receive events when active
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Events
                </h4>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Select the events that will trigger this webhook
                </p>
                
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {activeEndpoint?.events.map((event) => (
                    <div key={event.id} className="border rounded-md p-3 dark:border-gray-700">
                      <div className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id={`event-${event.id}`}
                            type="checkbox"
                            checked={event.enabled}
                            onChange={() => toggleEvent(event.id)}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`event-${event.id}`} className="font-medium text-gray-700 dark:text-gray-300">
                            {event.name}
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">{event.description}</p>
                          
                          <details className="mt-2">
                            <summary className="text-xs font-medium text-primary-600 cursor-pointer dark:text-primary-400">
                              View example payload
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700 overflow-x-auto dark:bg-gray-900 dark:text-gray-300">
                              {JSON.stringify(event.example, null, 2)}
                            </pre>
                          </details>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelEditing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              
              {!isCreating && (
                <button
                  type="button"
                  onClick={deleteEndpoint}
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-700 dark:text-red-400 dark:border-red-400/30 dark:hover:bg-red-900/20"
                >
                  Delete
                </button>
              )}
              
              <button
                type="button"
                onClick={saveEndpoint}
                disabled={isSaving || !activeEndpoint?.url}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isSaving ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  'Save Webhook'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {endpoints.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No webhook endpoints configured yet.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Create a webhook to automatically send data to external services.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <div
                  key={endpoint.id}
                  className="bg-white rounded-lg border shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white truncate max-w-sm">
                        {endpoint.url}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Created {new Date(endpoint.createdAt).toLocaleDateString()} · {endpoint.version.toUpperCase()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        endpoint.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {endpoint.active ? 'Active' : 'Inactive'}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => testEndpoint(endpoint.id)}
                        disabled={isTesting === endpoint.id}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        {isTesting === endpoint.id ? (
                          <>
                            <ArrowPathIcon className="animate-spin -ml-1 mr-1 h-3 w-3" />
                            Testing...
                          </>
                        ) : (
                          'Test'
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => editEndpoint(endpoint)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  
                  {testResult && testResult.id === endpoint.id && (
                    <div className={`px-4 py-3 border-t text-sm ${
                      testResult.success 
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' 
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                    }`}>
                      {testResult.message}
                    </div>
                  )}
                  
                  <div className="border-t px-4 py-3 dark:border-gray-700">
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Configured Events:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.events
                        .filter(event => event.enabled)
                        .map(event => (
                          <span 
                            key={event.id} 
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {event.name}
                          </span>
                        ))}
                      
                      {endpoint.events.filter(event => event.enabled).length === 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          No events configured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Default webhook events
export const getDefaultEvents = (): WebhookEvent[] => {
  return [
    {
      id: 'scraper.job.started',
      name: 'Scraper Job Started',
      description: 'Triggered when a scraper job begins execution',
      enabled: false,
      example: {
        event: 'scraper.job.started',
        payload: {
          job_id: '1234567890',
          scraper_id: 'amazon_product_scraper',
          timestamp: '2023-06-15T10:30:00Z',
          params: {
            url: 'https://example.com/products',
            max_pages: 5
          }
        }
      }
    },
    {
      id: 'scraper.job.completed',
      name: 'Scraper Job Completed',
      description: 'Triggered when a scraper job completes successfully',
      enabled: false,
      example: {
        event: 'scraper.job.completed',
        payload: {
          job_id: '1234567890',
          scraper_id: 'amazon_product_scraper',
          timestamp: '2023-06-15T11:30:00Z',
          duration_seconds: 3600,
          results_count: 150,
          storage_location: 'jobs/1234567890/results.json'
        }
      }
    },
    {
      id: 'scraper.job.failed',
      name: 'Scraper Job Failed',
      description: 'Triggered when a scraper job fails to complete',
      enabled: false,
      example: {
        event: 'scraper.job.failed',
        payload: {
          job_id: '1234567890',
          scraper_id: 'amazon_product_scraper',
          timestamp: '2023-06-15T11:15:00Z',
          error: 'Rate limit exceeded',
          error_details: {
            status_code: 429,
            message: 'Too many requests',
            url: 'https://example.com/products/page/3'
          }
        }
      }
    },
    {
      id: 'data.export.completed',
      name: 'Data Export Completed',
      description: 'Triggered when a data export operation completes',
      enabled: false,
      example: {
        event: 'data.export.completed',
        payload: {
          export_id: '9876543210',
          timestamp: '2023-06-16T14:20:00Z',
          format: 'csv',
          rows_exported: 500,
          filename: 'product_data_2023-06-16.csv',
          download_url: 'https://app.example.com/exports/9876543210/download'
        }
      }
    },
    {
      id: 'data.export.failed',
      name: 'Data Export Failed',
      description: 'Triggered when a data export operation fails',
      enabled: false,
      example: {
        event: 'data.export.failed',
        payload: {
          export_id: '9876543210',
          timestamp: '2023-06-16T14:15:00Z',
          format: 'csv',
          error: 'Insufficient disk space',
          error_details: {
            required_bytes: 15000000,
            available_bytes: 10000000
          }
        }
      }
    },
    {
      id: 'scheduled.export.triggered',
      name: 'Scheduled Export Triggered',
      description: 'Triggered when a scheduled export begins',
      enabled: false,
      example: {
        event: 'scheduled.export.triggered',
        payload: {
          schedule_id: 'weekly_product_export',
          export_id: '9876543210',
          timestamp: '2023-06-16T08:00:00Z',
          schedule: {
            frequency: 'weekly',
            day: 'monday',
            time: '08:00'
          }
        }
      }
    },
    {
      id: 'data.threshold.reached',
      name: 'Data Threshold Reached',
      description: 'Triggered when data collection reaches a defined threshold',
      enabled: false,
      example: {
        event: 'data.threshold.reached',
        payload: {
          threshold_id: 'product_count_1000',
          timestamp: '2023-06-17T16:45:00Z',
          metric: 'record_count',
          value: 1000,
          threshold: 1000,
          dataset_id: 'amazon_products'
        }
      }
    }
  ];
};

export default WebhookConfiguration;
