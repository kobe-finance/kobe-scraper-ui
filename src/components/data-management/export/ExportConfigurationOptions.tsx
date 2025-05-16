import React from 'react';
import { DocumentTextIcon, DocumentIcon, TableCellsIcon, PhotoIcon } from '@heroicons/react/24/outline';

export interface FormatConfig {
  id: string;
  formatId: string;
  options: Record<string, any>;
}

interface ExportConfigurationOptionsProps {
  formatId: string;
  config: FormatConfig;
  onUpdateConfig: (config: FormatConfig) => void;
  className?: string;
}

/**
 * Component for configuring export format-specific options
 * Displays different configuration options based on the selected format
 */
const ExportConfigurationOptions: React.FC<ExportConfigurationOptionsProps> = ({
  formatId,
  config,
  onUpdateConfig,
  className = ''
}) => {
  // Update a specific option
  const updateOption = (key: string, value: any) => {
    const updatedConfig = {
      ...config,
      options: {
        ...config.options,
        [key]: value
      }
    };
    onUpdateConfig(updatedConfig);
  };

  // Render configuration options based on format
  const renderFormatOptions = () => {
    switch (formatId) {
      case 'json':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="json-pretty" className="flex items-center">
                <input
                  id="json-pretty"
                  type="checkbox"
                  checked={config.options.prettyPrint ?? true}
                  onChange={(e) => updateOption('prettyPrint', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Pretty print (format with indentation)
                </span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Indentation Spaces
              </label>
              <select
                value={config.options.indentation ?? 2}
                onChange={(e) => updateOption('indentation', Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="json-metadata" className="flex items-center">
                <input
                  id="json-metadata"
                  type="checkbox"
                  checked={config.options.includeMetadata ?? true}
                  onChange={(e) => updateOption('includeMetadata', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Include metadata
                </span>
              </label>
            </div>
          </div>
        );
      
      case 'csv':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Delimiter
              </label>
              <select
                value={config.options.delimiter ?? ','}
                onChange={(e) => updateOption('delimiter', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="csv-header" className="flex items-center">
                <input
                  id="csv-header"
                  type="checkbox"
                  checked={config.options.includeHeader ?? true}
                  onChange={(e) => updateOption('includeHeader', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Include header row
                </span>
              </label>
            </div>
            
            <div>
              <label htmlFor="csv-quotes" className="flex items-center">
                <input
                  id="csv-quotes"
                  type="checkbox"
                  checked={config.options.quoteStrings ?? true}
                  onChange={(e) => updateOption('quoteStrings', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Quote string values
                </span>
              </label>
            </div>
          </div>
        );
      
      case 'xlsx':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="xlsx-sheets" className="flex items-center">
                <input
                  id="xlsx-sheets"
                  type="checkbox"
                  checked={config.options.multipleSheets ?? false}
                  onChange={(e) => updateOption('multipleSheets', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Create multiple sheets (one per data type)
                </span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sheet Name
              </label>
              <input
                type="text"
                value={config.options.sheetName ?? 'Data'}
                onChange={(e) => updateOption('sheetName', e.target.value)}
                placeholder="Sheet name"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={config.options.multipleSheets}
              />
            </div>
            
            <div>
              <label htmlFor="xlsx-autofilter" className="flex items-center">
                <input
                  id="xlsx-autofilter"
                  type="checkbox"
                  checked={config.options.autoFilter ?? true}
                  onChange={(e) => updateOption('autoFilter', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable auto filter
                </span>
              </label>
            </div>
            
            <div>
              <label htmlFor="xlsx-freeze" className="flex items-center">
                <input
                  id="xlsx-freeze"
                  type="checkbox"
                  checked={config.options.freezeHeader ?? true}
                  onChange={(e) => updateOption('freezeHeader', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Freeze header row
                </span>
              </label>
            </div>
          </div>
        );
      
      case 'html':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="html-styling" className="flex items-center">
                <input
                  id="html-styling"
                  type="checkbox"
                  checked={config.options.includeStyling ?? true}
                  onChange={(e) => updateOption('includeStyling', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Include CSS styling
                </span>
              </label>
            </div>
            
            <div>
              <label htmlFor="html-interactive" className="flex items-center">
                <input
                  id="html-interactive"
                  type="checkbox"
                  checked={config.options.interactive ?? false}
                  onChange={(e) => updateOption('interactive', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Add interactive features (sorting, filtering)
                </span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Table Design
              </label>
              <select
                value={config.options.tableDesign ?? 'default'}
                onChange={(e) => updateOption('tableDesign', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="default">Default</option>
                <option value="striped">Striped Rows</option>
                <option value="bordered">Bordered</option>
                <option value="compact">Compact</option>
              </select>
            </div>
          </div>
        );
      
      case 'md':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Table Style
              </label>
              <select
                value={config.options.tableStyle ?? 'github'}
                onChange={(e) => updateOption('tableStyle', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="github">GitHub style</option>
                <option value="simple">Simple</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="md-header" className="flex items-center">
                <input
                  id="md-header"
                  type="checkbox"
                  checked={config.options.includeHeader ?? true}
                  onChange={(e) => updateOption('includeHeader', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Include document header with metadata
                </span>
              </label>
            </div>
            
            <div>
              <label htmlFor="md-toc" className="flex items-center">
                <input
                  id="md-toc"
                  type="checkbox"
                  checked={config.options.includeToc ?? false}
                  onChange={(e) => updateOption('includeToc', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Include table of contents
                </span>
              </label>
            </div>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Page Size
              </label>
              <select
                value={config.options.pageSize ?? 'a4'}
                onChange={(e) => updateOption('pageSize', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Orientation
              </label>
              <select
                value={config.options.orientation ?? 'portrait'}
                onChange={(e) => updateOption('orientation', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="pdf-header" className="flex items-center">
                <input
                  id="pdf-header"
                  type="checkbox"
                  checked={config.options.includeHeader ?? true}
                  onChange={(e) => updateOption('includeHeader', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Include document header
                </span>
              </label>
            </div>
            
            <div>
              <label htmlFor="pdf-footer" className="flex items-center">
                <input
                  id="pdf-footer"
                  type="checkbox"
                  checked={config.options.includeFooter ?? true}
                  onChange={(e) => updateOption('includeFooter', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Include page numbers in footer
                </span>
              </label>
            </div>
          </div>
        );
      
      case 'images':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image Format
              </label>
              <select
                value={config.options.format ?? 'png'}
                onChange={(e) => updateOption('format', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image Quality
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={config.options.quality ?? 80}
                  onChange={(e) => updateOption('quality', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {config.options.quality ?? 80}%
                </span>
              </div>
            </div>
            
            <div>
              <label htmlFor="img-metadata" className="flex items-center">
                <input
                  id="img-metadata"
                  type="checkbox"
                  checked={config.options.includeMetadata ?? true}
                  onChange={(e) => updateOption('includeMetadata', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Include metadata in image (EXIF)
                </span>
              </label>
            </div>
            
            <div>
              <label htmlFor="img-archive" className="flex items-center">
                <input
                  id="img-archive"
                  type="checkbox"
                  checked={config.options.createArchive ?? true}
                  onChange={(e) => updateOption('createArchive', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Create ZIP archive for multiple images
                </span>
              </label>
            </div>
          </div>
        );
      
      case 'xml':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="xml-pretty" className="flex items-center">
                <input
                  id="xml-pretty"
                  type="checkbox"
                  checked={config.options.prettyPrint ?? true}
                  onChange={(e) => updateOption('prettyPrint', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Pretty print (format with indentation)
                </span>
              </label>
            </div>
            
            <div>
              <label htmlFor="xml-declaration" className="flex items-center">
                <input
                  id="xml-declaration"
                  type="checkbox"
                  checked={config.options.includeDeclaration ?? true}
                  onChange={(e) => updateOption('includeDeclaration', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Include XML declaration
                </span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Root Element Name
              </label>
              <input
                type="text"
                value={config.options.rootElement ?? 'data'}
                onChange={(e) => updateOption('rootElement', e.target.value)}
                placeholder="Root element name"
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            No configuration options available for this format.
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-base font-medium text-gray-900 dark:text-white">
        Format Options
      </h3>
      
      <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
        {renderFormatOptions()}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          General Options
        </h3>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-4 dark:bg-gray-800">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Maximum Records
            </label>
            <input
              type="number"
              value={config.options.maxRecords ?? 0}
              onChange={(e) => updateOption('maxRecords', Number(e.target.value))}
              min="0"
              placeholder="0 for all records"
              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              0 or empty means export all records
            </p>
          </div>
          
          <div>
            <label htmlFor="include-timestamps" className="flex items-center">
              <input
                id="include-timestamps"
                type="checkbox"
                checked={config.options.includeTimestamps ?? true}
                onChange={(e) => updateOption('includeTimestamps', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Include timestamps and execution info
              </span>
            </label>
          </div>
          
          <div>
            <label htmlFor="compress" className="flex items-center">
              <input
                id="compress"
                type="checkbox"
                checked={config.options.compressed ?? false}
                onChange={(e) => updateOption('compressed', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Compress output (create .zip file)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get default icons for common export formats
export const getFormatIcon = (formatId: string): React.ReactNode => {
  switch (formatId) {
    case 'json':
    case 'xml':
      return <DocumentTextIcon className="h-6 w-6" />;
    case 'csv':
    case 'xlsx':
      return <TableCellsIcon className="h-6 w-6" />;
    case 'images':
      return <PhotoIcon className="h-6 w-6" />;
    default:
      return <DocumentIcon className="h-6 w-6" />;
  }
};

// Helper function to get default export formats
export const getDefaultExportFormats = (): ExportFormat[] => {
  return [
    {
      id: 'json',
      name: 'JSON',
      extension: 'json',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      description: 'JavaScript Object Notation format for structured data'
    },
    {
      id: 'csv',
      name: 'CSV',
      extension: 'csv',
      icon: <TableCellsIcon className="h-6 w-6" />,
      description: 'Comma-separated values for tabular data'
    },
    {
      id: 'xlsx',
      name: 'Excel',
      extension: 'xlsx',
      icon: <TableCellsIcon className="h-6 w-6" />,
      description: 'Microsoft Excel spreadsheet format'
    },
    {
      id: 'html',
      name: 'HTML',
      extension: 'html',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      description: 'Web page format with optional interactive features'
    },
    {
      id: 'md',
      name: 'Markdown',
      extension: 'md',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      description: 'Text-based markup for easy reading and writing'
    },
    {
      id: 'pdf',
      name: 'PDF',
      extension: 'pdf',
      icon: <DocumentIcon className="h-6 w-6" />,
      description: 'Portable Document Format for reliable printing'
    },
    {
      id: 'images',
      name: 'Images',
      extension: 'zip',
      icon: <PhotoIcon className="h-6 w-6" />,
      description: 'Export images in various formats (PNG, JPEG, WebP)'
    },
    {
      id: 'xml',
      name: 'XML',
      extension: 'xml',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      description: 'Extensible Markup Language for structured data'
    }
  ];
};

export default ExportConfigurationOptions;
