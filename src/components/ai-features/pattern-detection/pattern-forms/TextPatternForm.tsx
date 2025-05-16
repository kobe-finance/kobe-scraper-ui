import React from 'react';
import { TextPattern } from '../types';

interface TextPatternFormProps {
  pattern: TextPattern;
  onChange: (updates: Partial<TextPattern>) => void;
  errors: Record<string, string>;
}

/**
 * Form component for configuring text-based pattern extraction
 * Allows setting text content to match and matching options
 */
const TextPatternForm: React.FC<TextPatternFormProps> = ({
  pattern,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Text to Match
        </label>
        <div className="mt-1">
          <textarea
            id="text-content"
            rows={3}
            value={pattern.content}
            onChange={(e) => onChange({ content: e.target.value })}
            className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
              errors.content ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter the exact text content to match"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter the exact text you want to find on the page
        </p>
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="case-sensitive"
              type="checkbox"
              checked={pattern.isCaseSensitive}
              onChange={(e) => onChange({ isCaseSensitive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="case-sensitive" className="font-medium text-gray-700 dark:text-gray-300">
              Case Sensitive
            </label>
            <p className="text-gray-500 dark:text-gray-400">
              Match exact letter casing
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="whole-word"
              type="checkbox"
              checked={pattern.isWholeWord}
              onChange={(e) => onChange({ isWholeWord: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="whole-word" className="font-medium text-gray-700 dark:text-gray-300">
              Whole Word
            </label>
            <p className="text-gray-500 dark:text-gray-400">
              Match only complete words
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 text-sm text-blue-700 dark:text-blue-300">
            <p>
              Text patterns are good for finding specific content like product prices, titles, or error messages.
              For more flexibility, consider using a Regex pattern instead.
            </p>
          </div>
        </div>
      </div>
      
      {/* Text pattern example */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Example</h4>
        <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-700 dark:bg-gray-750 dark:text-gray-300">
          <p className="mb-2">This pattern will match:</p>
          <div className="p-2 bg-white rounded border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <span className="font-mono text-sm bg-yellow-100 px-1 dark:bg-yellow-900/30">
              {pattern.content || 'Enter text to see example'}
            </span>
          </div>
          {pattern.content && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              With {pattern.isCaseSensitive ? 'case-sensitive' : 'case-insensitive'} matching
              {pattern.isWholeWord ? ' and whole word matching' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextPatternForm;
