import React from 'react';
import { z } from 'zod';
import { ConfigurationModal } from '../../../components/shared/ConfigurationModal';
import type { TabItem } from '../../../components/ui/Tabs';
import { SelectorType, ProxyType } from '../../../core/types/scraper';

// Define scraper-specific schema aligned with API types
export const scraperConfigurationSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  url: z.string().url({ message: "Must be a valid URL" }),
  selector: z.string().optional(),
  selector_type: z.nativeEnum(SelectorType).default(SelectorType.CSS),
  max_depth: z.number().min(1).max(5).default(2),
  proxy_type: z.nativeEnum(ProxyType).default(ProxyType.NONE),
  proxy_url: z.string().optional(),
  javascript_enabled: z.boolean().default(false),
  respect_robots_txt: z.boolean().default(true)
});

// Define the type for scraper configuration values
export type ScraperFormValues = z.infer<typeof scraperConfigurationSchema>;

// Default values
const defaultScraperValues: Partial<ScraperFormValues> = {
  max_depth: 2,
  selector_type: SelectorType.CSS,
  proxy_type: ProxyType.NONE,
  javascript_enabled: false,
  respect_robots_txt: true
};

// Create basic tab content component
const BasicConfigTab = () => (
  <div className="space-y-6">
    <div className="mb-4">
      <label htmlFor="name" className="block text-sm font-medium mb-1">Scraper Name *</label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="E.g., Product Catalog Scraper"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="description" className="block text-sm font-medium mb-1">Description (Optional)</label>
      <textarea
        id="description"
        name="description"
        rows={3}
        placeholder="What does this scraper do?"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="url" className="block text-sm font-medium mb-1">Target URL *</label>
      <input
        id="url"
        name="url"
        type="url"
        placeholder="https://example.com/products"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="selector" className="block text-sm font-medium mb-1">CSS Selector (Optional)</label>
      <input
        id="selector"
        name="selector"
        type="text"
        placeholder=".product-item, #main-content"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  </div>
);

// Create advanced tab content component
const AdvancedConfigTab = () => (
  <div className="space-y-6">
    <div className="mb-4">
      <label htmlFor="max_depth" className="block text-sm font-medium mb-1">Max Crawl Depth</label>
      <input
        id="max_depth"
        name="max_depth"
        type="number"
        min={1}
        max={5}
        defaultValue={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div className="mb-4">
      <label htmlFor="proxy_type" className="block text-sm font-medium mb-1">Proxy Type</label>
      <select
        id="proxy_type"
        name="proxy_type"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value={ProxyType.NONE}>None</option>
        <option value={ProxyType.HTTP}>HTTP Proxy</option>
        <option value={ProxyType.SOCKS5}>SOCKS5 Proxy</option>
      </select>
    </div>

    <div className="mb-4 opacity-50">
      <label htmlFor="proxy_url" className="block text-sm font-medium mb-1">Proxy URL</label>
      <input
        id="proxy_url"
        name="proxy_url"
        type="text"
        placeholder="http://proxy-provider.com:8080"
        disabled
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
      <p className="text-xs text-gray-500 mt-1">Available when proxy type is selected</p>
    </div>

    <div className="space-y-4 pt-2">
      <div className="flex items-center">
        <input
          id="javascript_enabled"
          name="javascript_enabled"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="javascript_enabled" className="ml-2 text-sm text-gray-700">
          Enable JavaScript (for dynamic websites)
        </label>
      </div>

      <div className="flex items-center">
        <input
          id="respect_robots_txt"
          name="respect_robots_txt"
          type="checkbox"
          defaultChecked
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="respect_robots_txt" className="ml-2 text-sm text-gray-700">
          Respect robots.txt rules
        </label>
      </div>
    </div>
  </div>
);

// Scraper configuration modal component
interface ScraperConfigurationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ScraperFormValues) => Promise<void>;
  initialValues?: Partial<ScraperFormValues>;
}

export const ScraperConfigurationModal: React.FC<ScraperConfigurationModalProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialValues = defaultScraperValues,
}) => {
  // Create configuration tabs
  const configTabs: TabItem[] = [
    {
      id: 'basic',
      label: 'Basic Configuration',
      content: <BasicConfigTab />
    },
    {
      id: 'advanced',
      label: 'Advanced Options',
      content: <AdvancedConfigTab />
    }
  ];
  
  // Transform and validate the submission for API compatibility
  const handleSubmit = async (data: ScraperFormValues) => {
    // Map form values to API request format
    // This ensures proper type conversion between form values and API request types
    const apiRequest = {
      ...data,
      // Ensure enum values are properly typed
      selector_type: data.selector_type,
      proxy_type: data.proxy_type
    };
    
    // Pass the properly typed data to the parent handler
    return onSubmit(apiRequest);
  };

  return (
    <ConfigurationModal<ScraperFormValues>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      validationSchema={scraperConfigurationSchema}
      initialValues={initialValues}
      title="Create New Web Scraper"
      submitButtonText="Create Scraper"
      tabs={configTabs}
      entityType="scraper"
    />
  );
};
