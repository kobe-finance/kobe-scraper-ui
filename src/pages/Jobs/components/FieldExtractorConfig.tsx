import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Input } from '../../../components';
import type { JobFormValues } from './types';

interface FieldExtractorProps {
  disabled?: boolean;
}

export const FieldExtractorConfig: React.FC<FieldExtractorProps> = ({ disabled = false }) => {
  const { control, register, watch, formState: { errors } } = useFormContext<JobFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'extractionFields',
  });
  
  const selectorType = watch('selectorType');
  
  // Get placeholder based on selector type
  const getSelectorPlaceholder = (type: string) => {
    switch (type) {
      case 'css':
        return '.product-title, h1.title';
      case 'xpath':
        return '//div[@class="price"]/span';
      case 'json':
        return '$.product.price';
      case 'regex':
        return 'Price:\\s*\\$(\\d+\\.\\d+)';
      default:
        return 'Enter selector';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Fields</h4>
        <Button 
          type="button" 
          size="sm" 
          variant="outline"
          onClick={() => append({ 
            name: '', 
            selector: '', 
            selectorType: selectorType, 
            required: true,
            dataType: 'string',
            description: ''
          })}
          disabled={disabled}
        >
          Add Field
        </Button>
      </div>
      
      {fields.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No data fields configured. Add fields to extract specific data from the target pages.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div 
              key={field.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between mb-3">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Field {index + 1}
                </h5>
                <div className="flex space-x-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => move(index, index - 1)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      disabled={disabled}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="sr-only">Move up</span>
                    </button>
                  )}
                  {index < fields.length - 1 && (
                    <button
                      type="button"
                      onClick={() => move(index, index + 1)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      disabled={disabled}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <span className="sr-only">Move down</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    disabled={disabled}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="sr-only">Remove</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor={`extractionFields.${index}.name`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Field Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id={`extractionFields.${index}.name`}
                    {...register(`extractionFields.${index}.name` as const)}
                    placeholder="price, title, description, etc."
                    disabled={disabled}
                  />
                  {errors.extractionFields?.[index]?.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.extractionFields[index]?.name?.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor={`extractionFields.${index}.selector`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selector <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id={`extractionFields.${index}.selector`}
                    {...register(`extractionFields.${index}.selector` as const)}
                    placeholder={getSelectorPlaceholder(selectorType)}
                    disabled={disabled}
                  />
                  {errors.extractionFields?.[index]?.selector && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.extractionFields[index]?.selector?.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor={`extractionFields.${index}.selectorType`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selector Type
                  </label>
                  <select
                    id={`extractionFields.${index}.selectorType`}
                    {...register(`extractionFields.${index}.selectorType` as const)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                    disabled={disabled}
                  >
                    <option value="css">CSS Selector</option>
                    <option value="xpath">XPath</option>
                    <option value="json">JSON Path</option>
                    <option value="regex">Regular Expression</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor={`extractionFields.${index}.dataType`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Data Type
                  </label>
                  <select
                    id={`extractionFields.${index}.dataType`}
                    {...register(`extractionFields.${index}.dataType` as const)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                    disabled={disabled}
                  >
                    <option value="string">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                    <option value="array">Array</option>
                    <option value="url">URL</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor={`extractionFields.${index}.description`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description (Optional)
                  </label>
                  <Input
                    id={`extractionFields.${index}.description`}
                    {...register(`extractionFields.${index}.description` as const)}
                    placeholder="Description of what this field represents"
                    disabled={disabled}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      id={`extractionFields.${index}.required`}
                      type="checkbox"
                      {...register(`extractionFields.${index}.required` as const)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      disabled={disabled}
                    />
                    <label htmlFor={`extractionFields.${index}.required`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Required field (job will fail if this cannot be extracted)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
