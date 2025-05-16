import React from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

export interface ExportJob {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: string;
  progress: number; // 0-100
  startTime?: Date;
  endTime?: Date;
  error?: string;
  fileSize?: string;
  recordCount?: number;
  downloadUrl?: string;
}

interface ExportProgressTrackingProps {
  jobs: ExportJob[];
  onRetry?: (jobId: string) => void;
  onCancel?: (jobId: string) => void;
  onDownload?: (jobId: string) => void;
  className?: string;
}

/**
 * Component for tracking the progress of data export jobs
 * Shows status, progress, and controls for download or retry
 */
const ExportProgressTracking: React.FC<ExportProgressTrackingProps> = ({
  jobs,
  onRetry,
  onCancel,
  onDownload,
  className = ''
}) => {
  // Format duration between two dates
  const formatDuration = (start?: Date, end?: Date): string => {
    if (!start) return '--';
    
    const startTime = start.getTime();
    const endTime = end ? end.getTime() : Date.now();
    const durationMs = endTime - startTime;
    
    // Format as mm:ss or hh:mm:ss
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get status icon based on job status
  const getStatusIcon = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  // Get text based on job status
  const getStatusText = (job: ExportJob): string => {
    switch (job.status) {
      case 'completed':
        return `Completed (${job.recordCount?.toLocaleString() || 0} records)`;
      case 'failed':
        return `Failed: ${job.error || 'Unknown error'}`;
      case 'processing':
        return `Processing (${Math.round(job.progress)}%)`;
      case 'pending':
        return 'Pending';
      default:
        return '';
    }
  };

  if (jobs.length === 0) {
    return (
      <div className={`text-center p-6 text-gray-500 italic dark:text-gray-400 ${className}`}>
        No export jobs to display.
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
        Export Jobs
      </h3>
      
      <div className="space-y-3">
        {jobs.map((job) => (
          <div 
            key={job.id} 
            className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center">
                {getStatusIcon(job.status)}
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{job.name}</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                  {job.format.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {job.startTime && (
                  <>
                    {new Date(job.startTime).toLocaleTimeString()} 
                    {' · '}
                    {formatDuration(
                      job.startTime ? new Date(job.startTime) : undefined, 
                      job.endTime ? new Date(job.endTime) : undefined
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Progress bar */}
            {job.status === 'processing' && (
              <div className="px-4 pt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full dark:bg-primary-500" 
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Content */}
            <div className="px-4 py-3">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {getStatusText(job)}
              </div>
              
              {job.status === 'completed' && job.fileSize && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  File size: {job.fileSize}
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="px-4 py-2 border-t flex justify-end space-x-2 dark:border-gray-700">
              {job.status === 'completed' && onDownload && (
                <button
                  type="button"
                  onClick={() => onDownload(job.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                  Download
                </button>
              )}
              
              {job.status === 'failed' && onRetry && (
                <button
                  type="button"
                  onClick={() => onRetry(job.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Retry
                </button>
              )}
              
              {(job.status === 'pending' || job.status === 'processing') && onCancel && (
                <button
                  type="button"
                  onClick={() => onCancel(job.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportProgressTracking;
