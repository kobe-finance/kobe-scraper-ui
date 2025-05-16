import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';

// Define help content interface
interface HelpContent {
  title: string;
  content: ReactNode;
  moreInfoUrl?: string;
}

// Define help context type
type HelpContextType = {
  showHelp: (helpId: string) => void;
  hideHelp: () => void;
  isHelpVisible: boolean;
  currentHelp: HelpContent | null;
};

// Create context
const HelpContext = createContext<HelpContextType>({
  showHelp: () => {},
  hideHelp: () => {},
  isHelpVisible: false,
  currentHelp: null,
});

// Define props for provider
interface HelpProviderProps {
  children: ReactNode;
  helpContent: Record<string, HelpContent>;
}

/**
 * Provider component for the contextual help system
 */
export const ContextualHelpProvider: React.FC<HelpProviderProps> = ({ 
  children, 
  helpContent 
}) => {
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [currentHelp, setCurrentHelp] = useState<HelpContent | null>(null);
  
  const showHelp = useCallback((helpId: string) => {
    const content = helpContent[helpId];
    if (content) {
      setCurrentHelp(content);
      setIsHelpVisible(true);
    } else {
      console.warn(`Help content for "${helpId}" not found`);
    }
  }, [helpContent]);
  
  const hideHelp = useCallback(() => {
    setIsHelpVisible(false);
  }, []);
  
  return (
    <HelpContext.Provider value={{ 
      showHelp, 
      hideHelp, 
      isHelpVisible, 
      currentHelp 
    }}>
      {children}
      {isHelpVisible && currentHelp && <HelpModal content={currentHelp} onClose={hideHelp} />}
    </HelpContext.Provider>
  );
};

// Hook for consuming help context
export const useContextualHelp = () => useContext(HelpContext);

// Interface for help tooltip props
interface HelpTooltipProps {
  helpId: string;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * Component that wraps content with a help tooltip
 */
export const HelpTooltip: React.FC<HelpTooltipProps> = ({ 
  helpId, 
  children, 
  position = 'top' 
}) => {
  const { showHelp } = useContextualHelp();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  const showTooltip = useCallback(() => {
    setIsTooltipVisible(true);
  }, []);
  
  const hideTooltip = useCallback(() => {
    setIsTooltipVisible(false);
  }, []);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showHelp(helpId);
  }, [helpId, showHelp]);
  
  // Position classes for the tooltip
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  };
  
  return (
    <div className="inline-flex relative items-center group">
      {children}
      <button
        onClick={handleClick}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        aria-label={`Get help about ${helpId}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isTooltipVisible && (
        <div className={`absolute z-10 bg-gray-800 text-white text-xs p-2 rounded shadow-lg pointer-events-none ${positionClasses[position]}`}>
          Click for help
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45">
            {position === 'top' && <div className="absolute left-1/2 top-full -ml-1"></div>}
            {position === 'right' && <div className="absolute right-full top-1/2 -mt-1"></div>}
            {position === 'bottom' && <div className="absolute left-1/2 bottom-full -ml-1"></div>}
            {position === 'left' && <div className="absolute left-full top-1/2 -mt-1"></div>}
          </div>
        </div>
      )}
    </div>
  );
};

// Modal component to display help content
interface HelpModalProps {
  content: HelpContent;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ content, onClose }) => {
  // Close modal when clicking outside or pressing Escape
  const handleOutsideClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);
  
  // Handle keyboard events
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="help-title" className="text-xl font-semibold text-gray-800 dark:text-white">
            {content.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Close help"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-4 text-gray-700 dark:text-gray-300">
          {content.content}
        </div>
        
        {content.moreInfoUrl && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
            <a
              href={content.moreInfoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              Learn more about this feature
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Predefine a set of help content for common features
export const defaultHelpContent: Record<string, HelpContent> = {
  'scheduler': {
    title: 'Job Scheduler',
    content: (
      <>
        <p className="mb-3">
          The Job Scheduler allows you to create and manage automated scraping tasks that run on a schedule.
        </p>
        <h3 className="font-medium mb-2">Key Features:</h3>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Create daily, weekly, or monthly scheduled jobs</li>
          <li>Monitor job status and execution history</li>
          <li>Pause or resume jobs as needed</li>
          <li>View detailed job results and logs</li>
        </ul>
        <p>
          To create a new job, click the "New Job" button and fill out the required information.
        </p>
      </>
    ),
    moreInfoUrl: '/docs/guides/scheduler/creating-jobs.md'
  },
  'workflow-builder': {
    title: 'Workflow Builder',
    content: (
      <>
        <p className="mb-3">
          The Workflow Builder allows you to create data processing pipelines by connecting different node types.
        </p>
        <h3 className="font-medium mb-2">Node Types:</h3>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li><strong>Web Scraper:</strong> Extract data from websites</li>
          <li><strong>Data Filter:</strong> Transform and clean data</li>
          <li><strong>Database:</strong> Store data in various formats</li>
          <li><strong>Notification:</strong> Send alerts and notifications</li>
          <li><strong>API Connector:</strong> Integrate with external services</li>
        </ul>
        <p>
          Click on any node from the palette to add it to your workflow, then connect nodes by dragging from outputs to inputs.
        </p>
      </>
    ),
    moreInfoUrl: '/docs/guides/workflows/first-workflow.md'
  },
  'mobile-interface': {
    title: 'Mobile Experience',
    content: (
      <>
        <p className="mb-3">
          The mobile interface is optimized for smaller screens while maintaining full functionality.
        </p>
        <h3 className="font-medium mb-2">Optimizations:</h3>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Touch-friendly controls and layouts</li>
          <li>List view for workflows to improve usability</li>
          <li>Simplified navigation for mobile devices</li>
          <li>Offline support for on-the-go usage</li>
        </ul>
        <p>
          All changes made on mobile devices will sync automatically when you regain internet connection.
        </p>
      </>
    ),
    moreInfoUrl: '/docs/guides/mobile/mobile-interface.md'
  },
  'data-visualization': {
    title: 'Data Visualization',
    content: (
      <>
        <p className="mb-3">
          Data visualization tools help you analyze and understand your scraped data.
        </p>
        <h3 className="font-medium mb-2">Chart Types:</h3>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Line charts for time-series data</li>
          <li>Bar charts for comparative analysis</li>
          <li>Pie charts for distribution visualization</li>
          <li>Custom dashboards for key metrics</li>
        </ul>
        <p>
          Click on any data point for more detailed information or to export the underlying data.
        </p>
      </>
    ),
    moreInfoUrl: '/docs/guides/data/visualization.md'
  }
};

export default {
  ContextualHelpProvider,
  useContextualHelp,
  HelpTooltip,
  defaultHelpContent
};
