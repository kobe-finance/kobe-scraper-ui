import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, Button, Input } from '../../../components';

// Define the schema for job creation
const createJobSchema = z.object({
  name: z.string().min(3, { message: 'Job name must be at least 3 characters' }),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  description: z.string().optional(),
  type: z.enum(['basic', 'advanced', 'full_page']),
  // Additional fields for advanced options
  selector: z.string().optional(),
  javascriptEnabled: z.boolean().default(false),
  maxDepth: z.number().int().min(1).max(10).default(1),
});

// Define type for form values
type JobFormValues = z.infer<typeof createJobSchema>;

interface CreateJobModalProps {
  onCreateJob: (jobData: JobFormValues) => Promise<void>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  onCreateJob,
  isOpen,
  onOpenChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Initialize the form with explicit typing
  const { register, handleSubmit: submitForm, reset, watch, formState: { errors } } = useForm<JobFormValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      name: '',
      url: '',
      description: '',
      type: 'basic',
      selector: '',
      javascriptEnabled: false,
      maxDepth: 1,
    },
  });

  // Handle form submission
  const handleSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      await onCreateJob(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating job:', error);
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
      <ModalContent className="sm:max-w-lg">
        <form onSubmit={submitForm(handleSubmit as any)}>
          <ModalHeader>
            <ModalTitle>Create New Scraper Job</ModalTitle>
          </ModalHeader>
          
          <div className="p-6 space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Name</label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="E.g. Product Scraper"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target URL</label>
                <Input
                  id="url"
                  {...register('url')}
                  placeholder="https://example.com"
                  disabled={isSubmitting}
                />
                {errors.url && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.url.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                <Input
                  id="description"
                  {...register('description')}
                  placeholder="Brief description of this job"
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Type</label>
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center space-x-2 cursor-pointer p-2 border rounded-md border-gray-300 dark:border-gray-700">
                    <input
                      type="radio"
                      value="basic"
                      {...register('type')}
                      checked={watch('type') === 'basic'}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Basic</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer p-2 border rounded-md border-gray-300 dark:border-gray-700">
                    <input
                      type="radio"
                      value="full_page"
                      {...register('type')}
                      checked={watch('type') === 'full_page'}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Full Page</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer p-2 border rounded-md border-gray-300 dark:border-gray-700">
                    <input
                      type="radio"
                      value="advanced"
                      {...register('type')}
                      checked={watch('type') === 'advanced'}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Advanced</span>
                  </label>
                </div>
                {errors.type && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
                )}
              </div>
            </div>
            
            {/* Toggle for Advanced Options */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="w-full"
            >
              {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </Button>
            
            {/* Advanced Options */}
            {showAdvancedOptions && (
              <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-800">
                {watch('type') === 'basic' && (
                  <div className="space-y-2">
                    <label htmlFor="selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CSS Selector (Optional)</label>
                    <Input
                      id="selector"
                      {...register('selector')}
                      placeholder=".product-item, #main-content"
                      disabled={isSubmitting}
                    />
                    {errors.selector && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.selector.message}</p>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="maxDepth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Crawl Depth</label>
                  <Input
                    id="maxDepth"
                    type="number"
                    {...register('maxDepth', {
                      valueAsNumber: true,
                    })}
                    min={1}
                    max={10}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    How many links deep to follow from the starting URL (1-10)
                  </p>
                  {errors.maxDepth && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.maxDepth.message}</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="javascriptEnabled"
                    {...register('javascriptEnabled')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="javascriptEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Enable JavaScript rendering (slower but more accurate for dynamic websites)
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <ModalFooter>
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
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
                'Create Job'
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
