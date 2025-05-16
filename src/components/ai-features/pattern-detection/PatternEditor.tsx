import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlayIcon, 
  ClipboardDocumentIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Pattern, PatternType } from './types';
import PatternTypeSelector from './PatternTypeSelector';
import TextPatternForm from './pattern-forms/TextPatternForm';
import RegexPatternForm from './pattern-forms/RegexPatternForm';
import CssPatternForm from './pattern-forms/CssPatternForm';
import XPathPatternForm from './pattern-forms/XPathPatternForm';
import AttributePatternForm from './pattern-forms/AttributePatternForm';
import TablePatternForm from './pattern-forms/TablePatternForm';
import ListPatternForm from './pattern-forms/ListPatternForm';
import NestedPatternForm from './pattern-forms/NestedPatternForm';

interface PatternEditorProps {
  initialPattern?: Pattern;
  onSave: (pattern: Pattern) => void;
  onTest?: (pattern: Pattern) => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * PatternEditor component - The main interface for creating and editing extraction patterns
 * Supports multiple pattern types and provides a visual editor for each type
 */
const PatternEditor: React.FC<PatternEditorProps> = ({
  initialPattern,
  onSave,
  onTest,
  onCancel,
  className = '',
}) => {
  // Default new pattern template
  const createDefaultPattern = (type: PatternType): Pattern => {
    const basePattern = {
      id: `pattern_${Date.now()}`,
      name: 'New Pattern',
      type,
      description: '',
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    switch (type) {
      case 'text':
        return {
          ...basePattern,
          type: 'text',
          content: '',
          isCaseSensitive: false,
          isWholeWord: false,
        };
      case 'regex':
        return {
          ...basePattern,
          type: 'regex',
          expression: '',
          flags: 'gi',
          groups: [],
        };
      case 'css':
        return {
          ...basePattern,
          type: 'css',
          selector: '',
          multiple: true,
        };
      case 'xpath':
        return {
          ...basePattern,
          type: 'xpath',
          path: '',
          multiple: true,
        };
      case 'attribute':
        return {
          ...basePattern,
          type: 'attribute',
          elementSelector: '',
          attributeName: '',
        };
      case 'table':
        return {
          ...basePattern,
          type: 'table',
          tableSelector: 'table',
          rowSelector: 'tr',
          cellSelector: 'td',
          includeHeaders: true,
        };
      case 'list':
        return {
          ...basePattern,
          type: 'list',
          listSelector: 'ul, ol',
          itemSelector: 'li',
          extractItemText: true,
        };
      case 'nested':
        return {
          ...basePattern,
          type: 'nested',
          rootSelector: '',
          children: [],
        };
      default:
        return {
          ...basePattern,
          type: 'text',
          content: '',
          isCaseSensitive: false,
          isWholeWord: false,
        };
    }
  };

  // State for the current pattern being edited
  const [pattern, setPattern] = useState<Pattern>(
    initialPattern || createDefaultPattern('text')
  );
  
  // State for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // State to track if the form has been modified
  const [isDirty, setIsDirty] = useState(false);
  
  // State for handling form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle pattern type change
  const handleTypeChange = (newType: PatternType) => {
    if (newType === pattern.type) return;
    
    if (isDirty && !confirm('Changing pattern type will reset your current pattern. Continue?')) {
      return;
    }
    
    setPattern(createDefaultPattern(newType));
    setErrors({});
    setIsDirty(false);
  };
  
  // Generic handler for pattern property changes
  const handlePatternChange = <T extends Pattern>(updates: Partial<T>) => {
    setPattern(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  };
  
  // Validate the pattern before saving
  const validatePattern = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Common validations for all pattern types
    if (!pattern.name.trim()) {
      newErrors.name = 'Pattern name is required';
    }
    
    // Type-specific validations
    switch (pattern.type) {
      case 'text':
        if (!(pattern as any).content?.trim()) {
          newErrors.content = 'Text content is required';
        }
        break;
      case 'regex':
        if (!(pattern as any).expression?.trim()) {
          newErrors.expression = 'Regular expression is required';
        } else {
          // Validate regex syntax
          try {
            new RegExp((pattern as any).expression, (pattern as any).flags);
          } catch (e) {
            newErrors.expression = `Invalid regular expression: ${e instanceof Error ? e.message : 'Syntax error'}`;
          }
        }
        break;
      case 'css':
        if (!(pattern as any).selector?.trim()) {
          newErrors.selector = 'CSS selector is required';
        }
        break;
      case 'xpath':
        if (!(pattern as any).path?.trim()) {
          newErrors.path = 'XPath is required';
        }
        break;
      case 'attribute':
        if (!(pattern as any).elementSelector?.trim()) {
          newErrors.elementSelector = 'Element selector is required';
        }
        if (!(pattern as any).attributeName?.trim()) {
          newErrors.attributeName = 'Attribute name is required';
        }
        break;
      case 'table':
        if (!(pattern as any).tableSelector?.trim()) {
          newErrors.tableSelector = 'Table selector is required';
        }
        if (!(pattern as any).rowSelector?.trim()) {
          newErrors.rowSelector = 'Row selector is required';
        }
        if (!(pattern as any).cellSelector?.trim()) {
          newErrors.cellSelector = 'Cell selector is required';
        }
        break;
      case 'list':
        if (!(pattern as any).listSelector?.trim()) {
          newErrors.listSelector = 'List selector is required';
        }
        if (!(pattern as any).itemSelector?.trim()) {
          newErrors.itemSelector = 'Item selector is required';
        }
        break;
      case 'nested':
        if (!(pattern as any).rootSelector?.trim()) {
          newErrors.rootSelector = 'Root selector is required';
        }
        if ((pattern as any).children?.length === 0) {
          newErrors.children = 'At least one child pattern is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePattern()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      onSave(pattern);
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving pattern:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle test pattern
  const handleTest = () => {
    if (!validatePattern()) {
      return;
    }
    
    onTest?.(pattern);
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    
    onCancel?.();
  };
  
  // Render the appropriate form based on pattern type
  const renderPatternForm = () => {
    switch (pattern.type) {
      case 'text':
        return (
          <TextPatternForm
            pattern={pattern}
            onChange={handlePatternChange}
            errors={errors}
          />
        );
      case 'regex':
        return (
          <RegexPatternForm
            pattern={pattern}
            onChange={handlePatternChange}
            errors={errors}
          />
        );
      case 'css':
        return (
          <CssPatternForm
            pattern={pattern}
            onChange={handlePatternChange}
            errors={errors}
          />
        );
      case 'xpath':
        return (
          <XPathPatternForm
            pattern={pattern}
            onChange={handlePatternChange}
            errors={errors}
          />
        );
      case 'attribute':
        return (
          <AttributePatternForm
            pattern={pattern}
            onChange={handlePatternChange}
            errors={errors}
          />
        );
      case 'table':
        return (
          <TablePatternForm
            pattern={pattern}
            onChange={handlePatternChange}
            errors={errors}
          />
        );
      case 'list':
        return (
          <ListPatternForm
            pattern={pattern}
            onChange={handlePatternChange}
            errors={errors}
          />
        );
      case 'nested':
        return (
          <NestedPatternForm
            pattern={pattern}
            onChange={handlePatternChange}
            errors={errors}
          />
        );
      default:
        return <div>Unsupported pattern type</div>;
    }
  };
  
  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Pattern header with name and type selector */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
              <div className="sm:col-span-3">
                <label htmlFor="pattern-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pattern Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="pattern-name"
                    value={pattern.name}
                    onChange={(e) => handlePatternChange({ name: e.target.value })}
                    className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                      errors.name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pattern Type
                </label>
                <div className="mt-1">
                  <PatternTypeSelector
                    selectedType={pattern.type}
                    onChange={handleTypeChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Pattern description */}
            <div>
              <label htmlFor="pattern-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="pattern-description"
                  rows={2}
                  value={pattern.description || ''}
                  onChange={(e) => handlePatternChange({ description: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Optional description of what this pattern extracts"
                />
              </div>
            </div>
            
            {/* Render type-specific form */}
            <div className="p-4 bg-gray-50 rounded-md dark:bg-gray-750">
              {renderPatternForm()}
            </div>
            
            {/* Form actions */}
            <div className="flex justify-end space-x-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
              
              {onTest && (
                <button
                  type="button"
                  onClick={handleTest}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Test Pattern
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Save Pattern
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatternEditor;
