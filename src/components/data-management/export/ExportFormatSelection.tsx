import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

export interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  icon: React.ReactNode;
  description: string;
}

interface ExportFormatSelectionProps {
  formats: ExportFormat[];
  selectedFormat: string;
  onSelectFormat: (formatId: string) => void;
  className?: string;
}

/**
 * Component for selecting data export formats
 * Displays available formats with visual indicators and descriptions
 */
const ExportFormatSelection: React.FC<ExportFormatSelectionProps> = ({
  formats,
  selectedFormat,
  onSelectFormat,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-base font-medium text-gray-900 dark:text-white">
        Export Format
      </h3>
      
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((format) => {
          const isSelected = format.id === selectedFormat;
          
          return (
            <div
              key={format.id}
              className={`
                relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none 
                ${isSelected 
                  ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20' 
                  : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'}
              `}
              onClick={() => onSelectFormat(format.id)}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    {format.icon}
                  </div>
                  <div className="ml-4">
                    <span className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{format.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">(.{format.extension})</span>
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{format.description}</p>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-white dark:bg-primary-400 dark:text-gray-900">
                    <CheckIcon className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExportFormatSelection;
