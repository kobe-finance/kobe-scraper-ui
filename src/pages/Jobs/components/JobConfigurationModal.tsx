import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalTitle, 
  Button,
  Input,
  Tabs 
} from '../../../components';
import type { TabItem } from '../../../components/ui/Tabs';
import { ScraperConfigTab } from './ScraperConfigTab';
import { ScheduleConfigTab } from './ScheduleConfigTab';
import { AdvancedSettingsTab } from './AdvancedSettingsTab';
import { jobConfigurationSchema, type JobFormValues, mapFormValuesToApiRequest, type CreateJobRequest } from './types';
import { ApiError } from '../../../core/errors/api_error';
import { SelectorType } from '../../../core/types/scraper';
import { JobPriority } from '../../../core/types/job';
import { legacyJobClient } from '../../../services/api/compatibility';

interface JobConfigurationModalProps {
  onCreateJob: (jobData: JobFormValues) => Promise<void>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<JobFormValues>;
  title?: string;
  submitButtonText?: string;
}

export const JobConfigurationModal: React.FC<JobConfigurationModalProps> = ({
  onCreateJob,
  isOpen,
  onOpenChange,
  initialValues,
  title = 'Create New Scraper Job',
  submitButtonText = 'Create Job',
}) => {
  // State management handled in the submission object below
  const [activeTab, setActiveTab] = useState('basic');

  // Initialize the form with react-hook-form and zod validation
  const methods = useForm<JobFormValues>({
    resolver: zodResolver(jobConfigurationSchema) as any, // Type cast to fix TS error with complex schema
    defaultValues: {
      name: '',
      description: '',
      url: '',
      url_pattern: '',
      selector_type: SelectorType.CSS,
      main_selector: '',
      pagination_type: 'none',
      pagination_selector: '',
      schedule_frequency: 'once',
      priority: JobPriority.NORMAL,
      proxy_type: 'none',
      max_retries: 3,
      retry_delay: 5,
      export_format: 'json',
      include_metadata: true,
      javascript_enabled: false,
      exponential_backoff: true,
      run_immediate: false,
      use_browser_cookies: false,
      auto_export_on_complete: false,
      ...initialValues,
    },
  });

  // Use a single state for all submission-related state
  const [submission, setSubmission] = useState({
    loading: false,
    processing: false,
  });
  
  // Helper to set error in form
  const setFormError = (error: Error | null) => {
    if (error) {
      methods.setError('root', {
        type: 'server',
        message: error.message || 'An unexpected error occurred',
      });
    } else {
      methods.clearErrors('root');
    }
  };
  
  // Update the UI based on submission state
  const isSubmitting = submission.loading || submission.processing;
  
  // We'll use our compatibility layer to handle both old and new API architectures
  // This ensures backward compatibility regardless of which API layer is enabled
  
  // Handle form submission
  const handleSubmit = async (data: JobFormValues) => {
    try {
      setSubmission(prev => ({ ...prev, loading: true }));
      setFormError(null);
      
      // Map form values to API request format
      const jobRequest: CreateJobRequest = mapFormValuesToApiRequest(data);
      
      try {
        // Use the compatibility layer to create the job
        // This works with both the old and new API architectures
        setSubmission(prev => ({ ...prev, processing: true }));
        const createdJob = await legacyJobClient.createJob(jobRequest);
        setSubmission({ loading: false, processing: false });
        
        // If successful, call the onCreateJob callback to update UI
        await onCreateJob(data);
        methods.reset();
        onOpenChange(false);
        return createdJob;
      } catch (errorObj: unknown) {
        // Type guard for ApiError
        const isApiError = (error: unknown): error is ApiError => {
          return error instanceof ApiError;
        };
        
        if (isApiError(errorObj)) {
          // Handle API-specific errors
          if (errorObj.status === 400) {
            // Convert validation errors to field errors
            if (errorObj.data?.errors) {
              const fieldErrors = errorObj.data.errors;
              Object.entries(fieldErrors).forEach(([field, message]) => {
                // Convert snake_case field names to camelCase for form error handling
                const formField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                methods.setError(formField as any, {
                  type: 'server',
                  message: message as string,
                });
              });
            } else {
              setFormError(new Error(errorObj.message || 'Invalid form data'));
            }
          } else if (errorObj.status === 401 || errorObj.status === 403) {
            // Authentication/authorization errors
            setFormError(new Error('You do not have permission to create this job. Please log in again.'));
          } else {
            // Other API errors
            setFormError(new Error(`Error creating job: ${errorObj.message}`));
          }
        } else if (errorObj instanceof Error) {
          // Handle unexpected errors with Error type
          console.error('Unexpected error creating job:', errorObj);
          setFormError(errorObj);
        } else {
          // Handle truly unknown errors (not Error instances)
          console.error('Unknown error type:', errorObj);
          setFormError(new Error('An unexpected error occurred. Please try again.'));
        }
        
        // Reset submission state
        setSubmission({ loading: false, processing: false });
        
        throw errorObj; // Re-throw so calling code can handle it if needed
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('An unexpected error occurred while creating the job.');
    } finally {
      setSubmission({ loading: false, processing: false });
    }
  };

  // Handle closing modal
  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  // Define tabs for the configuration
  const configTabs: TabItem[] = [
    {
      id: 'basic',
      label: 'Basic Information',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              {...methods.register('name')}
              placeholder="E.g. Product Scraper"
              disabled={isSubmitting}
            />
            {methods.formState.errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{methods.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description (Optional)
            </label>
            <Input
              id="description"
              {...methods.register('description')}
              placeholder="Brief description of this job"
              disabled={isSubmitting}
            />
            {methods.formState.errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400">{methods.formState.errors.description.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="javascript_enabled"
                type="checkbox"
                {...methods.register('javascript_enabled')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="javascript_enabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable JavaScript rendering (slower but more accurate for dynamic websites)
              </label>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'scraper',
      label: 'Scraper Configuration',
      content: <ScraperConfigTab />,
    },
    {
      id: 'schedule',
      label: 'Schedule',
      content: <ScheduleConfigTab />,
    },
    {
      id: 'advanced',
      label: 'Advanced Settings',
      content: <AdvancedSettingsTab />,
    },
  ];

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="sm:max-w-3xl">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit as any)}>
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
            
            <div className="p-6">
              <Tabs 
                tabs={configTabs} 
                defaultTab="basic" 
                onChange={setActiveTab}
              />
            </div>
            
            <ModalFooter className="flex justify-between">
              <div>
                {activeTab !== 'basic' && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      const currentIndex = configTabs.findIndex(tab => tab.id === activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(configTabs[currentIndex - 1].id);
                      }
                    }}
                  >
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                
                {activeTab !== 'advanced' ? (
                  <Button 
                    type="button" 
                    disabled={isSubmitting}
                    onClick={() => {
                      const currentIndex = configTabs.findIndex(tab => tab.id === activeTab);
                      if (currentIndex < configTabs.length - 1) {
                        setActiveTab(configTabs[currentIndex + 1].id);
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      submitButtonText
                    )}
                  </Button>
                )}
              </div>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
};
