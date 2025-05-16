import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SwipeableDrawer } from '@mui/material';
import {
  CalendarIcon,
  ClockIcon,
  ArrowsRightLeftIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { ScheduledJob, JobDependency, JobNotification } from './types';
import { mockScheduledJobs } from './mockData';
import GestureHandler from '../../common/GestureHandler';

// Import components - these would be created/updated for mobile optimization
import CalendarView from './CalendarView';
import MobileScheduleForm from './MobileScheduleForm';
import MobileJobDependencies from './MobileJobDependencies';
import MobileNotificationSettings from './MobileNotificationSettings';
import MobileConflictResolution from './MobileConflictResolution';

interface MobileSchedulerInterfaceProps {
  projectId?: string;
}

/**
 * Mobile-optimized Scheduler Interface
 * Features touch-friendly controls, swipeable tabs, and fullscreen modals
 */
const MobileSchedulerInterface: React.FC<MobileSchedulerInterfaceProps> = ({ projectId }) => {
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<ScheduledJob | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [conflicts, setConflicts] = useState<{jobId: string, message: string}[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Tabs for mobile navigation - memoized to prevent unnecessary re-renders
  const tabs = useMemo(() => [
    { name: 'Calendar', icon: CalendarIcon },
    { name: 'Schedule', icon: ClockIcon, disabled: !selectedJob },
    { name: 'Dependencies', icon: ArrowsRightLeftIcon, disabled: !selectedJob },
    { name: 'Notifications', icon: BellIcon, disabled: !selectedJob },
    { name: 'Conflicts', icon: ExclamationTriangleIcon, badge: conflicts.length > 0 },
  ], [selectedJob, conflicts.length]);

  // Load scheduled jobs on component mount
  useEffect(() => {
    // In a real app, this would fetch from an API
    setScheduledJobs(mockScheduledJobs);
    
    // Check for conflicts
    detectConflicts(mockScheduledJobs);
  }, [projectId]);

  // Handle selecting a job from the calendar - memoized to prevent unnecessary re-renders
  const handleSelectJob = useCallback((job: ScheduledJob) => {
    setSelectedJob(job);
    setIsEditMode(false);
    
    // Auto-navigate to schedule tab when a job is selected
    setActiveTab(1);
  };

  // Handle creating a new job - memoized to prevent unnecessary re-renders
  const handleCreateJob = useCallback(() => {
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
    
    // Navigate to schedule tab and open drawer
    setActiveTab(1);
  };

  // Handle updating a job - memoized with dependencies
  const handleUpdateJob = useCallback((updatedJob: ScheduledJob) => {
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
    
    // Close drawer after update
    setDrawerOpen(false);
    
    // Navigate back to calendar
    setActiveTab(0);
  };

  // Handle deleting a job - memoized with dependencies
  const handleDeleteJob = useCallback((jobId: string) => {
    setScheduledJobs(scheduledJobs.filter(job => job.id !== jobId));
    setSelectedJob(null);
    
    // Check for conflicts after deletion
    detectConflicts(scheduledJobs.filter(job => job.id !== jobId));
    
    // Close drawer after delete
    setDrawerOpen(false);
    
    // Navigate back to calendar
    setActiveTab(0);
  };

  // Handle updating job dependencies - memoized with dependencies
  const handleUpdateDependencies = useCallback((jobId: string, dependencies: JobDependency[]) => {
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
    
    // Close drawer after update
    setDrawerOpen(false);
  };

  // Handle updating job notifications - memoized with dependencies
  const handleUpdateNotifications = useCallback((jobId: string, notifications: JobNotification[]) => {
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
    
    // Close drawer after update
    setDrawerOpen(false);
  };

  // Detect schedule conflicts between jobs - memoized with dependencies
  const detectConflicts = useCallback((jobs: ScheduledJob[]) => {
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
    
    // Auto-navigate to conflicts tab if conflicts are detected
    if (newConflicts.length > 0 && conflicts.length === 0) {
      setActiveTab(4);
    }
  };

  // Detect circular dependencies - memoized with dependencies
  const detectDependencyConflicts = useCallback((jobs: ScheduledJob[]) => {
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
    
    // Auto-navigate to conflicts tab if new circular dependencies are detected
    if (newConflicts.length > conflicts.length) {
      setActiveTab(4);
    }
  };

  // Helper function to detect cycles in dependency graph - memoized for performance
  const hasCycle = useCallback((graph: Record<string, string[]>, node: string, visited: Set<string>, path: Set<string> = new Set()): boolean => {
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
  }, []);

  // Handle resolving a conflict - memoized with dependencies
  const handleResolveConflict = useCallback((jobId: string, conflictMessage: string) => {
    setConflicts(conflicts.filter(
      conflict => !(conflict.jobId === jobId && conflict.message === conflictMessage)
    ));
    
    // If no more conflicts, navigate back to calendar
    if (conflicts.length <= 1) {
      setActiveTab(0);
    }
  };

  // Handle swipe to change tabs - memoized with activeTab dependency
  const handleSwipeLeft = useCallback(() => {
    const nextTab = Math.min(activeTab + 1, tabs.length - 1);
    if (!tabs[nextTab].disabled) {
      setActiveTab(nextTab);
    }
  };

  const handleSwipeRight = useCallback(() => {
    const prevTab = Math.max(activeTab - 1, 0);
    setActiveTab(prevTab);
  }, [activeTab]);

  // Helper function to handle drawer open/close - memoized
  const toggleDrawer = useCallback((open: boolean) => {
    setDrawerOpen(open);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Job Scheduler</h2>
          <button
            type="button"
            onClick={handleCreateJob}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            aria-label="Create New Job"
          >
            Create Job
          </button>
        </div>
      </div>
      
      {/* Mobile tab navigation */}
      <div className="flex justify-around border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {tabs.map((tab, index) => (
          <button
            key={tab.name}
            disabled={tab.disabled}
            onClick={() => setActiveTab(index)}
            className={`flex flex-col items-center py-3 px-1 relative ${
              activeTab === index 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-500 dark:text-gray-400'
            } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-selected={activeTab === index}
            aria-disabled={tab.disabled}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
            role="tab"
          >
            <tab.icon className="h-6 w-6" />
            <span className="text-xs mt-1 font-medium">{tab.name}</span>
            {tab.badge && (
              <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200">
                {conflicts.length}
              </span>
            )}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>
        ))}
      </div>
      
      {/* Main content with gesture support */}
      <GestureHandler
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        className="min-h-[70vh] max-h-[75vh] overflow-y-auto"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {/* Calendar View */}
        {activeTab === 0 && (
          <div className="p-2">
            <CalendarView 
              jobs={scheduledJobs} 
              onSelectJob={handleSelectJob} 
              conflicts={conflicts}
            />
          </div>
        )}
        
        {/* Schedule Form - opens in a full-screen drawer */}
        {activeTab === 1 && selectedJob && (
          <div className="p-4 flex flex-col items-center justify-center">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {selectedJob.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedJob.scheduleType === 'recurring' 
                  ? `Recurring (${selectedJob.frequency})` 
                  : 'One-time'} schedule
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => toggleDrawer(true)}
              className="w-full py-4 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-center text-base font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              aria-label="Edit Schedule"
            >
              Edit Schedule
            </button>
            
            <div className="w-full mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schedule Summary
              </h4>
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400">Next Run</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(selectedJob.nextRunTime).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400">Status</dt>
                  <dd className="text-sm font-medium">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedJob.status === 'scheduled' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                        : selectedJob.status === 'running'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : selectedJob.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400">Dependencies</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedJob.dependencies.length || 'None'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400">Notifications</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedJob.notifications.length || 'None'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
        
        {/* Dependencies - opens in a full-screen drawer */}
        {activeTab === 2 && selectedJob && (
          <div className="p-4 flex flex-col items-center justify-center">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Job Dependencies
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure which jobs must run before {selectedJob.name}
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => toggleDrawer(true)}
              className="w-full py-4 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-center text-base font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              aria-label="Edit Dependencies"
            >
              Edit Dependencies
            </button>
            
            {selectedJob.dependencies.length > 0 ? (
              <div className="w-full mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Dependencies ({selectedJob.dependencies.length})
                </h4>
                <ul className="space-y-2">
                  {selectedJob.dependencies.map((dep) => {
                    const dependentJob = scheduledJobs.find(j => j.id === dep.dependsOnJobId);
                    return (
                      <li key={dep.id} className="text-sm text-gray-600 dark:text-gray-400">
                        • {dependentJob?.name || 'Unknown Job'} ({dep.dependencyType})
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="w-full mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No dependencies configured
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Notifications - opens in a full-screen drawer */}
        {activeTab === 3 && selectedJob && (
          <div className="p-4 flex flex-col items-center justify-center">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Notification Settings
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure alerts for job events
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => toggleDrawer(true)}
              className="w-full py-4 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-center text-base font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              aria-label="Edit Notifications"
            >
              Edit Notifications
            </button>
            
            {selectedJob.notifications.length > 0 ? (
              <div className="w-full mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Notifications ({selectedJob.notifications.length})
                </h4>
                <ul className="space-y-2">
                  {selectedJob.notifications.map((notification) => (
                    <li key={notification.id} className="text-sm text-gray-600 dark:text-gray-400">
                      • {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)} for {notification.events.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="w-full mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications configured
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Conflicts */}
        {activeTab === 4 && (
          <div className="p-4">
            <MobileConflictResolution
              conflicts={conflicts}
              jobs={scheduledJobs}
              onResolveConflict={handleResolveConflict}
              onSelectJob={handleSelectJob}
            />
          </div>
        )}
      </GestureHandler>
      
      {/* Mobile navigation buttons */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={handleSwipeRight}
          disabled={activeTab === 0}
          className={`flex items-center justify-center h-10 w-10 rounded-full ${
            activeTab === 0
              ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="Previous Tab"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {tabs[activeTab].name}
        </div>
        
        <button
          type="button"
          onClick={handleSwipeLeft}
          disabled={activeTab === tabs.length - 1 || tabs[activeTab + 1].disabled}
          className={`flex items-center justify-center h-10 w-10 rounded-full ${
            activeTab === tabs.length - 1 || tabs[activeTab + 1].disabled
              ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="Next Tab"
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      
      {/* Mobile full-screen drawers */}
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        disableSwipeToOpen
        PaperProps={{
          style: {
            height: '90%',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }
        }}
      >
        <div className="p-4 h-full overflow-y-auto">
          {/* Schedule Form */}
          {activeTab === 1 && selectedJob && (
            <MobileScheduleForm
              job={selectedJob}
              isNewJob={isEditMode}
              onSave={handleUpdateJob}
              onDelete={handleDeleteJob}
              onCancel={() => toggleDrawer(false)}
            />
          )}
          
          {/* Dependencies Form */}
          {activeTab === 2 && selectedJob && (
            <MobileJobDependencies
              job={selectedJob}
              allJobs={scheduledJobs.filter(job => job.id !== selectedJob.id)}
              onUpdateDependencies={(dependencies) => 
                handleUpdateDependencies(selectedJob.id, dependencies)
              }
              onCancel={() => toggleDrawer(false)}
            />
          )}
          
          {/* Notifications Form */}
          {activeTab === 3 && selectedJob && (
            <MobileNotificationSettings
              job={selectedJob}
              onUpdateNotifications={(notifications) => 
                handleUpdateNotifications(selectedJob.id, notifications)
              }
              onCancel={() => toggleDrawer(false)}
            />
          )}
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default MobileSchedulerInterface;
