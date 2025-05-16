import React, { useState } from 'react';
import { SparklesIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export interface EnrichmentSource {
  id: string;
  name: string;
  type: 'api' | 'calculation' | 'lookup' | 'ml';
  description?: string;
}

export interface EnrichmentTask {
  id: string;
  sourceId: string;
  targetFields: string[];
  outputFields: string[];
  config: Record<string, any>;
}

interface DataEnrichmentInterfaceProps {
  fields: { id: string; name: string }[];
  availableSources: EnrichmentSource[];
  onAddEnrichmentTask: (task: EnrichmentTask) => void;
  onRemoveEnrichmentTask: (taskId: string) => void;
  activeTasks: EnrichmentTask[];
  className?: string;
}

/**
 * Interface for enriching data with external sources or calculations
 * Allows adding information from APIs, lookups, or computed values
 */
const DataEnrichmentInterface: React.FC<DataEnrichmentInterfaceProps> = ({
  fields,
  availableSources,
  onAddEnrichmentTask,
  onRemoveEnrichmentTask,
  activeTasks,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>(availableSources[0]?.id || '');
  const [selectedTargetFields, setSelectedTargetFields] = useState<string[]>([]);
  const [outputFields, setOutputFields] = useState<string[]>(['']);
  const [config, setConfig] = useState<Record<string, any>>({});

  // Toggle panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Reset form
  const resetForm = () => {
    setSelectedSource(availableSources[0]?.id || '');
    setSelectedTargetFields([]);
    setOutputFields(['']);
    setConfig({});
  };

  // Handle target field selection
  const toggleTargetField = (fieldId: string) => {
    if (selectedTargetFields.includes(fieldId)) {
      setSelectedTargetFields(selectedTargetFields.filter(id => id !== fieldId));
    } else {
      setSelectedTargetFields([...selectedTargetFields, fieldId]);
    }
  };

  // Handle output field changes
  const handleOutputFieldChange = (index: number, value: string) => {
    const newOutputFields = [...outputFields];
    newOutputFields[index] = value;
    setOutputFields(newOutputFields);
  };

  // Add output field
  const addOutputField = () => {
    setOutputFields([...outputFields, '']);
  };

  // Remove output field
  const removeOutputField = (index: number) => {
    if (outputFields.length <= 1) return;
    const newOutputFields = [...outputFields];
    newOutputFields.splice(index, 1);
    setOutputFields(newOutputFields);
  };

  // Add enrichment task
  const handleAddTask = () => {
    if (!selectedSource || selectedTargetFields.length === 0 || !outputFields[0]) return;
    
    // Filter out empty output fields
    const filteredOutputFields = outputFields.filter(field => field.trim() !== '');
    
    const task: EnrichmentTask = {
      id: `task-${Date.now()}`,
      sourceId: selectedSource,
      targetFields: selectedTargetFields,
      outputFields: filteredOutputFields,
      config: { ...config }
    };
    
    onAddEnrichmentTask(task);
    resetForm();
  };

  // Get selected source
  const getSelectedSource = () => {
    return availableSources.find(source => source.id === selectedSource);
  };

  // Render config form based on selected source
  const renderConfigForm = () => {
    const source = getSelectedSource();
    if (!source) return null;
    
    switch (source.type) {
      case 'api':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Endpoint
              </label>
              <input
                type="text"
                value={config.endpoint || ''}
                onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                placeholder="https://api.example.com/data"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Method
              </label>
              <select
                value={config.method || 'GET'}
                onChange={(e) => setConfig({ ...config, method: e.target.value })}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Key Parameter (if needed)
              </label>
              <input
                type="text"
                value={config.apiKeyParam || ''}
                onChange={(e) => setConfig({ ...config, apiKeyParam: e.target.value })}
                placeholder="api_key"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        );
      
      case 'calculation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Formula
              </label>
              <textarea
                value={config.formula || ''}
                onChange={(e) => setConfig({ ...config, formula: e.target.value })}
                placeholder="e.g., {price} * {quantity}"
                rows={3}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Use field names in curly braces, e.g., {'{price}'} * {'{quantity}'}
              </p>
            </div>
          </div>
        );
      
      case 'lookup':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lookup Table
              </label>
              <textarea
                value={config.lookupTable || ''}
                onChange={(e) => setConfig({ ...config, lookupTable: e.target.value })}
                placeholder="key1: value1\nkey2: value2"
                rows={4}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter key-value pairs, one per line, or paste JSON/CSV data
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Value (if no match)
              </label>
              <input
                type="text"
                value={config.defaultValue || ''}
                onChange={(e) => setConfig({ ...config, defaultValue: e.target.value })}
                placeholder="Default value if no match found"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        );
      
      case 'ml':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ML Model
              </label>
              <select
                value={config.model || 'sentiment'}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="sentiment">Sentiment Analysis</option>
                <option value="classification">Text Classification</option>
                <option value="entityExtraction">Entity Extraction</option>
                <option value="summarization">Text Summarization</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Model Configuration
              </label>
              <textarea
                value={config.modelConfig || ''}
                onChange={(e) => setConfig({ ...config, modelConfig: e.target.value })}
                placeholder="JSON configuration for the model"
                rows={3}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
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
        <SparklesIcon className="h-5 w-5 mr-1" aria-hidden="true" />
        <span>Data Enrichment</span>
        {activeTasks.length > 0 && (
          <span className="ml-1.5 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
            {activeTasks.length}
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
                      Data Enrichment
                    </h3>
                    
                    <div className="mt-4 space-y-4">
                      {/* Enrichment source */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Enrichment Source
                        </label>
                        <select
                          value={selectedSource}
                          onChange={(e) => {
                            setSelectedSource(e.target.value);
                            setConfig({});
                          }}
                          className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          {availableSources.map((source) => (
                            <option key={source.id} value={source.id}>
                              {source.name} ({source.type})
                            </option>
                          ))}
                        </select>
                        {getSelectedSource()?.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {getSelectedSource()?.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Target fields */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Target Fields (Input)
                        </label>
                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 dark:border-gray-600">
                          <div className="grid grid-cols-2 gap-2">
                            {fields.map((field) => (
                              <div key={field.id} className="flex items-center">
                                <input
                                  id={`field-${field.id}`}
                                  type="checkbox"
                                  checked={selectedTargetFields.includes(field.id)}
                                  onChange={() => toggleTargetField(field.id)}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
                                />
                                <label
                                  htmlFor={`field-${field.id}`}
                                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300 truncate"
                                >
                                  {field.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Output fields */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Output Fields
                          </label>
                          <button
                            type="button"
                            onClick={addOutputField}
                            className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center"
                          >
                            <PlusIcon className="h-3 w-3 mr-1" />
                            Add Field
                          </button>
                        </div>
                        {outputFields.map((field, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <input
                              type="text"
                              value={field}
                              onChange={(e) => handleOutputFieldChange(index, e.target.value)}
                              placeholder="Output field name"
                              className="flex-grow rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {outputFields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeOutputField(index)}
                                className="ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Source-specific configuration */}
                      {renderConfigForm()}
                      
                      {/* Add task button */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddTask}
                          disabled={!selectedSource || selectedTargetFields.length === 0 || !outputFields[0]}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
                        >
                          Add Enrichment Task
                        </button>
                      </div>
                    </div>
                    
                    {/* Active tasks */}
                    {activeTasks.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Active Enrichment Tasks
                        </h4>
                        
                        <div className="border rounded-md overflow-hidden dark:border-gray-700">
                          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto">
                            {activeTasks.map((task) => {
                              const source = availableSources.find(s => s.id === task.sourceId) || { name: 'Unknown', type: 'api' as const };
                              const targetFieldNames = task.targetFields.map(id => {
                                const field = fields.find(f => f.id === id);
                                return field ? field.name : id;
                              }).join(', ');
                              
                              return (
                                <li key={task.id} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {source.name} ({source.type})
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      Input: {targetFieldNames}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      Output: {task.outputFields.join(', ')}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => onRemoveEnrichmentTask(task.id)}
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

export default DataEnrichmentInterface;
