import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScraperConfigTab } from '../Jobs/components/ScraperConfigTab';
import { ScheduleConfigTab } from '../Jobs/components/ScheduleConfigTab';
import { AdvancedSettingsTab } from '../Jobs/components/AdvancedSettingsTab';
import { Button, Input, Tabs } from '../../components';
import { jobConfigurationSchema, type JobFormValues } from '../Jobs/components/types';

const DemoJobConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  
  // Initialize the form with react-hook-form and zod validation
  const methods = useForm<JobFormValues>({
    resolver: zodResolver(jobConfigurationSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      url: '',
      urlPattern: '',
      selectorType: 'css',
      mainSelector: '',
      paginationType: 'none',
      paginationSelector: '',
      scheduleType: 'once',
      priorityLevel: 'normal',
      proxyType: 'none',
      maxRetries: 3,
      retryDelay: 5,
      exportFormat: 'json',
      includeMetadata: true,
      javascriptEnabled: false,
      exponentialBackoff: true,
      runImmediate: false,
      useBrowserCookies: false,
      autoExportOnComplete: false,
      extractionFields: [],
    },
  });

  const handleSubmit = (data: JobFormValues) => {
    console.log('Job configuration submitted:', data);
    alert('Job configuration submitted successfully! See console for details.');
  };
  
  const configTabs = [
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
            />
            {methods.formState.errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400">{methods.formState.errors.description.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="javascriptEnabled"
                type="checkbox"
                {...methods.register('javascriptEnabled')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="javascriptEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Kobe Scraper - Job Configuration Demo
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This is a demonstration of the advanced job configuration interface we've built.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="p-6">
                <Tabs 
                  tabs={configTabs} 
                  defaultTab="basic" 
                  onChange={setActiveTab}
                />
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between">
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
                  {activeTab !== 'advanced' ? (
                    <Button 
                      type="button" 
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
                    <Button type="submit">
                      Create Job
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default DemoJobConfig;
