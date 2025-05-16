import React from 'react';
import { Card, CardHeader, CardContent } from '../../../components';

export interface MetricDataPoint {
  date: string;
  value: number;
}

export interface MetricsChartProps {
  title: string;
  description?: string;
  data: MetricDataPoint[];
  color?: 'primary' | 'blue' | 'green' | 'red' | 'purple';
  type?: 'line' | 'bar';
  showValues?: boolean;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  title,
  description,
  data,
  color = 'primary',
  type = 'line',
  showValues = true,
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  
  // Find min and max values
  const values = data.map(d => d.value);
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const range = max - min;
  
  // Calculate chart dimensions
  const chartHeight = 160;
  const bottomPadding = 24; // For dates
  const chartContentHeight = chartHeight - bottomPadding;
  
  // Get color styles
  const getColorStyle = () => {
    switch (color) {
      case 'primary':
        return {
          fillClass: 'fill-primary-500/20',
          strokeClass: 'stroke-primary-500',
          textClass: 'text-primary-500',
        };
      case 'blue':
        return {
          fillClass: 'fill-blue-500/20',
          strokeClass: 'stroke-blue-500',
          textClass: 'text-blue-500',
        };
      case 'green':
        return {
          fillClass: 'fill-green-500/20',
          strokeClass: 'stroke-green-500',
          textClass: 'text-green-500',
        };
      case 'red':
        return {
          fillClass: 'fill-red-500/20',
          strokeClass: 'stroke-red-500',
          textClass: 'text-red-500',
        };
      case 'purple':
        return {
          fillClass: 'fill-purple-500/20',
          strokeClass: 'stroke-purple-500',
          textClass: 'text-purple-500',
        };
      default:
        return {
          fillClass: 'fill-primary-500/20',
          strokeClass: 'stroke-primary-500',
          textClass: 'text-primary-500',
        };
    }
  };
  
  const { fillClass, strokeClass, textClass } = getColorStyle();
  
  // Calculate the Y position for a given value
  const getYPosition = (value: number): number => {
    if (range === 0) return chartContentHeight / 2;
    return chartContentHeight - ((value - min) / range) * chartContentHeight;
  };
  
  // Format date labels
  const formatDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(' ', '\n');
  };
  
  // Render line chart
  const renderLineChart = () => {
    if (data.length === 0) return null;
    
    const width = 100 / (data.length - 1);
    
    // Generate points for polyline
    let points = data.map((point, i) => {
      const x = i * width;
      const y = getYPosition(point.value);
      return `${x},${y}`;
    }).join(' ');
    
    // Generate points for area (with baseline)
    const baseline = getYPosition(0);
    const areaPoints = `0,${baseline} ${points} ${width * (data.length - 1)},${baseline}`;
    
    return (
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 100 ${chartHeight}`}>
        {/* Area fill */}
        <polygon className={fillClass} points={areaPoints} />
        
        {/* Line */}
        <polyline
          className={`${strokeClass} fill-none stroke-2`}
          points={points}
        />
        
        {/* Data points */}
        {data.map((point, i) => (
          <circle
            key={i}
            cx={i * width}
            cy={getYPosition(point.value)}
            r="1.5"
            className={`${strokeClass} fill-white`}
          />
        ))}
        
        {/* Value labels */}
        {showValues && data.map((point, i) => (
          <text
            key={i}
            x={i * width}
            y={getYPosition(point.value) - 6}
            className={`${textClass} text-xs font-medium text-center`}
            textAnchor="middle"
          >
            {point.value}
          </text>
        ))}
        
        {/* Date labels */}
        {data.map((point, i) => {
          // Only show first, last, and some date labels to avoid overcrowding
          if (data.length <= 5 || i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 5) === 0) {
            return (
              <text
                key={`date-${i}`}
                x={i * width}
                y={chartHeight - 6}
                className="text-xs text-gray-500 dark:text-gray-400 fill-current"
                textAnchor="middle"
              >
                {formatDateLabel(point.date).split('\n')[0]}
              </text>
            );
          }
          return null;
        })}
      </svg>
    );
  };
  
  // Render bar chart
  const renderBarChart = () => {
    if (data.length === 0) return null;
    
    const barWidth = 100 / data.length;
    const barPadding = barWidth * 0.2;
    const actualBarWidth = barWidth - barPadding * 2;
    
    return (
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 100 ${chartHeight}`}>
        {/* Bars */}
        {data.map((point, i) => {
          const barHeight = Math.abs(getYPosition(point.value) - getYPosition(0));
          const y = point.value >= 0 ? getYPosition(point.value) : getYPosition(0);
          
          return (
            <rect
              key={i}
              x={i * barWidth + barPadding}
              y={y}
              width={actualBarWidth}
              height={barHeight || 1} // Ensure at least 1px height
              rx="1"
              className={fillClass}
            />
          );
        })}
        
        {/* Value labels */}
        {showValues && data.map((point, i) => (
          <text
            key={`value-${i}`}
            x={i * barWidth + barWidth / 2}
            y={getYPosition(point.value) - (point.value >= 0 ? 6 : -12)}
            className={`${textClass} text-xs font-medium text-center`}
            textAnchor="middle"
          >
            {point.value}
          </text>
        ))}
        
        {/* Date labels */}
        {data.map((point, i) => (
          <text
            key={`date-${i}`}
            x={i * barWidth + barWidth / 2}
            y={chartHeight - 6}
            className="text-xs text-gray-500 dark:text-gray-400 fill-current"
            textAnchor="middle"
          >
            {formatDateLabel(point.date).split('\n')[0]}
          </text>
        ))}
      </svg>
    );
  };
  
  return (
    <Card className="h-full">
      <CardHeader title={title} description={description} />
      <CardContent>
        <div ref={chartRef} className="w-full h-40 pt-2">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              No data available
            </div>
          ) : type === 'line' ? (
            renderLineChart()
          ) : (
            renderBarChart()
          )}
        </div>
      </CardContent>
    </Card>
  );
};
