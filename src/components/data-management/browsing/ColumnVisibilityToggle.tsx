import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export interface ColumnDefinition {
  id: string;
  header: string;
  isVisible?: boolean;
  isPinned?: boolean;
  canHide?: boolean;
}

interface ColumnVisibilityToggleProps {
  columns: ColumnDefinition[];
  onChange: (updatedColumns: ColumnDefinition[]) => void;
  className?: string;
}

/**
 * A component for toggling the visibility of table columns
 * Allows users to customize which columns are displayed
 */
const ColumnVisibilityToggle: React.FC<ColumnVisibilityToggleProps> = ({
  columns,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (columnId: string) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          isVisible: !column.isVisible
        };
      }
      return column;
    });
    
    onChange(updatedColumns);
  };

  // Show all columns
  const showAllColumns = () => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      isVisible: true
    }));
    
    onChange(updatedColumns);
  };

  // Hide all non-essential columns
  const hideAllColumns = () => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      isVisible: column.isPinned || false
    }));
    
    onChange(updatedColumns);
  };

  // Count visible columns
  const visibleColumnsCount = columns.filter((col) => col.isVisible).length;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        <EyeIcon className="h-5 w-5 mr-1" aria-hidden="true" />
        <span>Columns ({visibleColumnsCount}/{columns.length})</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 dark:bg-gray-800 dark:ring-gray-700">
          <div className="p-2">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Column Visibility
              </span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={showAllColumns}
                  className="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Show All
                </button>
                <button
                  type="button"
                  onClick={hideAllColumns}
                  className="text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Hide All
                </button>
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {columns.map((column) => (
                <div 
                  key={column.id} 
                  className="flex items-center justify-between py-1.5 px-1 hover:bg-gray-50 rounded dark:hover:bg-gray-700"
                >
                  <label 
                    htmlFor={`column-${column.id}`}
                    className="text-sm text-gray-700 cursor-pointer flex-grow dark:text-gray-300"
                  >
                    {column.header}
                    {column.isPinned && (
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-500">(pinned)</span>
                    )}
                  </label>
                  <div className="ml-2">
                    <button
                      id={`column-${column.id}`}
                      onClick={() => toggleColumnVisibility(column.id)}
                      disabled={column.isPinned || column.canHide === false}
                      className={`p-1 rounded-full focus:outline-none focus:ring-1 focus:ring-primary-500
                        ${column.isVisible 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-gray-400 dark:text-gray-500'}
                        ${(column.isPinned || column.canHide === false) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                      `}
                    >
                      {column.isVisible ? (
                        <EyeIcon className="h-4 w-4" />
                      ) : (
                        <EyeSlashIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnVisibilityToggle;
