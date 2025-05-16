import React, { useState } from 'react';
import { Button } from '../../../components';
import type { Job } from '../../Dashboard/components/JobsTable';

interface BatchJobsActionsProps {
  selectedJobs: Job[];
  onClearSelection: () => void;
  onDeleteSelected: () => Promise<void>;
  onExportSelected: () => Promise<void>;
  onRerunSelected: () => Promise<void>;
}

export const BatchJobsActions: React.FC<BatchJobsActionsProps> = ({
  selectedJobs,
  onClearSelection,
  onDeleteSelected,
  onExportSelected,
  onRerunSelected,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Batch action handlers
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedJobs.length} job(s)?`)) {
      setIsLoading(true);
      try {
        await onDeleteSelected();
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleExport = async () => {
    setIsLoading(true);
    try {
      await onExportSelected();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRerun = async () => {
    setIsLoading(true);
    try {
      await onRerunSelected();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check for active jobs
  const hasActiveJobs = selectedJobs.some(
    job => job.status === 'running' || job.status === 'queued'
  );
  
  // No jobs selected
  if (selectedJobs.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <span className="font-medium mr-2">
            {selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''} selected
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearSelection}
            className="text-xs"
          >
            Clear
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Data
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRerun}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rerun Jobs
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700"
            onClick={handleDelete}
            disabled={isLoading || hasActiveJobs}
            title={hasActiveJobs ? "Cannot delete running or queued jobs" : ""}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete {selectedJobs.length > 1 ? `(${selectedJobs.length})` : ''}
          </Button>
        </div>
      </div>
    </div>
  );
};
