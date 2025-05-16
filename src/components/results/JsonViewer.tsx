import React, { useState, useMemo } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface JsonViewerProps {
  data: any;
  initialExpanded?: boolean;
  expandDepth?: number;
  className?: string;
  collapsible?: boolean;
  indentWidth?: number;
  copyable?: boolean;
}

type JsonValueType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  initialExpanded = false,
  expandDepth = 1,
  className = '',
  collapsible = true,
  indentWidth = 16,
  copyable = true,
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({});
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Copy to clipboard functionality
  const handleCopy = () => {
    try {
      const stringified = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(stringified);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Determine type of a value
  const getValueType = (value: any): JsonValueType => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return typeof value as JsonValueType;
  };

  // Format a value for display based on its type
  const formatValue = (value: any, valueType: JsonValueType): string => {
    switch (valueType) {
      case 'string':
        return `"${value}"`;
      case 'null':
        return 'null';
      default:
        return String(value);
    }
  };

  // Get color class based on value type
  const getValueColor = (valueType: JsonValueType): string => {
    switch (valueType) {
      case 'string':
        return 'text-green-600';
      case 'number':
        return 'text-blue-600';
      case 'boolean':
        return 'text-purple-600';
      case 'null':
        return 'text-gray-500';
      default:
        return 'text-gray-800';
    }
  };

  // Check if a path should be expanded
  const isExpanded = (path: string, depth: number): boolean => {
    if (path in expandedPaths) {
      return expandedPaths[path];
    }
    return depth <= expandDepth || initialExpanded;
  };

  // Toggle expanded state for a path
  const toggleExpand = (path: string) => {
    setExpandedPaths(prev => ({
      ...prev,
      [path]: !(path in prev ? prev[path] : isExpanded(path, 0)),
    }));
  };

  // Recursive component to render JSON nodes
  const JsonNode: React.FC<{
    data: any;
    path: string;
    depth: number;
    indentLevel: number;
  }> = ({ data, path, depth, indentLevel }) => {
    const valueType = getValueType(data);
    const expanded = isExpanded(path, depth);
    
    // Simple value node (string, number, boolean, null)
    if (!['object', 'array'].includes(valueType)) {
      return (
        <span className={getValueColor(valueType)}>
          {formatValue(data, valueType)}
        </span>
      );
    }
    
    // Empty object or array
    if (
      (valueType === 'object' && Object.keys(data).length === 0) ||
      (valueType === 'array' && data.length === 0)
    ) {
      return (
        <span className="text-gray-500">
          {valueType === 'object' ? '{}' : '[]'}
        </span>
      );
    }
    
    // Object or array with content
    const isArray = valueType === 'array';
    const keys = isArray ? Array.from({ length: data.length }, (_, i) => i) : Object.keys(data);
    
    return (
      <>
        <span className="inline-flex items-center">
          {collapsible && (
            <button
              onClick={() => toggleExpand(path)}
              className="mr-1 focus:outline-none text-gray-500 hover:text-gray-700"
            >
              {expanded ? (
                <ChevronDownIcon className="h-3 w-3" />
              ) : (
                <ChevronRightIcon className="h-3 w-3" />
              )}
            </button>
          )}
          <span>{isArray ? '[' : '{'}</span>
          {!expanded && (
            <span className="text-gray-500 ml-1">
              {isArray ? `${keys.length} items` : `${keys.length} properties`}
            </span>
          )}
          {!expanded && <span>{isArray ? ']' : '}'}</span>}
        </span>
        
        {expanded && (
          <>
            <ul className="mt-1 ml-0 list-none">
              {keys.map((key, index) => (
                <li
                  key={`${path}-${key}`}
                  className="leading-normal"
                  style={{ paddingLeft: `${indentLevel * indentWidth}px` }}
                >
                  <span className="inline-flex items-center">
                    {!isArray && (
                      <>
                        <span className="text-purple-600 mr-1">"{key}":</span>{' '}
                      </>
                    )}
                    {isArray && <span className="text-gray-500 mr-1">{key}:</span>}
                    <JsonNode
                      data={data[key]}
                      path={`${path}.${key}`}
                      depth={depth + 1}
                      indentLevel={indentLevel + 1}
                    />
                    {index < keys.length - 1 && <span>,</span>}
                  </span>
                </li>
              ))}
            </ul>
            <div style={{ paddingLeft: `${(indentLevel - 1) * indentWidth}px` }}>
              {isArray ? ']' : '}'}
            </div>
          </>
        )}
      </>
    );
  };

  // Generate a string representation of the data for the pre tag
  const jsonString = useMemo(() => {
    try {
      if (typeof data === 'string') {
        try {
          // Try to parse if it's a JSON string
          const parsed = JSON.parse(data);
          return parsed;
        } catch {
          return data;
        }
      }
      return data;
    } catch (error) {
      console.error('Error processing JSON data:', error);
      return null;
    }
  }, [data]);

  // If data is invalid
  if (jsonString === null) {
    return <div className="text-red-500">Invalid JSON data</div>;
  }

  return (
    <div className={`font-mono text-sm bg-gray-50 rounded-lg shadow p-4 ${className}`}>
      {copyable && (
        <div className="flex justify-end mb-2">
          <button
            onClick={handleCopy}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="overflow-auto">
        <code>
          <JsonNode
            data={jsonString}
            path="root"
            depth={1}
            indentLevel={1}
          />
        </code>
      </pre>
    </div>
  );
};

export default JsonViewer;
