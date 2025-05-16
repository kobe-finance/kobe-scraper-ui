import React, { useState } from 'react';
import { StepProps } from '../OnboardingWizard';

// Available frequency options
const frequencyOptions = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom Schedule' },
];

// Data source options with sample data
const dataSourceOptions = [
  { 
    id: 'product-data', 
    name: 'Product Data', 
    description: 'Extract product names, prices, descriptions, and availability',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },
  { 
    id: 'pricing-data', 
    name: 'Pricing & Discount Data', 
    description: 'Monitor price changes, discounts, and promotional offers',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    id: 'reviews-data', 
    name: 'Reviews & Ratings', 
    description: 'Collect customer reviews, ratings, and sentiment data',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  },
  { 
    id: 'inventory-data', 
    name: 'Inventory & Stock Status', 
    description: 'Track product availability and stock levels',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  { 
    id: 'competitor-data', 
    name: 'Competitor Intelligence', 
    description: 'Gather data on competitor products, pricing, and promotions',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  { 
    id: 'custom-data', 
    name: 'Custom Data Extraction', 
    description: 'Define your own custom data points to extract',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    )
  },
];

const DataSourcesStep: React.FC<StepProps> = ({ onNext, onPrevious, currentData }) => {
  const [selectedSources, setSelectedSources] = useState<string[]>(
    currentData.dataSources.sources || []
  );
  const [frequency, setFrequency] = useState(
    currentData.dataSources.frequency || 'daily'
  );
  const [proxyEnabled, setProxyEnabled] = useState(
    currentData.dataSources.proxyEnabled !== undefined 
      ? currentData.dataSources.proxyEnabled 
      : true
  );
  const [error, setError] = useState('');

  const toggleSource = (sourceId: string) => {
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter(id => id !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSources.length === 0) {
      setError('Please select at least one data source');
      return;
    }
    
    onNext({
      sources: selectedSources,
      frequency,
      proxyEnabled,
    });
  };

  return (
    <div className="p-6 sm:p-8">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          Configure Data Sources
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select the types of data you'd like to extract and how often you need it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Data Source Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Data Sources
          </label>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select the types of data you want to extract (you can select multiple)
          </p>
          
          {error && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {dataSourceOptions.map((source) => (
              <div 
                key={source.id}
                className={`
                  relative rounded-lg border p-4 flex cursor-pointer focus:outline-none
                  ${selectedSources.includes(source.id) 
                    ? 'bg-primary-50 border-primary-500 dark:bg-primary-900 dark:border-primary-500' 
                    : 'border-gray-300 dark:border-gray-700 dark:bg-gray-800'}
                `}
                onClick={() => toggleSource(source.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className={`
                      flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center
                      ${selectedSources.includes(source.id) 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}
                    `}>
                      {source.icon}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {source.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {source.description}
                      </div>
                    </div>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={selectedSources.includes(source.id)}
                      onChange={() => {}} // Controlled by the onClick handler on the parent div
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequency Selection */}
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Scraping Frequency
          </label>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            How often would you like to collect data?
          </p>
          <select
            id="frequency"
            className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            {frequencyOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Proxy Toggle */}
        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              id="proxy"
              type="checkbox"
              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              checked={proxyEnabled}
              onChange={() => setProxyEnabled(!proxyEnabled)}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="proxy" className="font-medium text-gray-700 dark:text-gray-300">
              Enable Proxy Rotation
            </label>
            <p className="text-gray-500 dark:text-gray-400">
              Use our proxy network to avoid IP blocks and rate limits (recommended)
            </p>
          </div>
        </div>

        {/* Tooltip */}
        <div className="rounded-md bg-green-50 dark:bg-green-900 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Pro tip</h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>
                  You can always modify these settings or add more data sources later from your dashboard. We recommend starting with fewer data sources and adding more as needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
          >
            Back
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataSourcesStep;
