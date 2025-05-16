import React, { useState } from 'react';
import {
  EyeIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckIcon,
  ClipboardIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Pattern } from '../pattern-detection/types';

interface ExtractedContent {
  id: string;
  content: string | Record<string, any>;
  sourceUrl: string;
  extractedAt: string;
  patternId: string;
  metadata?: Record<string, any>;
}

interface ContentExtractionPreviewProps {
  pattern?: Pattern;
  extractedContent: ExtractedContent[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onRunAnalysis: (contentId: string) => Promise<void>;
  className?: string;
}

/**
 * Component for previewing extracted content from web pages
 * Shows the raw extracted data in different formats (text, JSON, table)
 */
const ContentExtractionPreview: React.FC<ContentExtractionPreviewProps> = ({
  pattern,
  extractedContent,
  isLoading,
  onRefresh,
  onRunAnalysis,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'raw' | 'formatted' | 'table'>('formatted');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);

  // Toggle expanded state for an item
  const toggleExpand = (id: string) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter(item => item !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  // Handle refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing content:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Copy content to clipboard
  const copyToClipboard = (content: string | Record<string, any>) => {
    const textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(textContent).then(() => {
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 2000);
    });
  };

  // Render content based on view mode
  const renderContent = (item: ExtractedContent) => {
    const content = item.content;

    if (viewMode === 'raw') {
      return (
        <div className="font-mono text-xs overflow-x-auto whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-200 dark:bg-gray-750 dark:border-gray-700 dark:text-gray-200">
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </div>
      );
    }

    if (viewMode === 'table' && typeof content !== 'string') {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                {Object.keys(content as Record<string, any>).map((key) => (
                  <th
                    key={key}
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              <tr>
                {Object.entries(content as Record<string, any>).map(([key, value]) => (
                  <td key={key} className="px-3 py-2 text-sm text-gray-900 dark:text-gray-200">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    // Default: formatted view
    if (typeof content === 'string') {
      return (
        <div className="text-sm text-gray-800 dark:text-gray-200">
          {content}
        </div>
      );
    } else {
      return (
        <div className="space-y-2">
          {Object.entries(content as Record<string, any>).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{key}</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
  };

  // Truncate content for preview
  const truncateContent = (content: string | Record<string, any>): string => {
    if (typeof content === 'string') {
      return content.length > 100 ? `${content.substring(0, 100)}...` : content;
    } else {
      return JSON.stringify(content).length > 100 
        ? `${JSON.stringify(content).substring(0, 100)}...` 
        : JSON.stringify(content);
    }
  };

  // Get URL domain for display
  const getDomain = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (e) {
      return url;
    }
  };

  // Determine if content is JSON or structured data
  const isStructuredData = (content: string | Record<string, any>): boolean => {
    return typeof content !== 'string';
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
              <EyeIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Content Extraction Preview
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {pattern 
                ? `Preview extracted content using the "${pattern.name}" pattern` 
                : 'Preview extracted content from your patterns'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            {/* View mode selector */}
            <div className="flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setViewMode('formatted')}
                className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-l-md border ${
                  viewMode === 'formatted'
                    ? 'bg-primary-50 text-primary-700 border-primary-500 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-650'
                }`}
              >
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                Formatted
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium border-t border-b ${
                  viewMode === 'raw'
                    ? 'bg-primary-50 text-primary-700 border-primary-500 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-650'
                }`}
              >
                <CodeBracketIcon className="h-4 w-4 mr-1" />
                Raw
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-r-md border ${
                  viewMode === 'table'
                    ? 'bg-primary-50 text-primary-700 border-primary-500 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-650'
                }`}
              >
                <TableCellsIcon className="h-4 w-4 mr-1" />
                Table
              </button>
            </div>
            
            {/* Refresh button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center p-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              title="Refresh content"
            >
              <ArrowPathIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : extractedContent.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-md border-2 border-dashed border-gray-300 dark:bg-gray-750 dark:border-gray-700">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No content extracted</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {pattern 
                ? 'No content has been extracted with this pattern yet.' 
                : 'No content has been extracted with any pattern yet.'}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {extractedContent.map((item) => (
              <div 
                key={item.id} 
                className={`border rounded-lg overflow-hidden transition-shadow dark:border-gray-700 ${
                  expandedItems.includes(item.id) 
                    ? 'shadow-md bg-white dark:bg-gray-750' 
                    : 'bg-white hover:shadow-sm dark:bg-gray-800'
                }`}
              >
                {/* Header */}
                <div 
                  onClick={() => toggleExpand(item.id)}
                  className="px-4 py-3 flex justify-between items-center cursor-pointer"
                >
                  <div className="flex items-center">
                    {expandedItems.includes(item.id) ? (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {isStructuredData(item.content) ? 'Structured Data' : 'Text Content'}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>{getDomain(item.sourceUrl)}</span>
                        <span className="mx-1.5">•</span>
                        <span>{formatDate(item.extractedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.content);
                      }}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-400"
                      title="Copy content"
                    >
                      {showCopiedNotification && selectedItem === item.id ? (
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <ClipboardIcon className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item.id);
                        onRunAnalysis(item.id);
                      }}
                      className="p-1 rounded-md hover:bg-primary-50 text-primary-600 dark:hover:bg-primary-900/20 dark:text-primary-400"
                      title="Run AI analysis"
                    >
                      <SparklesIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Preview when collapsed */}
                {!expandedItems.includes(item.id) && (
                  <div className="px-4 py-2 text-sm text-gray-500 border-t truncate dark:text-gray-400 dark:border-gray-700">
                    {truncateContent(item.content)}
                  </div>
                )}

                {/* Expanded content */}
                {expandedItems.includes(item.id) && (
                  <div className="px-4 py-3 border-t dark:border-gray-700">
                    {renderContent(item)}
                    <div className="mt-4 flex justify-between items-center">
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View source page
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedItem(item.id);
                          onRunAnalysis(item.id);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
                      >
                        <SparklesIcon className="-ml-1 mr-1.5 h-3.5 w-3.5" />
                        Analyze Content
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentExtractionPreview;
