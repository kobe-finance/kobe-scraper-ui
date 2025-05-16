import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, Button } from '../../../components';

export interface Job {
  id: string;
  name: string;
  url: string;
  status: 'running' | 'completed' | 'failed' | 'queued' | 'cancelled';
  dataPoints: number;
  createdAt: string;
  updatedAt: string;
  progress?: number;
  error?: string;
  description?: string;
  duration?: string;
  type?: 'basic' | 'advanced' | 'full_page';
}

interface JobsTableProps {
  jobs: Job[];
  title?: string;
  description?: string;
  limit?: number;
  showActions?: boolean;
  isLoading?: boolean;
  onRefresh?: () => void;
  onCancel?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
}

export const JobsTable: React.FC<JobsTableProps> = ({
  jobs,
  title = 'Jobs',
  description = 'Recent scraping jobs',
  limit,
  showActions = false,
  isLoading = false,
  onRefresh,
  onCancel,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  
  const limitedJobs = limit ? jobs.slice(0, limit) : jobs;

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
        return 'Basic';
      case 'advanced':
        return 'Advanced';
      case 'full_page':
        return 'Full Page';
      default:
        return 'Custom';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleExpandJob = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const handleViewDetails = (jobId: string) => {
    navigate(`/dashboard/jobs/${jobId}`);
  };

  return (
    <Card>
      <CardHeader title={title} description={description}>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="ml-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {limitedJobs.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              {isLoading ? 'Loading jobs...' : 'No jobs found'}
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="pb-3 pl-4 pr-3 text-sm font-semibold">Job Name</th>
                  <th className="pb-3 px-3 text-sm font-semibold hidden md:table-cell">URL</th>
                  <th className="pb-3 px-3 text-sm font-semibold">Status</th>
                  <th className="pb-3 px-3 text-sm font-semibold hidden sm:table-cell">Data Points</th>
                  <th className="pb-3 px-3 text-sm font-semibold hidden lg:table-cell">Created</th>
                  {showActions && <th className="pb-3 px-3 text-sm font-semibold text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {limitedJobs.map((job) => (
                  <React.Fragment key={job.id}>
                    <tr 
                      className={`border-b border-gray-100 dark:border-gray-800 ${
                        expandedJobId === job.id ? 'bg-gray-50 dark:bg-gray-900/30' : ''
                      } hover:bg-gray-50 dark:hover:bg-gray-900/20 cursor-pointer transition-colors`}
                      onClick={() => toggleExpandJob(job.id)}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                        {job.name}
                        {job.type && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            ({getTypeLabel(job.type)})
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm hidden md:table-cell">
                        <div className="max-w-[200px] truncate">{job.url}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
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
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm hidden sm:table-cell">
                        {job.dataPoints.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm hidden lg:table-cell">
                        {formatDate(job.createdAt)}
                      </td>
                      {showActions && (
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                          <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(job.id);
                              }}
                            >
                              View
                            </Button>
                            {job.status === 'running' && onCancel && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCancel(job.id);
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                            {(job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') && onDelete && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(job.id);
                                }}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                    {expandedJobId === job.id && (
                      <tr className="bg-gray-50 dark:bg-gray-900/30">
                        <td colSpan={showActions ? 6 : 5} className="p-3">
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">URL</p>
                              <p className="mt-1 text-sm break-all">{job.url}</p>
                            </div>
                            {job.description && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Description</p>
                                <p className="mt-1 text-sm">{job.description}</p>
                              </div>
                            )}
                            {job.duration && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Duration</p>
                                <p className="mt-1 text-sm">{job.duration}</p>
                              </div>
                            )}
                            {job.error && job.status === 'failed' && (
                              <div className="sm:col-span-2 lg:col-span-3">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Error</p>
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{job.error}</p>
                              </div>
                            )}
                            <div className="sm:col-span-2 lg:col-span-3 mt-1">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(job.id);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {limit && jobs.length > limit && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/jobs')}
            >
              View All Jobs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
