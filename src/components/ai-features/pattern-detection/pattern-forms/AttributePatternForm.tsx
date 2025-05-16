import React, { useState } from 'react';
import { AttributePattern } from '../types';

interface AttributePatternFormProps {
  pattern: AttributePattern;
  onChange: (updates: Partial<AttributePattern>) => void;
  errors: Record<string, string>;
}

/**
 * Form component for configuring attribute-based pattern extraction
 * Allows selecting elements and extracting specific HTML attributes
 */
const AttributePatternForm: React.FC<AttributePatternFormProps> = ({
  pattern,
  onChange,
  errors,
}) => {
  // Common HTML attributes that can be extracted
  const commonAttributes = [
    { value: 'href', label: 'href (links)' },
    { value: 'src', label: 'src (images, scripts)' },
    { value: 'alt', label: 'alt (images)' },
    { value: 'title', label: 'title' },
    { value: 'id', label: 'id' },
    { value: 'class', label: 'class' },
    { value: 'style', label: 'style' },
    { value: 'value', label: 'value (form elements)' },
    { value: 'data-id', label: 'data-id' },
    { value: 'data-src', label: 'data-src' },
    { value: 'data-url', label: 'data-url' },
    { value: 'aria-label', label: 'aria-label' },
    { value: 'role', label: 'role' },
    { value: 'target', label: 'target (links)' },
    { value: 'type', label: 'type' },
    { value: 'name', label: 'name' },
    { value: 'placeholder', label: 'placeholder (form elements)' },
    { value: 'content', label: 'content (meta tags)' },
    { value: 'action', label: 'action (forms)' },
    { value: 'method', label: 'method (forms)' },
  ];

  // Common element selector examples
  const elementExamples = [
    { selector: 'a', description: 'All links' },
    { selector: 'img', description: 'All images' },
    { selector: 'meta[property]', description: 'Meta tags with property attribute' },
    { selector: '.product-link', description: 'Elements with product-link class' },
    { selector: 'button[type="submit"]', description: 'Submit buttons' },
    { selector: 'input[name="email"]', description: 'Email input fields' },
    { selector: 'div[data-id]', description: 'Divs with data-id attribute' },
    { selector: 'form[action]', description: 'Forms with action attribute' },
  ];

  // Insert element example
  const insertElementExample = (example: string) => {
    onChange({ elementSelector: example });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="element-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Element Selector
        </label>
        <div className="mt-1">
          <input
            id="element-selector"
            type="text"
            value={pattern.elementSelector}
            onChange={(e) => onChange({ elementSelector: e.target.value })}
            className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:text-white ${
              errors.elementSelector ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g. a, img, meta[property]"
          />
          {errors.elementSelector && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.elementSelector}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter a CSS selector to identify elements with the attribute to extract
        </p>
      </div>

      {/* Quick element examples */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Element Examples (click to use)
        </label>
        <div className="flex flex-wrap gap-2">
          {elementExamples.slice(0, 6).map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => insertElementExample(example.selector)}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
              title={example.description}
            >
              {example.selector}
            </button>
          ))}
        </div>
      </div>

      {/* Attribute name */}
      <div>
        <label htmlFor="attribute-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Attribute Name
        </label>
        <div className="mt-1">
          <div className="relative rounded-md shadow-sm">
            <input
              id="attribute-name"
              type="text"
              value={pattern.attributeName}
              onChange={(e) => onChange({ attributeName: e.target.value })}
              list="common-attributes"
              className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:text-white ${
                errors.attributeName ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g. href, src, data-id"
            />
            <datalist id="common-attributes">
              {commonAttributes.map((attr) => (
                <option key={attr.value} value={attr.value} />
              ))}
            </datalist>
          </div>
          {errors.attributeName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.attributeName}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter the name of the attribute to extract
        </p>
      </div>

      {/* Common attributes */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Common Attributes
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {commonAttributes.slice(0, 12).map((attr) => (
            <button
              key={attr.value}
              type="button"
              onClick={() => onChange({ attributeName: attr.value })}
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                pattern.attributeName === attr.value
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {attr.value}
            </button>
          ))}
        </div>
      </div>

      {/* Usage examples */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 text-sm text-blue-700 dark:text-blue-300">
            <p>
              This pattern will extract the <b>{pattern.attributeName || '[attribute name]'}</b> attribute from all elements matching{' '}
              <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">
                {pattern.elementSelector || '[element selector]'}
              </code>.
            </p>
            <div className="mt-2">
              <p className="font-medium mb-1">Common use cases:</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Extract URLs from links: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">a</code> + <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">href</code></li>
                <li>Extract image sources: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">img</code> + <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">src</code></li>
                <li>Extract product IDs: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">.product</code> + <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">data-id</code></li>
                <li>Extract meta content: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">meta[property="og:title"]</code> + <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">content</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributePatternForm;
