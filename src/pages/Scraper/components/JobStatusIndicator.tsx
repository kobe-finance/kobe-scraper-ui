import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../services/apiClient';

interface JobStatusIndicatorProps {
  jobId: string;
  onComplete: (result: any) => void;
  onError: (error: string) => void;
  pollingInterval?: number;
}

/**
 * Component to track and display the status of a background scraping job
 */
export const JobStatusIndicator: React.FC<JobStatusIndicatorProps> = ({
  jobId,
  onComplete,
  onError,
  pollingInterval = 2000,
}) => {
  const [status, setStatus] = useState<string>('pending');
  const [progress, setProgress] = useState<number>(0);
  const [isPolling, setIsPolling] = useState<boolean>(true);

  useEffect(() => {
    let intervalId: number | undefined;
    
    const checkJobStatus = async () => {
      try {
        const jobStatus = await apiClient.getJobStatus(jobId);
        
        setStatus(jobStatus.status);
        
        if (jobStatus.progress) {
          setProgress(jobStatus.progress);
        }
        
        // Handle job completion
        if (jobStatus.status === 'completed') {
          setIsPolling(false);
          if (jobStatus.result) {
            onComplete(jobStatus.result);
          }
        }
        
        // Handle job failure
        if (jobStatus.status === 'failed') {
          setIsPolling(false);
          onError(jobStatus.error || 'Job failed without specific error message');
        }
      } catch (error) {
        console.error('Error checking job status:', error);
        setIsPolling(false);
        onError('Failed to check job status: ' + (error as Error).message);
      }
    };
    
    // Start polling
    if (isPolling) {
      checkJobStatus(); // Check immediately
      intervalId = window.setInterval(checkJobStatus, pollingInterval);
    }
    
    // Cleanup
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, isPolling, onComplete, onError, pollingInterval]);
  
  // Helper to get appropriate status color
  const getStatusColorClass = () => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'running':
        return 'text-blue-600';
      default:
        return 'text-yellow-600';
    }
  };
  
  // Helper to get status description
  const getStatusDescription = () => {
    switch (status) {
      case 'pending':
        return 'Job is waiting to start...';
      case 'running':
        return 'Scraping in progress...';
      case 'completed':
        return 'Scraping completed successfully!';
      case 'failed':
        return 'Scraping job failed';
      default:
        return 'Unknown status';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        {/* Status Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          status === 'running' ? 'bg-blue-100' : 
          status === 'completed' ? 'bg-green-100' : 
          status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
        }`}>
          {status === 'running' ? (
            <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : status === 'completed' ? (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : status === 'failed' ? (
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
        </div>
        
        {/* Status Text */}
        <div>
          <p className={`font-semibold ${getStatusColorClass()}`}>
            Job Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
          <p className="text-sm text-gray-600">{getStatusDescription()}</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      {(status === 'running' || status === 'pending') && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {/* Job ID */}
      <div className="text-xs text-gray-500">
        Job ID: {jobId}
      </div>
    </div>
  );
};
