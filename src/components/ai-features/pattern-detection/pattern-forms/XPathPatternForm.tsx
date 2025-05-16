import React from 'react';
import { XPathPattern } from '../types';

interface XPathPatternFormProps {
  pattern: XPathPattern;
  onChange: (updates: Partial<XPathPattern>) => void;
  errors: Record<string, string>;
}

/**
 * Form component for configuring XPath-based pattern extraction
 * Provides tools for building and validating XPath expressions
 */
const XPathPatternForm: React.FC<XPathPatternFormProps> = ({
  pattern,
  onChange,
  errors,
}) => {
  // Common XPath examples
  const xpathExamples = [
    { path: '//h1', description: 'All h1 headings' },
    { path: '//div[@class="product"]', description: 'Divs with class "product"' },
    { path: '//a[@href]', description: 'All links with href attribute' },
    { path: '//ul[@id="menu"]/li', description: 'List items in menu' },
    { path: '//table//tr[position() mod 2 = 1]', description: 'Odd table rows' },
    { path: '//span[contains(text(), "Price")]', description: 'Spans containing "Price"' },
    { path: '//div[@id="main"]//p[1]', description: 'First paragraph in main div' },
    { path: '//*[@data-testid="product-price"]', description: 'Element with test ID' },
  ];

  // Handle path change
  const handlePathChange = (path: string) => {
    onChange({ path });
  };

  // Insert example xpath
  const insertExample = (example: string) => {
    handlePathChange(example);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="xpath-path" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          XPath Expression
        </label>
        <div className="mt-1">
          <input
            id="xpath-path"
            type="text"
            value={pattern.path}
            onChange={(e) => handlePathChange(e.target.value)}
            className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:text-white ${
              errors.path ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g. //div[@class='price']"
          />
          {errors.path && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.path}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter an XPath expression to match elements on the page
        </p>
      </div>

      {/* Quick examples */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Quick Examples (click to use)
        </label>
        <div className="flex flex-wrap gap-2">
          {xpathExamples.slice(0, 5).map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => insertExample(example.path)}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
            >
              {example.path}
            </button>
          ))}
        </div>
      </div>

      {/* Multiple elements option */}
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

      {/* XPath explanation */}
      <div className="mt-4">
        <details className="text-sm">
          <summary className="text-primary-600 cursor-pointer dark:text-primary-400">
            Learn more about XPath expressions
          </summary>
          <div className="mt-2 space-y-3">
            <div className="p-3 bg-gray-50 rounded-md text-xs dark:bg-gray-750">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">XPath Syntax</h5>
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="py-1 text-left font-medium text-gray-700 dark:text-gray-300">Expression</th>
                    <th className="py-1 text-left font-medium text-gray-700 dark:text-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">/</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Select from the root node</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">//</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Select nodes anywhere</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">.</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Select the current node</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">..</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Select the parent of current node</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">@</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Select attributes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md text-xs dark:bg-gray-750">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Predicates and Operators</h5>
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="py-1 text-left font-medium text-gray-700 dark:text-gray-300">Example</th>
                    <th className="py-1 text-left font-medium text-gray-700 dark:text-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">//book[1]</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">First book element</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">//book[last()]</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">Last book element</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">//book[position() < 3]</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">First two book elements</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">//book[@type='hardcover']</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">All books with type="hardcover"</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono text-gray-600 dark:text-gray-400">//book[price>35.00]</td>
                    <td className="py-1 text-gray-600 dark:text-gray-400">All books with price>35.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </details>
      </div>

      {/* XPath vs CSS comparison */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 text-sm text-blue-700 dark:text-blue-300">
            <p>
              XPath is more powerful than CSS selectors for certain use cases:
            </p>
            <ul className="list-disc list-inside mt-1 text-xs">
              <li>Finding elements by their text content</li>
              <li>Selecting parent or ancestor elements</li>
              <li>Advanced positional selection (e.g., every third element)</li>
              <li>More complex attribute conditions</li>
            </ul>
            <p className="mt-1">
              This pattern will select {pattern.multiple ? 'all elements' : 'the first element'} matching{' '}
              <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">
                {pattern.path || '[Enter an XPath]'}
              </code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPathPatternForm;
