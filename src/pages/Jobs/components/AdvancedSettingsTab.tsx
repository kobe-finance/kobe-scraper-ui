import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { JobFormValues } from './types';

export const AdvancedSettingsTab: React.FC = () => {
  const { register, formState: { errors }, watch } = useFormContext<JobFormValues>();
  
  // Local state for managing collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    proxy: false,
    headers: false,
    retry: false,
    export: false
  });
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="space-y-6">
      {/* Proxy Configuration Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
        <button
          type="button"
          className="w-full px-4 py-3 text-left flex justify-between items-center bg-gray-50 dark:bg-gray-800"
          onClick={() => toggleSection('proxy')}
        >
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Proxy Configuration</h3>
          <svg 
            className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.proxy ? 'transform rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {expandedSections.proxy && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="space-y-2">
              <label htmlFor="proxyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Proxy Type
              </label>
              <select
                id="proxyType"
                {...register('proxyType')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="none">No Proxy</option>
                <option value="http">HTTP Proxy</option>
                <option value="socks">SOCKS Proxy</option>
                <option value="rotating">Rotating Proxy</option>
              </select>
            </div>
            
            {watch('proxyType') !== 'none' && (
              <>
                {watch('proxyType') === 'rotating' ? (
                  <div className="space-y-2">
                    <label htmlFor="proxyUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Proxy API URL
                    </label>
                    <Input
                      id="proxyUrl"
                      {...register('proxyUrl')}
                      placeholder="https://proxy-provider.com/api/rotating"
                      className="w-full"
                    />
                    {errors.proxyUrl && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.proxyUrl.message}</p>
                    )}
                    
                    <div className="space-y-2 mt-2">
                      <label htmlFor="proxyApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        API Key
                      </label>
                      <Input
                        id="proxyApiKey"
                        type="password"
                        {...register('proxyApiKey')}
                        placeholder="Your API key for the proxy service"
                        className="w-full"
                      />
                      {errors.proxyApiKey && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.proxyApiKey.message}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="proxyHost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Proxy Host
                      </label>
                      <Input
                        id="proxyHost"
                        {...register('proxyHost')}
                        placeholder="proxy.example.com"
                        className="w-full"
                      />
                      {errors.proxyHost && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.proxyHost.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="proxyPort" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Proxy Port
                      </label>
                      <Input
                        id="proxyPort"
                        type="number"
                        {...register('proxyPort', { valueAsNumber: true })}
                        placeholder="8080"
                        className="w-full"
                      />
                      {errors.proxyPort && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.proxyPort.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="proxyUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Username (Optional)
                      </label>
                      <Input
                        id="proxyUsername"
                        {...register('proxyUsername')}
                        placeholder="username"
                        className="w-full"
                      />
                      {errors.proxyUsername && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.proxyUsername.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="proxyPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password (Optional)
                      </label>
                      <Input
                        id="proxyPassword"
                        type="password"
                        {...register('proxyPassword')}
                        placeholder="password"
                        className="w-full"
                      />
                      {errors.proxyPassword && (
                        <p className="text-sm text-red-600 dark:text-red-400">{errors.proxyPassword.message}</p>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Headers & Cookies Configuration */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
        <button
          type="button"
          className="w-full px-4 py-3 text-left flex justify-between items-center bg-gray-50 dark:bg-gray-800"
          onClick={() => toggleSection('headers')}
        >
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Headers & Cookies</h3>
          <svg 
            className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.headers ? 'transform rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {expandedSections.headers && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="space-y-2">
              <label htmlFor="customUserAgent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom User Agent
              </label>
              <Input
                id="customUserAgent"
                {...register('customUserAgent')}
                placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
                className="w-full"
              />
              {errors.customUserAgent && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.customUserAgent.message}</p>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Headers</h4>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    // This will be implemented with field array functionality
                    // Currently just a placeholder
                  }}
                >
                  Add Header
                </Button>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Header configuration will be implemented here with key-value pairs
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="useBrowserCookies"
                  type="checkbox"
                  {...register('useBrowserCookies')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="useBrowserCookies" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Use Browser Cookies (requires JavaScript rendering)
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Cookies</h4>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    // This will be implemented with field array functionality
                    // Currently just a placeholder
                  }}
                >
                  Add Cookie
                </Button>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Cookie configuration will be implemented here with key-value pairs
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Retry Settings */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
        <button
          type="button"
          className="w-full px-4 py-3 text-left flex justify-between items-center bg-gray-50 dark:bg-gray-800"
          onClick={() => toggleSection('retry')}
        >
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Retry Settings</h3>
          <svg 
            className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.retry ? 'transform rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {expandedSections.retry && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="space-y-2">
              <label htmlFor="maxRetries" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Maximum Retry Attempts
              </label>
              <Input
                id="maxRetries"
                type="number"
                {...register('maxRetries', { valueAsNumber: true })}
                min={0}
                max={10}
                placeholder="3"
                className="w-full"
              />
              {errors.maxRetries && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.maxRetries.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="retryDelay" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Retry Delay (seconds)
              </label>
              <Input
                id="retryDelay"
                type="number"
                {...register('retryDelay', { valueAsNumber: true })}
                min={1}
                max={300}
                placeholder="5"
                className="w-full"
              />
              {errors.retryDelay && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.retryDelay.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="retryStatusCodes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Retry on Status Codes
              </label>
              <Input
                id="retryStatusCodes"
                {...register('retryStatusCodes')}
                placeholder="429, 500, 502, 503, 504"
                className="w-full"
              />
              {errors.retryStatusCodes && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.retryStatusCodes.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Comma-separated list of HTTP status codes to trigger retry
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="exponentialBackoff"
                  type="checkbox"
                  {...register('exponentialBackoff')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="exponentialBackoff" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Use exponential backoff for retries
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Export Options */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
        <button
          type="button"
          className="w-full px-4 py-3 text-left flex justify-between items-center bg-gray-50 dark:bg-gray-800"
          onClick={() => toggleSection('export')}
        >
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Export Options</h3>
          <svg 
            className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.export ? 'transform rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {expandedSections.export && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="space-y-2">
              <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Export Format
              </label>
              <select
                id="exportFormat"
                {...register('exportFormat')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
                <option value="database">Database</option>
              </select>
            </div>
            
            {watch('exportFormat') === 'database' && (
              <div className="space-y-2">
                <label htmlFor="databaseConnectionString" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Database Connection String
                </label>
                <Input
                  id="databaseConnectionString"
                  {...register('databaseConnectionString')}
                  placeholder="postgres://username:password@localhost:5432/database"
                  className="w-full"
                />
                {errors.databaseConnectionString && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.databaseConnectionString.message}</p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="exportPath" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Export Path/Name
              </label>
              <Input
                id="exportPath"
                {...register('exportPath')}
                placeholder={watch('exportFormat') === 'database' ? 'table_name' : 'exports/my-scraper-data'}
                className="w-full"
              />
              {errors.exportPath && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.exportPath.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="includeMetadata"
                  type="checkbox"
                  {...register('includeMetadata')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="includeMetadata" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Include metadata (timestamp, source URL, etc.)
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="autoExportOnComplete"
                  type="checkbox"
                  {...register('autoExportOnComplete')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="autoExportOnComplete" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Automatically export when scraper completes
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
