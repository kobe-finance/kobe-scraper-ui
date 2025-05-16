import React, { useState } from 'react';
import { XMarkIcon, ArrowPathIcon, CheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Integration } from './IntegrationCard';

export interface ConnectionField {
  id: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required: boolean;
  options?: Array<{ value: string; label: string }>;
  helpText?: string;
  validation?: RegExp;
  value: string | boolean;
}

export interface ConnectionConfig {
  integrationId: string;
  name: string;
  fields: ConnectionField[];
  isActive: boolean;
}

interface ConnectionConfigurationFormProps {
  integration: Integration;
  existingConfig?: ConnectionConfig;
  onSave: (config: ConnectionConfig) => Promise<void>;
  onCancel: () => void;
  onTest?: (config: ConnectionConfig) => Promise<{ success: boolean; message: string }>;
  className?: string;
}

/**
 * Form component for configuring connection details for integrations
 * Handles different authentication types and field validations
 */
const ConnectionConfigurationForm: React.FC<ConnectionConfigurationFormProps> = ({
  integration,
  existingConfig,
  onSave,
  onCancel,
  onTest,
  className = ''
}) => {
  // Initialize form state with existing config or defaults
  const [formState, setFormState] = useState<ConnectionConfig>(() => {
    if (existingConfig) {
      return { ...existingConfig };
    }
    
    // Create default config based on integration type
    const defaultFields = getDefaultFields(integration);
    return {
      integrationId: integration.id,
      name: `${integration.name} Connection`,
      fields: defaultFields,
      isActive: false
    };
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Handle field changes
  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    setFormState(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      )
    }));
    
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
    
    // Clear test result when form changes
    if (testResult) {
      setTestResult(null);
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    formState.fields.forEach(field => {
      // Check required fields
      if (field.required) {
        if (typeof field.value === 'string' && !field.value.trim()) {
          newErrors[field.id] = 'This field is required';
        }
      }
      
      // Check pattern validation
      if (field.validation && typeof field.value === 'string' && field.value) {
        if (!field.validation.test(field.value)) {
          newErrors[field.id] = 'Invalid format';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(formState);
    } catch (error) {
      console.error('Error saving connection:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle test connection
  const handleTestConnection = async () => {
    if (!onTest || !validateForm()) {
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await onTest(formState);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection test failed with an unexpected error'
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 ${className}`}>
      <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          Configure {integration.name} Connection
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Connection Name */}
        <div>
          <label htmlFor="connection-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Connection Name
          </label>
          <input
            type="text"
            id="connection-name"
            value={formState.name}
            onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        
        {/* Dynamic Fields */}
        {formState.fields.map((field) => (
          <div key={field.id}>
            <label 
              htmlFor={field.id} 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'select' && field.options && (
              <select
                id={field.id}
                value={field.value as string}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors[field.id] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                required={field.required}
              >
                <option value="">Select an option</option>
                {field.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {field.type === 'textarea' && (
              <textarea
                id={field.id}
                value={field.value as string}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors[field.id] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                rows={4}
                required={field.required}
              />
            )}
            
            {field.type === 'checkbox' && (
              <div className="mt-1 flex items-center">
                <input
                  id={field.id}
                  type="checkbox"
                  checked={field.value as boolean}
                  onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                />
                <label htmlFor={field.id} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {field.label}
                </label>
              </div>
            )}
            
            {(field.type === 'text' || field.type === 'password') && (
              <div className="mt-1 relative">
                <input
                  type={field.type}
                  id={field.id}
                  value={field.value as string}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`block w-full rounded-md border shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors[field.id] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  required={field.required}
                />
                {errors[field.id] && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
            )}
            
            {errors[field.id] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[field.id]}</p>
            )}
            
            {field.helpText && !errors[field.id] && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{field.helpText}</p>
            )}
          </div>
        ))}
        
        {/* Active Toggle */}
        <div className="flex items-center">
          <input
            id="is-active"
            type="checkbox"
            checked={formState.isActive}
            onChange={(e) => setFormState(prev => ({ ...prev, isActive: e.target.checked }))}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
          />
          <label htmlFor="is-active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Enable this connection
          </label>
        </div>
        
        {/* Test Results */}
        {testResult && (
          <div className={`p-3 rounded-md ${
            testResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {testResult.success ? (
                  <CheckIcon className="h-5 w-5 text-green-400 dark:text-green-500" aria-hidden="true" />
                ) : (
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 dark:text-red-500" aria-hidden="true" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm ${
                  testResult.success ? 'text-green-700 dark:text-green-200' : 'text-red-700 dark:text-red-200'
                }`}>
                  {testResult.message}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          
          {onTest && (
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              {isTesting ? (
                <>
                  <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
          >
            {isSaving ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              'Save Connection'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper function to get default fields based on integration type
const getDefaultFields = (integration: Integration): ConnectionField[] => {
  switch (integration.authType) {
    case 'oauth':
      return [
        {
          id: 'client_id',
          label: 'Client ID',
          type: 'text',
          placeholder: 'Enter your OAuth client ID',
          required: true,
          helpText: 'The client ID provided by the service',
          value: ''
        },
        {
          id: 'client_secret',
          label: 'Client Secret',
          type: 'password',
          placeholder: 'Enter your OAuth client secret',
          required: true,
          helpText: 'The client secret provided by the service',
          value: ''
        },
        {
          id: 'redirect_uri',
          label: 'Redirect URI',
          type: 'text',
          placeholder: 'https://your-app.com/oauth/callback',
          required: true,
          helpText: 'The callback URL registered with the service',
          value: window.location.origin + '/oauth/callback'
        },
        {
          id: 'scopes',
          label: 'Permission Scopes',
          type: 'text',
          placeholder: 'e.g., read write',
          required: false,
          helpText: 'Space-separated list of permission scopes',
          value: ''
        }
      ];
    
    case 'api_key':
      return [
        {
          id: 'api_key',
          label: 'API Key',
          type: 'password',
          placeholder: 'Enter your API key',
          required: true,
          helpText: 'The API key provided by the service',
          value: ''
        },
        {
          id: 'api_url',
          label: 'API URL',
          type: 'text',
          placeholder: 'https://api.example.com/v1',
          required: false,
          helpText: 'The base URL for API requests (if different from default)',
          value: ''
        }
      ];
    
    case 'basic':
      return [
        {
          id: 'username',
          label: 'Username',
          type: 'text',
          placeholder: 'Enter your username',
          required: true,
          value: ''
        },
        {
          id: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
          required: true,
          value: ''
        },
        {
          id: 'host',
          label: 'Host',
          type: 'text',
          placeholder: 'e.g., db.example.com',
          required: true,
          value: ''
        },
        {
          id: 'port',
          label: 'Port',
          type: 'text',
          placeholder: 'e.g., 27017',
          required: true,
          validation: /^\d+$/,
          value: ''
        }
      ];
    
    case 'webhook':
      return [
        {
          id: 'webhook_url',
          label: 'Webhook URL',
          type: 'text',
          placeholder: 'https://your-service.com/webhook',
          required: true,
          helpText: 'The URL where data will be sent',
          value: ''
        },
        {
          id: 'secret_key',
          label: 'Secret Key',
          type: 'password',
          placeholder: 'Enter a secret key for webhook validation',
          required: false,
          helpText: 'Used to sign payload for verification',
          value: ''
        },
        {
          id: 'content_type',
          label: 'Content Type',
          type: 'select',
          required: true,
          options: [
            { value: 'application/json', label: 'JSON' },
            { value: 'application/x-www-form-urlencoded', label: 'Form URL Encoded' },
            { value: 'text/plain', label: 'Plain Text' }
          ],
          value: 'application/json'
        },
        {
          id: 'custom_headers',
          label: 'Custom Headers',
          type: 'textarea',
          placeholder: 'One header per line: Header-Name: value',
          required: false,
          helpText: 'Additional HTTP headers to send with the webhook',
          value: ''
        }
      ];
    
    case 'custom':
    default:
      return [
        {
          id: 'integration_details',
          label: 'Integration Details',
          type: 'textarea',
          placeholder: 'Enter the details required for this integration',
          required: true,
          helpText: 'Provide all necessary information in JSON format',
          value: '{}'
        }
      ];
  }
};

export default ConnectionConfigurationForm;
