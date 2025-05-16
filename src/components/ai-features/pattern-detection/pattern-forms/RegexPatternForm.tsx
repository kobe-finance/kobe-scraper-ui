import React, { useState } from 'react';
import { RegexPattern } from '../types';

interface RegexPatternFormProps {
  pattern: RegexPattern;
  onChange: (updates: Partial<RegexPattern>) => void;
  errors: Record<string, string>;
}

/**
 * Form component for configuring regex-based pattern extraction
 * Provides tools for building and testing regular expressions
 */
const RegexPatternForm: React.FC<RegexPatternFormProps> = ({
  pattern,
  onChange,
  errors,
}) => {
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<Array<{
    match: string;
    index: number;
    groups?: Record<string, string>;
  }> | null>(null);

  // Available regex flags
  const availableFlags = [
    { key: 'g', label: 'Global', description: 'Find all matches' },
    { key: 'i', label: 'Case Insensitive', description: 'Ignore case' },
    { key: 'm', label: 'Multiline', description: 'Anchors work on each line' },
    { key: 's', label: 'DotAll', description: 'Dot matches newlines' },
    { key: 'u', label: 'Unicode', description: 'Unicode support' },
    { key: 'y', label: 'Sticky', description: 'Start at lastIndex' },
  ];

  // Toggle a flag in the pattern
  const toggleFlag = (flag: string) => {
    const currentFlags = pattern.flags;
    const newFlags = currentFlags.includes(flag)
      ? currentFlags.replace(flag, '')
      : currentFlags + flag;
    onChange({ flags: newFlags });
  };

  // Test the regex pattern against a sample input
  const testRegex = () => {
    if (!pattern.expression) {
      return;
    }

    try {
      const regex = new RegExp(pattern.expression, pattern.flags);
      const results: Array<{
        match: string;
        index: number;
        groups?: Record<string, string>;
      }> = [];

      if (pattern.flags.includes('g')) {
        // Global flag - find all matches
        let match;
        while ((match = regex.exec(testInput)) !== null) {
          const groups: Record<string, string> = {};
          
          // Extract named capture groups if any
          if (match.groups) {
            Object.keys(match.groups).forEach(key => {
              groups[key] = match.groups![key];
            });
          }
          
          results.push({
            match: match[0],
            index: match.index,
            groups: Object.keys(groups).length > 0 ? groups : undefined,
          });
          
          // Avoid infinite loops for zero-width matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // Non-global - find first match only
        const match = regex.exec(testInput);
        if (match) {
          const groups: Record<string, string> = {};
          
          // Extract named capture groups if any
          if (match.groups) {
            Object.keys(match.groups).forEach(key => {
              groups[key] = match.groups![key];
            });
          }
          
          results.push({
            match: match[0],
            index: match.index,
            groups: Object.keys(groups).length > 0 ? groups : undefined,
          });
        }
      }

      setTestResults(results);
    } catch (e) {
      // Handle regex syntax errors
      console.error('Invalid regex:', e);
      setTestResults([]);
    }
  };

  // Extract potential named groups from regex
  const extractNamedGroups = (expression: string): string[] => {
    const groups: string[] = [];
    try {
      // This is a simple regex to find named groups, but it's not perfect
      // A more robust solution would use a regex parser
      const namedGroupRegex = /\(\?<([^>]+)>/g;
      let match;
      while ((match = namedGroupRegex.exec(expression)) !== null) {
        groups.push(match[1]);
      }
    } catch (e) {
      console.error('Error extracting named groups:', e);
    }
    return groups;
  };

  // Update groups when expression changes
  const handleExpressionChange = (expression: string) => {
    const groups = extractNamedGroups(expression);
    onChange({ 
      expression,
      groups
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="regex-expression" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Regular Expression
        </label>
        <div className="mt-1">
          <input
            id="regex-expression"
            type="text"
            value={pattern.expression}
            onChange={(e) => handleExpressionChange(e.target.value)}
            className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:text-white ${
              errors.expression ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g. (\d+\.\d{2})"
          />
          {errors.expression && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expression}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter a regular expression pattern to match content
        </p>
      </div>

      {/* Regex flags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Flags
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {availableFlags.map((flag) => (
            <button
              key={flag.key}
              type="button"
              onClick={() => toggleFlag(flag.key)}
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                pattern.flags.includes(flag.key)
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
              title={flag.description}
            >
              {flag.label} ({flag.key})
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Current flags: {pattern.flags || 'none'}
        </p>
      </div>

      {/* Named capture groups */}
      {pattern.groups && pattern.groups.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Named Capture Groups
          </label>
          <div className="mt-1">
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
              {pattern.groups.map((group, index) => (
                <li key={index}>{group}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Regex tester */}
      <div className="p-3 border border-gray-200 rounded-md dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Test Your Regex
        </h4>
        <div className="space-y-3">
          <div>
            <label htmlFor="test-input" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Test Input
            </label>
            <div className="mt-1">
              <textarea
                id="test-input"
                rows={3}
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter text to test your regular expression against"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={testRegex}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
              disabled={!pattern.expression || !testInput}
            >
              Test Expression
            </button>
          </div>
          
          {testResults !== null && (
            <div className="mt-2">
              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Results ({testResults.length} {testResults.length === 1 ? 'match' : 'matches'})
              </h5>
              
              {testResults.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No matches found
                </p>
              ) : (
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Match
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Position
                        </th>
                        {testResults.some(r => r.groups) && (
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                            Groups
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
                      {testResults.map((result, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-mono dark:text-white">
                            {result.match}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                            {result.index}
                          </td>
                          {testResults.some(r => r.groups) && (
                            <td className="px-3 py-2 whitespace-nowrap text-xs font-mono dark:text-white">
                              {result.groups ? (
                                <div className="space-y-1">
                                  {Object.entries(result.groups).map(([name, value]) => (
                                    <div key={name}>
                                      <span className="text-green-600 dark:text-green-400">{name}:</span> {value}
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {testResults.length > 0 && testInput && (
                <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs dark:bg-gray-750">
                  <strong className="block mb-1 text-gray-700 dark:text-gray-300">Highlighted Matches:</strong>
                  <div className="font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                    {(() => {
                      let lastIndex = 0;
                      const parts = [];
                      
                      for (const result of testResults) {
                        if (result.index > lastIndex) {
                          parts.push(
                            <span key={`text-${lastIndex}`}>
                              {testInput.substring(lastIndex, result.index)}
                            </span>
                          );
                        }
                        
                        parts.push(
                          <span 
                            key={`match-${result.index}`}
                            className="bg-yellow-200 px-0.5 dark:bg-yellow-900/40"
                          >
                            {result.match}
                          </span>
                        );
                        
                        lastIndex = result.index + result.match.length;
                      }
                      
                      if (lastIndex < testInput.length) {
                        parts.push(
                          <span key={`text-${lastIndex}`}>
                            {testInput.substring(lastIndex)}
                          </span>
                        );
                      }
                      
                      return parts;
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Helpful regex examples */}
      <div className="mt-2">
        <details className="text-sm">
          <summary className="text-primary-600 cursor-pointer dark:text-primary-400">
            Common Regex Patterns
          </summary>
          <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs space-y-2 dark:bg-gray-750">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Price extraction:</p>
              <code className="text-xs bg-gray-100 p-1 rounded dark:bg-gray-700">
                \$\s*(\d+(?:\.\d{2})?)
              </code>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Email addresses:</p>
              <code className="text-xs bg-gray-100 p-1 rounded dark:bg-gray-700">
                [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
              </code>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">URLs:</p>
              <code className="text-xs bg-gray-100 p-1 rounded dark:bg-gray-700">
                https?://(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)
              </code>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Phone numbers:</p>
              <code className="text-xs bg-gray-100 p-1 rounded dark:bg-gray-700">
                (\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}
              </code>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Dates (MM/DD/YYYY):</p>
              <code className="text-xs bg-gray-100 p-1 rounded dark:bg-gray-700">
                (0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\d{4}
              </code>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default RegexPatternForm;
