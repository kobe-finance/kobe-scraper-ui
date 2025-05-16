/**
 * Types for scheduling system
 */

export interface ScheduledJob {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'failed' | 'completed';
  createdAt: string;
  updatedAt: string;
  lastRun?: string; // ISO date string
  nextRun?: string; // ISO date string
  schedule: {
    type: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
    time?: string; // HH:MM format
    day?: string; // For weekly: Monday, Tuesday, etc.
    dayOfMonth?: number; // For monthly: 1-31
    custom?: string; // For custom schedules
  };
  scraperConfig: {
    scraperId: string;
    scraperName: string;
    targetUrl?: string;
    parameters?: Record<string, any>;
  };
}

export interface SchedulerSettings {
  maxConcurrentJobs: number;
  respectRobotsTxt: boolean;
  defaultDelay: number; // in seconds
}

export interface JobScheduleFormData {
  name: string;
  description?: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  startTime?: string;
  endTime?: string;
  scraperConfig: {
    scraperId: string;
    parameters?: Record<string, any>;
  };
}
