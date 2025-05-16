import React, { useState, useEffect, useMemo } from 'react';
import { XMarkIcon, AdjustmentsHorizontalIcon, PlusIcon } from '@heroicons/react/24/outline';

export type FilterOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'notContains' 
  | 'startsWith' 
  | 'endsWith'
  | 'greaterThan' 
  | 'lessThan' 
  | 'between' 
  | 'exists' 
  | 'notExists';

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  value2?: any; // For 'between' operator
}

export interface DataFilterProps {
  data: Record<string, any>[];
  fields?: string[];
  onFilterChange: (filteredData: Record<string, any>[]) => void;
  className?: string;
  initialFilters?: FilterCondition[];
  allowSaving?: boolean;
  presetFilters?: Array<{
    name: string;
    conditions: FilterCondition[];
  }>;
}

// Operators with their display names and applicable data types
const OPERATORS = [
  { value: 'equals', display: 'Equals', types: ['string', 'number', 'boolean'] },
  { value: 'notEquals', display: 'Not Equals', types: ['string', 'number', 'boolean'] },
  { value: 'contains', display: 'Contains', types: ['string'] },
  { value: 'notContains', display: 'Not Contains', types: ['string'] },
  { value: 'startsWith', display: 'Starts With', types: ['string'] },
  { value: 'endsWith', display: 'Ends With', types: ['string'] },
  { value: 'greaterThan', display: 'Greater Than', types: ['number'] },
  { value: 'lessThan', display: 'Less Than', types: ['number'] },
  { value: 'between', display: 'Between', types: ['number'] },
  { value: 'exists', display: 'Exists', types: ['any'] },
  { value: 'notExists', display: 'Not Exists', types: ['any'] },
];

