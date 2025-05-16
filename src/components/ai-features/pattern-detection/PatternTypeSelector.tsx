import React from 'react';
import { PatternType } from './types';

interface PatternTypeSelectorProps {
  selectedType: PatternType;
  onChange: (type: PatternType) => void;
  className?: string;
}

/**
 * Component for selecting the pattern type
 * Displays icons and labels for each available pattern type
 */
const PatternTypeSelector: React.FC<PatternTypeSelectorProps> = ({
  selectedType,
  onChange,
  className = '',
}) => {
  // All available pattern types with labels and descriptions
  const patternTypes: Array<{
    type: PatternType;
    label: string;
    description: string;
    icon: JSX.Element;
  }> = [
    {
      type: 'text',
      label: 'Text',
      description: 'Simple text matching',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      ),
    },
    {
      type: 'regex',
      label: 'Regex',
      description: 'Regular expression matching',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      type: 'css',
      label: 'CSS',
      description: 'CSS selector-based extraction',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
    },
    {
      type: 'xpath',
      label: 'XPath',
      description: 'XPath-based extraction',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      ),
    },
    {
      type: 'attribute',
      label: 'Attribute',
      description: 'Extract specific HTML attributes',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      type: 'table',
      label: 'Table',
      description: 'Extract tabular data',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      type: 'list',
      label: 'List',
      description: 'Extract lists of items',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      type: 'nested',
      label: 'Nested',
      description: 'Extract hierarchical data',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <select
          value={selectedType}
          onChange={(e) => onChange(e.target.value as PatternType)}
          className="block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {patternTypes.map((type) => (
            <option key={type.type} value={type.type}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Quick help text based on selected type */}
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {patternTypes.find((t) => t.type === selectedType)?.description || ''}
      </p>
      
      {/* Type Information Modal */}
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {patternTypes.map((type) => (
          <button
            key={type.type}
            type="button"
            onClick={() => onChange(type.type)}
            className={`flex flex-col items-center px-2 py-2 border rounded-md text-xs ${
              selectedType === type.type
                ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/20 dark:border-primary-700 dark:text-primary-400'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <span className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 text-gray-900 mb-1 dark:bg-gray-700 dark:text-gray-200">
              {type.icon}
            </span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatternTypeSelector;
