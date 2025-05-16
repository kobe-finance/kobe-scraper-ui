/**
 * Types for the scheduler system
 */

// Schedule frequency types
export type ScheduleFrequency =
  | 'once'
  | 'minutely'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'custom';

// Schedule types
export type ScheduleType = 'one-time' | 'recurring';

// Job status types
export type JobStatus =
  | 'scheduled'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'paused';

// Days of the week for weekly schedules
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Job dependency interface
export interface JobDependency {
  id: string;
  dependsOnJobId: string;
  dependencyType: 'success' | 'completion' | 'failure';
  timeout?: number; // in minutes
}

// Job notification interface
export interface JobNotification {
  id: string;
  type: 'email' | 'slack' | 'webhook' | 'inApp';
  recipients?: string[]; // for email or slack
  webhookUrl?: string; // for webhook
  channel?: string; // for slack
  events: ('start' | 'success' | 'failure' | 'timeout')[];
  message?: string;
  includeResults?: boolean;
}

// Scheduled job interface
export interface ScheduledJob {
  id: string;
  name: string;
  workflowId: string;
  workflowName: string;
  scheduleType: ScheduleType;
  frequency: ScheduleFrequency;
  startTime: string; // ISO string
  endTime: string | null; // ISO string or null if no end time
  status: JobStatus;
  nextRunTime: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  dependencies: JobDependency[];
  notifications: JobNotification[];
  parameters: Record<string, any>; // Parameters passed to the workflow
  
  // Recurring schedule details
  cron?: string;
  timezone?: string;
  daysOfWeek?: DayOfWeek[];
  dayOfMonth?: number;
  monthOfYear?: number;
  minuteOfHour?: number;
  hourOfDay?: number;
  
  // Run history related
  lastRunTime?: string; // ISO string
  lastRunStatus?: JobStatus;
  lastRunDuration?: number; // in seconds
  averageRunDuration?: number; // in seconds
  totalRuns?: number;
  successfulRuns?: number;
  failedRuns?: number;
}

// Job run history
export interface JobRunHistory {
  id: string;
  jobId: string;
  startTime: string; // ISO string
  endTime: string | null; // ISO string or null if still running
  status: JobStatus;
  duration: number; // in seconds
  result?: any;
  error?: string;
  logs?: string[];
}

// Calendar event interface for displaying jobs on calendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  allDay: boolean;
  status: JobStatus;
  jobId: string;
  className?: string;
  editable?: boolean;
  extendedProps?: Record<string, any>;
}

// Week of month for monthly schedules (first Monday, last Friday, etc.)
export interface WeekOfMonth {
  week: 'first' | 'second' | 'third' | 'fourth' | 'last';
  day: DayOfWeek;
}

// Schedule expression for complex scheduling rules
export interface ScheduleExpression {
  type: 'cron' | 'rate' | 'fixed';
  value: string; // cron expression, rate expression, or fixed time
  timezone?: string;
}

// Schedule conflict
export interface ScheduleConflict {
  jobId: string;
  conflictingJobId: string;
  conflictType: 'time-overlap' | 'resource-constraint' | 'circular-dependency';
  message: string;
  severity: 'warning' | 'error';
  suggestedResolution?: string;
}

// Job filter options for searching and filtering jobs
export interface JobFilterOptions {
  status?: JobStatus[];
  frequency?: ScheduleFrequency[];
  startDate?: string; // ISO string
  endDate?: string; // ISO string
  workflowIds?: string[];
  search?: string;
  sortBy?: 'name' | 'status' | 'nextRunTime' | 'createdAt' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
}
