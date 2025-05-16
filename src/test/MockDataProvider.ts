import { DataProvider } from '../services/DataProvider';
import { ScheduledJob, Workflow, JobDependency, JobNotification } from '../components/automation/scheduler/types';
import jobsData from './fixtures/scheduler/jobs.json';
import workflowsData from './fixtures/scheduler/workflows.json';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

/**
 * Schema validation for mock data to ensure it matches expected API shape
 */
export const ScheduledJobSchema = z.object({
  id: z.string(),
  name: z.string(),
  workflowId: z.string(),
  workflowName: z.string().optional(),
  scheduleType: z.enum(['one-time', 'recurring']),
  frequency: z.enum(['once', 'minutely', 'hourly', 'daily', 'weekly', 'monthly']),
  startTime: z.string(),
  endTime: z.string().nullable(),
  hourOfDay: z.number().optional(),
  minuteOfHour: z.number().optional(),
  dayOfMonth: z.number().optional(),
  daysOfWeek: z.array(z.enum([
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ])).optional(),
  timezone: z.string().optional(),
  status: z.enum(['scheduled', 'running', 'completed', 'failed']),
  nextRunTime: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  dependencies: z.array(z.object({
    id: z.string(),
    dependsOnJobId: z.string(),
    dependencyType: z.enum(['sequential', 'conditional', 'parallel']),
    createdAt: z.string(),
  })).optional(),
  notifications: z.array(z.object({
    id: z.string(),
    type: z.string(),
    events: z.array(z.string()),
    recipients: z.array(z.string()).optional(),
    configuration: z.record(z.any()),
    createdAt: z.string(),
  })).optional(),
  parameters: z.record(z.any()).optional(),
});

export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  nodes: z.array(z.object({
    id: z.string(),
    type: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    data: z.record(z.any()),
  })),
  connections: z.array(z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string().optional(),
    targetHandle: z.string().optional(),
  })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * MockDataProvider implementation of DataProvider for testing
 * Uses local fixture data instead of real API calls
 */
export class MockDataProvider implements DataProvider {
  private jobs: ScheduledJob[];
  private workflows: Workflow[];
  
  constructor() {
    // Load and validate data from fixtures
    try {
      this.jobs = this.validateJobs(jobsData);
      this.workflows = this.validateWorkflows(workflowsData);
    } catch (error) {
      console.error('Mock data validation error:', error);
      this.jobs = [];
      this.workflows = [];
    }
  }

  /**
   * Validate jobs data against schema
   */
  private validateJobs(data: any): ScheduledJob[] {
    return z.array(ScheduledJobSchema).parse(data);
  }

  /**
   * Validate workflows data against schema
   */
  private validateWorkflows(data: any): Workflow[] {
    return z.array(WorkflowSchema).parse(data);
  }
  
  /**
   * Create a deep clone of an object to avoid unintentional mutations
   */
  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  // DataProvider method implementations
  async getJobs(): Promise<ScheduledJob[]> {
    return this.clone(this.jobs);
  }
  
  async getJob(id: string): Promise<ScheduledJob | null> {
    const job = this.jobs.find(j => j.id === id);
    return job ? this.clone(job) : null;
  }
  
  async createJob(job: Omit<ScheduledJob, 'id'>): Promise<ScheduledJob> {
    const newJob = {
      ...job,
      id: `job-${uuidv4()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as ScheduledJob;
    
    this.jobs.push(newJob);
    return this.clone(newJob);
  }
  
  async updateJob(job: ScheduledJob): Promise<ScheduledJob> {
    const index = this.jobs.findIndex(j => j.id === job.id);
    if (index === -1) {
      throw new Error(`Job not found: ${job.id}`);
    }
    
    const updatedJob = {
      ...job,
      updatedAt: new Date().toISOString(),
    };
    
    this.jobs[index] = updatedJob;
    return this.clone(updatedJob);
  }
  
  async deleteJob(id: string): Promise<boolean> {
    const initialLength = this.jobs.length;
    this.jobs = this.jobs.filter(job => job.id !== id);
    return this.jobs.length < initialLength;
  }
  
  async getWorkflows(): Promise<Workflow[]> {
    return this.clone(this.workflows);
  }
  
  async getWorkflow(id: string): Promise<Workflow | null> {
    const workflow = this.workflows.find(w => w.id === id);
    return workflow ? this.clone(workflow) : null;
  }
  
  async createWorkflow(workflow: Omit<Workflow, 'id'>): Promise<Workflow> {
    const newWorkflow = {
      ...workflow,
      id: `workflow-${uuidv4()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Workflow;
    
    this.workflows.push(newWorkflow);
    return this.clone(newWorkflow);
  }
  
  async updateWorkflow(workflow: Workflow): Promise<Workflow> {
    const index = this.workflows.findIndex(w => w.id === workflow.id);
    if (index === -1) {
      throw new Error(`Workflow not found: ${workflow.id}`);
    }
    
    const updatedWorkflow = {
      ...workflow,
      updatedAt: new Date().toISOString(),
    };
    
    this.workflows[index] = updatedWorkflow;
    return this.clone(updatedWorkflow);
  }
  
  async deleteWorkflow(id: string): Promise<boolean> {
    const initialLength = this.workflows.length;
    this.workflows = this.workflows.filter(workflow => workflow.id !== id);
    return this.workflows.length < initialLength;
  }
  
  async getJobDependencies(jobId: string): Promise<JobDependency[]> {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }
    
    return this.clone(job.dependencies || []);
  }
  
  async updateJobDependencies(jobId: string, dependencies: JobDependency[]): Promise<JobDependency[]> {
    const jobIndex = this.jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) {
      throw new Error(`Job not found: ${jobId}`);
    }
    
    this.jobs[jobIndex] = {
      ...this.jobs[jobIndex],
      dependencies,
      updatedAt: new Date().toISOString(),
    };
    
    return this.clone(dependencies);
  }
  
  async getJobNotifications(jobId: string): Promise<JobNotification[]> {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }
    
    return this.clone(job.notifications || []);
  }
  
  async updateJobNotifications(jobId: string, notifications: JobNotification[]): Promise<JobNotification[]> {
    const jobIndex = this.jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) {
      throw new Error(`Job not found: ${jobId}`);
    }
    
    this.jobs[jobIndex] = {
      ...this.jobs[jobIndex],
      notifications,
      updatedAt: new Date().toISOString(),
    };
    
    return this.clone(notifications);
  }
}
