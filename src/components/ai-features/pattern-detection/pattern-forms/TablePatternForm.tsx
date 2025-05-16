import React from 'react';
import { TablePattern } from '../types';

interface TablePatternFormProps {
  pattern: TablePattern;
  onChange: (updates: Partial<TablePattern>) => void;
  errors: Record<string, string>;
}

/**
 * Form component for configuring table-based pattern extraction
 * Allows defining how to extract data from HTML tables
 */
const TablePatternForm: React.FC<TablePatternFormProps> = ({
  pattern,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="table-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Table Selector
        </label>
        <div className="mt-1">
          <input
            id="table-selector"
            type="text"
            value={pattern.tableSelector}
            onChange={(e) => onChange({ tableSelector: e.target.value })}
            className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:text-white ${
              errors.tableSelector ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g. table, .product-table, #price-list"
          />
          {errors.tableSelector && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tableSelector}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          CSS selector to identify the table(s) to extract
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="header-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Header Selector <span className="text-gray-500 dark:text-gray-400">(optional)</span>
          </label>
          <div className="mt-1">
            <input
              id="header-selector"
              type="text"
              value={pattern.headerSelector || ''}
              onChange={(e) => onChange({ headerSelector: e.target.value || undefined })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g. thead tr, tr:first-child"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            CSS selector for table headers (relative to table)
          </p>
        </div>
        
        <div>
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="include-headers"
                type="checkbox"
                checked={pattern.includeHeaders}
                onChange={(e) => onChange({ includeHeaders: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="include-headers" className="font-medium text-gray-700 dark:text-gray-300">
                Include Headers
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Include header row(s) in extracted data
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="row-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Row Selector
          </label>
          <div className="mt-1">
            <input
              id="row-selector"
              type="text"
              value={pattern.rowSelector}
              onChange={(e) => onChange({ rowSelector: e.target.value })}
              className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:text-white ${
                errors.rowSelector ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g. tr, tbody > tr"
            />
            {errors.rowSelector && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rowSelector}</p>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            CSS selector for table rows (relative to table)
          </p>
        </div>
        
        <div>
          <label htmlFor="cell-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cell Selector
          </label>
          <div className="mt-1">
            <input
              id="cell-selector"
              type="text"
              value={pattern.cellSelector}
              onChange={(e) => onChange({ cellSelector: e.target.value })}
              className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:text-white ${
                errors.cellSelector ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="e.g. td, th, td, th"
            />
            {errors.cellSelector && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cellSelector}</p>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            CSS selector for table cells (relative to row)
          </p>
        </div>
      </div>

      {/* Table extraction explanation and examples */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 text-sm text-blue-700 dark:text-blue-300">
            <p>
              This pattern will extract tabular data from all tables matching{' '}
              <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">
                {pattern.tableSelector || 'table'}
              </code>.
            </p>
            <div className="mt-2">
              <p className="font-medium mb-1">Common table extraction patterns:</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li><strong>Standard HTML table:</strong> Table: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">table</code>, Rows: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">tr</code>, Cells: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">td, th</code></li>
                <li><strong>Table with separate header:</strong> Table: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">table</code>, Headers: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">thead tr</code>, Rows: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">tbody tr</code>, Cells: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">td</code></li>
                <li><strong>Table with first row as header:</strong> Table: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">table</code>, Headers: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">tr:first-child</code>, Rows: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">tr:not(:first-child)</code>, Cells: <code className="bg-blue-100 px-1 py-0.5 rounded-sm font-mono text-xs dark:bg-blue-900/50">td</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* HTML Table Structure Visualization */}
      <div className="mt-4">
        <details className="text-sm">
          <summary className="text-primary-600 cursor-pointer dark:text-primary-400">
            Table Structure Visualization
          </summary>
          
          <div className="mt-2 p-3 bg-gray-50 rounded-md dark:bg-gray-750">
            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
              This diagram shows how table patterns map to HTML table structure:
            </p>
            
            <div className="border border-gray-300 rounded dark:border-gray-600">
              <div className="bg-white p-3 font-mono text-xs text-gray-700 overflow-x-auto dark:bg-gray-800 dark:text-gray-300">
                <pre>{`<table class="product-table">  <!-- Table Selector -->
  <thead>                <!-- Header Selector (optional) -->
    <tr>
      <th>Product</th>    <!-- Cell Selector -->
      <th>Price</th>
      <th>Stock</th>
    </tr>
  </thead>
  <tbody>
    <tr>                 <!-- Row Selector -->
      <td>Laptop</td>     <!-- Cell Selector -->
      <td>$999</td>
      <td>In Stock</td>
    </tr>
    <tr>                 <!-- Row Selector -->
      <td>Keyboard</td>   <!-- Cell Selector -->
      <td>$49</td>
      <td>Low Stock</td>
    </tr>
  </tbody>
</table>`}</pre>
              </div>
            </div>
            
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">
              The table pattern extracts the data in a structured format, preserving rows and columns.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default TablePatternForm;
