import React, { useState } from 'react';
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TableCellsIcon,
  CodeBracketIcon,
  PhotoIcon,
  DocumentDuplicateIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

export interface DownloadOptionsProps {
  data: any;
  filename?: string;
  formats?: Array<'json' | 'csv' | 'xlsx' | 'html' | 'images' | 'pdf'>;
  onDownload?: (format: string, data: any) => void;
  className?: string;
  allowPartialDownload?: boolean;
  selectedItems?: number[];
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({
  data,
  filename = 'scraped-data',
  formats = ['json', 'csv', 'xlsx', 'images'],
  onDownload,
  className = '',
  allowPartialDownload = true,
  selectedItems = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState({
    prettyPrint: true,
    includeMetadata: true,
    includeImages: true,
    imageQuality: 'high',
    maxItems: 0, // 0 means all items
  });

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowSettings(false);
    }
  };

  // Toggle settings panel
  const toggleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSettings(!showSettings);
  };

  // Get data to download (all or selected)
  const getDataToDownload = () => {
    if (!allowPartialDownload || selectedItems.length === 0) {
      return data;
    }

    // Handle array data
    if (Array.isArray(data)) {
      return data.filter((_, index) => selectedItems.includes(index));
    }

    // Handle object data with items property
    if (data?.items && Array.isArray(data.items)) {
      const filteredData = { ...data };
      filteredData.items = data.items.filter((_, index) => selectedItems.includes(index));
      return filteredData;
    }

    return data;
  };

  // Update download options
  const updateOption = (key: keyof typeof downloadOptions, value: any) => {
    setDownloadOptions({
      ...downloadOptions,
      [key]: value,
    });
  };

  // Convert data to the specified format and initiate download
  const downloadData = (format: string) => {
    const dataToDownload = getDataToDownload();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let downloadFilename = `${filename}-${timestamp}`;
    let content: string | Blob | null = null;
    let url: string | null = null;

    // If custom download handler is provided, use it
    if (onDownload) {
      onDownload(format, dataToDownload);
      return;
    }

    try {
      switch (format) {
        case 'json':
          content = new Blob(
            [
              JSON.stringify(
                dataToDownload, 
                null, 
                downloadOptions.prettyPrint ? 2 : 0
              )
            ],
            { type: 'application/json' }
          );
          downloadFilename += '.json';
          break;

        case 'csv':
          content = convertToCSV(dataToDownload);
          downloadFilename += '.csv';
          break;

        case 'xlsx':
          // For XLSX, we'd need a library like SheetJS/xlsx
          // This is a placeholder that creates a simple CSV as fallback
          content = convertToCSV(dataToDownload);
          downloadFilename += '.csv';
          console.warn('XLSX download not implemented, falling back to CSV');
          break;

        case 'html':
          content = convertToHTML(dataToDownload);
          downloadFilename += '.html';
          break;

        case 'images':
          // For multiple images, create a zip file
          // For now, just alert the user that it's not implemented
          alert('Bulk image download will open a new page with all images for manual saving.');
          return;

        case 'pdf':
          // PDF generation would require a library
          alert('PDF download not implemented. Please export as HTML and print to PDF.');
          return;

        default:
          console.error('Unknown format:', format);
          return;
      }

      if (content) {
        // Create download link
        url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = downloadFilename;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          if (url) URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (error) {
      console.error('Error preparing download:', error);
      alert(`Error preparing download: ${error}`);
    }
  };

  // Convert data to CSV format
  const convertToCSV = (data: any): Blob => {
    let csv = '';
    let items: any[] = [];

    // Determine the items to process
    if (Array.isArray(data)) {
      items = data;
    } else if (data?.items && Array.isArray(data.items)) {
      items = data.items;
    } else {
      items = [data];
    }

    // Limit items if maxItems is specified
    if (downloadOptions.maxItems > 0 && items.length > downloadOptions.maxItems) {
      items = items.slice(0, downloadOptions.maxItems);
    }

    if (items.length === 0) {
      return new Blob(['No data available'], { type: 'text/csv' });
    }

    // Collect all possible headers
    const allKeys = new Set<string>();
    items.forEach(item => {
      Object.keys(item).forEach(key => {
        allKeys.add(key);
      });
    });

    // Filter out image URLs if includeImages is false
    const headers = Array.from(allKeys).filter(key => {
      if (!downloadOptions.includeImages && 
          (key.includes('image') || key.includes('img') || key.includes('photo'))) {
        return false;
      }
      return true;
    });

    // Create header row
    csv += headers.map(key => `"${key}"`).join(',') + '\n';

    // Create data rows
    items.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        if (value === null || value === undefined) {
          return '';
        }
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csv += row.join(',') + '\n';
    });

    // Add metadata if requested
    if (downloadOptions.includeMetadata && data.metadata) {
      csv += '\n# Metadata\n';
      Object.entries(data.metadata).forEach(([key, value]) => {
        csv += `"${key}","${JSON.stringify(value).replace(/"/g, '""')}"\n`;
      });
    }

    return new Blob([csv], { type: 'text/csv' });
  };

  // Convert data to HTML format
  const convertToHTML = (data: any): Blob => {
    let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${filename}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .metadata { margin-top: 30px; padding: 10px; background-color: #f8f8f8; border: 1px solid #ddd; }
        .image-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .image-item { border: 1px solid #ddd; padding: 10px; text-align: center; }
        .image-item img { max-width: 100%; max-height: 150px; }
    </style>
</head>
<body>
    <h1>${filename}</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
`;

    let items: any[] = [];

    // Determine the items to process
    if (Array.isArray(data)) {
      items = data;
    } else if (data?.items && Array.isArray(data.items)) {
      items = data.items;
    } else {
      items = [data];
    }

    // Limit items if maxItems is specified
    if (downloadOptions.maxItems > 0 && items.length > downloadOptions.maxItems) {
      items = items.slice(0, downloadOptions.maxItems);
    }

    if (items.length === 0) {
      html += '<p>No data available</p>';
    } else {
      // Collect all possible headers
      const allKeys = new Set<string>();
      items.forEach(item => {
        Object.keys(item).forEach(key => {
          allKeys.add(key);
        });
      });

      // Create data table
      html += '<h2>Data</h2>\n<table>\n<thead>\n<tr>\n';
      
      // Table headers
      const headers = Array.from(allKeys);
      headers.forEach(header => {
        html += `<th>${header}</th>\n`;
      });
      
      html += '</tr>\n</thead>\n<tbody>\n';
      
      // Table rows
      items.forEach(item => {
        html += '<tr>\n';
        headers.forEach(header => {
          const value = item[header];
          if (value === null || value === undefined) {
            html += '<td></td>\n';
          } else if (typeof value === 'object') {
            html += `<td><pre>${JSON.stringify(value, null, 2)}</pre></td>\n`;
          } else {
            html += `<td>${String(value)}</td>\n`;
          }
        });
        html += '</tr>\n';
      });
      
      html += '</tbody>\n</table>\n';
      
      // Extract images if requested
      if (downloadOptions.includeImages) {
        const images: string[] = [];
        
        // Collect image URLs from items
        items.forEach(item => {
          Object.entries(item).forEach(([key, value]) => {
            if (typeof value === 'string' && 
                (key.includes('image') || key.includes('img') || key.includes('photo')) &&
                (value.startsWith('http') || value.startsWith('data:'))) {
              images.push(value);
            }
          });
        });
        
        if (images.length > 0) {
          html += '<h2>Images</h2>\n<div class="image-gallery">\n';
          images.forEach((url, index) => {
            html += `
<div class="image-item">
    <img src="${url}" alt="Image ${index + 1}">
    <p>Image ${index + 1}</p>
</div>`;
          });
          html += '</div>\n';
        }
      }
    }
    
    // Add metadata if requested
    if (downloadOptions.includeMetadata && data.metadata) {
      html += '<div class="metadata">\n<h2>Metadata</h2>\n<table>\n';
      Object.entries(data.metadata).forEach(([key, value]) => {
        html += `<tr><th>${key}</th><td>${JSON.stringify(value)}</td></tr>\n`;
      });
      html += '</table>\n</div>\n';
    }
    
    html += '</body>\n</html>';
    
    return new Blob([html], { type: 'text/html' });
  };

  // Format names for readability
  const formatName = (format: string): string => {
    switch (format) {
      case 'json': return 'JSON';
      case 'csv': return 'CSV';
      case 'xlsx': return 'Excel (XLSX)';
      case 'html': return 'HTML';
      case 'images': return 'Images';
      case 'pdf': return 'PDF';
      default: return format.toUpperCase();
    }
  };

  // Get icon for format
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json':
        return <CodeBracketIcon className="h-5 w-5" />;
      case 'csv':
        return <TableCellsIcon className="h-5 w-5" />;
      case 'xlsx':
        return <TableCellsIcon className="h-5 w-5" />;
      case 'html':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'images':
        return <PhotoIcon className="h-5 w-5" />;
      case 'pdf':
        return <DocumentDuplicateIcon className="h-5 w-5" />;
      default:
        return <ArrowDownTrayIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        title="Download options"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
        <span>Download</span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-10 overflow-hidden"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-1">
            <div className="px-4 py-2 bg-gray-100 flex justify-between items-center">
              <span className="font-medium text-gray-700">Export Data</span>
              <button
                onClick={toggleSettings}
                className="text-gray-500 hover:text-gray-700"
                title="Export settings"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
            
            {showSettings ? (
              <div className="p-3 border-b">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Export Options</h4>
                
                <div className="space-y-2 text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={downloadOptions.prettyPrint}
                      onChange={(e) => updateOption('prettyPrint', e.target.checked)}
                      className="mr-2"
                    />
                    Pretty-print JSON
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={downloadOptions.includeMetadata}
                      onChange={(e) => updateOption('includeMetadata', e.target.checked)}
                      className="mr-2"
                    />
                    Include metadata
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={downloadOptions.includeImages}
                      onChange={(e) => updateOption('includeImages', e.target.checked)}
                      className="mr-2"
                    />
                    Include images
                  </label>
                  
                  <div>
                    <label className="block mb-1">Max items:</label>
                    <select
                      value={downloadOptions.maxItems}
                      onChange={(e) => updateOption('maxItems', parseInt(e.target.value, 10))}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="0">All items</option>
                      <option value="10">10 items</option>
                      <option value="50">50 items</option>
                      <option value="100">100 items</option>
                      <option value="500">500 items</option>
                      <option value="1000">1000 items</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={toggleSettings}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              formats.map((format) => (
                <button
                  key={format}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  onClick={() => downloadData(format)}
                >
                  <span className="mr-2 text-gray-600">{getFormatIcon(format)}</span>
                  <span>{formatName(format)}</span>
                </button>
              ))
            )}
          </div>
          
          {allowPartialDownload && selectedItems.length > 0 && !showSettings && (
            <div className="px-4 py-2 bg-gray-100 text-xs text-gray-600">
              {selectedItems.length === 1
                ? 'Downloading 1 selected item'
                : `Downloading ${selectedItems.length} selected items`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DownloadOptions;
