import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  ArrowPathIcon, 
  CodeBracketIcon, 
  DocumentTextIcon, 
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { TransformationNode as TransformationNodeType } from '../types';

/**
 * Transformation node component for modifying data
 * Supports different transformation types: map, filter, sort, etc.
 */
const TransformationNode: React.FC<NodeProps> = ({ data, isConnectable, selected }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Get icon based on transformation type
  const getTransformationIcon = () => {
    switch (data.transformationType) {
      case 'map':
        return <CodeBracketIcon className="h-5 w-5 text-green-500" />;
      case 'template':
        return <DocumentTextIcon className="h-5 w-5 text-green-500" />;
      case 'filter':
      case 'sort':
        return <AdjustmentsHorizontalIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ArrowPathIcon className="h-5 w-5 text-green-500" />;
    }
  };

  // Get display name for transformation type
  const getTransformationName = () => {
    switch (data.transformationType) {
      case 'map':
        return 'Map Function';
      case 'template':
        return 'Template';
      case 'filter':
        return 'Filter';
      case 'sort':
        return 'Sort';
      case 'format':
        return 'Format Data';
      case 'convert':
        return 'Convert Type';
      default:
        return 'Transform';
    }
  };

  // Handle change in transformation type
  const handleTransformationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    data.onNodeChange(data.id, {
      transformationType: newType,
      configuration: {},
    });
  };

  // Toggle config panel
  const toggleConfig = useCallback(() => {
    setIsConfigOpen(!isConfigOpen);
  }, [isConfigOpen]);

  return (
    <div 
      className={`relative rounded-lg p-3 w-64 border-2 ${
        selected 
          ? 'border-green-500 dark:border-green-600' 
          : 'border-green-200 dark:border-green-800'
      } bg-white dark:bg-gray-800 transition-colors shadow-sm hover:shadow`}
    >
      {/* Node header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-1.5 rounded-md bg-green-50 dark:bg-green-900/30 mr-2">
            {getTransformationIcon()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {data.name || 'Transform'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getTransformationName()}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleConfig}
          className="p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <svg
            className={`h-4 w-4 transition-transform ${isConfigOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Configuration panel */}
      {isConfigOpen && (
        <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
              Transformation Type
            </label>
            <select
              value={data.transformationType}
              onChange={handleTransformationTypeChange}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="map">Map Function</option>
              <option value="template">Template</option>
              <option value="filter">Filter</option>
              <option value="sort">Sort</option>
              <option value="format">Format Data</option>
              <option value="convert">Convert Type</option>
            </select>
          </div>

          {/* Render configuration based on transformation type */}
          {data.transformationType === 'map' && (
            <MapTransformConfig
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.transformationType === 'template' && (
            <TemplateTransformConfig
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.transformationType === 'filter' && (
            <FilterTransformConfig
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.transformationType === 'sort' && (
            <SortTransformConfig
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.transformationType === 'format' && (
            <FormatTransformConfig
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.transformationType === 'convert' && (
            <ConvertTransformConfig
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}
        </div>
      )}

      {/* Node description */}
      {data.description && !isConfigOpen && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {data.description}
        </div>
      )}

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: '#22c55e', width: '10px', height: '10px', border: '2px solid white' }}
        isConnectable={isConnectable}
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#22c55e', width: '10px', height: '10px', border: '2px solid white' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

// Map function transformation configuration component
interface MapTransformConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const MapTransformConfig: React.FC<MapTransformConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Input Field
        </label>
        <input
          type="text"
          value={config.inputField || ''}
          onChange={(e) => updateConfig('inputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Field to transform (leave empty for entire input)"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Output Field
        </label>
        <input
          type="text"
          value={config.outputField || ''}
          onChange={(e) => updateConfig('outputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Where to store result (leave empty to replace input)"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          JavaScript Code
        </label>
        <textarea
          value={config.code || '// item is the current value\n// index is the array index (if array)\n// return the transformed value\nreturn item;'}
          onChange={(e) => updateConfig('code', e.target.value)}
          rows={4}
          className="block w-full text-sm font-mono border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
};

// Template transformation configuration component
interface TemplateTransformConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const TemplateTransformConfig: React.FC<TemplateTransformConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Output Field
        </label>
        <input
          type="text"
          value={config.outputField || ''}
          onChange={(e) => updateConfig('outputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Where to store result"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Template
        </label>
        <textarea
          value={config.template || ''}
          onChange={(e) => updateConfig('template', e.target.value)}
          rows={4}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Use {{variable}} syntax to reference input fields"
        />
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
            Template Engine
          </label>
          <select
            value={config.engine || 'handlebars'}
            onChange={(e) => updateConfig('engine', e.target.value)}
            className="block w-32 text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="handlebars">Handlebars</option>
            <option value="mustache">Mustache</option>
            <option value="ejs">EJS</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Filter transformation configuration component
interface FilterTransformConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const FilterTransformConfig: React.FC<FilterTransformConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Input Array Field
        </label>
        <input
          type="text"
          value={config.inputField || ''}
          onChange={(e) => updateConfig('inputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Array field to filter"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Output Field
        </label>
        <input
          type="text"
          value={config.outputField || ''}
          onChange={(e) => updateConfig('outputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Where to store filtered array"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Filter Condition
        </label>
        <textarea
          value={config.condition || '// item is the current array element\n// index is the array index\n// array is the original array\nreturn true; // to keep the item'}
          onChange={(e) => updateConfig('condition', e.target.value)}
          rows={4}
          className="block w-full text-sm font-mono border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
};

// Sort transformation configuration component
interface SortTransformConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const SortTransformConfig: React.FC<SortTransformConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Input Array Field
        </label>
        <input
          type="text"
          value={config.inputField || ''}
          onChange={(e) => updateConfig('inputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Array field to sort"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Output Field
        </label>
        <input
          type="text"
          value={config.outputField || ''}
          onChange={(e) => updateConfig('outputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Where to store sorted array"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Sort By Field
        </label>
        <input
          type="text"
          value={config.sortField || ''}
          onChange={(e) => updateConfig('sortField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Field to sort by (leave empty for custom sort)"
        />
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
            Sort Direction
          </label>
          <select
            value={config.direction || 'asc'}
            onChange={(e) => updateConfig('direction', e.target.value)}
            className="block w-32 text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {!config.sortField && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
            Custom Sort Function
          </label>
          <textarea
            value={config.customSort || '// a and b are elements to compare\n// return negative if a < b\n// return positive if a > b\n// return 0 if equal\nreturn a - b;'}
            onChange={(e) => updateConfig('customSort', e.target.value)}
            rows={4}
            className="block w-full text-sm font-mono border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      )}
    </div>
  );
};

// Format data transformation configuration component
interface FormatTransformConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const FormatTransformConfig: React.FC<FormatTransformConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const formatOptions = [
    { value: 'date', label: 'Date/Time' },
    { value: 'number', label: 'Number' },
    { value: 'string', label: 'String' },
    { value: 'json', label: 'JSON' },
  ];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Input Field
        </label>
        <input
          type="text"
          value={config.inputField || ''}
          onChange={(e) => updateConfig('inputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Field to format"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Output Field
        </label>
        <input
          type="text"
          value={config.outputField || ''}
          onChange={(e) => updateConfig('outputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Where to store formatted value"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Format Type
        </label>
        <select
          value={config.formatType || 'date'}
          onChange={(e) => updateConfig('formatType', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {formatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {config.formatType === 'date' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
            Date Format
          </label>
          <input
            type="text"
            value={config.dateFormat || 'YYYY-MM-DD'}
            onChange={(e) => updateConfig('dateFormat', e.target.value)}
            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="YYYY-MM-DD HH:mm:ss"
          />
        </div>
      )}

      {config.formatType === 'number' && (
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
              Decimal Places
            </label>
            <input
              type="number"
              value={config.decimalPlaces || 2}
              onChange={(e) => updateConfig('decimalPlaces', parseInt(e.target.value))}
              min="0"
              max="20"
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useThousandsSeparator"
              checked={config.useThousandsSeparator || false}
              onChange={(e) => updateConfig('useThousandsSeparator', e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="useThousandsSeparator" className="ml-2 block text-xs text-gray-700 dark:text-gray-300">
              Use thousands separator
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

// Convert type transformation configuration component
interface ConvertTransformConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const ConvertTransformConfig: React.FC<ConvertTransformConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const typeOptions = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'object', label: 'Object' },
    { value: 'array', label: 'Array' },
  ];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Input Field
        </label>
        <input
          type="text"
          value={config.inputField || ''}
          onChange={(e) => updateConfig('inputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Field to convert"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Output Field
        </label>
        <input
          type="text"
          value={config.outputField || ''}
          onChange={(e) => updateConfig('outputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Where to store converted value"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Target Type
        </label>
        <select
          value={config.targetType || 'string'}
          onChange={(e) => updateConfig('targetType', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {config.targetType === 'boolean' && (
        <div>
          <div className="text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
            True Values
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            These values will be converted to true (comma separated)
          </div>
          <input
            type="text"
            value={config.trueValues || 'true,yes,1,y'}
            onChange={(e) => updateConfig('trueValues', e.target.value)}
            className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      )}
    </div>
  );
};

export default TransformationNode;
