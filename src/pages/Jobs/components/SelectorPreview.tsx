import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../../../components';
import type { JobFormValues } from './types';
import { scraper_service } from '../../../services/api/scraper_service';

interface PreviewResult {
  success: boolean;
  data: {
    [key: string]: any;
  };
  errors?: {
    [key: string]: string;
  };
  screenshot?: string;
}

export const SelectorPreview: React.FC = () => {
  const { watch, formState } = useFormContext<JobFormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<PreviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const url = watch('url');
  const selectorType = watch('selectorType');
  const mainSelector = watch('mainSelector');
  const extractionFields = watch('extractionFields');
  const javascriptEnabled = watch('javascriptEnabled');
  
  const handlePreview = async () => {
    if (!url) {
      setError('Please enter a URL to preview extraction');
      return;
    }
    
    // Data fields are now optional
    // If no extraction fields are defined, we'll just preview the page
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Making preview request to backend with:', {
        url,
        selector_type: selectorType,
        main_selector: mainSelector,
        extraction_fields_count: extractionFields?.length || 0,
        javascript_enabled: javascriptEnabled
      });
      
      // Format the request data to match our API types
      const formatted_fields = extractionFields?.map(field => ({
        name: field.name,
        selector: field.selector,
        selector_type: field.selectorType
      })) || [];
      
      const result = await scraper_service.preview_extraction({
        url,
        selector_type: selectorType,
        main_selector: mainSelector,
        extraction_fields: formatted_fields,
        javascript_enabled: javascriptEnabled
      });
      
      setPreviewResult(result);
    } catch (err) {
      console.error('Preview extraction error:', err);
      
      // Error handling based on our error structure
      if (err instanceof Error) {
        // Check if it's an API error with additional properties
        const apiError = err as Error & { status?: number; data?: any };
        
        if (apiError.status) {
          setError(`API Error: ${apiError.message} (Status: ${apiError.status})`);
          console.error('API Error details:', apiError.data);
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('An unknown error occurred');
      }
      
      setPreviewResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderResultTable = () => {
    if (!previewResult || !previewResult.data) return null;
    
    const fields = Object.keys(previewResult.data);
    
    if (fields.length === 0) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 dark:bg-yellow-900/20 dark:border-yellow-700">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            No data was extracted. Your selectors may not have matched any content on the page.
          </p>
        </div>
      );
    }
    
    return (
      <div className="overflow-hidden border border-gray-200 rounded-md dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Field
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Value
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {fields.map((field) => {
              const value = previewResult.data[field];
              const error = previewResult.errors?.[field];
              const hasError = !!error;
              
              return (
                <tr key={field}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {field}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-sm truncate">
                    {hasError ? (
                      <span className="text-red-500 dark:text-red-400">Failed</span>
                    ) : (
                      <>
                        {typeof value === 'object' 
                          ? JSON.stringify(value) 
                          : String(value)}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {hasError ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Error
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Success
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  // If a screenshot is available, show it
  const renderScreenshot = () => {
    if (!previewResult?.screenshot) return null;
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Page Screenshot
        </h4>
        <div className="border border-gray-200 rounded-md p-1 dark:border-gray-700">
          <img 
            src={previewResult.screenshot} 
            alt="Page screenshot" 
            className="w-full h-auto rounded-md"
          />
        </div>
      </div>
    );
  };
  
  // Show form errors that might prevent a successful preview
  const getFormErrors = () => {
    const errors = [];
    
    if (formState.errors.url) {
      errors.push(`URL: ${formState.errors.url.message}`);
    }
    
    extractionFields?.forEach((field, index) => {
      if (formState.errors.extractionFields?.[index]) {
        const fieldErrors = formState.errors.extractionFields[index];
        if (fieldErrors?.name) {
          errors.push(`Field "${field.name || index + 1}" name: ${fieldErrors.name.message}`);
        }
        if (fieldErrors?.selector) {
          errors.push(`Field "${field.name || index + 1}" selector: ${fieldErrors.selector.message}`);
        }
      }
    });
    
    return errors;
  };
  
  const formErrors = getFormErrors();
  const hasFormErrors = formErrors.length > 0;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
          Preview Extraction
        </h3>
        
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handlePreview}
          disabled={isLoading || hasFormErrors}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Testing...
            </>
          ) : (
            'Test Extraction'
          )}
        </Button>
      </div>
      
      {/* Show any form errors that would prevent a successful preview */}
      {hasFormErrors && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-3 dark:bg-yellow-900/20 dark:border-yellow-700">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1">
            Please fix the following errors before testing:
          </h4>
          <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-400">
            {formErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Show error message if preview failed */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-900/20 dark:border-red-700">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {/* Show preview results if available */}
      {previewResult && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Extraction Results
          </h4>
          {renderResultTable()}
          {renderScreenshot()}
        </div>
      )}
      
      {/* Show help text if no preview has been run yet */}
      {!previewResult && !isLoading && !error && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 dark:bg-gray-700/30 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click "Test Extraction" to preview what data will be extracted from the target URL using your current configuration. 
            This will test all the data field selectors you've defined.
          </p>
        </div>
      )}
    </div>
  );
};
