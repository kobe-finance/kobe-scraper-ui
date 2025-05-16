import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { JobFormValues } from './types';
import { FieldExtractorConfig } from './FieldExtractorConfig';
import { SelectorPreview } from './SelectorPreview';

export const ScraperConfigTab: React.FC = () => {
  const { register, formState: { errors }, watch } = useFormContext<JobFormValues>();
  
  return (
    <div className="space-y-6">
      {/* URL Configuration Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Target URL Configuration</h3>
        
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target URL <span className="text-red-500">*</span>
          </label>
          <Input
            id="url"
            {...register('url')}
            placeholder="https://example.com/products"
            className="w-full"
          />
          {errors.url && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.url.message}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            The starting URL for the scraper to begin crawling from
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="urlPattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL Pattern Filter
          </label>
          <Input
            id="urlPattern"
            {...register('urlPattern')}
            placeholder="https://example.com/products/.*"
            className="w-full"
          />
          {errors.urlPattern && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.urlPattern.message}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Optional regular expression to limit which URLs are scraped (e.g., only product pages)
          </p>
        </div>
      </div>
      
      {/* Selector Builder Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Selector Configuration</h3>
        
        <div className="space-y-2">
          <label htmlFor="selectorType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Selector Type
          </label>
          <select
            id="selectorType"
            {...register('selectorType')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="css">CSS Selector</option>
            <option value="xpath">XPath</option>
            <option value="json">JSON Path</option>
            <option value="regex">Regular Expression</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="mainSelector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Main Content Selector
          </label>
          <Input
            id="mainSelector"
            {...register('mainSelector')}
            placeholder={watch('selectorType') === 'css' ? '.product-item, #main-content' : 
                      watch('selectorType') === 'xpath' ? '//div[@class="product-item"]' : 
                      watch('selectorType') === 'json' ? '$.products[*]' : 
                      'Product Name: (.+)'}
            className="w-full"
          />
          {errors.mainSelector && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.mainSelector.message}</p>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Fields</h4>
            <Button 
              type="button" 
              size="sm" 
              variant="outline"
              onClick={() => {
                // This will be implemented with field array functionality
                // Currently just a placeholder
              }}
            >
              Add Field
            </Button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Field extraction configuration will be implemented here
            </p>
          </div>
        </div>
        
        {/* Data Fields Configuration */}
        <FieldExtractorConfig />
      </div>
      
      {/* Pagination Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Pagination Configuration</h3>
        
        <div className="space-y-2">
          <label htmlFor="paginationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pagination Type
          </label>
          <select
            id="paginationType"
            {...register('paginationType')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="none">No Pagination</option>
            <option value="next_button">Next Button</option>
            <option value="page_number">Page Numbers</option>
            <option value="infinite_scroll">Infinite Scroll</option>
            <option value="load_more">Load More Button</option>
          </select>
        </div>
        
        {watch('paginationType') !== 'none' && (
          <div className="space-y-2">
            <label htmlFor="paginationSelector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pagination Selector
            </label>
            <Input
              id="paginationSelector"
              {...register('paginationSelector')}
              placeholder={watch('paginationType') === 'next_button' ? '.pagination .next, a[rel="next"]' : 
                        watch('paginationType') === 'page_number' ? '.pagination a' : 
                        watch('paginationType') === 'infinite_scroll' ? '.product-grid' : 
                        '.load-more-button'}
              className="w-full"
            />
            {errors.paginationSelector && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.paginationSelector.message}</p>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="maxPages" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Maximum Pages to Scrape
          </label>
          <Input
            id="maxPages"
            type="number"
            {...register('maxPages', { valueAsNumber: true })}
            min={1}
            max={1000}
            placeholder="10"
            className="w-full"
          />
          {errors.maxPages && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.maxPages.message}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Limit the number of pages to scrape (empty = no limit)
          </p>
        </div>
      </div>
      
      {/* Preview Section */}
      <div className="mt-8">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Extraction Preview
        </h3>
        <SelectorPreview />
      </div>
    </div>
  );
};
