import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export interface ValidationRule {
  id: string;
  field: string;
  type: 'required' | 'type' | 'range' | 'pattern' | 'length' | 'custom' | 'enum';
  message: string;
  config: {
    [key: string]: any;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: { field: string; message: string }[];
}

interface ValidationRuleBuilderProps {
  fields: { id: string; name: string; type?: string }[];
  onAddRule: (rule: ValidationRule) => void;
  onRemoveRule: (ruleId: string) => void;
  rules: ValidationRule[];
  className?: string;
}

/**
 * Component for building validation rules to ensure data quality
 * Supports various validation types including required fields, data types, 
 * value ranges, patterns, and custom validation logic
 */
const ValidationRuleBuilder: React.FC<ValidationRuleBuilderProps> = ({
  fields,
  onAddRule,
  onRemoveRule,
  rules,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string>(fields[0]?.id || '');
  const [validationType, setValidationType] = useState<ValidationRule['type']>('required');
  const [errorMessage, setErrorMessage] = useState('');
  const [config, setConfig] = useState<Record<string, any>>({});

  // Toggle panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Reset form
  const resetForm = () => {
    setSelectedField(fields[0]?.id || '');
    setValidationType('required');
    setErrorMessage('');
    setConfig({});
  };

  // Add a validation rule
  const handleAddRule = () => {
    if (!selectedField || !errorMessage) return;

    const rule: ValidationRule = {
      id: `rule-${Date.now()}`,
      field: selectedField,
      type: validationType,
      message: errorMessage,
      config: { ...config }
    };

    onAddRule(rule);
    resetForm();
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={togglePanel}
        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        <CheckCircleIcon className="h-5 w-5 mr-1" aria-hidden="true" />
        <span>Validation Rules</span>
        {rules.length > 0 && (
          <span className="ml-1.5 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
            {rules.length}
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
                      Data Validation Rules
                    </h3>
                    
                    <div className="mt-4 space-y-4">
                      {/* Field selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Field
                        </label>
                        <select
                          value={selectedField}
                          onChange={(e) => setSelectedField(e.target.value)}
                          className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          {fields.map((field) => (
                            <option key={field.id} value={field.id}>
                              {field.name} {field.type ? `(${field.type})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Validation type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Validation Type
                        </label>
                        <select
                          value={validationType}
                          onChange={(e) => {
                            setValidationType(e.target.value as ValidationRule['type']);
                            setConfig({});
                          }}
                          className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="required">Required Field</option>
                          <option value="type">Data Type</option>
                          <option value="range">Value Range</option>
                          <option value="pattern">Pattern Match</option>
                          <option value="length">Length Check</option>
                          <option value="enum">Allowed Values</option>
                          <option value="custom">Custom Rule</option>
                        </select>
                      </div>
                      
                      {/* Configuration based on validation type */}
                      <div>
                        {validationType === 'required' && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Field must have a non-empty value.
                          </div>
                        )}
                        
                        {validationType === 'type' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Expected Type
                            </label>
                            <select
                              value={config.dataType || 'string'}
                              onChange={(e) => setConfig({ ...config, dataType: e.target.value })}
                              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="boolean">Boolean</option>
                              <option value="date">Date</option>
                              <option value="email">Email</option>
                              <option value="url">URL</option>
                            </select>
                          </div>
                        )}
                        
                        {validationType === 'range' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Minimum Value
                              </label>
                              <input
                                type="text"
                                value={config.min || ''}
                                onChange={(e) => setConfig({ ...config, min: e.target.value })}
                                placeholder="Minimum"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Maximum Value
                              </label>
                              <input
                                type="text"
                                value={config.max || ''}
                                onChange={(e) => setConfig({ ...config, max: e.target.value })}
                                placeholder="Maximum"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                          </div>
                        )}
                        
                        {validationType === 'pattern' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Regular Expression
                            </label>
                            <input
                              type="text"
                              value={config.pattern || ''}
                              onChange={(e) => setConfig({ ...config, pattern: e.target.value })}
                              placeholder="e.g., ^[A-Z][a-z]+$"
                              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                        )}
                        
                        {validationType === 'length' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Minimum Length
                              </label>
                              <input
                                type="number"
                                value={config.minLength || ''}
                                onChange={(e) => setConfig({ ...config, minLength: e.target.value })}
                                placeholder="Min Length"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Maximum Length
                              </label>
                              <input
                                type="number"
                                value={config.maxLength || ''}
                                onChange={(e) => setConfig({ ...config, maxLength: e.target.value })}
                                placeholder="Max Length"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                          </div>
                        )}
                        
                        {validationType === 'enum' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Allowed Values (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={config.values || ''}
                              onChange={(e) => setConfig({ ...config, values: e.target.value })}
                              placeholder="e.g., red, green, blue"
                              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                        )}
                        
                        {validationType === 'custom' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Custom Validation Expression
                            </label>
                            <textarea
                              value={config.expression || ''}
                              onChange={(e) => setConfig({ ...config, expression: e.target.value })}
                              placeholder="e.g., value !== null && value.length > 0"
                              rows={3}
                              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Use 'value' to refer to the field value in your expression.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Error message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Error Message
                        </label>
                        <input
                          type="text"
                          value={errorMessage}
                          onChange={(e) => setErrorMessage(e.target.value)}
                          placeholder="Error message to display when validation fails"
                          className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      
                      {/* Add rule button */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddRule}
                          disabled={!selectedField || !errorMessage}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
                        >
                          Add Rule
                        </button>
                      </div>
                    </div>
                    
                    {/* Current rules */}
                    {rules.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Active Validation Rules
                        </h4>
                        
                        <div className="border rounded-md overflow-hidden dark:border-gray-700">
                          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto">
                            {rules.map((rule) => {
                              const fieldName = fields.find(f => f.id === rule.field)?.name || rule.field;
                              
                              return (
                                <li key={rule.id} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {fieldName} – {getValidationTypeName(rule.type)}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {rule.message}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => onRemoveRule(rule.id)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <XCircleIcon className="h-5 w-5" />
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

// Helper function to get human-readable validation type names
function getValidationTypeName(type: ValidationRule['type']): string {
  switch (type) {
    case 'required': return 'Required Field';
    case 'type': return 'Data Type Check';
    case 'range': return 'Value Range';
    case 'pattern': return 'Pattern Match';
    case 'length': return 'Length Check';
    case 'enum': return 'Allowed Values';
    case 'custom': return 'Custom Rule';
    default: return 'Validation Rule';
  }
}

export default ValidationRuleBuilder;
