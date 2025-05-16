import React, { useState } from 'react';
import { CssPattern } from '../types';

interface CssPatternFormProps {
  pattern: CssPattern;
  onChange: (updates: Partial<CssPattern>) => void;
  errors: Record<string, string>;
}

/**
 * Form component for configuring CSS selector-based pattern extraction
 * Provides tools for building and previewing CSS selectors
 */
const CssPatternForm: React.FC<CssPatternFormProps> = ({
  pattern,
  onChange,
  errors,
}) => {
  // Common HTML attributes that can be extracted
  const commonAttributes = [
    { value: '', label: 'Element Text (default)' },
    { value: 'href', label: 'href (links)' },
    { value: 'src', label: 'src (images, scripts)' },
    { value: 'alt', label: 'alt (images)' },
    { value: 'title', label: 'title' },
    { value: 'id', label: 'id' },
    { value: 'class', label: 'class' },
    { value: 'style', label: 'style' },
    { value: 'data-*', label: 'data-* (custom data attributes)' },
  ];

  // Common CSS selector examples
  const selectorExamples = [
    { selector: 'h1', description: 'First h1 heading' },
    { selector: '.product-price', description: 'Element with class "product-price"' },
    { selector: '#main-content', description: 'Element with ID "main-content"' },
    { selector: 'article p', description: 'Paragraphs inside articles' },
    { selector: 'ul.menu > li', description: 'Direct list items in menu' },
    { selector: 'a[href^="https://"]', description: 'Links with HTTPS URLs' },
    { selector: 'div[data-role="product"]', description: 'Divs with product data role' },
    { selector: 'tr:nth-child(even)', description: 'Even table rows' },
  ];

  // Handle selector change
  const handleSelectorChange = (selector: string) => {
    onChange({ selector });
  };

  // Handle attribute extraction change
  const handleAttributeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const attribute = event.target.value;
    onChange({ 
      extractAttribute: attribute === '' ? undefined : attribute 
    });
  };

  // Insert example selector
  const insertExample = (example: string) => {
    handleSelectorChange(example);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="css-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          CSS Selector
        </label>
        <div className="mt-1">
          <input
            id="css-selector"
            type="text"
            value={pattern.selector}
            onChange={(e) => handleSelectorChange(e.target.value)}
            className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:text-white ${
              errors.selector ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g. .price-tag, #product-title"
          />
          {errors.selector && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.selector}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter a CSS selector to match elements on the page
        </p>
      </div>

      {/* Quick examples */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Quick Examples (click to use)
        </label>
        <div className="flex flex-wrap gap-2">
          {selectorExamples.slice(0, 5).map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => insertExample(example.selector)}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
            >
              {example.selector}
            </button>
          ))}
        </div>
      </div>

      {/* Extract options */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="extract-attribute" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Extract Attribute
          </label>
          <select
            id="extract-attribute"
            value={pattern.extractAttribute || ''}
            onChange={handleAttributeChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {commonAttributes.map((attr) => (
              <option key={attr.value} value={attr.value}>
                {attr.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Select which attribute to extract from matched elements
          </p>
        </div>

        <div>
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="multiple-elements"
                type="checkbox"
                checked={pattern.multiple}
                onChange={(e) => onChange({ multiple: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="multiple-elements" className="font-medium text-gray-700 dark:text-gray-300">
                Extract Multiple Elements
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Extract all matching elements instead of just the first match
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Selector explanation */}
      <div className="mt-4">
        <details className="text-sm">
          <summary className="text-primary-600 cursor-pointer dark:text-primary-400">
            Learn more about CSS selectors
          </summary>
          <div className="mt-2 space-y-3">
            <div className="p-3 bg-gray-50 rounded-md text-xs dark:bg-gray-750">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Basic Selectors</h5>
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="py-1 text-left font-medium text-gray-700 dark:text-gray-300">Selector</th>
                    <th className="py-1 text-left font-medium text-gray-700 dark:text-gray-300">Example</th>
                    <th className="py-1 text-left font-medium text-gray-700 dark:text-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">element</td>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">p</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Selects all paragraphs</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">.class</td>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">.intro</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Selects elements with class="intro"</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">#id</td>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">#first</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Selects element with id="first"</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">*</td>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">*</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Selects all elements</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md text-xs dark:bg-gray-750">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Attribute Selectors</h5>
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="py-1 text-left font-medium text-gray-700 dark:text-gray-300">Selector</th>
                    <th className="py-1 text-left font-medium text-gray-700 dark:text-gray-300">Example</th>
                    <th className="py-1 text-left font-medium text-gray-700 dark:text-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">[attribute]</td>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">[target]</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Elements with a target attribute</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">[attribute=value]</td>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">[target="_blank"]</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Elements with target="_blank"</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">[attribute^=value]</td>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">[href^="https"]</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Elements with href starting with "https"</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">[attribute$=value]</td>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">[href$=".pdf"]</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Elements with href ending with ".pdf"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </details>
      </div>

      {/* Selector preview */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 text-sm text-blue-700 dark:text-blue-300">
            <p>
              This pattern will select {pattern.multiple ? 'all elements' : 'the first element'} matching{' '}
              <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">
                {pattern.selector || '[Enter a selector]'}
              </code>
              {pattern.extractAttribute ? (
                <>
                  {' '}and extract the <b>{pattern.extractAttribute}</b> attribute
                </>
              ) : (
                ' and extract the text content'
              )}
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CssPatternForm;
