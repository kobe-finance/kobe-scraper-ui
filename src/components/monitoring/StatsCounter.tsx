import React from 'react';
import { JobStats } from '../../context/MonitoringContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

// Individual stat card component
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  className = ''
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold">{value}</p>
        {trend && trendValue && (
          <p className={`text-xs mt-1 ${getTrendColor()}`}>
            {getTrendIcon()} {trendValue}
          </p>
        )}
      </div>
    </div>
  );
};

interface StatsCounterProps {
  stats: JobStats;
  previousStats?: JobStats;
  className?: string;
}

// Format bytes to human-readable format
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Main stats counter component
const StatsCounter: React.FC<StatsCounterProps> = ({
  stats,
  previousStats,
  className = ''
}) => {
  // Calculate trends
  const calculateTrend = (current: number, previous: number | undefined): [string, 'up' | 'down' | 'neutral'] => {
    if (!previous) return ['', 'neutral'];
    
    const difference = current - previous;
    const percentChange = (difference / previous) * 100;
    
    if (percentChange > 0) {
      return [`+${percentChange.toFixed(1)}%`, 'up'];
    } else if (percentChange < 0) {
      return [`${percentChange.toFixed(1)}%`, 'down'];
    } else {
      return ['No change', 'neutral'];
    }
  };

  const [pagesScrapedTrendValue, pagesScrapedTrend] = calculateTrend(
    stats.pagesScraped, 
    previousStats?.pagesScraped
  );

  const [itemsExtractedTrendValue, itemsExtractedTrend] = calculateTrend(
    stats.itemsExtracted, 
    previousStats?.itemsExtracted
  );

  const [rpmTrendValue, rpmTrend] = calculateTrend(
    stats.requestsPerMinute, 
    previousStats?.requestsPerMinute
  );

  const [errorsTrendValue, errorsTrend] = calculateTrend(
    stats.errorsEncountered, 
    previousStats?.errorsEncountered
  );

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <StatCard
        title="Pages Scraped"
        value={stats.pagesScraped}
        icon={<span>📄</span>}
        trend={pagesScrapedTrend}
        trendValue={pagesScrapedTrendValue}
      />
      
      <StatCard
        title="Items Extracted"
        value={stats.itemsExtracted}
        icon={<span>📦</span>}
        trend={itemsExtractedTrend}
        trendValue={itemsExtractedTrendValue}
      />
      
      <StatCard
        title="Requests / Min"
        value={stats.requestsPerMinute.toFixed(1)}
        icon={<span>⚡</span>}
        trend={rpmTrend}
        trendValue={rpmTrendValue}
      />
      
      <StatCard
        title="Errors"
        value={stats.errorsEncountered}
        icon={<span>❌</span>}
        trend={errorsTrend}
        trendValue={errorsTrendValue}
      />
      
      <StatCard
        title="Avg Response Time"
        value={`${stats.avgResponseTime.toFixed(0)} ms`}
        icon={<span>⏱️</span>}
      />
      
      <StatCard
        title="Pages Remaining"
        value={stats.pagesRemaining}
        icon={<span>🔄</span>}
      />
      
      <StatCard
        title="Data Size"
        value={formatBytes(stats.dataSize)}
        icon={<span>💾</span>}
      />
      
      <StatCard
        title="Success Rate"
        value={stats.pagesScraped > 0 
          ? `${((stats.pagesScraped - stats.errorsEncountered) / stats.pagesScraped * 100).toFixed(1)}%` 
          : 'N/A'
        }
        icon={<span>✅</span>}
      />
    </div>
  );
};

export default StatsCounter;
