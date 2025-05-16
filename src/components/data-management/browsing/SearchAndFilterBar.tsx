import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface FilterOption {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: string | number | boolean | Array<string | number> | null;
  label?: string;
}

interface SearchAndFilterBarProps {
  onSearch: (searchTerm: string) => void;
  onFilter: (filters: FilterOption[]) => void;
  filterOptions?: { field: string; label: string; type: 'text' | 'number' | 'boolean' | 'date' | 'select'; options?: string[] }[];
  activeFilters?: FilterOption[];
  className?: string;
  debounceMs?: number;
  placeholder?: string;
}

/**
 * A search and filter bar component for data browsing
 * Supports complex filtering with multiple conditions
 */
const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  onSearch,
  onFilter,
  filterOptions = [],
  activeFilters = [],
  className = '',
  debounceMs = 300,
  placeholder = 'Search...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOption[]>(activeFilters);
  const [newFilter, setNewFilter] = useState<{
    field: string;
    operator: FilterOption['operator'];
    value: string | number | boolean | null;
  }>({
    field: filterOptions[0]?.field || '',
    operator: 'equals',
    value: ''
  });

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceMs, onSearch]);

  // Apply filters
  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  // Handle adding a new filter
  const handleAddFilter = () => {
    if (!newFilter.field || newFilter.value === null || newFilter.value === '') return;
    
    const fieldOption = filterOptions.find(option => option.field === newFilter.field);
    const newFilterWithLabel = {
      ...newFilter,
      label: fieldOption?.label
    };
    
    setFilters([...filters, newFilterWithLabel as FilterOption]);
    
    // Reset new filter form
    setNewFilter({
      field: filterOptions[0]?.field || '',
      operator: 'equals',
      value: ''
    });
  };

  // Handle removing a filter
  const handleRemoveFilter = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters([]);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Search input */}
      <div className="flex items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
            </button>
          )}
        </div>
        
        {/* Filter toggle button */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="ml-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <FunnelIcon className={`h-5 w-5 ${filters.length > 0 ? 'text-primary-500' : 'text-gray-400'}`} aria-hidden="true" />
        </button>
        
        {/* Advanced filter button */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="ml-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
      
      {/* Filter panel */}
      {isFilterOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600 p-4 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
            
            {/* Clear all filters */}
            {filters.length > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear all
              </button>
            )}
          </div>
          
          {/* Active filters */}
          {filters.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active filters:</div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1"
                  >
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {filter.label || filter.field} {humanizeOperator(filter.operator)} {formatFilterValue(filter.value)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFilter(index)}
                      className="ml-2"
                    >
                      <XMarkIcon className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* New filter form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            {/* Field select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field</label>
              <select
                value={newFilter.field}
                onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {filterOptions.map((option) => (
                  <option key={option.field} value={option.field}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Operator select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Operator</label>
              <select
                value={newFilter.operator}
                onChange={(e) => setNewFilter({
                  ...newFilter,
                  operator: e.target.value as FilterOption['operator']
                })}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="startsWith">Starts with</option>
                <option value="endsWith">Ends with</option>
                <option value="greaterThan">Greater than</option>
                <option value="lessThan">Less than</option>
                <option value="between">Between</option>
                <option value="in">In list</option>
              </select>
            </div>
            
            {/* Value input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
              <input
                type="text"
                value={newFilter.value === null ? '' : String(newFilter.value)}
                onChange={(e) => setNewFilter({
                  ...newFilter,
                  value: e.target.value
                })}
                placeholder="Filter value..."
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          {/* Add filter button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddFilter}
              className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Add Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions

function humanizeOperator(operator: FilterOption['operator']): string {
  switch (operator) {
    case 'equals': return 'is';
    case 'contains': return 'contains';
    case 'startsWith': return 'starts with';
    case 'endsWith': return 'ends with';
    case 'greaterThan': return 'is greater than';
    case 'lessThan': return 'is less than';
    case 'between': return 'is between';
    case 'in': return 'is in';
    default: return '';
  }
}

function formatFilterValue(value: FilterOption['value']): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

export default SearchAndFilterBar;
