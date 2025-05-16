import React, { useState, useEffect } from 'react';
import { ScheduledJob, JobDependency } from './types';
import { XMarkIcon, PlusIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface MobileJobDependenciesProps {
  job: ScheduledJob;
  allJobs: ScheduledJob[];
  onUpdateDependencies: (dependencies: JobDependency[]) => void;
  onCancel: () => void;
}

/**
 * Mobile-optimized job dependencies component
 * Features larger touch targets and improved accessibility
 */
const MobileJobDependencies: React.FC<MobileJobDependenciesProps> = ({
  job,
  allJobs,
  onUpdateDependencies,
  onCancel
}) => {
  const [dependencies, setDependencies] = useState<JobDependency[]>(job.dependencies || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDependencyJobId, setNewDependencyJobId] = useState<string>('');
  const [newDependencyType, setNewDependencyType] = useState<string>('sequential');

  // Update dependencies when job changes
  useEffect(() => {
    setDependencies(job.dependencies || []);
  }, [job]);

  // Handle saving dependencies
  const handleSave = () => {
    onUpdateDependencies(dependencies);
  };

  // Handle adding a new dependency
  const handleAddDependency = () => {
    if (!newDependencyJobId) return;

    const newDependency: JobDependency = {
      id: `dep-${Date.now()}`,
      dependsOnJobId: newDependencyJobId,
      dependencyType: newDependencyType as 'sequential' | 'conditional' | 'parallel',
      createdAt: new Date().toISOString()
    };

    setDependencies([...dependencies, newDependency]);
    setShowAddForm(false);
    setNewDependencyJobId('');
    setNewDependencyType('sequential');
  };

  // Handle removing a dependency
  const handleRemoveDependency = (dependencyId: string) => {
    setDependencies(dependencies.filter(dep => dep.id !== dependencyId));
  };

  return (
    <div className="h-full flex flex-col" role="dialog" aria-labelledby="dependencies-title">
      {/* Mobile form header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h2 
          id="dependencies-title" 
          className="text-lg font-medium text-gray-900 dark:text-white"
        >
          Job Dependencies
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configure which jobs must run before <span className="font-medium">{job.name}</span>
        </p>
      </div>

      {/* Current dependencies list */}
      <div className="flex-1 overflow-y-auto mb-4">
        {dependencies.length === 0 ? (
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No dependencies configured
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Add dependencies to ensure jobs run in the correct order
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" role="list" aria-label="Job dependencies">
            {dependencies.map((dependency) => {
              const dependentJob = allJobs.find(j => j.id === dependency.dependsOnJobId);
              return (
                <li 
                  key={dependency.id} 
                  className="p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                            dependency.dependencyType === 'sequential'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : dependency.dependencyType === 'conditional'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}
                          aria-label={`Dependency type: ${dependency.dependencyType}`}
                        >
                          {dependency.dependencyType.charAt(0).toUpperCase() + dependency.dependencyType.slice(1)}
                        </span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {dependentJob?.name || 'Unknown Job'}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {dependentJob?.scheduleType === 'recurring' 
                          ? `${dependentJob.frequency.charAt(0).toUpperCase() + dependentJob.frequency.slice(1)} job` 
                          : 'One-time job'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDependency(dependency.id)}
                      className="ml-2 inline-flex items-center justify-center p-2 rounded-full text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Remove dependency on ${dependentJob?.name || 'Unknown Job'}`}
                    >
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Add dependency form */}
      {showAddForm ? (
        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Add Dependency
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="dependsOnJobId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job
              </label>
              <select
                id="dependsOnJobId"
                name="dependsOnJobId"
                value={newDependencyJobId}
                onChange={(e) => setNewDependencyJobId(e.target.value)}
                className="shadow-sm block w-full px-4 py-3 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                aria-label="Select job"
              >
                <option value="">Select a job...</option>
                {allJobs
                  .filter(j => !dependencies.some(dep => dep.dependsOnJobId === j.id))
                  .map(j => (
                    <option key={j.id} value={j.id}>
                      {j.name}
                    </option>
                  ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="dependencyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dependency Type
              </label>
              <select
                id="dependencyType"
                name="dependencyType"
                value={newDependencyType}
                onChange={(e) => setNewDependencyType(e.target.value)}
                className="shadow-sm block w-full px-4 py-3 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                aria-label="Select dependency type"
              >
                <option value="sequential">Sequential (Run after completion)</option>
                <option value="conditional">Conditional (Run only if successful)</option>
                <option value="parallel">Parallel (Run in parallel)</option>
              </select>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {newDependencyType === 'sequential' && 'This job will run after the selected job completes (regardless of outcome).'}
                {newDependencyType === 'conditional' && 'This job will only run if the selected job completes successfully.'}
                {newDependencyType === 'parallel' && 'This job can run at the same time as the selected job.'}
              </p>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                aria-label="Cancel adding dependency"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDependency}
                disabled={!newDependencyJobId}
                className={`inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${
                  !newDependencyJobId 
                    ? 'bg-indigo-300 dark:bg-indigo-700 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                aria-label="Add dependency"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 mb-4"
          aria-label="Add new dependency"
        >
          <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          Add Dependency
        </button>
      )}

      {/* Form explanation */}
      <div className="mb-6">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <ChevronRightIcon className="h-5 w-5 mr-1 text-gray-400" aria-hidden="true" />
            About Dependencies
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dependencies ensure your jobs run in the correct order. For example, if job B depends on job A, job B will only run after job A completes.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-auto flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          aria-label="Cancel"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          aria-label="Save dependencies"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MobileJobDependencies;
