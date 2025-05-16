import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  QuestionMarkCircleIcon, 
  ArrowsRightLeftIcon, 
  EyeIcon, 
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { ConditionNode as ConditionNodeType } from '../types';

/**
 * Condition node component for branching workflows
 * Provides different condition types with true/false branches
 */
const ConditionNode: React.FC<NodeProps> = ({ data, isConnectable, selected }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Get icon based on condition type
  const getConditionIcon = () => {
    switch (data.condition) {
      case 'equals':
      case 'notEquals':
        return <ArrowsRightLeftIcon className="h-5 w-5 text-amber-500" />;
      case 'contains':
      case 'notContains':
        return <EyeIcon className="h-5 w-5 text-amber-500" />;
      case 'exists':
      case 'notExists':
        return <CheckCircleIcon className="h-5 w-5 text-amber-500" />;
      case 'empty':
      case 'notEmpty':
        return <XCircleIcon className="h-5 w-5 text-amber-500" />;
      default:
        return <QuestionMarkCircleIcon className="h-5 w-5 text-amber-500" />;
    }
  };

  // Get display name for condition type
  const getConditionName = () => {
    switch (data.condition) {
      case 'equals':
        return 'Equals';
      case 'notEquals':
        return 'Not Equals';
      case 'contains':
        return 'Contains';
      case 'notContains':
        return 'Not Contains';
      case 'exists':
        return 'Exists';
      case 'notExists':
        return 'Not Exists';
      case 'empty':
        return 'Is Empty';
      case 'notEmpty':
        return 'Not Empty';
      case 'greaterThan':
        return 'Greater Than';
      case 'lessThan':
        return 'Less Than';
      case 'custom':
        return 'Custom';
      default:
        return 'Condition';
    }
  };

  // Handle change in condition type
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCondition = e.target.value;
    data.onNodeChange(data.id, {
      condition: newCondition,
      expression: '',
      parameters: {},
    });
  };

  // Toggle config panel
  const toggleConfig = useCallback(() => {
    setIsConfigOpen(!isConfigOpen);
  }, [isConfigOpen]);

  // Get a simplified preview of the condition
  const getConditionPreview = (): string => {
    if (!data.expression) return '';
    
    let preview = data.expression;
    
    // If too long, truncate
    if (preview.length > 30) {
      preview = preview.substring(0, 30) + '...';
    }
    
    return preview;
  };

  return (
    <div 
      className={`relative rounded-lg p-3 w-64 border-2 ${
        selected 
          ? 'border-amber-500 dark:border-amber-600' 
          : 'border-amber-200 dark:border-amber-800'
      } bg-white dark:bg-gray-800 transition-colors shadow-sm hover:shadow`}
    >
      {/* Node header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-900/30 mr-2">
            {getConditionIcon()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {data.name || 'Condition'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getConditionName()}
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
              Condition Type
            </label>
            <select
              value={data.condition}
              onChange={handleConditionChange}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="equals">Equals</option>
              <option value="notEquals">Not Equals</option>
              <option value="contains">Contains</option>
              <option value="notContains">Not Contains</option>
              <option value="exists">Exists</option>
              <option value="notExists">Not Exists</option>
              <option value="empty">Is Empty</option>
              <option value="notEmpty">Not Empty</option>
              <option value="greaterThan">Greater Than</option>
              <option value="lessThan">Less Than</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Condition configuration based on type */}
          {data.condition === 'custom' ? (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
                JavaScript Expression
              </label>
              <textarea
                value={data.expression || ''}
                onChange={(e) => {
                  data.onNodeChange(data.id, {
                    expression: e.target.value,
                  });
                }}
                rows={3}
                className="block w-full text-sm font-mono border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="data.value > 100 && data.status === 'active'"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Write a JavaScript expression that evaluates to true or false
              </p>
            </div>
          ) : ['equals', 'notEquals', 'contains', 'notContains', 'greaterThan', 'lessThan'].includes(data.condition) ? (
            <ComparisonConditionConfig
              condition={data.condition}
              parameters={data.parameters}
              onChange={(newParams) => {
                data.onNodeChange(data.id, {
                  parameters: newParams,
                });
              }}
            />
          ) : (
            <FieldConditionConfig
              condition={data.condition}
              parameters={data.parameters}
              onChange={(newParams) => {
                data.onNodeChange(data.id, {
                  parameters: newParams,
                });
              }}
            />
          )}
        </div>
      )}

      {/* Node description or preview */}
      {!isConfigOpen && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {data.description || getConditionPreview() || 'Configure this condition...'}
        </div>
      )}

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: '#f59e0b', width: '10px', height: '10px', border: '2px solid white' }}
        isConnectable={isConnectable}
      />

      {/* True output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ 
          background: '#22c55e', 
          width: '10px', 
          height: '10px', 
          border: '2px solid white',
          top: '35%'
        }}
        isConnectable={isConnectable}
      />
      <div 
        className="absolute text-xs text-green-600 font-medium dark:text-green-400"
        style={{ right: '-25px', top: 'calc(35% - 8px)' }}
      >
        True
      </div>

      {/* False output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ 
          background: '#ef4444', 
          width: '10px', 
          height: '10px', 
          border: '2px solid white',
          top: '65%'
        }}
        isConnectable={isConnectable}
      />
      <div 
        className="absolute text-xs text-red-600 font-medium dark:text-red-400"
        style={{ right: '-25px', top: 'calc(65% - 8px)' }}
      >
        False
      </div>
    </div>
  );
};

// Comparison condition configuration component
interface ComparisonConditionConfigProps {
  condition: string;
  parameters: Record<string, any>;
  onChange: (parameters: Record<string, any>) => void;
}

const ComparisonConditionConfig: React.FC<ComparisonConditionConfigProps> = ({ 
  condition, 
  parameters,
  onChange 
}) => {
  const updateParameter = (key: string, value: any) => {
    onChange({ ...parameters, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Left Value
        </label>
        <input
          type="text"
          value={parameters.left || ''}
          onChange={(e) => updateParameter('left', e.target.value)}
          placeholder="Field or value to compare"
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Use dot notation for nested fields (e.g., data.user.name)
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Right Value
        </label>
        <input
          type="text"
          value={parameters.right || ''}
          onChange={(e) => updateParameter('right', e.target.value)}
          placeholder="Value to compare against"
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Use quotes for string literals (e.g., "active")
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
            Case Sensitive
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="caseSensitive"
              checked={parameters.caseSensitive || false}
              onChange={(e) => updateParameter('caseSensitive', e.target.checked)}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Only applies to string comparisons
        </p>
      </div>
    </div>
  );
};

// Field condition configuration component
interface FieldConditionConfigProps {
  condition: string;
  parameters: Record<string, any>;
  onChange: (parameters: Record<string, any>) => void;
}

const FieldConditionConfig: React.FC<FieldConditionConfigProps> = ({ 
  condition, 
  parameters,
  onChange 
}) => {
  const updateParameter = (key: string, value: any) => {
    onChange({ ...parameters, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Field Path
        </label>
        <input
          type="text"
          value={parameters.field || ''}
          onChange={(e) => updateParameter('field', e.target.value)}
          placeholder="Field to check"
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Use dot notation for nested fields (e.g., data.user.name)
        </p>
      </div>

      {['exists', 'notExists', 'empty', 'notEmpty'].includes(condition) && (
        <p className="text-xs text-gray-500 italic dark:text-gray-400">
          {condition === 'exists' && 'Checks if the field exists and is not undefined or null'}
          {condition === 'notExists' && 'Checks if the field does not exist or is undefined or null'}
          {condition === 'empty' && 'Checks if the field is an empty string, array, or object'}
          {condition === 'notEmpty' && 'Checks if the field is not an empty string, array, or object'}
        </p>
      )}
    </div>
  );
};

export default ConditionNode;
