import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

interface DataTableProps {
  data: Record<string, any>[];
  columns?: {
    key: string;
    label: string;
    render?: (value: any, row: Record<string, any>) => React.ReactNode;
    sortable?: boolean;
    hidden?: boolean;
  }[];
  initialSortColumn?: string;
  initialSortDirection?: 'asc' | 'desc';
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: Record<string, any>) => void;
  className?: string;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns: propColumns,
  initialSortColumn,
  initialSortDirection = 'asc',
  pagination = true,
  pageSize = 10,
  onRowClick,
  className = '',
  emptyMessage = 'No data available'
}) => {
  // Generate columns automatically if not provided
  const columns = useMemo(() => {
    if (propColumns) return propColumns;
    
    if (data.length === 0) return [];
    
    // Get all unique keys from the data
    const allKeys = Array.from(
      new Set(data.flatMap(item => Object.keys(item)))
    );
    
    // Create columns from keys
    return allKeys.map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      sortable: true,
    }));
  }, [propColumns, data]);
  
  // States for sorting and pagination
  const [sortColumn, setSortColumn] = useState<string | null>(initialSortColumn || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);
  
  // Sort data based on current sort settings
  const sortedData = useMemo(() => {
    if (!sortColumn) return [...data];
    
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      // Handle nullish values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
      if (bValue == null) return sortDirection === 'asc' ? 1 : -1;
      
      // Compare values based on their types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // For other types, convert to string and compare
      const aStr = String(aValue);
      const bStr = String(bValue);
      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [data, sortColumn, sortDirection]);
  
  // Get paginated data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);
  
  // Total pages for pagination
  const totalPages = useMemo(() => {
    if (!pagination) return 1;
    return Math.max(1, Math.ceil(sortedData.length / pageSize));
  }, [sortedData, pagination, pageSize]);
  
  // Handle sort click
  const handleSortClick = (key: string) => {
    if (sortColumn === key) {
      // Toggle direction if already sorting by this column
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set new sort column and default to ascending
      setSortColumn(key);
      setSortDirection('asc');
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Get visible columns (not hidden)
  const visibleColumns = columns.filter(col => !col.hidden);
  
  return (
    <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={column.sortable ? () => handleSortClick(column.key) : undefined}
                >
                  <div className="flex items-center">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="ml-1">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowsUpDownIcon className="h-4 w-4 text-gray-300" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key] !== undefined && row[column.key] !== null
                        ? String(row[column.key])
                        : '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, sortedData.length)}
                </span>{' '}
                of <span className="font-medium">{sortedData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Logic to show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  // Add ellipsis
                  if (totalPages > 5) {
                    if (i === 0 && pageNum > 1) {
                      return (
                        <button
                          key="ellipsis-start"
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </button>
                      );
                    }
                    
                    if (i === 4 && pageNum < totalPages) {
                      return (
                        <button
                          key="ellipsis-end"
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </button>
                      );
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
