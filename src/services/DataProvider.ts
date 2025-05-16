import { ScheduledJob, Workflow, JobDependency, JobNotification } from '../components/automation/scheduler/types';

/**
 * DataProvider interface defines all methods for data access
 * Both mock and real implementations will adhere to this interface
 */
export interface DataProvider {
  // Scheduler related methods
  getJobs(): Promise<ScheduledJob[]>;
  getJob(id: string): Promise<ScheduledJob | null>;
  createJob(job: Omit<ScheduledJob, 'id'>): Promise<ScheduledJob>;
  updateJob(job: ScheduledJob): Promise<ScheduledJob>;
  deleteJob(id: string): Promise<boolean>;
  
  // Workflow related methods
  getWorkflows(): Promise<Workflow[]>;
  getWorkflow(id: string): Promise<Workflow | null>;
  createWorkflow(workflow: Omit<Workflow, 'id'>): Promise<Workflow>;
  updateWorkflow(workflow: Workflow): Promise<Workflow>;
  deleteWorkflow(id: string): Promise<boolean>;
  
  // Dependencies and notifications
  getJobDependencies(jobId: string): Promise<JobDependency[]>;
  updateJobDependencies(jobId: string, dependencies: JobDependency[]): Promise<JobDependency[]>;
  
  getJobNotifications(jobId: string): Promise<JobNotification[]>;
  updateJobNotifications(jobId: string, notifications: JobNotification[]): Promise<JobNotification[]>;
}

/**
 * API implementation of DataProvider for production and live testing
 */
export class ApiDataProvider implements DataProvider {
  private baseUrl: string;
  
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }
  
  async getJobs(): Promise<ScheduledJob[]> {
    const response = await fetch(`${this.baseUrl}/jobs`);
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }
    return await response.json();
  }
  
  async getJob(id: string): Promise<ScheduledJob | null> {
    const response = await fetch(`${this.baseUrl}/jobs/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch job: ${response.statusText}`);
    }
    return await response.json();
  }
  
  async createJob(job: Omit<ScheduledJob, 'id'>): Promise<ScheduledJob> {
    const response = await fetch(`${this.baseUrl}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error(`Failed to create job: ${response.statusText}`);
    }
    return await response.json();
  }
  
  async updateJob(job: ScheduledJob): Promise<ScheduledJob> {
    const response = await fetch(`${this.baseUrl}/jobs/${job.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error(`Failed to update job: ${response.statusText}`);
    }
    return await response.json();
  }
  
  async deleteJob(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/jobs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete job: ${response.statusText}`);
    }
    return true;
  }
  
  async getWorkflows(): Promise<Workflow[]> {
    const response = await fetch(`${this.baseUrl}/workflows`);
    if (!response.ok) {
      throw new Error(`Failed to fetch workflows: ${response.statusText}`);
    }
    return await response.json();
  }
  
  async getWorkflow(id: string): Promise<Workflow | null> {
    const response = await fetch(`${this.baseUrl}/workflows/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch workflow: ${response.statusText}`);
    }
    return await response.json();
  }
  
  async createWorkflow(workflow: Omit<Workflow, 'id'>): Promise<Workflow> {
    const response = await fetch(`${this.baseUrl}/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflow),
    });
    if (!response.ok) {
      throw new Error(`Failed to create workflow: ${response.statusText}`);
    }
    return await response.json();
  }
  
  async updateWorkflow(workflow: Workflow): Promise<Workflow> {
    const response = await fetch(`${this.baseUrl}/workflows/${workflow.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflow),
    });
    if (!response.ok) {
      throw new Error(`Failed to update workflow: ${response.statusText}`);
    }
    return await response.json();
  }
  
  async deleteWorkflow(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/workflows/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete workflow: ${response.statusText}`);
    }
    return true;
  }
  
  async getJobDependencies(jobId: string): Promise<JobDependency[]> {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}/dependencies`);
    if (!response.ok) {
      throw new Error(`Failed to fetch job dependencies: ${response.statusText}`);
    }
    return await response.json();
  }
  
  async updateJobDependencies(jobId: string, dependencies: JobDependency[]): Promise<JobDependency[]> {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}/dependencies`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dependencies),
    });
    if (!response.ok) {
      throw new Error(`Failed to update job dependencies: ${response.statusText}`);
    }
    return await response.json();
  }
  
  async getJobNotifications(jobId: string): Promise<JobNotification[]> {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}/notifications`);
    if (!response.ok) {
      throw new Error(`Failed to fetch job notifications: ${response.statusText}`);
    }
    return await response.json();
  }
  
  async updateJobNotifications(jobId: string, notifications: JobNotification[]): Promise<JobNotification[]> {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}/notifications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notifications),
    });
    if (!response.ok) {
      throw new Error(`Failed to update job notifications: ${response.statusText}`);
    }
    return await response.json();
  }
}

/**
 * Factory function to get the appropriate data provider
 * Uses environment variables to determine which provider to use
 */
export function getDataProvider(): DataProvider {
  // This will be replaced by the mock implementation in tests
  return new ApiDataProvider(
    process.env.VITE_API_BASE_URL || '/api'
  );
}
