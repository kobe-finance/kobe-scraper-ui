import React, { useState } from 'react';
import { Button } from '../../components';
import { SummaryCard } from './components/SummaryCard';
import { MetricsChart } from './components/MetricsChart';
import { ActivityFeed } from './components/ActivityFeed';
import { JobsTable } from './components/JobsTable';
import { QuickActions, useDefaultQuickActions } from './components/QuickActions';
import { mockJobs, mockActivities, mockMetricsData, mockSummaryStats } from './mockData';

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobs] = useState(mockJobs);
  const [activities] = useState(mockActivities);
  const quickActions = useDefaultQuickActions();
  
  // Simulating data refresh
  const handleRefreshData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6 pb-8">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleRefreshData}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
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
              Refresh Dashboard
            </>
          )}
        </Button>
      </div>
      
      {/* Summary Cards - First Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SummaryCard
          title="Active Jobs"
          value={mockSummaryStats.activeJobs}
          description="Currently running scrapers"
          color="blue"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M3.33 8L10 12l10-6-10-6L0 6h10v2H3.33zM0 8v8l2-2.22V9.2L0 8zm10 12l-5-3-2-1.2v-6l7 4.2 7-4.2v6L10 20z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Completed Jobs"
          value={mockSummaryStats.completedJobsToday}
          description="Completed in last 24h"
          color="green"
          trend={{ value: 25, isPositive: true }}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Failed Jobs"
          value={mockSummaryStats.failedJobsToday}
          description="Failed in last 24h"
          color="red"
          trend={{ value: 5, isPositive: false }}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Data Points"
          value={mockSummaryStats.totalDataPoints.toLocaleString()}
          description="Total data collected"
          color="purple"
          trend={{ value: 12, isPositive: true }}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
            </svg>
          }
        />
      </div>
      
      {/* Charts and Activity Feed Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-6 sm:grid-cols-2">
            <MetricsChart
              title="Jobs Completed"
              description="Daily job completion rate"
              data={mockMetricsData.jobsCompleted}
              color="green"
              type="bar"
            />
            
            <MetricsChart
              title="Data Points Collected"
              description="Daily data extraction volume"
              data={mockMetricsData.dataPoints}
              color="blue"
              showValues={false}
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
      </div>
      
      {/* Third Row - Jobs and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <JobsTable 
            jobs={jobs} 
            title="Recent Jobs"
            description="Latest scraping jobs"
            limit={5}
            onRefresh={handleRefreshData}
            isLoading={isLoading}
          />
        </div>
        
        <div className="lg:col-span-1">
          <QuickActions actions={quickActions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
