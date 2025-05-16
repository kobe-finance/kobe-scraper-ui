import React, { useState } from 'react';
import { PlayIcon, ArrowPathIcon, DocumentTextIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Pattern, PatternTestResult } from './types';

interface PatternTestingProps {
  pattern: Pattern;
  onRunTest: (pattern: Pattern, content: string) => Promise<PatternTestResult>;
  initialContent?: string;
  className?: string;
}

/**
 * Component for testing extraction patterns against sample HTML content
 * Shows real-time results and performance metrics
 */
const PatternTesting: React.FC<PatternTestingProps> = ({
  pattern,
  onRunTest,
  initialContent = '',
  className = '',
}) => {
  const [content, setContent] = useState(initialContent);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResult, setTestResult] = useState<PatternTestResult | null>(null);
  const [contentType, setContentType] = useState<'raw' | 'url'>('raw');
  const [contentUrl, setContentUrl] = useState('');

  // Placeholder HTML examples for different pattern types
  const exampleHtml: Record<string, string> = {
    text: `<div class="content">
  <h1>Welcome to our Online Store</h1>
  <p>We have the best products at the best prices.</p>
  <p class="promo">Use code SAVE20 for 20% off your first order!</p>
</div>`,
    regex: `<div class="prices">
  <p>Standard price: $19.99</p>
  <p>Sale price: $14.95</p>
  <p>Premium product: $29.99</p>
  <span class="shipping">Shipping: $4.99</span>
</div>`,
    css: `<div class="product-list">
  <div class="product">
    <h2 class="product-title">Smartphone X</h2>
    <p class="product-price">$699.99</p>
    <div class="product-rating">4.5/5</div>
  </div>
  <div class="product">
    <h2 class="product-title">Laptop Pro</h2>
    <p class="product-price">$1,299.99</p>
    <div class="product-rating">4.8/5</div>
  </div>
</div>`,
    xpath: `<ul class="nav-menu">
  <li><a href="/home">Home</a></li>
  <li><a href="/products">Products</a></li>
  <li><a href="/about">About Us</a></li>
  <li><a href="/contact">Contact</a></li>
</ul>`,
    attribute: `<div class="gallery">
  <img src="image1.jpg" alt="Product 1" data-id="prod-123" />
  <img src="image2.jpg" alt="Product 2" data-id="prod-456" />
  <a href="https://example.com/product/789" class="product-link" data-id="prod-789">View Details</a>
</div>`,
    table: `<table class="data-table">
  <thead>
    <tr>
      <th>Product</th>
      <th>Price</th>
      <th>Stock</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Smartphone X</td>
      <td>$699.99</td>
      <td>In Stock</td>
    </tr>
    <tr>
      <td>Laptop Pro</td>
      <td>$1,299.99</td>
      <td>Low Stock</td>
    </tr>
  </tbody>
</table>`,
    list: `<div class="categories">
  <h3>Product Categories</h3>
  <ul class="category-list">
    <li>Electronics</li>
    <li>Clothing</li>
    <li>Home & Kitchen</li>
    <li>Books</li>
  </ul>
</div>`,
    nested: `<div class="search-results">
  <div class="result-item">
    <h3 class="title">Smartphone X</h3>
    <p class="description">The latest smartphone with amazing features</p>
    <span class="price">$699.99</span>
    <div class="rating">4.5/5</div>
  </div>
  <div class="result-item">
    <h3 class="title">Laptop Pro</h3>
    <p class="description">Powerful laptop for professionals</p>
    <span class="price">$1,299.99</span>
    <div class="rating">4.8/5</div>
  </div>
</div>`,
  };

  // Load an example based on pattern type
  const loadExample = () => {
    setContent(exampleHtml[pattern.type] || exampleHtml.text);
    setContentType('raw');
  };

  // Run the pattern test
  const runTest = async () => {
    if (!content && contentType === 'raw') {
      alert('Please enter HTML content to test against');
      return;
    }

    if (!contentUrl && contentType === 'url') {
      alert('Please enter a URL to test against');
      return;
    }

    setIsRunningTest(true);
    setTestResult(null);

    try {
      // For a real implementation, you would fetch content from the URL first
      // Here we're just using the raw content for demonstration
      const testContent = contentType === 'raw' ? content : `<p>Content would be fetched from ${contentUrl}</p>`;
      const result = await onRunTest(pattern, testContent);
      setTestResult(result);
    } catch (error) {
      console.error('Error running pattern test:', error);
      setTestResult({
        patternId: pattern.id,
        success: false,
        matches: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: 0,
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  // Format the execution time
  const formatExecutionTime = (ms: number): string => {
    if (ms < 1) {
      return 'Less than 1ms';
    } else if (ms < 1000) {
      return `${ms.toFixed(2)}ms`;
    } else {
      return `${(ms / 1000).toFixed(2)}s`;
    }
  };

  // Toggle between raw content and URL
  const handleContentTypeChange = (type: 'raw' | 'url') => {
    setContentType(type);
    setTestResult(null);
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
          Test Pattern
        </h3>

        <div className="space-y-4">
          {/* Content Type Selector */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="content-type-raw"
                type="radio"
                name="content-type"
                checked={contentType === 'raw'}
                onChange={() => handleContentTypeChange('raw')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="content-type-raw" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Raw HTML
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="content-type-url"
                type="radio"
                name="content-type"
                checked={contentType === 'url'}
                onChange={() => handleContentTypeChange('url')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="content-type-url" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                URL (Preview Only)
              </label>
            </div>
          </div>

          {/* Test Input - Content or URL */}
          {contentType === 'raw' ? (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="test-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  HTML Content to Test Against
                </label>
                <button
                  type="button"
                  onClick={loadExample}
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Load Example
                </button>
              </div>
              <textarea
                id="test-content"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Paste HTML content to test your pattern against"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="content-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL to Test Against (Preview Only)
              </label>
              <input
                id="content-url"
                type="url"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://example.com"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Note: In this preview, actual URL content extraction is simulated. In a production environment, the application would fetch and parse the provided URL.
              </p>
            </div>
          )}

          {/* Run Test Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={runTest}
              disabled={isRunningTest || (contentType === 'raw' && !content) || (contentType === 'url' && !contentUrl)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              {isRunningTest ? (
                <>
                  <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Running Test...
                </>
              ) : (
                <>
                  <PlayIcon className="-ml-1 mr-2 h-4 w-4" />
                  Run Test
                </>
              )}
            </button>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Results
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Execution time: {formatExecutionTime(testResult.executionTime)}
                </span>
              </div>

              {testResult.error ? (
                <div className="p-4 bg-red-50 rounded-md dark:bg-red-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon className="h-5 w-5 text-red-400 dark:text-red-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error running pattern</h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        <p>{testResult.error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : testResult.matches.length === 0 ? (
                <div className="p-4 bg-yellow-50 rounded-md dark:bg-yellow-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-5 w-5 text-yellow-400 dark:text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">No matches found</h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                        <p>The pattern did not find any matches in the provided content.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1.5 dark:text-green-400" />
                    <span className="font-medium text-sm text-green-700 dark:text-green-300">
                      {testResult.matches.length} match{testResult.matches.length !== 1 ? 'es' : ''} found
                    </span>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-750">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            Content
                          </th>
                          {testResult.matches.some(m => m.path) && (
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                              Path
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {testResult.matches.map((match, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-pre-wrap text-sm text-gray-700 font-mono dark:text-gray-300">
                              {match.content}
                            </td>
                            {testResult.matches.some(m => m.path) && (
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {match.path || '-'}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tips for Pattern Testing */}
          <div className="mt-4 p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1 text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium">Tips for Testing</p>
                <ul className="mt-1 list-disc list-inside text-xs space-y-1">
                  <li>Use the browser's inspect tool to find the HTML structure of elements you want to extract</li>
                  <li>Start with a small sample of content before testing against larger pages</li>
                  <li>For complex extractions, break down the task into multiple patterns</li>
                  <li>Test your patterns against different examples to ensure robustness</li>
                  <li>Consider how website structure changes might affect your pattern</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternTesting;
