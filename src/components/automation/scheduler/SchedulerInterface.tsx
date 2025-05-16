import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { CalendarIcon, ClockIcon, ArrowsRightLeftIcon, BellIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Types
import { ScheduledJob, JobDependency, JobNotification } from './types';

// Mock data for development
import { mockScheduledJobs } from './mockData';

// Import placeholder components - these will be implemented next
import CalendarView from './CalendarView';
import ScheduleForm from './ScheduleForm';
import JobDependencies from './JobDependencies';
import NotificationSettings from './NotificationSettings';
import ConflictResolution from './ConflictResolution';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface SchedulerInterfaceProps {
  projectId?: string;
}

/**
 * Scheduler Interface component for managing automated job schedules
 * Includes calendar view, schedule configuration, dependency mapping, notifications, and conflict resolution
 */
const SchedulerInterface: React.FC<SchedulerInterfaceProps> = ({ projectId }) => {
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<ScheduledJob | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [conflicts, setConflicts] = useState<{jobId: string, message: string}[]>([]);

  // Tabs for the different sections of the scheduler
  const tabs = [
    { name: 'Calendar', icon: CalendarIcon },
    { name: 'Schedule', icon: ClockIcon, disabled: !selectedJob },
    { name: 'Dependencies', icon: ArrowsRightLeftIcon, disabled: !selectedJob },
    { name: 'Notifications', icon: BellIcon, disabled: !selectedJob },
    { name: 'Conflicts', icon: ExclamationTriangleIcon, badge: conflicts.length > 0 },
  ];

  // Load scheduled jobs on component mount
  useEffect(() => {
    // In a real app, this would fetch from an API
    setScheduledJobs(mockScheduledJobs);
    
    // Check for conflicts
    detectConflicts(mockScheduledJobs);
  }, [projectId]);

  // Handle selecting a job from the calendar
  const handleSelectJob = (job: ScheduledJob) => {
    setSelectedJob(job);
    setIsEditMode(false);
  };

  // Handle creating a new job
  const handleCreateJob = () => {
    const newJob: ScheduledJob = {
      id: `job-${Date.now()}`,
      name: 'New Job',
      workflowId: '',
      workflowName: '',
      scheduleType: 'recurring',
      frequency: 'daily',
      startTime: new Date().toISOString(),
      endTime: null,
      status: 'scheduled',
      nextRunTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dependencies: [],
      notifications: [],
      parameters: {},
    };
    
    setSelectedJob(newJob);
    setIsEditMode(true);
  };

  // Handle updating a job
  const handleUpdateJob = (updatedJob: ScheduledJob) => {
    if (isEditMode && !scheduledJobs.find(job => job.id === updatedJob.id)) {
      // Creating a new job
      setScheduledJobs([...scheduledJobs, updatedJob]);
    } else {
      // Updating existing job
      setScheduledJobs(
        scheduledJobs.map(job => (job.id === updatedJob.id ? updatedJob : job))
      );
    }
    
    setSelectedJob(updatedJob);
    setIsEditMode(false);
    
    // Check for conflicts after update
    detectConflicts([...scheduledJobs.filter(job => job.id !== updatedJob.id), updatedJob]);
  };

  // Handle deleting a job
  const handleDeleteJob = (jobId: string) => {
    setScheduledJobs(scheduledJobs.filter(job => job.id !== jobId));
    setSelectedJob(null);
    
    // Check for conflicts after deletion
    detectConflicts(scheduledJobs.filter(job => job.id !== jobId));
  };

  // Handle updating job dependencies
  const handleUpdateDependencies = (jobId: string, dependencies: JobDependency[]) => {
    const updatedJobs = scheduledJobs.map(job => {
      if (job.id === jobId) {
        return { ...job, dependencies };
      }
      return job;
    });
    
    setScheduledJobs(updatedJobs);
    
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, dependencies });
    }
    
    // Check for circular dependencies
    detectDependencyConflicts(updatedJobs);
  };

  // Handle updating job notifications
  const handleUpdateNotifications = (jobId: string, notifications: JobNotification[]) => {
    const updatedJobs = scheduledJobs.map(job => {
      if (job.id === jobId) {
        return { ...job, notifications };
      }
      return job;
    });
    
    setScheduledJobs(updatedJobs);
    
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, notifications });
    }
  };

  // Detect schedule conflicts between jobs
  const detectConflicts = (jobs: ScheduledJob[]) => {
    const newConflicts: {jobId: string, message: string}[] = [];
    
    // Simple time overlap detection for recurring jobs
    jobs.forEach((job1) => {
      jobs.forEach((job2) => {
        if (job1.id !== job2.id && job1.scheduleType === 'recurring' && job2.scheduleType === 'recurring') {
          // This is a simplified check - in a real app this would be more sophisticated
          if (job1.frequency === job2.frequency && job1.nextRunTime === job2.nextRunTime) {
            newConflicts.push({ 
              jobId: job1.id, 
              message: `Potential time conflict with "${job2.name}"`
            });
          }
        }
      });
    });
    
    setConflicts(newConflicts);
  };

  // Detect circular dependencies
  const detectDependencyConflicts = (jobs: ScheduledJob[]) => {
    // Build a dependency graph
    const dependencyGraph: Record<string, string[]> = {};
    jobs.forEach(job => {
      dependencyGraph[job.id] = job.dependencies.map(dep => dep.dependsOnJobId);
    });
    
    // Check for circular dependencies
    const newConflicts = [...conflicts];
    
    jobs.forEach(job => {
      if (hasCycle(dependencyGraph, job.id, new Set())) {
        if (!newConflicts.some(conflict => conflict.jobId === job.id && conflict.message.includes('circular'))) {
          newConflicts.push({
            jobId: job.id,
            message: 'Circular dependency detected'
          });
        }
      } else {
        // Remove any existing circular dependency conflicts for this job
        const index = newConflicts.findIndex(
          conflict => conflict.jobId === job.id && conflict.message.includes('circular')
        );
        if (index !== -1) {
          newConflicts.splice(index, 1);
        }
      }
    });
    
    setConflicts(newConflicts);
  };

  // Helper function to detect cycles in dependency graph
  const hasCycle = (graph: Record<string, string[]>, node: string, visited: Set<string>, path: Set<string> = new Set()): boolean => {
    if (path.has(node)) return true;
    if (visited.has(node)) return false;
    
    visited.add(node);
    path.add(node);
    
    const dependencies = graph[node] || [];
    for (const dep of dependencies) {
      if (hasCycle(graph, dep, visited, path)) {
        return true;
      }
    }
    
    path.delete(node);
    return false;
  };

  // Handle resolving a conflict
  const handleResolveConflict = (jobId: string, conflictMessage: string) => {
    setConflicts(conflicts.filter(
      conflict => !(conflict.jobId === jobId && conflict.message === conflictMessage)
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      <div className="px-4 sm:px-6 py-5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Job Scheduler</h2>
          <button
            type="button"
            onClick={handleCreateJob}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Create New Job
          </button>
        </div>
      </div>
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 px-4">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              disabled={tab.disabled}
              className={({ selected }) =>
                classNames(
                  'flex items-center py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap',
                  selected
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
                  tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                )
              }
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200">
                  {conflicts.length}
                </span>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="p-4">
          <Tab.Panel>
            <CalendarView 
              jobs={scheduledJobs} 
              onSelectJob={handleSelectJob} 
              conflicts={conflicts}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            {selectedJob && (
              <ScheduleForm
                job={selectedJob}
                isNewJob={isEditMode}
                onSave={handleUpdateJob}
                onDelete={handleDeleteJob}
              />
            )}
          </Tab.Panel>
          
          <Tab.Panel>
            {selectedJob && (
              <JobDependencies
                job={selectedJob}
                allJobs={scheduledJobs.filter(job => job.id !== selectedJob.id)}
                onUpdateDependencies={(dependencies) => 
                  handleUpdateDependencies(selectedJob.id, dependencies)
                }
              />
            )}
          </Tab.Panel>
          
          <Tab.Panel>
            {selectedJob && (
              <NotificationSettings
                job={selectedJob}
                onUpdateNotifications={(notifications) => 
                  handleUpdateNotifications(selectedJob.id, notifications)
                }
              />
            )}
          </Tab.Panel>
          
          <Tab.Panel>
            <ConflictResolution
              conflicts={conflicts}
              jobs={scheduledJobs}
              onResolveConflict={handleResolveConflict}
              onSelectJob={handleSelectJob}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default SchedulerInterface;
