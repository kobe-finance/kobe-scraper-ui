import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Card, CardContent } from '../../components';
import type { Job } from '../../core/types/job';
import { JobStatus } from '../../core/types/job';
import { JobFilters, type JobFiltersState, defaultFilters } from './components/JobFilters';
import { JobDetail } from './components/JobDetail';
import { JobConfigurationModal } from './components/JobConfigurationModal';
import { BatchJobsActions } from './components/BatchJobsActions';
import type { JobFormValues } from './components/types';
import { useApi } from '../../hooks/useApi';

const JobsPage: React.FC = () => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFiltersState>(defaultFilters);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Get API services from our hook
  const api = useApi();
  
  // Selected jobs for batch operations
  const selectedJobsData = selectedJobs.map(id => jobs.find(job => job.id === id)).filter(Boolean) as Job[];
  
  // Get the selected job
  const selectedJob = selectedJobId ? jobs.find(job => job.id === selectedJobId) || null : null;
  
  // Fetch jobs on component mount and when filters change
  useEffect(() => {
    fetchJobs();
  }, []);
  
  // Filter jobs when filters or jobs change
  useEffect(() => {
    filterJobs();
  }, [filters, jobs]);
  
  // Fetch jobs from the API
  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.job.listJobs({
        page: 1,
        per_page: 50, // We'll handle client-side pagination for now
        sort_by: 'created_at',
        sort_direction: 'desc'
      });
      
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter jobs based on current filters
  const filterJobs = () => {
    let result = [...jobs];
    
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(job => 
        job.name.toLowerCase().includes(searchLower) || 
        job.url.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter(job => job.status === filters.status);
    }
    
    // Filter by date range
    if (filters.dateRange.from) {
      const fromDate = new Date(filters.dateRange.from).getTime();
      result = result.filter(job => new Date(job.createdAt).getTime() >= fromDate);
    }
    
    if (filters.dateRange.to) {
      const toDate = new Date(filters.dateRange.to).getTime();
      result = result.filter(job => new Date(job.createdAt).getTime() <= toDate);
    }
    
    // Update filtered jobs
    setFilteredJobs(result);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: JobFiltersState) => {
    setFilters(newFilters);
  };
  
  // Handle refreshing jobs data
  const handleRefreshJobs = () => {
    fetchJobs();
  };
  
  // Handle job cancellation
  const handleCancelJob = async (jobId: string) => {
    try {
      await api.job.updateJob(jobId, { status: JobStatus.CANCELLED });
      // After successful cancellation, refresh the job list
      fetchJobs();
    } catch (err) {
      setError('Failed to cancel job. Please try again.');
      console.error('Error cancelling job:', err);
    }
  };
  
  // Handle job deletion
  const handleDeleteJob = async (jobId: string) => {
    try {
      await api.job.deleteJob(jobId);
      
      // If the deleted job was selected, clear selection
      if (selectedJobId === jobId) {
        setSelectedJobId(null);
      }
      
      // Also remove from batch selection if present
      setSelectedJobs(prev => prev.filter(id => id !== jobId));
      
      // Refresh the jobs list
      fetchJobs();
    } catch (err) {
      setError('Failed to delete job. Please try again.');
      console.error('Error deleting job:', err);
    }
  };
  
  // Handle batch job deletion
  const handleBatchDelete = async () => {
    setError(null);
    
    try {
      // Delete each selected job
      await Promise.all(selectedJobs.map(jobId => api.job.deleteJob(jobId)));
      
      // If the selected detail job was deleted, clear selection
      if (selectedJobId && selectedJobs.includes(selectedJobId)) {
        setSelectedJobId(null);
      }
      
      // Clear selection
      setSelectedJobs([]);
      
      // Refresh jobs
      fetchJobs();
    } catch (err) {
      setError('Failed to delete one or more jobs. Please try again.');
      console.error('Error deleting jobs:', err);
    }
  };
  
  // Handle batch job export
  const handleBatchExport = async () => {
    try {
      // For each selected job, get the results
      for (const jobId of selectedJobs) {
        const results = await api.job.getJobResults(jobId);
        console.log(`Exported job ${jobId} with ${results.total} results`);
        // In a real app, you would handle the exported data, e.g., download as CSV/JSON
      }
    } catch (err) {
      setError('Failed to export jobs. Please try again.');
      console.error('Error exporting jobs:', err);
    }
  };
  
  // Handle batch job rerun
  const handleBatchRerun = async () => {
    setError(null);
    
    try {
      const selectedJobsData = jobs.filter(job => selectedJobs.includes(job.id));
      
      // Create new jobs based on selected jobs
      for (const job of selectedJobsData) {
        await api.job.createJob({
          name: `Rerun of ${job.name}`,
          description: `Rerun of job ${job.id} from ${new Date().toLocaleDateString()}`,
          scraper_id: job.scraper_id,
          options: job.options,
          metadata: job.metadata
        });
      }
      
      // Refresh jobs
      fetchJobs();
      
      // Clear selection
      setSelectedJobs([]);
    } catch (err) {
      setError('Failed to rerun jobs. Please try again.');
      console.error('Error rerunning jobs:', err);
    }
  };
  
  // Handle job selection for batch operations
  const handleJobSelection = (jobId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedJobs(prev => [...prev, jobId]);
    } else {
      setSelectedJobs(prev => prev.filter(id => id !== jobId));
    }
  };
  
  // Handle "select all" checkbox
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      // Get all IDs from filtered jobs
      const allIds = filteredJobs.map(job => job.id);
      setSelectedJobs(allIds);
    } else {
      setSelectedJobs([]);
    }
  };
  
  // Handle job creation
  const handleCreateJob = async (jobData: JobFormValues) => {
    try {
      await api.job.createJob({
        name: jobData.name,
        description: jobData.description,
        scraper_id: jobData.scraperId,
        options: {
          max_pages: jobData.maxPages,
          delay_between_requests_ms: jobData.delay,
          priority: jobData.priority as 'low' | 'normal' | 'high',
          timeout_seconds: jobData.timeout
        },
        metadata: {
          source: 'kobe-scraper-ui',
          created_by: 'user', // In a real app, this would be the user ID
          notes: jobData.notes
        }
      });
      
      // Refresh jobs list
      fetchJobs();
      
      // Close the modal
      setIsCreateModalOpen(false);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to create job:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      };
    }
  };
  
  // Handle exporting job data
  const handleExportJob = async (jobId: string) => {
    try {
      const results = await api.job.getJobResults(jobId);
      console.log(`Exported job ${jobId} with ${results.total} results`);
      // In a real app, you would handle the exported data, e.g., download as CSV/JSON
    } catch (error) {
      setError('Failed to export job data. Please try again.');
      console.error('Error exporting job:', error);
    }
  };
  
  // Handle re-running a job
  const handleRerunJob = async (jobId: string) => {
    try {
      // Find the original job
      const originalJob = jobs.find(job => job.id === jobId);
      
      if (originalJob) {
        await api.job.createJob({
          name: `Rerun of ${originalJob.name}`,
          description: `Rerun of job ${originalJob.id} from ${new Date().toLocaleDateString()}`,
          scraper_id: originalJob.scraper_id,
          options: originalJob.options,
          metadata: originalJob.metadata
        });
        
        // Refresh jobs
        fetchJobs();
      }
    } catch (error) {
      setError('Failed to rerun job. Please try again.');
      console.error('Error rerunning job:', error);
    }
  };
  
  return (
    <div className="space-y-6 pb-8">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scraper Jobs</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleRefreshJobs} 
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            {/* Display error message if there is one */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
              <button 
                onClick={() => setError(null)} 
                className="float-right text-red-700 hover:text-red-900"
              >
                Dismiss
              </button>
            </div>
          )}
          
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Jobs
              </>
            )}
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Job
          </Button>
        </div>
      </div>
      
      {/* Job Filters */}
      <JobFilters 
        onFilterChange={handleFilterChange} 
        isLoading={isLoading}
      />
      
      {/* Batch Actions (if any jobs selected) */}
      {selectedJobs.length > 0 && (
        <BatchJobsActions
          selectedJobs={selectedJobsData}
          onClearSelection={() => setSelectedJobs([])}
          onDeleteSelected={handleBatchDelete}
          onExportSelected={handleBatchExport}
          onRerunSelected={handleBatchRerun}
        />
      )}
      
      {/* Selected Job Detail (if any) */}
      {selectedJob && (
        <JobDetail
          job={selectedJob}
          onClose={() => setSelectedJobId(null)}
          onCancel={handleCancelJob}
          onDelete={handleDeleteJob}
          onExport={handleExportJob}
          onRerun={handleRerunJob}
        />
      )}
      
      {/* Custom Jobs Table with selection */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">All Jobs</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="whitespace-nowrap py-3 pl-4 pr-3">
                    <input 
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      checked={selectedJobs.length > 0 && selectedJobs.length === filteredJobs.length}
                      ref={el => {
                        if (el) {
                          // @ts-ignore - DOM element indeterminate property
                          el.indeterminate = selectedJobs.length > 0 && selectedJobs.length < filteredJobs.length;
                        }
                      }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="whitespace-nowrap py-3 pr-3 font-medium">Job ID</th>
                  <th className="whitespace-nowrap py-3 px-3 font-medium">Name</th>
                  <th className="whitespace-nowrap py-3 px-3 font-medium">Status</th>
                  <th className="whitespace-nowrap py-3 px-3 font-medium">Start Time</th>
                  <th className="whitespace-nowrap py-3 px-3 font-medium">End Time</th>
                  <th className="whitespace-nowrap py-3 px-3 font-medium">Data Points</th>
                  <th className="whitespace-nowrap py-3 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Display error message if there is one */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
              <button 
                onClick={() => setError(null)} 
                className="float-right text-red-700 hover:text-red-900"
              >
                Dismiss
              </button>
            </div>
          )}
          
          {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">Loading...</td>
                  </tr>
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">No jobs found. Try adjusting your filters.</td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => {
                    const isSelected = selectedJobs.includes(job.id);
                    return (
                      <tr key={job.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/20">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3">
                          <input 
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                            checked={isSelected}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleJobSelection(job.id, e.target.checked)}
                          />
                        </td>
                        <td className="whitespace-nowrap py-4 pr-3 font-medium">{job.id}</td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <button 
                            onClick={() => setSelectedJobId(job.id)}
                            className="text-primary-600 hover:text-primary-700 hover:underline font-medium focus:outline-none"
                          >
                            {job.name}
                          </button>
                          {job.scraper_id && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              Scraper ID: {job.scraper_id}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span className={
                            `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              job.status === JobStatus.COMPLETED ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : job.status === JobStatus.RUNNING ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : job.status === JobStatus.PENDING ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : job.status === JobStatus.CANCELLED ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`
                          }>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {new Date(job.created_at).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {job.status === JobStatus.COMPLETED && job.completed_at ? new Date(job.completed_at).toLocaleString() : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {job.status === JobStatus.COMPLETED && job.result_count ? job.result_count.toLocaleString() : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => setSelectedJobId(job.id)}>View</Button>
                            {(job.status === JobStatus.RUNNING || job.status === JobStatus.PENDING) && (
                              <Button size="sm" variant="outline" onClick={() => handleCancelJob(job.id)}>Cancel</Button>
                            )}
                            {job.status !== JobStatus.RUNNING && job.status !== JobStatus.PENDING && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Job Configuration Modal */}
      <JobConfigurationModal
        onCreateJob={handleCreateJob}
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
};

export default JobsPage;
