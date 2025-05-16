import React, { useState } from 'react';
import { ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';

export interface NormalizationRule {
  id: string;
  field: string;
  type: 'standardize' | 'replaceValues' | 'trim' | 'case' | 'removeSpecialChars' | 'formatNumber' | 'formatDate';
  config: Record<string, any>;
}

interface DataNormalizationToolsProps {
  fields: { id: string; name: string; type?: string }[];
  onApplyNormalization: (rules: NormalizationRule[]) => void;
  className?: string;
}

/**
 * Tools for standardizing and normalizing data across records
 * Supports various normalization operations like case standardization, 
 * value replacement, and special character handling
 */
const DataNormalizationTools: React.FC<DataNormalizationToolsProps> = ({
  fields,
  onApplyNormalization,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<NormalizationRule['type']>('standardize');
  const [selectedField, setSelectedField] = useState<string>(fields[0]?.id || '');
  const [rules, setRules] = useState<NormalizationRule[]>([]);
  const [ruleConfig, setRuleConfig] = useState<Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(false);

  // Toggle panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Add a new rule
  const addRule = () => {
    if (!selectedField) return;
    
    const newRule: NormalizationRule = {
      id: `rule-${Date.now()}`,
      field: selectedField,
      type: activeTab,
      config: { ...ruleConfig }
    };
    
    setRules([...rules, newRule]);
    
    // Reset form
    setRuleConfig({});
  };

  // Remove a rule
  const removeRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  // Apply all rules
  const applyRules = () => {
    if (rules.length === 0) return;
    
    onApplyNormalization(rules);
    setIsOpen(false);
  };

  // Handle config change
  const handleConfigChange = (key: string, value: any) => {
    setRuleConfig({
      ...ruleConfig,
      [key]: value
    });
  };

  // Get appropriate configuration form based on active tab
  const getRuleConfigForm = () => {
    switch (activeTab) {
      case 'standardize':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Standardization Type
              </label>
              <select
                value={ruleConfig.standardType || 'values'}
                onChange={(e) => handleConfigChange('standardType', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="values">Common Value Standardization</option>
                <option value="distribution">Statistical Standardization (z-score)</option>
                <option value="minmax">Min-Max Scaling</option>
              </select>
            </div>

            {ruleConfig.standardType === 'values' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Value Mappings
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const mappings = ruleConfig.mappings || [];
                      handleConfigChange('mappings', [...mappings, { from: '', to: '' }]);
                    }}
                    className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    Add Mapping
                  </button>
                </div>
                
                {(ruleConfig.mappings || []).map((mapping: {from: string, to: string}, index: number) => (
                  <div key={index} className="grid grid-cols-5 gap-2 items-center">
                    <input
                      type="text"
                      value={mapping.from}
                      onChange={(e) => {
                        const mappings = [...(ruleConfig.mappings || [])];
                        mappings[index] = { ...mappings[index], from: e.target.value };
                        handleConfigChange('mappings', mappings);
                      }}
                      placeholder="From value"
                      className="col-span-2 rounded-md border border-gray-300 py-1 px-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <div className="col-span-1 text-center">→</div>
                    <input
                      type="text"
                      value={mapping.to}
                      onChange={(e) => {
                        const mappings = [...(ruleConfig.mappings || [])];
                        mappings[index] = { ...mappings[index], to: e.target.value };
                        handleConfigChange('mappings', mappings);
                      }}
                      placeholder="To value"
                      className="col-span-2 rounded-md border border-gray-300 py-1 px-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            )}

            {(ruleConfig.standardType === 'distribution' || ruleConfig.standardType === 'minmax') && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {ruleConfig.standardType === 'distribution' 
                  ? 'Values will be standardized using z-scores (mean 0, standard deviation 1).'
                  : 'Values will be scaled to a range between 0 and 1.'}
              </div>
            )}
          </div>
        );
      
      case 'replaceValues':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Find what:
              </label>
              <input
                type="text"
                value={ruleConfig.find || ''}
                onChange={(e) => handleConfigChange('find', e.target.value)}
                placeholder="Text or pattern to find"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Replace with:
              </label>
              <input
                type="text"
                value={ruleConfig.replace || ''}
                onChange={(e) => handleConfigChange('replace', e.target.value)}
                placeholder="Replacement text"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="use-regex"
                type="checkbox"
                checked={ruleConfig.useRegex || false}
                onChange={(e) => handleConfigChange('useRegex', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
              />
              <label
                htmlFor="use-regex"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Use regular expression
              </label>
            </div>
          </div>
        );
      
      case 'trim':
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="trim-leading"
                type="checkbox"
                checked={ruleConfig.trimLeading !== false}
                onChange={(e) => handleConfigChange('trimLeading', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
              />
              <label
                htmlFor="trim-leading"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Trim leading whitespace
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="trim-trailing"
                type="checkbox"
                checked={ruleConfig.trimTrailing !== false}
                onChange={(e) => handleConfigChange('trimTrailing', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
              />
              <label
                htmlFor="trim-trailing"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Trim trailing whitespace
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="remove-extra"
                type="checkbox"
                checked={ruleConfig.removeExtra || false}
                onChange={(e) => handleConfigChange('removeExtra', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
              />
              <label
                htmlFor="remove-extra"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remove extra whitespace (replace multiple spaces with single space)
              </label>
            </div>
          </div>
        );
      
      case 'case':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Case Transformation
              </label>
              <select
                value={ruleConfig.caseType || 'lower'}
                onChange={(e) => handleConfigChange('caseType', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="lower">lowercase</option>
                <option value="upper">UPPERCASE</option>
                <option value="title">Title Case</option>
                <option value="sentence">Sentence case</option>
              </select>
            </div>
          </div>
        );
      
      case 'removeSpecialChars':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Characters to Remove
              </label>
              <input
                type="text"
                value={ruleConfig.chars || ''}
                onChange={(e) => handleConfigChange('chars', e.target.value)}
                placeholder="e.g., !@#$%^&*()"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave empty to remove all non-alphanumeric characters
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                id="keep-spaces"
                type="checkbox"
                checked={ruleConfig.keepSpaces || false}
                onChange={(e) => handleConfigChange('keepSpaces', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
              />
              <label
                htmlFor="keep-spaces"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Keep spaces
              </label>
            </div>
          </div>
        );
      
      case 'formatNumber':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number Format
              </label>
              <select
                value={ruleConfig.numberFormat || 'standard'}
                onChange={(e) => handleConfigChange('numberFormat', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="standard">Standard (1,234.56)</option>
                <option value="scientific">Scientific (1.23e+3)</option>
                <option value="compact">Compact (1.2K)</option>
                <option value="integer">Integer (1235)</option>
                <option value="percent">Percent (123.5%)</option>
                <option value="currency">Currency ($1,234.56)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Decimal Places
              </label>
              <input
                type="number"
                value={ruleConfig.decimalPlaces || 2}
                onChange={(e) => handleConfigChange('decimalPlaces', parseInt(e.target.value))}
                min="0"
                max="10"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {ruleConfig.numberFormat === 'currency' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={ruleConfig.currencySymbol || '$'}
                  onChange={(e) => handleConfigChange('currencySymbol', e.target.value)}
                  placeholder="$"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}
          </div>
        );
      
      case 'formatDate':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Input Format
              </label>
              <input
                type="text"
                value={ruleConfig.inputFormat || 'YYYY-MM-DD'}
                onChange={(e) => handleConfigChange('inputFormat', e.target.value)}
                placeholder="YYYY-MM-DD"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Format of the current date values (YYYY-MM-DD, MM/DD/YYYY, etc.)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Format
              </label>
              <input
                type="text"
                value={ruleConfig.outputFormat || 'YYYY-MM-DD'}
                onChange={(e) => handleConfigChange('outputFormat', e.target.value)}
                placeholder="YYYY-MM-DD"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Format for the standardized date values
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                id="auto-detect"
                type="checkbox"
                checked={ruleConfig.autoDetect || false}
                onChange={(e) => handleConfigChange('autoDetect', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600"
              />
              <label
                htmlFor="auto-detect"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Auto-detect input format
              </label>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render tab button
  const renderTabButton = (tabId: NormalizationRule['type'], label: string) => (
    <button
      type="button"
      onClick={() => setActiveTab(tabId)}
      className={`px-3 py-2 text-sm font-medium rounded-md ${
        activeTab === tabId
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className={className}>
      <button
        type="button"
        onClick={togglePanel}
        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        <SparklesIcon className="h-5 w-5 mr-1" aria-hidden="true" />
        <span>Normalize Data</span>
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
                      Data Normalization
                    </h3>
                    
                    <div className="mt-4">
                      {/* Field selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Field to normalize:
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
                      
                      {/* Normalization type tabs */}
                      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex overflow-x-auto space-x-1">
                          {renderTabButton('standardize', 'Standardize')}
                          {renderTabButton('replaceValues', 'Replace Values')}
                          {renderTabButton('trim', 'Trim Whitespace')}
                          {renderTabButton('case', 'Case Conversion')}
                          {renderTabButton('removeSpecialChars', 'Remove Special Chars')}
                          {renderTabButton('formatNumber', 'Format Numbers')}
                          {renderTabButton('formatDate', 'Format Dates')}
                        </div>
                      </div>
                      
                      {/* Configuration form for the selected normalization type */}
                      <div className="mb-4">
                        {getRuleConfigForm()}
                      </div>

                      {/* Add rule button */}
                      <div className="flex justify-end mb-4">
                        <button
                          type="button"
                          onClick={addRule}
                          disabled={!selectedField}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
                        >
                          Add Rule
                        </button>
                      </div>
                      
                      {/* Current rules */}
                      {rules.length > 0 && (
                        <div className="border rounded-md p-4 dark:border-gray-700">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Normalization Rules ({rules.length})
                          </h4>
                          
                          <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {rules.map((rule) => {
                              const fieldName = fields.find(f => f.id === rule.field)?.name || rule.field;
                              
                              return (
                                <li key={rule.id} className="flex justify-between items-center bg-gray-50 p-2 rounded dark:bg-gray-700">
                                  <span className="text-sm text-gray-800 dark:text-gray-200">
                                    {fieldName} – {getRuleDescription(rule)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeRule(rule.id)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse dark:bg-gray-700">
                <button
                  type="button"
                  onClick={applyRules}
                  disabled={rules.length === 0}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  Apply Normalization
                </button>
                <button
                  type="button"
                  onClick={togglePanel}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
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

// Helper function to get a readable description of a rule
function getRuleDescription(rule: NormalizationRule): string {
  switch (rule.type) {
    case 'standardize':
      if (rule.config.standardType === 'values') {
        return 'Map values to standard formats';
      } else if (rule.config.standardType === 'distribution') {
        return 'Apply z-score standardization';
      } else if (rule.config.standardType === 'minmax') {
        return 'Apply min-max scaling';
      }
      return 'Standardize values';
    
    case 'replaceValues':
      return `Replace "${rule.config.find || ''}" with "${rule.config.replace || ''}"${rule.config.useRegex ? ' (RegEx)' : ''}`;
    
    case 'trim':
      const parts = [];
      if (rule.config.trimLeading !== false) parts.push('leading');
      if (rule.config.trimTrailing !== false) parts.push('trailing');
      if (rule.config.removeExtra) parts.push('extra');
      return `Trim ${parts.join(', ')} whitespace`;
    
    case 'case':
      const caseType = rule.config.caseType || 'lower';
      return `Convert to ${caseType === 'lower' ? 'lowercase' : caseType === 'upper' ? 'UPPERCASE' : caseType === 'title' ? 'Title Case' : 'Sentence case'}`;
    
    case 'removeSpecialChars':
      return `Remove special characters${rule.config.keepSpaces ? ' (keep spaces)' : ''}`;
    
    case 'formatNumber':
      const format = rule.config.numberFormat || 'standard';
      return `Format as ${format} number with ${rule.config.decimalPlaces || 2} decimal places`;
    
    case 'formatDate':
      return `Format dates to ${rule.config.outputFormat || 'YYYY-MM-DD'}`;
    
    default:
      return 'Apply normalization';
  }
}

export default DataNormalizationTools;
