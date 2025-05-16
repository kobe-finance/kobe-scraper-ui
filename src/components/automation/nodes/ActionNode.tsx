import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  BoltIcon, 
  GlobeAltIcon, 
  DocumentTextIcon, 
  ArrowDownOnSquareIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { ActionNode as ActionNodeType } from '../types';

/**
 * Action node component for performing operations
 * Supports different action types: scrape, extract, download, etc.
 */
const ActionNode: React.FC<NodeProps> = ({ data, isConnectable, selected }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Map action type to icon
  const getActionIcon = () => {
    switch (data.actionType) {
      case 'scrape':
        return <GlobeAltIcon className="h-5 w-5 text-purple-500" />;
      case 'extract':
        return <DocumentTextIcon className="h-5 w-5 text-purple-500" />;
      case 'download':
        return <ArrowDownOnSquareIcon className="h-5 w-5 text-purple-500" />;
      case 'copy':
        return <DocumentDuplicateIcon className="h-5 w-5 text-purple-500" />;
      case 'transform':
        return <ArrowPathIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <BoltIcon className="h-5 w-5 text-purple-500" />;
    }
  };

  // Get display name for action type
  const getActionTypeName = () => {
    switch (data.actionType) {
      case 'scrape':
        return 'Web Scraping';
      case 'extract':
        return 'Content Extraction';
      case 'download':
        return 'Download Content';
      case 'copy':
        return 'Copy Data';
      case 'transform':
        return 'Transform Data';
      default:
        return 'Action';
    }
  };

  // Handle change in action type
  const handleActionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newActionType = e.target.value;
    data.onNodeChange(data.id, {
      actionType: newActionType,
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
          ? 'border-purple-500 dark:border-purple-600' 
          : 'border-purple-200 dark:border-purple-800'
      } bg-white dark:bg-gray-800 transition-colors shadow-sm hover:shadow`}
    >
      {/* Node header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-900/30 mr-2">
            {getActionIcon()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {data.name || 'Action'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getActionTypeName()}
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
              Action Type
            </label>
            <select
              value={data.actionType}
              onChange={handleActionTypeChange}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="scrape">Web Scraping</option>
              <option value="extract">Content Extraction</option>
              <option value="download">Download Content</option>
              <option value="copy">Copy Data</option>
              <option value="transform">Transform Data</option>
            </select>
          </div>

          {/* Render configuration based on action type */}
          {data.actionType === 'scrape' && (
            <ScrapeConfiguration
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.actionType === 'extract' && (
            <ExtractConfiguration
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.actionType === 'download' && (
            <DownloadConfiguration
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.actionType === 'copy' && (
            <CopyConfiguration
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.actionType === 'transform' && (
            <TransformConfiguration
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
        style={{ background: '#a855f7', width: '10px', height: '10px', border: '2px solid white' }}
        isConnectable={isConnectable}
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#a855f7', width: '10px', height: '10px', border: '2px solid white' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

// Scrape configuration component
interface ScrapeConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const ScrapeConfiguration: React.FC<ScrapeConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          URL
        </label>
        <input
          type="text"
          value={config.url || ''}
          onChange={(e) => updateConfig('url', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Method
        </label>
        <select
          value={config.method || 'GET'}
          onChange={(e) => updateConfig('method', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
            Use Browser
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useBrowser"
              checked={config.useBrowser || false}
              onChange={(e) => updateConfig('useBrowser', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Use a headless browser for JavaScript-rendered content
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Timeout (seconds)
        </label>
        <input
          type="number"
          value={config.timeout || 30}
          onChange={(e) => updateConfig('timeout', parseInt(e.target.value))}
          min={1}
          max={300}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
            Headers
          </label>
          <button
            type="button"
            onClick={() => updateConfig('headers', { ...config.headers, ['']: '' })}
            className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            + Add
          </button>
        </div>
        <div className="mt-1 space-y-2">
          {Object.entries(config.headers || {}).map(([key, value], index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newHeaders = { ...config.headers };
                  const oldKey = key;
                  delete newHeaders[oldKey];
                  newHeaders[e.target.value] = value;
                  updateConfig('headers', newHeaders);
                }}
                className="block w-1/2 text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Header"
              />
              <input
                type="text"
                value={value as string}
                onChange={(e) => {
                  const newHeaders = { ...config.headers };
                  newHeaders[key] = e.target.value;
                  updateConfig('headers', newHeaders);
                }}
                className="block w-1/2 text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Value"
              />
              <button
                type="button"
                onClick={() => {
                  const newHeaders = { ...config.headers };
                  delete newHeaders[key];
                  updateConfig('headers', newHeaders);
                }}
                className="p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Extract configuration component
interface ExtractConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const ExtractConfiguration: React.FC<ExtractConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Pattern Type
        </label>
        <select
          value={config.patternType || 'css'}
          onChange={(e) => updateConfig('patternType', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="css">CSS Selector</option>
          <option value="xpath">XPath</option>
          <option value="regex">Regular Expression</option>
          <option value="json">JSON Path</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Pattern
        </label>
        <textarea
          value={config.pattern || ''}
          onChange={(e) => updateConfig('pattern', e.target.value)}
          rows={3}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter extraction pattern"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Output Field Name
        </label>
        <input
          type="text"
          value={config.outputField || 'extractedContent'}
          onChange={(e) => updateConfig('outputField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="extractedContent"
        />
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
            Multiple Results
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="multipleResults"
              checked={config.multipleResults || false}
              onChange={(e) => updateConfig('multipleResults', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Extract all matching elements (array) vs. first match only
        </p>
      </div>
    </div>
  );
};

// Download configuration component
interface DownloadConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const DownloadConfiguration: React.FC<DownloadConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          URL Field
        </label>
        <input
          type="text"
          value={config.urlField || 'url'}
          onChange={(e) => updateConfig('urlField', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Field containing URL to download"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Field from input data containing URL to download
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Output Format
        </label>
        <select
          value={config.outputFormat || 'binary'}
          onChange={(e) => updateConfig('outputFormat', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="binary">Binary</option>
          <option value="base64">Base64</option>
          <option value="text">Text</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Save To
        </label>
        <input
          type="text"
          value={config.savePath || ''}
          onChange={(e) => updateConfig('savePath', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="/path/to/save/file.ext"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Optional path to save file locally
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
            Include Headers
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeHeaders"
              checked={config.includeHeaders || false}
              onChange={(e) => updateConfig('includeHeaders', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Copy data configuration component
interface CopyConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const CopyConfiguration: React.FC<CopyConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const addMapping = () => {
    const mappings = [...(config.mappings || []), { source: '', target: '' }];
    updateConfig('mappings', mappings);
  };

  const updateMapping = (index: number, field: 'source' | 'target', value: string) => {
    const mappings = [...(config.mappings || [])];
    mappings[index] = { ...mappings[index], [field]: value };
    updateConfig('mappings', mappings);
  };

  const removeMapping = (index: number) => {
    const mappings = [...(config.mappings || [])];
    mappings.splice(index, 1);
    updateConfig('mappings', mappings);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
          Field Mappings
        </label>
        <button
          type="button"
          onClick={addMapping}
          className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          + Add Mapping
        </button>
      </div>

      <div className="space-y-2">
        {(config.mappings || []).map((mapping: any, index: number) => (
          <div key={index} className="flex space-x-2">
            <input
              type="text"
              value={mapping.source}
              onChange={(e) => updateMapping(index, 'source', e.target.value)}
              className="block w-1/2 text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Source field"
            />
            <span className="flex items-center text-gray-400">→</span>
            <input
              type="text"
              value={mapping.target}
              onChange={(e) => updateMapping(index, 'target', e.target.value)}
              className="block w-1/2 text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Target field"
            />
            <button
              type="button"
              onClick={() => removeMapping(index)}
              className="p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {(config.mappings || []).length === 0 && (
          <p className="text-xs text-gray-500 italic dark:text-gray-400">
            No field mappings defined yet
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
            Copy All Fields
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="copyAll"
              checked={config.copyAll || false}
              onChange={(e) => updateConfig('copyAll', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Copy all fields not specified in mappings
        </p>
      </div>
    </div>
  );
};

// Transform data configuration component
interface TransformConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const TransformConfiguration: React.FC<TransformConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Transform Type
        </label>
        <select
          value={config.transformType || 'javascript'}
          onChange={(e) => updateConfig('transformType', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="javascript">JavaScript Function</option>
          <option value="template">Template</option>
          <option value="filter">Filter</option>
          <option value="sort">Sort</option>
        </select>
      </div>

      {config.transformType === 'javascript' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
            JavaScript Code
          </label>
          <textarea
            value={config.code || '// data is the input object\n// return the transformed result\nreturn data;'}
            onChange={(e) => updateConfig('code', e.target.value)}
            rows={5}
            className="block w-full text-sm font-mono border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Write JavaScript that transforms the input data
          </p>
        </div>
      )}

      {config.transformType === 'template' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
            Template
          </label>
          <textarea
            value={config.template || ''}
            onChange={(e) => updateConfig('template', e.target.value)}
            rows={5}
            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Use {{variable}} syntax to reference input fields"
          />
        </div>
      )}

      {config.transformType === 'filter' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
            Filter Condition
          </label>
          <textarea
            value={config.condition || ''}
            onChange={(e) => updateConfig('condition', e.target.value)}
            rows={3}
            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="item.price > 100"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Condition to filter array items (each item is 'item')
          </p>
        </div>
      )}

      {config.transformType === 'sort' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
              Sort Field
            </label>
            <input
              type="text"
              value={config.sortField || ''}
              onChange={(e) => updateConfig('sortField', e.target.value)}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Field to sort by"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                Sort Direction
              </label>
              <select
                value={config.sortDirection || 'asc'}
                onChange={(e) => updateConfig('sortDirection', e.target.value)}
                className="block w-24 text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionNode;
