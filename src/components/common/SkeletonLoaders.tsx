import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animated?: boolean;
  children?: React.ReactNode;
}

/**
 * Base skeleton loader component
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height = 'auto',
  width = '100%',
  rounded = 'md',
  animated = true,
  children
}) => {
  const roundedClass = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'full': 'rounded-full',
  }[rounded];

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 ${animated ? 'animate-pulse' : ''} ${roundedClass} ${className}`}
      style={{ height, width }}
      aria-hidden="true"
      role="status"
      aria-label="Loading"
    >
      {children}
    </div>
  );
};

/**
 * Card skeleton for card-like components
 */
export const CardSkeleton: React.FC<SkeletonProps> = (props) => (
  <Skeleton
    height={props.height || '300px'}
    className={`p-4 ${props.className || ''}`}
    {...props}
  >
    <div className="flex flex-col space-y-3">
      <Skeleton height="1.5rem" width="70%" rounded="sm" />
      <Skeleton height="1rem" width="90%" rounded="sm" />
      <Skeleton height="1rem" width="80%" rounded="sm" />
      <Skeleton height="3rem" rounded="sm" />
      <div className="flex justify-between pt-2">
        <Skeleton height="2rem" width="30%" rounded="sm" />
        <Skeleton height="2rem" width="20%" rounded="sm" />
      </div>
    </div>
  </Skeleton>
);

/**
 * Skeleton for job list items in scheduler
 */
export const JobListItemSkeleton: React.FC = () => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-2">
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <Skeleton height="1.5rem" width="60%" rounded="sm" />
        <Skeleton height="1.25rem" width="20%" rounded="full" />
      </div>
      <div className="flex justify-between pt-2">
        <Skeleton height="1rem" width="40%" rounded="sm" />
        <Skeleton height="1rem" width="30%" rounded="sm" />
      </div>
    </div>
  </div>
);

/**
 * Skeleton for workflow builder nodes
 */
export const NodeSkeleton: React.FC = () => (
  <Skeleton 
    height="120px"
    width="180px"
    rounded="md"
    className="mb-3"
  >
    <div className="p-3">
      <div className="flex items-center mb-2">
        <Skeleton height="24px" width="24px" rounded="full" className="mr-2" />
        <Skeleton height="1rem" width="70%" rounded="sm" />
      </div>
      <Skeleton height="0.75rem" width="90%" rounded="sm" className="mb-1" />
      <Skeleton height="0.75rem" width="80%" rounded="sm" className="mb-1" />
      <Skeleton height="0.75rem" width="60%" rounded="sm" />
    </div>
  </Skeleton>
);

/**
 * Skeleton for calendar view
 */
export const CalendarSkeleton: React.FC = () => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <Skeleton height="1.5rem" width="30%" rounded="sm" />
        <div className="flex space-x-2">
          <Skeleton height="2rem" width="2rem" rounded="sm" />
          <Skeleton height="2rem" width="2rem" rounded="sm" />
          <Skeleton height="2rem" width="2rem" rounded="sm" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={`cal-header-${i}`} height="3rem" animated={false} className="bg-gray-100 dark:bg-gray-800 p-2 text-center" />
      ))}
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={`cal-cell-${i}`} className="bg-white dark:bg-gray-800 min-h-[6rem] p-1">
          <div className="flex justify-between">
            <small className="text-gray-500">{(i % 31) + 1}</small>
            {i % 7 === 3 && <Skeleton height="1.25rem" width="70%" rounded="sm" className="mt-2" />}
            {i % 5 === 2 && <Skeleton height="1.25rem" width="80%" rounded="sm" className="mt-5" />}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Skeleton for mobile workflow form
 */
export const FormSkeleton: React.FC = () => (
  <div className="space-y-6 p-4">
    <div>
      <Skeleton height="1.5rem" width="30%" rounded="sm" className="mb-2" />
      <Skeleton height="3rem" rounded="md" />
    </div>
    <div>
      <Skeleton height="1.5rem" width="40%" rounded="sm" className="mb-2" />
      <Skeleton height="3rem" rounded="md" />
    </div>
    <div>
      <Skeleton height="1.5rem" width="35%" rounded="sm" className="mb-2" />
      <div className="flex space-x-2">
        <Skeleton height="2rem" width="2rem" rounded="full" />
        <Skeleton height="1.25rem" width="25%" rounded="sm" />
      </div>
      <div className="flex space-x-2 mt-2">
        <Skeleton height="2rem" width="2rem" rounded="full" />
        <Skeleton height="1.25rem" width="30%" rounded="sm" />
      </div>
    </div>
    <div className="flex justify-between pt-4">
      <Skeleton height="3rem" width="45%" rounded="md" />
      <Skeleton height="3rem" width="45%" rounded="md" />
    </div>
  </div>
);

/**
 * Grid of skeleton cards for loading dashboard
 */
export const SkeletonCardGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={`card-skeleton-${i}`} />
    ))}
  </div>
);

/**
 * Job list skeleton for scheduler
 */
export const JobListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <JobListItemSkeleton key={`job-skeleton-${i}`} />
    ))}
  </div>
);

/**
 * Workflow builder node list skeleton
 */
export const NodeListSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="flex flex-wrap gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <NodeSkeleton key={`node-skeleton-${i}`} />
    ))}
  </div>
);
