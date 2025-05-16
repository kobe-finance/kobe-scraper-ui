import React, { useState, useMemo } from 'react';
import { DocumentDuplicateIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

interface DuplicateDetectionInterfaceProps {
  data: Record<string, any>[];
  onRemoveDuplicates: (duplicates: Record<string, any>[]) => void;
  onMergeDuplicates: (duplicateGroups: Record<string, any>[][]) => void;
  className?: string;
}

interface DuplicateGroup {
  key: string;
  records: Record<string, any>[];
  fields: string[];
  selected: boolean;
}

/**
 * Interface for detecting and managing duplicate data entries
 * Supports flexible matching criteria and batch operations on duplicates
 */
const DuplicateDetectionInterface: React.FC<DuplicateDetectionInterfaceProps> = ({
  data,
  onRemoveDuplicates,
  onMergeDuplicates,
  className = ''
}) => {
  const [matchingFields, setMatchingFields] = useState<string[]>([]);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(100);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(true);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Get all available fields from the data
  const availableFields = useMemo(() => {
    if (!data.length) return [];
    
    // Get a sample record and extract all fields
    const sample = data[0];
    return Object.keys(sample).filter(key => typeof sample[key] !== 'object');
  }, [data]);

  // Handle field selection
  const handleFieldToggle = (field: string) => {
    if (matchingFields.includes(field)) {
      setMatchingFields(matchingFields.filter(f => f !== field));
    } else {
      setMatchingFields([...matchingFields, field]);
    }
  };

  // Find duplicates based on current settings
  const findDuplicates = () => {
    if (!data.length || !matchingFields.length) return;
    
    setIsAnalyzing(true);
    
    // Group records by a compound key of the matching fields
    const groups: Record<string, Record<string, any>[]> = {};
    
    data.forEach(record => {
      // Create a key based on the matching fields
      let key = matchingFields.map(field => {
        let value = record[field];
        
        // Convert to string
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value !== 'string') {
          value = String(value);
        }
        
        // Apply case sensitivity setting
        if (!caseSensitive) {
          value = value.toLowerCase();
        }
        
        // Apply whitespace setting
        if (ignoreWhitespace) {
          value = value.trim().replace(/\s+/g, ' ');
        }
        
        return value;
      }).join('|');
      
      // Apply similarity threshold for fuzzy matching if less than 100%
      if (similarityThreshold < 100 && groups) {
        // Find a similar key if exists
        const similarKey = Object.keys(groups).find(existingKey => {
          const similarity = calculateStringSimilarity(key, existingKey);
          return similarity >= similarityThreshold / 100;
        });
        
        if (similarKey) {
          key = similarKey;
        }
      }
      
      // Add to appropriate group
      if (!groups[key]) {
        groups[key] = [];
      }
      
      groups[key].push(record);
    });
    
    // Filter to only groups with duplicates and convert to the format needed for state
    const duplicates = Object.entries(groups)
      .filter(([_, records]) => records.length > 1)
      .map(([key, records]) => ({
        key,
        records,
        fields: matchingFields,
        selected: false
      }));
    
    setDuplicateGroups(duplicates);
    setIsAnalyzing(false);
  };

  // Toggle selection for a duplicate group
  const toggleGroupSelection = (index: number) => {
    const updatedGroups = [...duplicateGroups];
    updatedGroups[index] = {
      ...updatedGroups[index],
      selected: !updatedGroups[index].selected
    };
    setDuplicateGroups(updatedGroups);
  };

  // Toggle selection for all groups
  const toggleSelectAll = () => {
    const allSelected = duplicateGroups.every(group => group.selected);
    const updatedGroups = duplicateGroups.map(group => ({
      ...group,
      selected: !allSelected
    }));
    setDuplicateGroups(updatedGroups);
  };

  // Handle removing duplicates
  const handleRemoveDuplicates = () => {
    const selectedGroups = duplicateGroups.filter(group => group.selected);
    if (!selectedGroups.length) return;
    
    const duplicatesToRemove: Record<string, any>[] = [];
    
    selectedGroups.forEach(group => {
      // Keep the first record, mark the rest as duplicates
      const [keeper, ...duplicates] = group.records;
      duplicatesToRemove.push(...duplicates);
    });
    
    onRemoveDuplicates(duplicatesToRemove);
    
    // Update duplicate groups
    const updatedGroups = duplicateGroups.filter(group => !group.selected);
    setDuplicateGroups(updatedGroups);
  };

  // Handle merging duplicates
  const handleMergeDuplicates = () => {
    const selectedGroups = duplicateGroups.filter(group => group.selected);
    if (!selectedGroups.length) return;
    
    const groupsToMerge = selectedGroups.map(group => group.records);
    
    onMergeDuplicates(groupsToMerge);
    
    // Update duplicate groups
    const updatedGroups = duplicateGroups.filter(group => !group.selected);
    setDuplicateGroups(updatedGroups);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Duplicate Detection</h2>
        
        <div className="space-y-4">
          {/* Field selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Match records based on these fields:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableFields.map((field) => (
                <div key={field} className="flex items-center">
                  <input
                    id={`field-${field}`}
                    type="checkbox"
                    checked={matchingFields.includes(field)}
                    onChange={() => handleFieldToggle(field)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                  />
                  <label
                    htmlFor={`field-${field}`}
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300 truncate"
                  >
                    {field}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Matching options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Similarity Threshold: {similarityThreshold}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Fuzzy (50%)</span>
                <span>Exact (100%)</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="case-sensitive"
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                />
                <label
                  htmlFor="case-sensitive"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Case sensitive matching
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="ignore-whitespace"
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                />
                <label
                  htmlFor="ignore-whitespace"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Ignore whitespace differences
                </label>
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                type="button"
                onClick={findDuplicates}
                disabled={isAnalyzing || matchingFields.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                    Find Duplicates
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results */}
      {duplicateGroups.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Found {duplicateGroups.length} duplicate groups
            </h3>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                {duplicateGroups.every(group => group.selected) 
                  ? 'Deselect All' 
                  : 'Select All'
                }
              </button>
              
              <button
                type="button"
                onClick={handleRemoveDuplicates}
                disabled={!duplicateGroups.some(group => group.selected)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-700 dark:hover:bg-red-600"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Remove Duplicates
              </button>
              
              <button
                type="button"
                onClick={handleMergeDuplicates}
                disabled={!duplicateGroups.some(group => group.selected)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-700 dark:hover:bg-green-600"
              >
                <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                Merge Duplicates
              </button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {duplicateGroups.map((group, index) => (
              <div
                key={group.key}
                className={`border rounded-lg p-4 ${
                  group.selected 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <input
                      id={`group-${index}`}
                      type="checkbox"
                      checked={group.selected}
                      onChange={() => toggleGroupSelection(index)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                    />
                    <label
                      htmlFor={`group-${index}`}
                      className="ml-2 block font-medium text-gray-900 dark:text-white"
                    >
                      Duplicate Group #{index + 1}
                    </label>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      ({group.records.length} items)
                    </span>
                  </div>
                  
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Matching on: {group.fields.join(', ')}
                  </span>
                </div>
                
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {Object.keys(group.records[0]).slice(0, 5).map((field) => (
                          <th
                            key={field}
                            scope="col"
                            className={`px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 ${
                              group.fields.includes(field)
                                ? 'bg-yellow-50 dark:bg-yellow-900/20'
                                : ''
                            }`}
                          >
                            {field}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {group.records.map((record, recordIndex) => (
                        <tr key={recordIndex}>
                          {Object.entries(record).slice(0, 5).map(([field, value]) => (
                            <td
                              key={field}
                              className={`px-3 py-2 text-sm text-gray-700 dark:text-gray-300 ${
                                group.fields.includes(field)
                                  ? 'bg-yellow-50 dark:bg-yellow-900/10'
                                  : ''
                              }`}
                            >
                              {formatValue(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions

function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value).slice(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '');
    } catch (error) {
      return 'Complex Object';
    }
  }
  
  return String(value);
}

function calculateStringSimilarity(strA: string, strB: string): number {
  if (strA === strB) return 1.0;
  if (strA.length === 0 || strB.length === 0) return 0.0;
  
  // Levenshtein distance
  const lenA = strA.length;
  const lenB = strB.length;
  
  const matrix: number[][] = [];
  
  // Initialize the matrix
  for (let i = 0; i <= lenA; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= lenB; j++) {
    matrix[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = strA[i - 1] === strB[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  // Calculate the similarity as a percentage (1.0 = 100% match)
  const maxLen = Math.max(lenA, lenB);
  return 1 - matrix[lenA][lenB] / maxLen;
}

export default DuplicateDetectionInterface;
