import React, { useState, useEffect, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Column, useTable, useSortBy, useFilters } from '@tanstack/react-table';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface VirtualizedDataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  height?: number;
  rowHeight?: number;
  className?: string;
  onRowClick?: (row: T) => void;
  selectedRowId?: string | number;
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * A high-performance data table component with virtualization for handling large datasets
 * Uses react-virtual for virtualization and react-table for features like sorting and filtering
 */
export function VirtualizedDataTable<T extends object>({
  data,
  columns,
  height = 600,
  rowHeight = 40,
  className = '',
  onRowClick,
  selectedRowId,
  isLoading = false,
  emptyMessage = 'No data available'
}: VirtualizedDataTableProps<T>) {
  // State for tracking container element
  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);
  
  // Set up react-table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: tableState,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy
  );

  // Set up row virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef,
    estimateSize: () => rowHeight,
    overscan: 10,
  });

  // Calculate total list height
  const totalHeight = rows.length * rowHeight;
  
  // Get virtualized rows
  const virtualRows = useMemo(
    () => rowVirtualizer.getVirtualItems(),
    [rowVirtualizer, rows.length]
  );

  // Ensure we prepare all rows that might be rendered
  useEffect(() => {
    virtualRows.forEach(virtualRow => {
      const row = rows[virtualRow.index];
      if (row) prepareRow(row);
    });
  }, [prepareRow, rows, virtualRows]);

  // Rendering loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Rendering empty state
  if (!isLoading && rows.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-32 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <div className="overflow-hidden">
        <div
          ref={setParentRef}
          style={{ height, overflowY: 'auto' }}
          className="relative rounded-lg bg-white dark:bg-gray-800"
        >
          <table
            {...getTableProps()}
            className="w-full border-separate border-spacing-0"
            style={{ borderCollapse: 'separate' }}
          >
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} className="group">
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.render('Header')}</span>
                        <span className="inline-block w-4">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ArrowDownIcon className="h-3 w-3" />
                            ) : (
                              <ArrowUpIcon className="h-3 w-3" />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody
              {...getTableBodyProps()}
              className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
            >
              {/* Spacer to push content down to the correct scroll position */}
              {virtualRows.length > 0 && (
                <tr>
                  <td style={{ height: virtualRows[0].start }} />
                </tr>
              )}

              {/* The virtualized rows */}
              {virtualRows.map(virtualRow => {
                const row = rows[virtualRow.index];
                const isSelected = selectedRowId !== undefined && 
                  'id' in row.original && 
                  row.original.id === selectedRowId;
                
                return (
                  <tr
                    key={virtualRow.index}
                    {...row.getRowProps()}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={`
                      hover:bg-gray-50 dark:hover:bg-gray-700 
                      ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                      ${onRowClick ? 'cursor-pointer' : ''}
                    `}
                    style={{
                      height: `${rowHeight}px`,
                    }}
                  >
                    {row.cells.map(cell => (
                      <td
                        {...cell.getCellProps()}
                        className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Spacer to take up remaining space */}
              {virtualRows.length > 0 && (
                <tr>
                  <td
                    style={{
                      height: rows.length * rowHeight - virtualRows[virtualRows.length - 1].end,
                    }}
                  />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VirtualizedDataTable;
