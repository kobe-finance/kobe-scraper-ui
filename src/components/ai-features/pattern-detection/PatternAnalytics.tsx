import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  TagIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { Pattern } from './types';

interface PatternPerformanceData {
  extractionTime: number[];
  successRate: number[];
  matchCount: number[];
  dates: string[];
}

interface PatternUsageData {
  usageCount: number;
  userCount: number;
  projectCount: number;
  lastUsed: string;
  topProjects: { name: string; count: number }[];
}

interface PatternAnalyticsProps {
  pattern: Pattern;
  performanceData: PatternPerformanceData;
  usageData: PatternUsageData;
  onRefreshData: () => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

/**
 * Component for displaying analytics and insights about pattern usage and performance
 * Shows performance metrics, usage statistics, and improvement recommendations
 */
const PatternAnalytics: React.FC<PatternAnalyticsProps> = ({
  pattern,
  performanceData,
  usageData,
  onRefreshData,
  isLoading = false,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'performance' | 'usage' | 'recommendations'>('performance');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshData();
    } catch (error) {
      console.error('Error refreshing analytics data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate average extraction time
  const calculateAverageTime = (): number => {
    if (performanceData.extractionTime.length === 0) return 0;
    const sum = performanceData.extractionTime.reduce((a, b) => a + b, 0);
    return Math.round((sum / performanceData.extractionTime.length) * 100) / 100;
  };

  // Calculate average success rate
  const calculateAverageSuccessRate = (): number => {
    if (performanceData.successRate.length === 0) return 0;
    const sum = performanceData.successRate.reduce((a, b) => a + b, 0);
    return Math.round((sum / performanceData.successRate.length) * 100) / 100;
  };

  // Calculate average match count
  const calculateAverageMatchCount = (): number => {
    if (performanceData.matchCount.length === 0) return 0;
    const sum = performanceData.matchCount.reduce((a, b) => a + b, 0);
    return Math.round((sum / performanceData.matchCount.length) * 100) / 100;
  };

  // Generate recommendations based on pattern performance
  const generateRecommendations = (): { title: string; description: string; importance: 'low' | 'medium' | 'high' }[] => {
    const recommendations = [];
    const averageTime = calculateAverageTime();
    const averageSuccessRate = calculateAverageSuccessRate();

    if (pattern.type === 'regex' && averageTime > 100) {
      recommendations.push({
        title: 'Optimize regex pattern',
        description: 'Your regular expression might be causing backtracking. Consider simplifying or rewriting your pattern to improve performance.',
        importance: 'high',
      });
    }

    if (averageSuccessRate < 0.8) {
      recommendations.push({
        title: 'Improve pattern reliability',
        description: 'Your pattern fails to extract data about 20% of the time. Consider making it more robust by handling edge cases.',
        importance: 'medium',
      });
    }

    if (pattern.type === 'css' && pattern.config?.selector?.includes('*')) {
      recommendations.push({
        title: 'Avoid wildcard selectors',
        description: 'Using * in CSS selectors can be slow. Try to use more specific selectors for better performance.',
        importance: 'medium',
      });
    }

    if (pattern.type === 'xpath' && pattern.config?.expression?.includes('//')) {
      recommendations.push({
        title: 'Optimize XPath expression',
        description: 'Using // in XPath can be slow as it searches the entire document. Try to use more specific paths.',
        importance: 'low',
      });
    }

    // Add a general recommendation if nothing specific
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Pattern is performing well',
        description: 'No specific optimization recommendations at this time. Continue monitoring for changes.',
        importance: 'low',
      });
    }

    return recommendations;
  };

  // Format time to be human-readable
  const formatTime = (timeMs: number): string => {
    if (timeMs < 1) {
      return `${Math.round(timeMs * 1000)} μs`;
    } else if (timeMs < 1000) {
      return `${Math.round(timeMs)} ms`;
    } else {
      return `${(timeMs / 1000).toFixed(2)} s`;
    }
  };

