import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'indigo' | 'purple' | 'red' | 'yellow';
  animated?: boolean;
  className?: string;
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  indigo: 'bg-indigo-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500'
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showPercentage = false,
  color = 'green',
  animated = true,
  className = ''
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Get color class from the mapping or default to blue
  const colorClass = colorClasses[color] || colorClasses.blue;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(normalizedProgress)}%
          </span>
        )}
      </div>
      <div
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={`${colorClass} rounded-full ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{ 
            width: `${normalizedProgress}%`,
            height: '100%'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
