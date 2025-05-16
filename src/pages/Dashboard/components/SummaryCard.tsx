import React from 'react';
import { Card, CardHeader, CardContent } from '../../../components';

export interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'green' | 'blue' | 'red' | 'purple' | 'yellow';
  onClick?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  color = 'primary',
  onClick,
}) => {
  // Map color to appropriate Tailwind classes
  const colorClasses = {
    primary: {
      bg: 'bg-primary-100 dark:bg-primary-900/20',
      text: 'text-primary-600 dark:text-primary-400',
      iconBg: 'bg-primary-500/10',
      iconColor: 'text-primary-500',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-500',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500',
    },
  };

  const classes = colorClasses[color];

  return (
    <Card 
      className={`${onClick ? 'cursor-pointer transition-all hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
            <div className="mt-2 flex items-baseline">
              <p className={`text-2xl font-semibold ${classes.text}`}>{value}</p>
              
              {trend && (
                <span className={`ml-2 text-sm font-medium ${
                  trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <span className="inline-flex items-center">
                    {trend.isPositive ? (
                      <svg className="h-3 w-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                      </svg>
                    ) : (
                      <svg className="h-3 w-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                      </svg>
                    )}
                    {trend.value}%
                  </span>
                </span>
              )}
            </div>
            {description && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
          
          {icon && (
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${classes.iconBg}`}>
              <div className={classes.iconColor}>{icon}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
