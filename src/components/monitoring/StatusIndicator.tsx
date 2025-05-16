import React from 'react';
import { JobStatus } from '../../context/MonitoringContext';

interface StatusIndicatorProps {
  status: JobStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const statusConfig = {
  idle: {
    color: 'bg-gray-400',
    pulseEffect: false,
    label: 'Idle',
    icon: '⏸️'
  },
  queued: {
    color: 'bg-blue-400',
    pulseEffect: true,
    label: 'Queued',
    icon: '⏳'
  },
  running: {
    color: 'bg-green-500',
    pulseEffect: true,
    label: 'Running',
    icon: '▶️'
  },
  completed: {
    color: 'bg-green-600',
    pulseEffect: false,
    label: 'Completed',
    icon: '✅'
  },
  failed: {
    color: 'bg-red-500',
    pulseEffect: false,
    label: 'Failed',
    icon: '❌'
  },
  cancelled: {
    color: 'bg-yellow-500',
    pulseEffect: false,
    label: 'Cancelled',
    icon: '⚠️'
  }
};

const sizeConfig = {
  sm: {
    dot: 'h-2 w-2',
    text: 'text-xs',
    container: 'gap-1'
  },
  md: {
    dot: 'h-3 w-3',
    text: 'text-sm',
    container: 'gap-1.5'
  },
  lg: {
    dot: 'h-4 w-4',
    text: 'text-base',
    container: 'gap-2'
  }
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  size = 'md', 
  showLabel = true,
  className = '' 
}) => {
  const config = statusConfig[status] || statusConfig.idle;
  const sizeClass = sizeConfig[size] || sizeConfig.md;
  
  return (
    <div className={`flex items-center ${sizeClass.container} ${className}`}>
      <div className={`${sizeClass.dot} rounded-full ${config.color} ${config.pulseEffect ? 'animate-pulse' : ''}`}></div>
      {showLabel && (
        <span className={`font-medium ${sizeClass.text}`}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
