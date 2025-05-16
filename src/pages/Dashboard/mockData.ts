import type { Job } from './components/JobsTable';
import type { ActivityItem } from './components/ActivityFeed';
import type { MetricDataPoint } from './components/MetricsChart';

// Helper to generate dates for the past n days
const getPastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Generate mock jobs
export const mockJobs: Job[] = [
  {
    id: 'job-001',
    name: 'E-commerce Product Scraper',
    url: 'https://example-store.com/products',
    status: 'completed',
    dataPoints: 1243,
    createdAt: getPastDate(2),
    updatedAt: getPastDate(2),
    duration: '3m 42s',
    type: 'advanced',
    description: 'Weekly product data extraction from main product catalog',
  },
  {
    id: 'job-002',
    name: 'News Headlines Monitor',
    url: 'https://example-news.com/latest',
    status: 'running',
    progress: 67,
    dataPoints: 78,
    createdAt: getPastDate(0),
    updatedAt: getPastDate(0),
    type: 'basic',
    description: 'Hourly monitoring of headline changes',
  },
  {
    id: 'job-003',
    name: 'Competitor Price Tracker',
    url: 'https://competitor-site.com/pricing',
    status: 'failed',
    dataPoints: 0,
    createdAt: getPastDate(1),
    updatedAt: getPastDate(1),
    error: 'Connection timeout after 30 seconds. Site may be blocking scrapers.',
    type: 'full_page',
    description: 'Daily price comparison tracking',
  },
  {
    id: 'job-004',
    name: 'Real Estate Listings',
    url: 'https://property-listings.com/search?location=boston',
    status: 'queued',
    dataPoints: 0,
    createdAt: getPastDate(0),
    updatedAt: getPastDate(0),
    type: 'advanced',
    description: 'Weekly property listings extraction',
  },
  {
    id: 'job-005',
    name: 'Social Media Metrics',
    url: 'https://social-network.com/trending',
    status: 'completed',
    dataPoints: 856,
    createdAt: getPastDate(3),
    updatedAt: getPastDate(3),
    duration: '2m 12s',
    type: 'full_page',
    description: 'Daily trending topics analysis',
  },
  {
    id: 'job-006',
    name: 'Stock Market Data',
    url: 'https://finance-data.com/stocks/tech',
    status: 'completed',
    dataPoints: 543,
    createdAt: getPastDate(4),
    updatedAt: getPastDate(4),
    duration: '1m 37s',
    type: 'basic',
    description: 'End-of-day stock price recording',
  },
];

// Generate mock activities
export const mockActivities: ActivityItem[] = [
  {
    id: 'activity-001',
    type: 'job_created',
    message: 'Created new scraper job "News Headlines Monitor"',
    timestamp: getPastDate(0),
    meta: {
      jobId: 'job-002',
      jobName: 'News Headlines Monitor',
      url: 'https://example-news.com/latest',
    },
  },
  {
    id: 'activity-002',
    type: 'job_completed',
    message: 'Job "E-commerce Product Scraper" completed successfully',
    timestamp: getPastDate(2),
    meta: {
      jobId: 'job-001',
      jobName: 'E-commerce Product Scraper',
      dataPoints: 1243,
      url: 'https://example-store.com/products',
    },
  },
  {
    id: 'activity-003',
    type: 'job_failed',
    message: 'Job "Competitor Price Tracker" failed',
    timestamp: getPastDate(1),
    meta: {
      jobId: 'job-003',
      jobName: 'Competitor Price Tracker',
      url: 'https://competitor-site.com/pricing',
    },
  },
  {
    id: 'activity-004',
    type: 'data_exported',
    message: 'Exported 1243 data points to CSV format',
    timestamp: getPastDate(2),
    meta: {
      jobId: 'job-001',
      jobName: 'E-commerce Product Scraper',
      dataPoints: 1243,
    },
  },
  {
    id: 'activity-005',
    type: 'system',
    message: 'System maintenance scheduled for tonight at 2 AM',
    timestamp: getPastDate(0),
  },
  {
    id: 'activity-006',
    type: 'job_created',
    message: 'Created new scraper job "Real Estate Listings"',
    timestamp: getPastDate(0),
    meta: {
      jobId: 'job-004',
      jobName: 'Real Estate Listings',
      url: 'https://property-listings.com/search?location=boston',
    },
  },
];

// Generate mock metrics data
export const mockMetricsData = {
  jobsCompleted: [
    { date: getPastDate(6), value: 5 },
    { date: getPastDate(5), value: 8 },
    { date: getPastDate(4), value: 12 },
    { date: getPastDate(3), value: 7 },
    { date: getPastDate(2), value: 10 },
    { date: getPastDate(1), value: 14 },
    { date: getPastDate(0), value: 3 },
  ] as MetricDataPoint[],
  
  dataPoints: [
    { date: getPastDate(6), value: 1205 },
    { date: getPastDate(5), value: 1863 },
    { date: getPastDate(4), value: 2541 },
    { date: getPastDate(3), value: 1753 },
    { date: getPastDate(2), value: 2104 },
    { date: getPastDate(1), value: 3211 },
    { date: getPastDate(0), value: 856 },
  ] as MetricDataPoint[],
  
  apiCalls: [
    { date: getPastDate(6), value: 42 },
    { date: getPastDate(5), value: 65 },
    { date: getPastDate(4), value: 87 },
    { date: getPastDate(3), value: 53 },
    { date: getPastDate(2), value: 78 },
    { date: getPastDate(1), value: 104 },
    { date: getPastDate(0), value: 32 },
  ] as MetricDataPoint[],
};

// Mock summary stats
export const mockSummaryStats = {
  activeJobs: 1,
  completedJobsToday: 3,
  queuedJobs: 1,
  totalDataPoints: 12534,
  failedJobsToday: 1,
  dailyAvgJobTime: '2m 43s', 
};
