import React, { useState, useRef } from 'react';
import { 
  DocumentTextIcon, 
  DocumentDuplicateIcon, 
  CodeBracketIcon, 
  TableCellsIcon,
  ChartBarIcon,
  PhotoIcon,
  MapIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import DataTable from './DataTable';
import JsonViewer from './JsonViewer';
import { StatisticsCharts } from './StatisticsCharts';
import ContentHeatmap, { HeatmapData } from './ContentHeatmap';

// Define types for report sections
export type ReportSectionType = 
  | 'summary' 
  | 'table' 
  | 'json' 
  | 'chart' 
  | 'heatmap'
  | 'image'
  | 'text'
  | 'markdown'
  | 'code';

export interface ReportSection {
  id: string;
  type: ReportSectionType;
  title: string;
  description?: string;
  content: any;
  settings?: Record<string, any>;
}

export interface ReportMetadata {
  title: string;
  description?: string;
  author?: string;
  date?: string;
  version?: string;
  tags?: string[];
  logo?: string;
}

export interface ExportableReportProps {
  sections: ReportSection[];
  metadata: ReportMetadata;
  onExport?: (format: string, report: any) => void;
  onSectionToggle?: (sectionId: string, visible: boolean) => void;
  onSectionReorder?: (fromIndex: number, toIndex: number) => void;
  allowEdit?: boolean;
  className?: string;
}

const ExportableReport: React.FC<ExportableReportProps> = ({
  sections,
  metadata,
  onExport,
  onSectionToggle,
  onSectionReorder,
  allowEdit = false,
  className = '',
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'html' | 'docx' | 'md'>('pdf');
  const [includeAllSections, setIncludeAllSections] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Toggle section visibility
  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      
      // Notify parent if callback provided
      if (onSectionToggle) {
        onSectionToggle(sectionId, !newSet.has(sectionId));
      }
      
      return newSet;
    });
  };

  // Get icon for section type
  const getSectionIcon = (type: ReportSectionType) => {
    switch (type) {
      case 'summary':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'table':
        return <TableCellsIcon className="h-5 w-5 text-amber-500" />;
      case 'json':
        return <CodeBracketIcon className="h-5 w-5 text-purple-500" />;
      case 'chart':
        return <ChartBarIcon className="h-5 w-5 text-green-500" />;
      case 'heatmap':
        return <MapIcon className="h-5 w-5 text-red-500" />;
      case 'image':
        return <PhotoIcon className="h-5 w-5 text-cyan-500" />;
      case 'markdown':
      case 'text':
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
      case 'code':
        return <CodeBracketIcon className="h-5 w-5 text-gray-700" />;
      default:
        return <DocumentDuplicateIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Generate report based on selected format
  const generateReport = () => {
    setIsGenerating(true);
    
    // In a real application, this would generate the actual report
    setTimeout(() => {
      // Example report data structure
      const reportData = {
        metadata,
        sections: includeAllSections 
          ? sections 
          : sections.filter(section => !collapsedSections.has(section.id)),
        format: exportFormat,
        timestamp: new Date().toISOString()
      };
      
      if (onExport) {
        onExport(exportFormat, reportData);
      } else {
        console.log('Report would be exported:', reportData);
        alert(`Report would be exported as ${exportFormat.toUpperCase()}`);
      }
      
      setIsGenerating(false);
      setShowExportOptions(false);
    }, 1500);
  };

  // Render a specific section based on its type
  const renderSection = (section: ReportSection) => {
    switch (section.type) {
      case 'summary':
        return (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          </div>
        );
        
      case 'table':
        return (
          <DataTable
            data={section.content}
            columns={section.settings?.columns}
            initialSortColumn={section.settings?.initialSortColumn}
            initialSortDirection={section.settings?.initialSortDirection}
            pagination={section.settings?.pagination !== false}
            pageSize={section.settings?.pageSize || 10}
          />
        );
        
      case 'json':
        return (
          <JsonViewer
            data={section.content}
            initialExpanded={section.settings?.expanded}
            expandDepth={section.settings?.expandDepth || 1}
            collapsible={true}
          />
        );
        
      case 'chart':
        return (
          <StatisticsCharts
            data={section.content}
          />
        );
        
      case 'heatmap':
        if (Array.isArray(section.content)) {
          return (
            <ContentHeatmap
              data={section.content as HeatmapData[]}
              title={section.settings?.title || section.title}
              xLabel={section.settings?.xLabel}
              yLabel={section.settings?.yLabel}
              colorScale={section.settings?.colorScale || 'blue'}
            />
          );
        }
        return null;
        
      case 'image':
        return (
          <div className="flex justify-center p-4">
            <img
              src={section.content}
              alt={section.title}
              className="max-w-full max-h-96 object-contain"
            />
            {section.description && (
              <p className="text-sm text-gray-500 text-center mt-2">
                {section.description}
              </p>
            )}
          </div>
        );
        
      case 'text':
        return (
          <div className="p-4 whitespace-pre-wrap font-sans text-sm">
            {section.content}
          </div>
        );
        
      case 'markdown':
        return (
          <div className="p-4 prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        );
        
      case 'code':
        return (
          <div className="p-4 bg-gray-800 rounded-lg overflow-auto text-white font-mono text-sm">
            <pre>{section.content}</pre>
          </div>
        );
        
      default:
        return (
          <div className="p-4 text-gray-500 italic">
            Unknown section type: {section.type}
          </div>
        );
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`} ref={reportRef}>
      {/* Report header with metadata */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {metadata.logo && (
              <img
                src={metadata.logo}
                alt="Report Logo"
                className="h-10 w-10 object-contain"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{metadata.title}</h1>
              {metadata.description && (
                <p className="text-gray-500 mt-1">{metadata.description}</p>
              )}
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Export Report</span>
            </button>
            
            {/* Export options dropdown */}
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border">
                <div className="p-3">
                  <h3 className="font-medium text-gray-700 border-b pb-2 mb-2">Export Options</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Format
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className={`px-3 py-1.5 text-sm rounded border ${
                            exportFormat === 'pdf'
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setExportFormat('pdf')}
                        >
                          PDF
                        </button>
                        <button
                          className={`px-3 py-1.5 text-sm rounded border ${
                            exportFormat === 'html'
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setExportFormat('html')}
                        >
                          HTML
                        </button>
                        <button
                          className={`px-3 py-1.5 text-sm rounded border ${
                            exportFormat === 'docx'
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setExportFormat('docx')}
                        >
                          Word
                        </button>
                        <button
                          className={`px-3 py-1.5 text-sm rounded border ${
                            exportFormat === 'md'
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setExportFormat('md')}
                        >
                          Markdown
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={includeAllSections}
                          onChange={() => setIncludeAllSections(!includeAllSections)}
                          className="rounded border-gray-300 text-blue-600 mr-2"
                        />
                        Include all sections (even if collapsed)
                      </label>
                    </div>
                    
                    <button
                      onClick={generateReport}
                      disabled={isGenerating}
                      className={`w-full px-4 py-2 text-white rounded ${
                        isGenerating
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isGenerating ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </span>
                      ) : (
                        'Export'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Metadata details */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          {metadata.author && (
            <div>
              <span className="font-medium">Author:</span> {metadata.author}
            </div>
          )}
          {metadata.date && (
            <div>
              <span className="font-medium">Date:</span> {metadata.date}
            </div>
          )}
          {metadata.version && (
            <div>
              <span className="font-medium">Version:</span> {metadata.version}
            </div>
          )}
          {metadata.tags && metadata.tags.length > 0 && (
            <div className="flex items-center">
              <span className="font-medium mr-2">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-0.5 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Table of contents */}
      <div className="border-b px-6 py-4 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">Contents</h2>
        <ul className="mt-2 space-y-1">
          {sections.map((section, index) => (
            <li key={`toc-${section.id}`}>
              <a
                href={`#section-${section.id}`}
                className="text-blue-600 hover:underline flex items-center"
              >
                <span className="w-6 text-gray-500">{index + 1}.</span>
                <span className="mr-2">{getSectionIcon(section.type)}</span>
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Report sections */}
      <div className="p-6 space-y-6">
        {sections.map((section, index) => (
          <div 
            key={`section-${section.id}`}
            id={`section-${section.id}`}
            className="border rounded-lg overflow-hidden"
          >
            <div 
              className="flex items-center justify-between p-4 bg-gray-50 border-b"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 text-sm">
                  {index + 1}
                </span>
                <span>{getSectionIcon(section.type)}</span>
                <h3 className="font-medium text-gray-900">{section.title}</h3>
              </div>
              
              <div className="flex items-center">
                {allowEdit && (
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  </button>
                )}
                <button className="p-1 text-gray-400 hover:text-gray-600 ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      collapsedSections.has(section.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            {!collapsedSections.has(section.id) && (
              <>
                {section.description && (
                  <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
                    {section.description}
                  </div>
                )}
                <div className="bg-white">
                  {renderSection(section)}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportableReport;
