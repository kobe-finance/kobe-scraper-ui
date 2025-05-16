import React from 'react';
import { ScheduledJob } from './types';
import { 
  ExclamationTriangleIcon, 
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface MobileConflictResolutionProps {
  conflicts: {jobId: string; message: string}[];
  jobs: ScheduledJob[];
  onResolveConflict: (jobId: string, message: string) => void;
  onSelectJob: (job: ScheduledJob) => void;
}

/**
 * Mobile-optimized conflict resolution component
 * Features larger touch targets and enhanced accessibility
 */
const MobileConflictResolution: React.FC<MobileConflictResolutionProps> = ({
  conflicts,
  jobs,
  onResolveConflict,
  onSelectJob
}) => {
  // Group conflicts by job
  const conflictsByJob = conflicts.reduce((acc, conflict) => {
    if (!acc[conflict.jobId]) {
      acc[conflict.jobId] = [];
    }
    acc[conflict.jobId].push(conflict.message);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="h-full flex flex-col" role="region" aria-label="Scheduling Conflicts">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Scheduling Conflicts
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {conflicts.length > 0 
            ? 'The following jobs have scheduling conflicts that need to be resolved.' 
            : 'No scheduling conflicts detected.'}
        </p>
      </div>

      {conflicts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <CheckCircleIcon className="h-12 w-12 text-green-500 dark:text-green-400 mb-4" aria-hidden="true" />
          <p className="text-base text-gray-700 dark:text-gray-300 text-center">
            All scheduling conflicts have been resolved.
          </p>
        </div>
      ) : (
        <ul className="space-y-4" aria-label="Conflict list">
          {Object.keys(conflictsByJob).map(jobId => {
            const job = jobs.find(j => j.id === jobId);
            
            if (!job) return null;
            
            return (
              <li 
                key={jobId}
                className="border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-lg overflow-hidden"
                aria-label={`Conflicts for ${job.name}`}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-base font-medium text-red-800 dark:text-red-300">
                        {job.name}
                      </h3>
                      <div className="mt-2">
                        <ul className="list-disc pl-5 space-y-1">
                          {conflictsByJob[jobId].map((message, index) => (
                            <li key={index} className="text-sm text-red-700 dark:text-red-300">
                              {message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-red-200 dark:border-red-900 p-4 bg-red-100 dark:bg-red-900/30">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center text-sm text-red-700 dark:text-red-300 mb-2 sm:mb-0">
                      <ClockIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
                      <p>
                        Next run: {new Date(job.nextRunTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          conflictsByJob[jobId].forEach(message => {
                            onResolveConflict(jobId, message);
                          });
                        }}
                        className="inline-flex items-center px-4 py-3 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                        aria-label={`Ignore conflicts for ${job.name}`}
                      >
                        <XCircleIcon className="h-5 w-5 mr-1.5" aria-hidden="true" />
                        Ignore
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectJob(job)}
                        className="inline-flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        aria-label={`Edit schedule for ${job.name}`}
                      >
                        Edit Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Empty state for small number of conflicts */}
      {conflicts.length > 0 && conflicts.length < 3 && (
        <div className="mt-auto pt-6">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
              Resolve Scheduling Conflicts
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              To resolve conflicts, you can:
            </p>
            <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>Change the schedule time or frequency of conflicting jobs</li>
              <li>Adjust job dependencies to enforce sequential execution</li>
              <li>Ignore the conflict if the jobs can safely run in parallel</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileConflictResolution;
