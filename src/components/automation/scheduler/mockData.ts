import { ScheduledJob } from './types';

/**
 * Mock data for scheduler development
 */

// Get today's date at midnight
const today = new Date();
today.setHours(0, 0, 0, 0);

// Get dates for this week
const getDateForDay = (dayOffset: number): Date => {
  const date = new Date(today);
  date.setDate(date.getDate() + dayOffset);
  return date;
};

// Format a date as ISO string
const formatDateISO = (date: Date): string => date.toISOString();

// Mock scheduled jobs
export const mockScheduledJobs: ScheduledJob[] = [
  {
    id: 'job-1',
    name: 'Daily Product Scraping',
    workflowId: 'workflow-1',
    workflowName: 'E-commerce Scraper',
    scheduleType: 'recurring',
    frequency: 'daily',
    startTime: formatDateISO(getDateForDay(0)),
    endTime: null,
    status: 'scheduled',
    nextRunTime: formatDateISO(getDateForDay(1)),
    createdAt: formatDateISO(getDateForDay(-30)),
    updatedAt: formatDateISO(getDateForDay(-5)),
    dependencies: [],
    notifications: [
      {
        id: 'notification-1',
        type: 'email',
        recipients: ['user@example.com'],
        events: ['failure'],
        includeResults: true
      }
    ],
    parameters: { 
      url: 'https://example.com/products',
      maxPages: 10
    },
    hourOfDay: 8,
    minuteOfHour: 0,
    lastRunTime: formatDateISO(getDateForDay(-1)),
    lastRunStatus: 'completed',
    lastRunDuration: 540,
    averageRunDuration: 600,
    totalRuns: 30,
    successfulRuns: 28,
    failedRuns: 2
  },
  {
    id: 'job-2',
    name: 'Weekly Price Analysis',
    workflowId: 'workflow-2',
    workflowName: 'Price Analyzer',
    scheduleType: 'recurring',
    frequency: 'weekly',
    startTime: formatDateISO(getDateForDay(2)),
    endTime: null,
    status: 'scheduled',
    nextRunTime: formatDateISO(getDateForDay(2)),
    createdAt: formatDateISO(getDateForDay(-60)),
    updatedAt: formatDateISO(getDateForDay(-10)),
    dependencies: [
      {
        id: 'dependency-1',
        dependsOnJobId: 'job-1',
        dependencyType: 'success'
      }
    ],
    notifications: [
      {
        id: 'notification-2',
        type: 'slack',
        channel: '#data-updates',
        events: ['success', 'failure'],
        includeResults: true
      }
    ],
    parameters: { 
      sourceDataset: 'daily-products',
      compareWithPrevious: true
    },
    daysOfWeek: ['monday'],
    hourOfDay: 10,
    minuteOfHour: 0,
    lastRunTime: formatDateISO(getDateForDay(-5)),
    lastRunStatus: 'completed',
    lastRunDuration: 1200,
    averageRunDuration: 1150,
    totalRuns: 8,
    successfulRuns: 8,
    failedRuns: 0
  },
  {
    id: 'job-3',
    name: 'Monthly Competitor Analysis',
    workflowId: 'workflow-3',
    workflowName: 'Competitor Tracker',
    scheduleType: 'recurring',
    frequency: 'monthly',
    startTime: formatDateISO(getDateForDay(15)),
    endTime: null,
    status: 'scheduled',
    nextRunTime: formatDateISO(getDateForDay(15)),
    createdAt: formatDateISO(getDateForDay(-90)),
    updatedAt: formatDateISO(getDateForDay(-30)),
    dependencies: [
      {
        id: 'dependency-2',
        dependsOnJobId: 'job-2',
        dependencyType: 'completion'
      }
    ],
    notifications: [
      {
        id: 'notification-3',
        type: 'email',
        recipients: ['manager@example.com', 'analyst@example.com'],
        events: ['success'],
        includeResults: true
      },
      {
        id: 'notification-4',
        type: 'webhook',
        webhookUrl: 'https://example.com/api/notifications',
        events: ['success', 'failure'],
        includeResults: true
      }
    ],
    parameters: { 
      competitors: ['competitor1.com', 'competitor2.com'],
      analysisDepth: 'comprehensive'
    },
    dayOfMonth: 1,
    hourOfDay: 0,
    minuteOfHour: 0,
    lastRunTime: formatDateISO(getDateForDay(-15)),
    lastRunStatus: 'completed',
    lastRunDuration: 3600,
    averageRunDuration: 3500,
    totalRuns: 3,
    successfulRuns: 3,
    failedRuns: 0
  },
  {
    id: 'job-4',
    name: 'Data Export',
    workflowId: 'workflow-4',
    workflowName: 'Export Pipeline',
    scheduleType: 'one-time',
    frequency: 'once',
    startTime: formatDateISO(getDateForDay(5)),
    endTime: null,
    status: 'scheduled',
    nextRunTime: formatDateISO(getDateForDay(5)),
    createdAt: formatDateISO(getDateForDay(-2)),
    updatedAt: formatDateISO(getDateForDay(-2)),
    dependencies: [],
    notifications: [
      {
        id: 'notification-5',
        type: 'email',
        recipients: ['user@example.com'],
        events: ['success', 'failure'],
        includeResults: true
      }
    ],
    parameters: { 
      format: 'csv',
      includeMetadata: true
    }
  },
  {
    id: 'job-5',
    name: 'Hourly Stock Price Checker',
    workflowId: 'workflow-5',
    workflowName: 'Stock Tracker',
    scheduleType: 'recurring',
    frequency: 'hourly',
    startTime: formatDateISO(getDateForDay(0)),
    endTime: formatDateISO(getDateForDay(30)),
    status: 'scheduled',
    nextRunTime: formatDateISO(new Date(today.getTime() + 60 * 60 * 1000)), // 1 hour from now
    createdAt: formatDateISO(getDateForDay(-5)),
    updatedAt: formatDateISO(getDateForDay(-1)),
    dependencies: [],
    notifications: [
      {
        id: 'notification-6',
        type: 'inApp',
        events: ['failure'],
        includeResults: false
      }
    ],
    parameters: { 
      symbols: ['AAPL', 'MSFT', 'GOOG'],
      thresholdPercent: 5
    },
    minuteOfHour: 0,
    lastRunTime: formatDateISO(new Date(today.getTime() - 60 * 60 * 1000)), // 1 hour ago
    lastRunStatus: 'completed',
    lastRunDuration: 45,
    averageRunDuration: 50,
    totalRuns: 120,
    successfulRuns: 119,
    failedRuns: 1
  }
];

// Convert scheduled jobs to calendar events
export const getCalendarEventsFromJobs = (jobs: ScheduledJob[]) => {
  return jobs.map(job => {
    const start = new Date(job.nextRunTime);
    const end = new Date(start.getTime() + (job.averageRunDuration || 60) * 1000);
    
    let className = '';
    switch (job.status) {
      case 'scheduled':
        className = 'bg-blue-100 border-blue-500 text-blue-800';
        break;
      case 'running':
        className = 'bg-yellow-100 border-yellow-500 text-yellow-800';
        break;
      case 'completed':
        className = 'bg-green-100 border-green-500 text-green-800';
        break;
      case 'failed':
        className = 'bg-red-100 border-red-500 text-red-800';
        break;
      case 'paused':
        className = 'bg-gray-100 border-gray-500 text-gray-800';
        break;
      default:
        className = 'bg-purple-100 border-purple-500 text-purple-800';
    }
    
    return {
      id: `event-${job.id}`,
      title: job.name,
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: false,
      status: job.status,
      jobId: job.id,
      className,
      editable: job.status !== 'running',
      extendedProps: {
        workflowName: job.workflowName,
        frequency: job.frequency,
        dependencies: job.dependencies.length
      }
    };
  });
};
