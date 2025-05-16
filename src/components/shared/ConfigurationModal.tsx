import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Import all UI components directly
import { Modal } from '../ui/Modal';
import { ModalContent, ModalHeader, ModalFooter, ModalTitle } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import type { TabItem } from '../ui/Tabs';
// Import API services
import { ApiError } from '../../services/api';

// Generic configuration modal props
export interface ConfigurationModalProps<T> {
  // Required props
  onSubmit: (data: T) => Promise<void>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  validationSchema: any; // Zod schema
  
  // Optional props with defaults
  initialValues?: Partial<T>;
  title?: string;
  submitButtonText?: string;
  tabs?: TabItem[];
  entityType?: 'job' | 'scraper';
}

/**
 * A flexible configuration modal that can be used for different entity types (jobs, scrapers, etc.)
 * It handles form state, validation, and submission in a consistent way.
 */
export const ConfigurationModal = <T extends Record<string, any>>({
  onSubmit,
  isOpen,
  onOpenChange,
  validationSchema,
  initialValues = {},
  title = 'Configuration',
  submitButtonText = 'Save',
  tabs = [],
  entityType = 'job',
}: ConfigurationModalProps<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'basic');

  // Initialize the form with react-hook-form and zod validation
  const methods = useForm<T>({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues as any,
  });

  // Handle form submission
  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      methods.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(`Error creating ${entityType}:`, error);
      
      // Handle API errors
      if (error instanceof ApiError) {
        if (error.status === 400 && error.data?.errors) {
          // Set form errors from API validation errors
          const fieldErrors = error.data.errors || {};
          Object.entries(fieldErrors).forEach(([field, message]) => {
            methods.setError(field as any, {
              type: 'server',
              message: message as string,
            });
          });
        } else if (error.status === 401 || error.status === 403) {
          alert(`You do not have permission to create this ${entityType}. Please log in again.`);
        } else {
          alert(`Error creating ${entityType}: ${error.message}`);
        }
      } else {
        alert(`An unexpected error occurred while creating the ${entityType}.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle closing modal
  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="sm:max-w-3xl">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
            
            <div className="p-6">
              {tabs.length > 0 ? (
                <Tabs 
                  tabs={tabs} 
                  defaultTab={tabs[0].id} 
                  onChange={setActiveTab}
                />
              ) : (
                <div className="space-y-4">
                  {/* Fallback content if no tabs are provided */}
                  <div className="text-gray-500 text-center py-4">
                    No configuration options available.
                  </div>
                </div>
              )}
            </div>
            
            <ModalFooter className="flex justify-between">
              <div>
                {tabs.length > 1 && activeTab !== tabs[0].id && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1].id);
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
                
                {tabs.length > 1 && activeTab !== tabs[tabs.length - 1].id ? (
                  <Button 
                    type="button" 
                    disabled={isSubmitting}
                    onClick={() => {
                      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1].id);
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
                        {entityType === 'job' ? 'Creating...' : 'Saving...'}
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
