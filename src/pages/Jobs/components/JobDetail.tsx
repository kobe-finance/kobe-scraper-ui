import React from 'react';
import { Card, CardHeader, CardContent, Button } from '../../../components';
import type { Job } from '../../Dashboard/components/JobsTable';

interface JobDetailProps {
  job: Job;
  onClose: () => void;
  onCancel?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
  onExport?: (jobId: string) => void;
  onRerun?: (jobId: string) => void;
}

export const JobDetail: React.FC<JobDetailProps> = ({
  job,
  onClose,
  onCancel,
  onDelete,
  onExport,
  onRerun,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusClass = (status: Job['status']) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'queued':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getTypeLabel = (type?: Job['type']) => {
    switch (type) {
      case 'basic':
        return 'Basic Scraping';
      case 'advanced':
        return 'Advanced Scraping (with Schema)';
      case 'full_page':
        return 'Full Page Scraping';
      default:
        return 'Custom Scraping';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{job.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Job Details</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(job.status)}`}>
                  {job.status === 'running' && job.progress !== undefined ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {Math.round(job.progress)}%
                    </>
                  ) : (
                    job.status.charAt(0).toUpperCase() + job.status.slice(1)
                  )}
                </span>
                
                {job.duration && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({job.duration})
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {job.status === 'running' && onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(job.id)}
                >
                  Cancel Job
                </Button>
              )}
              
              {job.status === 'completed' && onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport(job.id)}
                >
                  Export Data
                </Button>
              )}
              
              {(job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') && onRerun && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onRerun(job.id)}
                >
                  Run Again
                </Button>
              )}
              
              {(job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') && onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(job.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
          
          {/* Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Type</p>
                <p className="mt-1">{getTypeLabel(job.type)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
                <p className="mt-1">{formatDate(job.createdAt)}</p>
              </div>
              
              {job.status !== 'queued' && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="mt-1">{formatDate(job.updatedAt)}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Data Points</p>
                <p className="mt-1">{job.dataPoints.toLocaleString()}</p>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Target URL</p>
                <p className="mt-1 break-all">
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {job.url}
                  </a>
                </p>
              </div>
              
              {job.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                  <p className="mt-1">{job.description}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Error Message */}
          {job.error && job.status === 'failed' && (
            <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-900 rounded-md">
              <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Error Message</p>
              <p className="text-sm text-red-700 dark:text-red-400">{job.error}</p>
            </div>
          )}
          
          {/* Data Preview Placeholder */}
          {job.status === 'completed' && job.dataPoints > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Data Preview</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {job.dataPoints} data points collected. 
                  <span className="underline ml-1 cursor-pointer">View Data</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
