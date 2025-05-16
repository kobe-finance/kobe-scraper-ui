import React, { useState } from 'react';
import { ArrowsRightLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export interface FieldMapping {
  id: string;
  sourceField: string;
  targetField: string;
  transformations: FieldTransformation[];
}

export interface FieldTransformation {
  id: string;
  type: 'rename' | 'extract' | 'format' | 'combine' | 'split' | 'constant';
  config: Record<string, any>;
}

interface CustomFieldMappingToolsProps {
  sourceFields: { id: string; name: string }[];
  targetSchema?: { id: string; name: string }[];
  onSaveMapping: (mapping: FieldMapping) => void;
  onRemoveMapping: (mappingId: string) => void;
  mappings: FieldMapping[];
  className?: string;
}

/**
 * Tools for mapping fields between different schemas
 * Supports field transformations, renaming, and custom mapping logic
 */
const CustomFieldMappingTools: React.FC<CustomFieldMappingToolsProps> = ({
  sourceFields,
  targetSchema,
  onSaveMapping,
  onRemoveMapping,
  mappings,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSourceField, setSelectedSourceField] = useState<string>(sourceFields[0]?.id || '');
  const [targetField, setTargetField] = useState<string>('');
  const [transformations, setTransformations] = useState<FieldTransformation[]>([]);
  const [currentTransformation, setCurrentTransformation] = useState<FieldTransformation['type']>('rename');
  const [transformationConfig, setTransformationConfig] = useState<Record<string, any>>({});

  // Toggle panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Reset form
  const resetForm = () => {
    setSelectedSourceField(sourceFields[0]?.id || '');
    setTargetField('');
    setTransformations([]);
    setCurrentTransformation('rename');
    setTransformationConfig({});
  };

  // Add transformation
  const addTransformation = () => {
    const newTransformation: FieldTransformation = {
      id: `transform-${Date.now()}`,
      type: currentTransformation,
      config: { ...transformationConfig }
    };
    
    setTransformations([...transformations, newTransformation]);
    setTransformationConfig({});
  };

  // Remove transformation
  const removeTransformation = (index: number) => {
    const newTransformations = [...transformations];
    newTransformations.splice(index, 1);
    setTransformations(newTransformations);
  };

  // Save mapping
  const saveMapping = () => {
    if (!selectedSourceField || !targetField) return;
    
    const mapping: FieldMapping = {
      id: `mapping-${Date.now()}`,
      sourceField: selectedSourceField,
      targetField,
      transformations: [...transformations]
    };
    
    onSaveMapping(mapping);
    resetForm();
  };

  // Get transformation config form based on selected type
  const getTransformationForm = () => {
    switch (currentTransformation) {
      case 'rename':
        return (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Simply maps the source field to the target field name
            </p>
          </div>
        );
      
      case 'extract':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Extraction Pattern (RegEx)
              </label>
              <input
                type="text"
                value={transformationConfig.pattern || ''}
                onChange={(e) => setTransformationConfig({ ...transformationConfig, pattern: e.target.value })}
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
                onChange={(e) => setTransformationConfig({ ...transformationConfig, groupIndex: parseInt(e.target.value) })}
                min="0"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        );
      
      case 'format':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Format Type
              </label>
              <select
                value={transformationConfig.formatType || 'text'}
                onChange={(e) => setTransformationConfig({ ...transformationConfig, formatType: e.target.value })}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="text">Text</option>
                <option value="date">Date</option>
                <option value="number">Number</option>
              </select>
            </div>
            
            {transformationConfig.formatType === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Text Format
                </label>
                <select
                  value={transformationConfig.textFormat || 'uppercase'}
                  onChange={(e) => setTransformationConfig({ ...transformationConfig, textFormat: e.target.value })}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="uppercase">UPPERCASE</option>
                  <option value="lowercase">lowercase</option>
                  <option value="capitalize">Capitalize</option>
                  <option value="trim">Trim</option>
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
                  value={transformationConfig.dateFormat || ''}
                  onChange={(e) => setTransformationConfig({ ...transformationConfig, dateFormat: e.target.value })}
                  placeholder="e.g., YYYY-MM-DD"
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
                  value={transformationConfig.numberFormat || ''}
                  onChange={(e) => setTransformationConfig({ ...transformationConfig, numberFormat: e.target.value })}
                  placeholder="e.g., 0,0.00"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}
          </div>
        );
      
      case 'combine':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Fields to Combine (comma-separated IDs)
              </label>
              <input
                type="text"
                value={transformationConfig.additionalFields || ''}
                onChange={(e) => setTransformationConfig({ ...transformationConfig, additionalFields: e.target.value })}
                placeholder="field1,field2,field3"
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
                onChange={(e) => setTransformationConfig({ ...transformationConfig, separator: e.target.value })}
                placeholder="Text to put between combined values"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        );
      
      case 'split':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Split Delimiter
              </label>
              <input
                type="text"
                value={transformationConfig.delimiter || ','}
                onChange={(e) => setTransformationConfig({ ...transformationConfig, delimiter: e.target.value })}
                placeholder="Character to split on, e.g., comma"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Index to Extract
              </label>
              <input
                type="number"
                value={transformationConfig.index !== undefined ? transformationConfig.index : 0}
                onChange={(e) => setTransformationConfig({ ...transformationConfig, index: parseInt(e.target.value) })}
                min="0"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Use 0 for the first part, 1 for the second, etc.
              </p>
            </div>
          </div>
        );
      
      case 'constant':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Constant Value
            </label>
            <input
              type="text"
              value={transformationConfig.value || ''}
              onChange={(e) => setTransformationConfig({ ...transformationConfig, value: e.target.value })}
              placeholder="Fixed value to use"
              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={togglePanel}
        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        <ArrowsRightLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
        <span>Field Mapping</span>
        {mappings.length > 0 && (
          <span className="ml-1.5 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
            {mappings.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={togglePanel}></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full dark:bg-gray-800">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Custom Field Mapping
                    </h3>
                    
                    <div className="mt-4 space-y-4">
                      {/* Source field selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Source Field
                        </label>
                        <select
                          value={selectedSourceField}
                          onChange={(e) => setSelectedSourceField(e.target.value)}
                          className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          {sourceFields.map((field) => (
                            <option key={field.id} value={field.id}>
                              {field.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Target field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Target Field Name
                        </label>
                        {targetSchema ? (
                          <select
                            value={targetField}
                            onChange={(e) => setTargetField(e.target.value)}
                            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          >
                            <option value="">Select a target field...</option>
                            {targetSchema.map((field) => (
                              <option key={field.id} value={field.id}>
                                {field.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={targetField}
                            onChange={(e) => setTargetField(e.target.value)}
                            placeholder="New field name"
                            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        )}
                      </div>
                      
                      {/* Transformations */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Transformations
                          </label>
                          
                          <div className="flex items-center space-x-2">
                            <select
                              value={currentTransformation}
                              onChange={(e) => {
                                setCurrentTransformation(e.target.value as FieldTransformation['type']);
                                setTransformationConfig({});
                              }}
                              className="text-sm rounded-md border border-gray-300 py-1 px-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                              <option value="rename">Rename</option>
                              <option value="extract">Extract Pattern</option>
                              <option value="format">Format Value</option>
                              <option value="combine">Combine Fields</option>
                              <option value="split">Split Value</option>
                              <option value="constant">Constant Value</option>
                            </select>
                            
                            <button
                              type="button"
                              onClick={addTransformation}
                              className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
                            >
                              <PlusIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Transformation configuration */}
                        <div className="mb-4 p-3 border border-gray-200 rounded-md dark:border-gray-700">
                          {getTransformationForm()}
                        </div>
                        
                        {/* Transformation list */}
                        {transformations.length > 0 && (
                          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 dark:border-gray-700">
                            {transformations.map((transformation, index) => (
                              <div key={transformation.id} className="flex justify-between items-center bg-gray-50 p-2 rounded dark:bg-gray-700">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {getTransformationDescription(transformation)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeTransformation(index)}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Save mapping button */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={saveMapping}
                          disabled={!selectedSourceField || !targetField}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
                        >
                          Save Mapping
                        </button>
                      </div>
                    </div>
                    
                    {/* Current mappings */}
                    {mappings.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Active Field Mappings
                        </h4>
                        
                        <div className="border rounded-md overflow-hidden dark:border-gray-700">
                          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto">
                            {mappings.map((mapping) => {
                              const sourceFieldName = sourceFields.find(f => f.id === mapping.sourceField)?.name || mapping.sourceField;
                              const targetFieldName = targetSchema 
                                ? targetSchema.find(f => f.id === mapping.targetField)?.name 
                                : mapping.targetField;
                              
                              return (
                                <li key={mapping.id} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {sourceFieldName} → {targetFieldName}
                                    </div>
                                    {mapping.transformations.length > 0 && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Transformations: {mapping.transformations.length}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => onRemoveMapping(mapping.id)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse dark:bg-gray-700">
                <button
                  type="button"
                  onClick={togglePanel}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get a readable description of a transformation
function getTransformationDescription(transformation: FieldTransformation): string {
  switch (transformation.type) {
    case 'rename':
      return 'Rename field';
    
    case 'extract':
      return `Extract pattern: ${transformation.config.pattern || 'regex'}`;
    
    case 'format':
      if (transformation.config.formatType === 'text') {
        return `Format as ${transformation.config.textFormat || 'text'}`;
      } else if (transformation.config.formatType === 'date') {
        return `Format date: ${transformation.config.dateFormat || 'YYYY-MM-DD'}`;
      } else if (transformation.config.formatType === 'number') {
        return `Format number: ${transformation.config.numberFormat || '0,0.00'}`;
      }
      return 'Format value';
    
    case 'combine':
      return `Combine with ${transformation.config.additionalFields || 'other fields'}`;
    
    case 'split':
      return `Split by '${transformation.config.delimiter || ','}' at index ${transformation.config.index || 0}`;
    
    case 'constant':
      return `Set constant: "${transformation.config.value || ''}"`;
    
    default:
      return 'Transform field';
  }
}

export default CustomFieldMappingTools;