const DataFilter: React.FC<DataFilterProps> = ({
  data,
  fields: propFields,
  onFilterChange,
  className = '',
  initialFilters = [],
  allowSaving = false,
  presetFilters = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>(initialFilters);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Generate fields automatically if not provided
  const fields = useMemo(() => {
    if (propFields) return propFields;
    
    if (data.length === 0) return [];
    
    // Get all unique fields from the data
    const allFields = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        allFields.add(key);
      });
    });
    
    return Array.from(allFields);
  }, [propFields, data]);

  // Detect field types based on data
  const fieldTypes = useMemo(() => {
    const types: Record<string, string> = {};
    
    fields.forEach(field => {
      // Find the first non-null value for this field
      const sampleValue = data.find(item => item[field] !== null && item[field] !== undefined)?.[field];
      
      if (sampleValue === undefined) {
        types[field] = 'any';
      } else {
        types[field] = typeof sampleValue;
      }
    });
    
    return types;
  }, [fields, data]);

  // Apply filters whenever conditions change
  useEffect(() => {
    const filteredData = applyFilters(data, filterConditions);
    onFilterChange(filteredData);
  }, [filterConditions, data, onFilterChange]);

  // Apply all filter conditions to the data
  const applyFilters = (
    data: Record<string, any>[], 
    conditions: FilterCondition[]
  ): Record<string, any>[] => {
    if (conditions.length === 0) return data;
    
    return data.filter(item => {
      // Item passes if it matches ALL conditions (AND logic)
      return conditions.every(condition => {
        const { field, operator, value, value2 } = condition;
        const itemValue = item[field];
        
        // Handle non-existent values
        if (itemValue === undefined || itemValue === null) {
          if (operator === 'exists') return false;
          if (operator === 'notExists') return true;
          return false;
        }
        
        // Apply operator logic
        switch (operator) {
          case 'equals':
            return itemValue == value; // loose equality to handle string/number conversions
          case 'notEquals':
            return itemValue != value;
          case 'contains':
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          case 'notContains':
            return !String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          case 'startsWith':
            return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase());
          case 'endsWith':
            return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase());
          case 'greaterThan':
            return Number(itemValue) > Number(value);
          case 'lessThan':
            return Number(itemValue) < Number(value);
          case 'between':
            return Number(itemValue) >= Number(value) && Number(itemValue) <= Number(value2);
          case 'exists':
            return true; // Already checked above
          case 'notExists':
            return false; // Already checked above
          default:
            return true;
        }
      });
    });
  };

  // Add a new filter condition
  const addFilterCondition = () => {
    // Create default condition using the first available field
    const newCondition: FilterCondition = {
      id: `filter_${Date.now()}`,
      field: fields[0] || '',
      operator: 'equals',
      value: '',
    };
    
    setFilterConditions([...filterConditions, newCondition]);
    setActivePreset(null); // Clear active preset when manually adding
  };

  // Update a filter condition
  const updateFilterCondition = (id: string, updates: Partial<FilterCondition>) => {
    setFilterConditions(prev => 
      prev.map(condition => 
        condition.id === id 
          ? { ...condition, ...updates } 
          : condition
      )
    );
    setActivePreset(null); // Clear active preset when manually updating
  };

  // Remove a filter condition
  const removeFilterCondition = (id: string) => {
    setFilterConditions(prev => prev.filter(condition => condition.id !== id));
    setActivePreset(null); // Clear active preset when manually removing
  };

  // Clear all filter conditions
  const clearFilters = () => {
    setFilterConditions([]);
    setActivePreset(null);
  };

  // Apply a preset filter
  const applyPreset = (presetName: string) => {
    const preset = presetFilters.find(p => p.name === presetName);
    if (preset) {
      // Clone the preset conditions and assign new IDs
      const conditions = preset.conditions.map(condition => ({
        ...condition,
        id: `filter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      }));
      
      setFilterConditions(conditions);
      setActivePreset(presetName);
    }
  };

  // Get applicable operators for a field
  const getOperatorsForField = (fieldName: string): { value: FilterOperator; display: string }[] => {
    const fieldType = fieldTypes[fieldName] || 'any';
    
    return OPERATORS
      .filter(op => op.types.includes(fieldType) || op.types.includes('any'))
      .map(op => ({ value: op.value as FilterOperator, display: op.display }));
  };

  // Save current filters as a preset (would need to be implemented with backend support)
  const saveCurrentFilters = () => {
    const presetName = prompt('Enter a name for this filter preset:');
    if (presetName && presetName.trim()) {
      alert(`Filter preset "${presetName}" would be saved to the backend.`);
      // In a real implementation, you would save this to your backend
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div
        className="p-4 border-b flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium">
            Filter Data
            {filterConditions.length > 0 && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full">
                {filterConditions.length}
              </span>
            )}
          </h3>
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transform transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {expanded && (
        <div className="p-4">
          {/* Preset filters */}
          {presetFilters.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preset Filters
              </label>
              <div className="flex flex-wrap gap-2">
                {presetFilters.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.name)}
                    className={`text-sm px-3 py-1 rounded-full ${
                      activePreset === preset.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter conditions */}
          {filterConditions.map(condition => (
            <div
              key={condition.id}
              className="mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex flex-wrap md:flex-nowrap gap-2">
                {/* Field select */}
                <div className="w-full md:w-1/4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Field
                  </label>
                  <select
                    value={condition.field}
                    onChange={e =>
                      updateFilterCondition(condition.id, { field: e.target.value })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fields.map(field => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Operator select */}
                <div className="w-full md:w-1/4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Operator
                  </label>
                  <select
                    value={condition.operator}
                    onChange={e =>
                      updateFilterCondition(condition.id, {
                        operator: e.target.value as FilterOperator,
                      })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {getOperatorsForField(condition.field).map(op => (
                      <option key={op.value} value={op.value}>
                        {op.display}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Value input(s) */}
                {condition.operator !== 'exists' && condition.operator !== 'notExists' && (
                  <div className={`w-full ${condition.operator === 'between' ? 'md:w-1/3' : 'md:w-1/2'}`}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Value
                    </label>
                    <input
                      type={fieldTypes[condition.field] === 'number' ? 'number' : 'text'}
                      value={condition.value}
                      onChange={e =>
                        updateFilterCondition(condition.id, {
                          value: fieldTypes[condition.field] === 'number'
                            ? Number(e.target.value)
                            : e.target.value,
                        })
                      }
                      className="block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Second value input for 'between' operator */}
                {condition.operator === 'between' && (
                  <div className="w-full md:w-1/3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      To Value
                    </label>
                    <input
                      type="number"
                      value={condition.value2 || ''}
                      onChange={e =>
                        updateFilterCondition(condition.id, {
                          value2: Number(e.target.value),
                        })
                      }
                      className="block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Remove button */}
                <div className="flex items-end pb-1">
                  <button
                    onClick={() => removeFilterCondition(condition.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove condition"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex justify-between mt-3">
            <div>
              <button
                onClick={addFilterCondition}
                className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm font-medium transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Filter
              </button>
            </div>
            <div className="space-x-2">
              {allowSaving && filterConditions.length > 0 && (
                <button
                  onClick={saveCurrentFilters}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm transition-colors"
                >
                  Save Filter
                </button>
              )}
              {filterConditions.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFilter;