  // Format date for x-axis labels
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Get color class based on importance
  const getImportanceColorClass = (importance: 'low' | 'medium' | 'high'): string => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Pattern Analytics
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Performance metrics and usage statistics for "{pattern.name}"
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <div>
              <label htmlFor="time-range" className="sr-only">Time Range</label>
              <select
                id="time-range"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="block w-full pl-3 pr-10 py-1.5 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center p-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              title="Refresh data"
            >
              <ArrowPathIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <>
            {/* Tab navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('performance')}
                  className={`${
                    activeTab === 'performance'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } py-2 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Performance
                </button>
                <button
                  onClick={() => setActiveTab('usage')}
                  className={`${
                    activeTab === 'usage'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } py-2 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Usage
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`${
                    activeTab === 'recommendations'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  } py-2 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Recommendations
                </button>
              </nav>
            </div>

            {/* Tab content */}
            <div className="mt-6">
              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div>
                  {/* Summary cards */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg border dark:bg-gray-750 dark:border-gray-700">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3 dark:bg-blue-900/30">
                            <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                                Avg. Extraction Time
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900 dark:text-white">
                                  {formatTime(calculateAverageTime())}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border dark:bg-gray-750 dark:border-gray-700">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 rounded-md p-3 dark:bg-green-900/30">
                            <DocumentCheckIcon className="h-5 w-5 text-green-600 dark:text-green-300" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                                Success Rate
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900 dark:text-white">
                                  {(calculateAverageSuccessRate() * 100).toFixed(1)}%
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border dark:bg-gray-750 dark:border-gray-700">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-purple-100 rounded-md p-3 dark:bg-purple-900/30">
                            <TagIcon className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                                Avg. Matches
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900 dark:text-white">
                                  {calculateAverageMatchCount().toFixed(1)}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Charts */}
                  <div className="space-y-6">
                    {/* Extraction Time Chart */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">
                        Extraction Time (ms)
                      </h4>
                      <div className="h-48 bg-white rounded-lg border shadow-sm p-4 dark:bg-gray-750 dark:border-gray-700">
                        {performanceData.extractionTime.length > 0 ? (
                          <div className="h-full w-full">
                            <div className="relative h-full w-full">
                              {/* Chart would go here - simplified version with CSS */}
                              <div className="absolute inset-0 flex items-end justify-between px-2">
                                {performanceData.extractionTime.map((time, index) => {
                                  const maxTime = Math.max(...performanceData.extractionTime);
                                  const height = maxTime > 0 ? (time / maxTime) * 100 : 0;
                                  return (
                                    <div key={index} className="flex flex-col items-center">
                                      <div
                                        style={{ height: `${height}%` }}
                                        className="w-4 bg-blue-500 rounded-t dark:bg-blue-600"
                                      ></div>
                                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(performanceData.dates[index])}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No performance data available for the selected time period.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Success Rate Chart */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">
                        Success Rate (%)
                      </h4>
                      <div className="h-48 bg-white rounded-lg border shadow-sm p-4 dark:bg-gray-750 dark:border-gray-700">
                        {performanceData.successRate.length > 0 ? (
                          <div className="h-full w-full">
                            <div className="relative h-full w-full">
                              {/* Chart would go here - simplified version with CSS */}
                              <div className="absolute inset-0 flex items-end justify-between px-2">
                                {performanceData.successRate.map((rate, index) => {
                                  const height = rate * 100;
                                  return (
                                    <div key={index} className="flex flex-col items-center">
                                      <div
                                        style={{ height: `${height}%` }}
                                        className="w-4 bg-green-500 rounded-t dark:bg-green-600"
                                      ></div>
                                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(performanceData.dates[index])}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No performance data available for the selected time period.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Usage Tab */}
              {activeTab === 'usage' && (
                <div>
                  {/* Usage Summary */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg border dark:bg-gray-750 dark:border-gray-700">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3 dark:bg-indigo-900/30">
                            <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                                Total Uses
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900 dark:text-white">
                                  {usageData.usageCount.toLocaleString()}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border dark:bg-gray-750 dark:border-gray-700">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-pink-100 rounded-md p-3 dark:bg-pink-900/30">
                            <UserGroupIcon className="h-5 w-5 text-pink-600 dark:text-pink-300" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                                Unique Users
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900 dark:text-white">
                                  {usageData.userCount.toLocaleString()}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border dark:bg-gray-750 dark:border-gray-700">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-amber-100 rounded-md p-3 dark:bg-amber-900/30">
                            <BoltIcon className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                                Projects Using
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900 dark:text-white">
                                  {usageData.projectCount}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Projects */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">
                      Top Projects Using This Pattern
                    </h4>
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden dark:bg-gray-750 dark:border-gray-700">
                      {usageData.topProjects.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                          {usageData.topProjects.map((project, index) => (
                            <li key={index} className="px-4 py-3 flex justify-between items-center">
                              <span className="text-sm text-gray-900 dark:text-white">{project.name}</span>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {project.count} uses
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          No project usage data available.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Last Used */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">
                      Pattern Usage Timeline
                    </h4>
                    <div className="bg-white rounded-lg border shadow-sm p-4 dark:bg-gray-750 dark:border-gray-700">
                      <div className="flex items-center text-sm">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1.5 dark:text-gray-500" />
                        <span className="text-gray-500 dark:text-gray-400">Last used:</span>
                        <span className="ml-1.5 font-medium text-gray-900 dark:text-white">
                          {new Date(usageData.lastUsed).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">
                    Pattern Optimization Recommendations
                  </h4>
                  
                  <div className="space-y-4">
                    {generateRecommendations().map((recommendation, index) => (
                      <div key={index} className="bg-white rounded-lg border shadow-sm overflow-hidden dark:bg-gray-750 dark:border-gray-700">
                        <div className="px-4 py-4">
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 rounded-md p-2 ${getImportanceColorClass(recommendation.importance)}`}>
                              {recommendation.importance === 'high' ? (
                                <ExclamationTriangleIcon className="h-5 w-5" />
                              ) : recommendation.importance === 'medium' ? (
                                <BoltIcon className="h-5 w-5" />
                              ) : (
                                <CheckIcon className="h-5 w-5" />
                              )}
                            </div>
                            <div className="ml-3">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                {recommendation.title}
                              </h5>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {recommendation.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PatternAnalytics;
