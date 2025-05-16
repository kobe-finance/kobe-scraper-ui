import React, { useState, useEffect } from 'react';
import { ScheduledJob, JobDependency } from './types';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface JobDependenciesProps {
  job: ScheduledJob;
  allJobs: ScheduledJob[];
  onUpdateDependencies: (dependencies: JobDependency[]) => void;
}

/**
 * Job Dependencies component for configuring job dependencies
 * Allows users to specify which jobs must run before this job
 */
const JobDependencies: React.FC<JobDependenciesProps> = ({
  job,
  allJobs,
  onUpdateDependencies
}) => {
  const [dependencies, setDependencies] = useState<JobDependency[]>(job.dependencies || []);
  const [newDependency, setNewDependency] = useState<Partial<JobDependency>>({
    dependencyType: 'success'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Update dependencies when job changes
  useEffect(() => {
    setDependencies(job.dependencies || []);
  }, [job]);

  // Handle adding a new dependency
  const handleAddDependency = () => {
    if (
      !newDependency.dependsOnJobId ||
      !newDependency.dependencyType
    ) {
      return; // Don't add incomplete dependencies
    }

    const dependency: JobDependency = {
      id: `dep-${Date.now()}`,
      dependsOnJobId: newDependency.dependsOnJobId,
      dependencyType: newDependency.dependencyType,
      timeout: newDependency.timeout
    };

    const updatedDependencies = [...dependencies, dependency];
    setDependencies(updatedDependencies);
    onUpdateDependencies(updatedDependencies);
    
    // Reset form
    setNewDependency({
      dependencyType: 'success'
    });
    setShowAddForm(false);
  };

  // Handle removing a dependency
  const handleRemoveDependency = (id: string) => {
    const updatedDependencies = dependencies.filter(dep => dep.id !== id);
    setDependencies(updatedDependencies);
    onUpdateDependencies(updatedDependencies);
  };

  // Get job name from job ID
  const getJobName = (jobId: string): string => {
    const foundJob = allJobs.find(j => j.id === jobId);
    return foundJob ? foundJob.name : 'Unknown Job';
  };

  // Get human-readable dependency type label
  const getDependencyTypeLabel = (type: string): string => {
    switch (type) {
      case 'success':
        return 'Successfully Completed';
      case 'completion':
        return 'Completed (Success or Failure)';
      case 'failure':
        return 'Failed';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Job Dependencies
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Configure which jobs must run before this job executes
        </p>
      </div>

      {/* Existing dependencies */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden">
        {dependencies.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500 dark:text-gray-400">
            <p>No dependencies configured. This job will run based on its schedule only.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {dependencies.map((dependency) => (
              <li key={dependency.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {getJobName(dependency.dependsOnJobId)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Must have {getDependencyTypeLabel(dependency.dependencyType)}
                    </span>
                    {dependency.timeout && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Timeout: {dependency.timeout} minutes
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDependency(dependency.id)}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                  >
                    <TrashIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add dependency form */}
      {showAddForm ? (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Add New Dependency</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="dependsOnJobId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Depends on Job
              </label>
              <select
                id="dependsOnJobId"
                name="dependsOnJobId"
                value={newDependency.dependsOnJobId || ''}
                onChange={(e) => setNewDependency({ ...newDependency, dependsOnJobId: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a job</option>
                {allJobs
                  .filter(j => !dependencies.some(d => d.dependsOnJobId === j.id))
                  .map(j => (
                    <option key={j.id} value={j.id}>
                      {j.name}
                    </option>
                  ))
                }
              </select>
            </div>
            
            <div>
              <label htmlFor="dependencyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dependency Type
              </label>
              <select
                id="dependencyType"
                name="dependencyType"
                value={newDependency.dependencyType || 'success'}
                onChange={(e) => setNewDependency({
                  ...newDependency,
                  dependencyType: e.target.value as 'success' | 'completion' | 'failure'
                })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="success">Must complete successfully</option>
                <option value="completion">Must complete (success or failure)</option>
                <option value="failure">Must fail</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="timeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Timeout (minutes, optional)
              </label>
              <input
                type="number"
                name="timeout"
                id="timeout"
                min="1"
                value={newDependency.timeout || ''}
                onChange={(e) => setNewDependency({
                  ...newDependency,
                  timeout: e.target.value ? parseInt(e.target.value) : undefined
                })}
                placeholder="e.g., 60"
                className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                If the dependency isn't met within this time, this job will be skipped
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDependency}
                disabled={!newDependency.dependsOnJobId || !newDependency.dependencyType}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Dependency
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            disabled={allJobs.filter(j => !dependencies.some(d => d.dependsOnJobId === j.id)).length === 0}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Add Dependency
          </button>
          {allJobs.filter(j => !dependencies.some(d => d.dependsOnJobId === j.id)).length === 0 && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              All available jobs are already dependencies.
            </p>
          )}
        </div>
      )}

      {/* Dependency visualization */}
      {dependencies.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Dependency Flow</h4>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md overflow-auto">
            <div className="flex items-center justify-center min-h-[100px]">
              {/* This is a simplified visualization. In a real implementation,
                  you might want to use a more sophisticated graph visualization library */}
              <div className="flex flex-col items-center">
                {dependencies.map((dep, index) => (
                  <div key={dep.id} className="mb-4 flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900 border border-blue-500 px-3 py-2 rounded-md text-sm text-blue-800 dark:text-blue-200">
                      {getJobName(dep.dependsOnJobId)}
                    </div>
                    <div className="mx-4 border-b-2 border-gray-400 dark:border-gray-500 w-16"></div>
                    {index === dependencies.length - 1 && (
                      <div className="bg-green-100 dark:bg-green-900 border border-green-500 px-3 py-2 rounded-md text-sm text-green-800 dark:text-green-200">
                        {job.name}
                      </div>
                    )}
                  </div>
                ))}
                {dependencies.length === 1 && (
                  <div className="bg-green-100 dark:bg-green-900 border border-green-500 px-3 py-2 rounded-md text-sm text-green-800 dark:text-green-200">
                    {job.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDependencies;
