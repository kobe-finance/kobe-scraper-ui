import React from 'react';
import { ListPattern } from '../types';

interface ListPatternFormProps {
  pattern: ListPattern;
  onChange: (updates: Partial<ListPattern>) => void;
  errors: Record<string, string>;
}

/**
 * Form component for configuring list-based pattern extraction
 * Enables extracting data from HTML lists like <ul> and <ol>
 */
const ListPatternForm: React.FC<ListPatternFormProps> = ({
  pattern,
  onChange,
  errors,
}) => {
  // Common list selector examples
  const listExamples = [
    { selector: 'ul, ol', description: 'All lists (unordered and ordered)' },
    { selector: 'ul.menu', description: 'Unordered list with class "menu"' },
    { selector: 'ol.steps', description: 'Ordered list with class "steps"' },
    { selector: '#sidebar ul', description: 'Lists within sidebar' },
    { selector: '.category-list', description: 'Elements with class "category-list"' },
    { selector: 'nav > ul', description: 'Direct unordered list children of nav' },
  ];

  // Common item selector examples
  const itemExamples = [
    { selector: 'li', description: 'All list items' },
    { selector: 'li.product', description: 'List items with class "product"' },
    { selector: 'li[data-id]', description: 'List items with data-id attribute' },
    { selector: 'li:not(.hidden)', description: 'List items that are not hidden' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="list-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          List Selector
        </label>
        <div className="mt-1">
          <input
            id="list-selector"
            type="text"
            value={pattern.listSelector}
            onChange={(e) => onChange({ listSelector: e.target.value })}
            className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:text-white ${
              errors.listSelector ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g. ul, ol, .product-list"
          />
          {errors.listSelector && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.listSelector}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          CSS selector to identify the list(s) to extract
        </p>
      </div>

      {/* Quick list examples */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          List Examples (click to use)
        </label>
        <div className="flex flex-wrap gap-2">
          {listExamples.slice(0, 4).map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange({ listSelector: example.selector })}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
              title={example.description}
            >
              {example.selector}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="item-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Item Selector
        </label>
        <div className="mt-1">
          <input
            id="item-selector"
            type="text"
            value={pattern.itemSelector}
            onChange={(e) => onChange({ itemSelector: e.target.value })}
            className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:text-white ${
              errors.itemSelector ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g. li, .list-item"
          />
          {errors.itemSelector && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.itemSelector}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          CSS selector for list items (relative to list)
        </p>
      </div>

      {/* Quick item examples */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Item Examples (click to use)
        </label>
        <div className="flex flex-wrap gap-2">
          {itemExamples.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange({ itemSelector: example.selector })}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
              title={example.description}
            >
              {example.selector}
            </button>
          ))}
        </div>
      </div>

      {/* Extract options */}
      <div>
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="extract-text"
              type="checkbox"
              checked={pattern.extractItemText}
              onChange={(e) => onChange({ extractItemText: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="extract-text" className="font-medium text-gray-700 dark:text-gray-300">
              Extract Text Only
            </label>
            <p className="text-gray-500 dark:text-gray-400">
              Extract just the text content from list items (without HTML)
            </p>
          </div>
        </div>
      </div>

      {/* List extraction explanation and examples */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 text-sm text-blue-700 dark:text-blue-300">
            <p>
              This pattern will extract items from all lists matching{' '}
              <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">
                {pattern.listSelector || 'ul, ol'}
              </code>{' '}
              and will get each item matching{' '}
              <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">
                {pattern.itemSelector || 'li'}
              </code>.
            </p>
            <div className="mt-2">
              <p className="font-medium mb-1">Common use cases:</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Navigation menus</li>
                <li>Product categories</li>
                <li>Feature lists</li>
                <li>Step-by-step instructions</li>
                <li>Tag clouds</li>
                <li>Search results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* HTML List Structure Visualization */}
      <div className="mt-4">
        <details className="text-sm">
          <summary className="text-primary-600 cursor-pointer dark:text-primary-400">
            List Structure Visualization
          </summary>
          
          <div className="mt-2 p-3 bg-gray-50 rounded-md dark:bg-gray-750">
            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
              This diagram shows how list patterns map to HTML list structure:
            </p>
            
            <div className="border border-gray-300 rounded dark:border-gray-600">
              <div className="bg-white p-3 font-mono text-xs text-gray-700 overflow-x-auto dark:bg-gray-800 dark:text-gray-300">
                <pre>{`<ul class="product-categories">  <!-- List Selector -->
  <li>Laptops</li>           <!-- Item Selector -->
  <li>Smartphones</li>        <!-- Item Selector -->
  <li>Accessories</li>        <!-- Item Selector -->
  <li>
    <a href="/wearables">Wearables</a>  <!-- Gets inner text if extractItemText is true -->
  </li>
</ul>

<ol class="setup-steps">    <!-- List Selector -->
  <li>Unbox the device</li>  <!-- Item Selector -->
  <li>Charge the battery</li>
  <li>Power on</li>
  <li>Follow on-screen setup</li>
</ol>`}</pre>
              </div>
            </div>
            
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">
              The list pattern extracts all items from matching lists. If "Extract Text Only" is checked, only the text content will be returned without HTML markup.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ListPatternForm;
