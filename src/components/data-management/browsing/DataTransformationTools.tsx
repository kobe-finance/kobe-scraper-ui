import React, { useState } from 'react';
import { ArrowPathIcon, ArrowsRightLeftIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export type TransformationType = 'rename' | 'extract' | 'combine' | 'format' | 'convert' | 'calculate';

export interface TransformationOption {
  id: string;
  type: TransformationType;
  name: string;
  description: string;
  targetFields: string[];
  outputField?: string;
  config: Record<string, any>;
}

interface DataTransformationToolsProps {
  fields: { id: string; name: string }[];
  onApplyTransformation: (transformation: TransformationOption) => void;
  className?: string;
}

/**
 * Component for data transformation operations
 * Provides tools to manipulate and transform data during browsing
 */
const DataTransformationTools: React.FC<DataTransformationToolsProps> = ({
  fields,
  onApplyTransformation,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TransformationType>('rename');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [outputField, setOutputField] = useState('');
  const [transformationConfig, setTransformationConfig] = useState<Record<string, any>>({});

  // Toggle panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Handle field selection
  const handleFieldToggle = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(id => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  // Handle configuration change
  const handleConfigChange = (key: string, value: any) => {
    setTransformationConfig({
      ...transformationConfig,
      [key]: value
    });
  };

  // Apply transformation
  const applyTransformation = () => {
    if (selectedFields.length === 0) return;
    
    const transformation: TransformationOption = {
      id: `transform-${Date.now()}`,
      type: activeTab,
      name: getTransformationName(activeTab),
      description: getTransformationDescription(activeTab, selectedFields, transformationConfig),
      targetFields: selectedFields,
      outputField: outputField || undefined,
      config: transformationConfig
    };
    
    onApplyTransformation(transformation);
    
    // Reset form
    setSelectedFields([]);
    setOutputField('');
    setTransformationConfig({});
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={togglePanel}
        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        <ArrowsRightLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
        <span>Transform Data</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={togglePanel}></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full dark:bg-gray-800">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Transform Data
                    </h3>
                    <div className="mt-4">
                      {/* Tabs */}
                      <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex -mb-px space-x-4" aria-label="Tabs">
                          {renderTab('rename', 'Rename Fields', activeTab, setActiveTab)}
                          {renderTab('extract', 'Extract Values', activeTab, setActiveTab)}
                          {renderTab('combine', 'Combine Fields', activeTab, setActiveTab)}
                          {renderTab('format', 'Format Values', activeTab, setActiveTab)}
                          {renderTab('convert', 'Convert Types', activeTab, setActiveTab)}
                          {renderTab('calculate', 'Calculate', activeTab, setActiveTab)}
                        </nav>
                      </div>

                      {/* Field selection */}
                      <div className="mt-4 mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Select fields to transform:
                        </label>
                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 dark:border-gray-600">
                          {fields.map((field) => (
                            <div key={field.id} className="flex items-center mb-1">
                              <input
                                id={`field-${field.id}`}
                                type="checkbox"
                                checked={selectedFields.includes(field.id)}
                                onChange={() => handleFieldToggle(field.id)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                              />
                              <label
                                htmlFor={`field-${field.id}`}
                                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                              >
                                {field.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tab content */}
                      <div className="mt-4">
                        {activeTab === 'rename' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Rename Pattern
                              </label>
                              <input
                                type="text"
                                value={transformationConfig.pattern || ''}
                                onChange={(e) => handleConfigChange('pattern', e.target.value)}
                                placeholder="New field name or pattern e.g. {field}_transformed"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Use {'{field}'} to include the original field name
                              </p>
                            </div>
                          </div>
                        )}

                        {activeTab === 'extract' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Output Field Name
                              </label>
                              <input
                                type="text"
                                value={outputField}
                                onChange={(e) => setOutputField(e.target.value)}
                                placeholder="Name for the extracted data field"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Extraction Pattern (RegEx)
                              </label>
                              <input
                                type="text"
                                value={transformationConfig.regex || ''}
                                onChange={(e) => handleConfigChange('regex', e.target.value)}
                                placeholder="Regular expression with capture groups"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Capture Group Index
                              </label>
                              <input
                                type="number"
                                value={transformationConfig.groupIndex || 1}
                                onChange={(e) => handleConfigChange('groupIndex', parseInt(e.target.value))}
                                min="0"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                          </div>
                        )}

                        {activeTab === 'combine' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Output Field Name
                              </label>
                              <input
                                type="text"
                                value={outputField}
                                onChange={(e) => setOutputField(e.target.value)}
                                placeholder="Name for the combined field"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Separator
                              </label>
                              <input
                                type="text"
                                value={transformationConfig.separator || ' '}
                                onChange={(e) => handleConfigChange('separator', e.target.value)}
                                placeholder="Text to put between combined values"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                          </div>
                        )}

                        {activeTab === 'format' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Format Type
                              </label>
                              <select
                                value={transformationConfig.formatType || 'text'}
                                onChange={(e) => handleConfigChange('formatType', e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              >
                                <option value="text">Text Formatting</option>
                                <option value="date">Date Formatting</option>
                                <option value="number">Number Formatting</option>
                              </select>
                            </div>

                            {transformationConfig.formatType === 'text' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Text Operation
                                </label>
                                <select
                                  value={transformationConfig.textOperation || 'uppercase'}
                                  onChange={(e) => handleConfigChange('textOperation', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                  <option value="uppercase">UPPERCASE</option>
                                  <option value="lowercase">lowercase</option>
                                  <option value="capitalize">Capitalize</option>
                                  <option value="trim">Trim Whitespace</option>
                                </select>
                              </div>
                            )}

                            {transformationConfig.formatType === 'date' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Date Format
                                </label>
                                <input
                                  type="text"
                                  value={transformationConfig.dateFormat || 'YYYY-MM-DD'}
                                  onChange={(e) => handleConfigChange('dateFormat', e.target.value)}
                                  placeholder="Format string (e.g., YYYY-MM-DD)"
                                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                              </div>
                            )}

                            {transformationConfig.formatType === 'number' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Number Format
                                </label>
                                <input
                                  type="text"
                                  value={transformationConfig.numberFormat || '0,0.00'}
                                  onChange={(e) => handleConfigChange('numberFormat', e.target.value)}
                                  placeholder="Format string (e.g., 0,0.00)"
                                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === 'convert' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Convert To Type
                              </label>
                              <select
                                value={transformationConfig.toType || 'string'}
                                onChange={(e) => handleConfigChange('toType', e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              >
                                <option value="string">String</option>
                                <option value="number">Number</option>
                                <option value="boolean">Boolean</option>
                                <option value="date">Date</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {activeTab === 'calculate' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Output Field Name
                              </label>
                              <input
                                type="text"
                                value={outputField}
                                onChange={(e) => setOutputField(e.target.value)}
                                placeholder="Name for the calculation result"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Formula
                              </label>
                              <input
                                type="text"
                                value={transformationConfig.formula || ''}
                                onChange={(e) => handleConfigChange('formula', e.target.value)}
                                placeholder="Formula using field names in curly braces e.g. {price} * {quantity}"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Use field names in curly braces, e.g., {'{price}'} * {'{quantity}'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse dark:bg-gray-700">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={applyTransformation}
                  disabled={selectedFields.length === 0}
                >
                  Apply Transformation
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={togglePanel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions

function renderTab(
  id: TransformationType,
  label: string,
  activeTab: TransformationType,
  setActiveTab: (tab: TransformationType) => void
) {
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        py-2 px-1 border-b-2 font-medium text-sm focus:outline-none
        ${activeTab === id 
          ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
      `}
    >
      {label}
    </button>
  );
}

function getTransformationName(type: TransformationType): string {
  switch (type) {
    case 'rename': return 'Rename Fields';
    case 'extract': return 'Extract Values';
    case 'combine': return 'Combine Fields';
    case 'format': return 'Format Values';
    case 'convert': return 'Convert Types';
    case 'calculate': return 'Calculate';
    default: return 'Transform Data';
  }
}

function getTransformationDescription(
  type: TransformationType, 
  fields: string[], 
  config: Record<string, any>
): string {
  const fieldCount = fields.length;
  const fieldText = fieldCount === 1 ? 'field' : 'fields';
  
  switch (type) {
    case 'rename':
      return `Rename ${fieldCount} ${fieldText} using pattern: ${config.pattern || '{field}_new'}`;
    case 'extract':
      return `Extract values from ${fieldCount} ${fieldText} using RegEx: ${config.regex || '(.*)'}`;
    case 'combine':
      return `Combine ${fieldCount} ${fieldText} with separator: '${config.separator || ' '}'`;
    case 'format':
      if (config.formatType === 'text') {
        return `Format text in ${fieldCount} ${fieldText} using: ${config.textOperation || 'uppercase'}`;
      } else if (config.formatType === 'date') {
        return `Format dates in ${fieldCount} ${fieldText} to: ${config.dateFormat || 'YYYY-MM-DD'}`;
      } else if (config.formatType === 'number') {
        return `Format numbers in ${fieldCount} ${fieldText} to: ${config.numberFormat || '0,0.00'}`;
      }
      return `Format ${fieldCount} ${fieldText}`;
    case 'convert':
      return `Convert ${fieldCount} ${fieldText} to type: ${config.toType || 'string'}`;
    case 'calculate':
      return `Calculate using formula: ${config.formula || ''}`;
    default:
      return `Transform ${fieldCount} ${fieldText}`;
  }
}

export default DataTransformationTools;
