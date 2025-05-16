import React from 'react';
import { ScheduledJob } from './types';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ConflictResolutionProps {
  conflicts: { jobId: string; message: string }[];
  jobs: ScheduledJob[];
  onResolveConflict: (jobId: string, message: string) => void;
  onSelectJob: (job: ScheduledJob) => void;
}

/**
 * ConflictResolution component for identifying and resolving scheduling conflicts
 * Displays a list of conflicts with options to resolve or navigate to the job
 */
const ConflictResolution: React.FC<ConflictResolutionProps> = ({
  conflicts,
  jobs,
  onResolveConflict,
  onSelectJob
}) => {
  // Get job by ID
  const getJobById = (jobId: string): ScheduledJob | undefined => {
    return jobs.find(job => job.id === jobId);
  };

  // Group conflicts by job
  const conflictsByJob = conflicts.reduce<Record<string, string[]>>((acc, conflict) => {
    if (!acc[conflict.jobId]) {
      acc[conflict.jobId] = [];
    }
    acc[conflict.jobId].push(conflict.message);
    return acc;
  }, {});

  // Check if a conflict is related to circular dependencies
  const isCircularDependency = (message: string): boolean => {
    return message.toLowerCase().includes('circular') || message.toLowerCase().includes('dependency');
  };

  // Check if a conflict is related to timing overlaps
  const isTimeConflict = (message: string): boolean => {
    return message.toLowerCase().includes('time') || message.toLowerCase().includes('overlap') || message.toLowerCase().includes('conflict');
  };

  // Get job's next run time in human-readable format
  const formatNextRunTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle job selection for editing
  const handleSelectJob = (jobId: string) => {
    const job = getJobById(jobId);
    if (job) {
      onSelectJob(job);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Scheduling Conflicts
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Identify and resolve scheduling conflicts between jobs
        </p>
      </div>

      {conflicts.length === 0 ? (
        <div className="px-4 py-5 sm:p-6 flex items-center justify-center flex-col">
          <CheckCircleIcon className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Conflicts Detected</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            All scheduled jobs appear to be configured properly without conflicts.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(conflictsByJob).map(([jobId, messages]) => {
              const job = getJobById(jobId);
              if (!job) return null;

              return (
                <li key={jobId} className="px-4 py-5 sm:px-6">
                  <div className="mb-2">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {job.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.scheduleType === 'recurring' ? job.frequency : 'One-time'} job • 
                      Next run: {formatNextRunTime(job.nextRunTime)}
                    </p>
                  </div>

                  <ul className="mt-3 space-y-3">
                    {messages.map((message, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <ExclamationTriangleIcon
                            className={`h-5 w-5 ${
                              isCircularDependency(message)
                                ? 'text-red-500'
                                : 'text-yellow-500'
                            }`}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {message}
                          </div>
                          <div className="mt-2 flex">
                            <button
                              type="button"
                              onClick={() => handleSelectJob(jobId)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                              Edit Job
                            </button>
                            <button
                              type="button"
                              onClick={() => onResolveConflict(jobId, message)}
                              className="ml-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                              Ignore Conflict
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Resolution suggestions */}
                  <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Suggested Resolutions:
                    </h5>
                    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {messages.some(isTimeConflict) && (
                        <>
                          <li>Adjust the job's schedule to run at a different time</li>
                          <li>Change the job's frequency or day settings</li>
                        </>
                      )}
                      {messages.some(isCircularDependency) && (
                        <>
                          <li>Remove one of the circular dependencies</li>
                          <li>Restructure the workflow to avoid dependency loops</li>
                        </>
                      )}
                      <li>If this conflict is intentional, you can ignore it</li>
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {conflicts.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          <p>
            Conflicts are detected automatically and may require your attention before jobs run.
            Unresolved conflicts could lead to unexpected behavior or job failures.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConflictResolution;
