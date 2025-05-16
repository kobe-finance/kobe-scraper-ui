import React, { useState, useMemo } from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  showLegend?: boolean;
  animate?: boolean;
  className?: string;
}

// Color palette for charts
const DEFAULT_COLORS = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#14b8a6', // teal-500
  '#6366f1', // indigo-500
];

export const PieChart: React.FC<ChartProps> = ({
  data,
  title,
  height = 300,
  showLegend = true,
  animate = true,
  className = '',
}) => {
  // Assign colors if not provided
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    }));
  }, [data]);

  // Calculate total
  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // Calculate segments
  const segments = useMemo(() => {
    let startAngle = 0;
    return chartData.map((item) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const degrees = percentage * 3.6; // Convert percentage to degrees (360° / 100)
      const segment = {
        label: item.label,
        value: item.value,
        percentage,
        color: item.color,
        startAngle,
        endAngle: startAngle + degrees,
      };
      startAngle += degrees;
      return segment;
    });
  }, [chartData, total]);

  // SVG path for pie segments
  const createPieSegment = (
    startAngle: number,
    endAngle: number,
    radius: number
  ) => {
    // Convert angles to radians
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    // Calculate points
    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    // Determine if it's a large arc (> 180 degrees)
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    // Create path
    return `M ${radius},${radius} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
          {title}
        </h3>
      )}

      <div className="flex flex-col md:flex-row items-center justify-center">
        {/* Pie Chart SVG */}
        <div className="relative" style={{ height: `${height}px`, width: `${height}px` }}>
          <svg
            width={height}
            height={height}
            viewBox={`0 0 ${height} ${height}`}
            className="transform -rotate-90"
          >
            {segments.map((segment, index) => (
              <path
                key={`segment-${index}`}
                d={createPieSegment(
                  segment.startAngle,
                  segment.endAngle,
                  height / 2 - 10
                )}
                fill={segment.color}
                stroke="#fff"
                strokeWidth="1"
                className={`transition-all duration-500 ${
                  animate ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transitionDelay: animate ? `${index * 100}ms` : '0ms',
                }}
              />
            ))}
          </svg>

          {/* Center circle with total */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 transform rotate-90"
            style={{ 
              height: `${height}px`, 
              width: `${height}px`, 
              top: 0, 
              left: 0 
            }}
          >
            <div className="text-3xl font-bold">{total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
            <div className="flex flex-col space-y-2">
              {segments.map((segment, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-sm mr-2"
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <div className="flex-grow">
                    <span className="text-sm font-medium">
                      {segment.label}
                    </span>
                  </div>
                  <div className="ml-2 flex items-center">
                    <span className="text-sm text-gray-700 font-semibold">
                      {segment.value}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({segment.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const BarChart: React.FC<ChartProps> = ({
  data,
  title,
  height = 300,
  showLegend = true,
  animate = true,
  className = '',
}) => {
  // Assign colors if not provided
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    }));
  }, [data]);

  // Calculate maximum value for scaling
  const maxValue = useMemo(() => {
    return Math.max(...chartData.map((item) => item.value), 0);
  }, [chartData]);

  // Chart dimensions
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = 800;
  const chartHeight = height - padding.top - padding.bottom;
  const barWidth = Math.min(40, (chartWidth - padding.left - padding.right) / chartData.length - 10);

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
          {title}
        </h3>
      )}

      <div className="overflow-x-auto">
        <svg
          width={Math.max(chartWidth, chartData.length * 60)}
          height={height}
          className="mx-auto"
        >
          {/* Y-axis labels and grid lines */}
          {Array.from({ length: 5 }).map((_, index) => {
            const value = maxValue * (1 - index / 4);
            const yPosition = padding.top + (index / 4) * chartHeight;
            return (
              <g key={`grid-${index}`}>
                <text
                  x={padding.left - 10}
                  y={yPosition}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-xs text-gray-500"
                >
                  {Math.round(value)}
                </text>
                <line
                  x1={padding.left}
                  y1={yPosition}
                  x2={chartWidth - padding.right}
                  y2={yPosition}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray={index === 4 ? '' : '4,4'}
                />
              </g>
            );
          })}

          {/* X-axis */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={chartWidth - padding.right}
            y2={height - padding.bottom}
            stroke="#9ca3af"
            strokeWidth="1"
          />

          {/* Bars and labels */}
          {chartData.map((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const barX = padding.left + index * ((chartWidth - padding.left - padding.right) / chartData.length) + (((chartWidth - padding.left - padding.right) / chartData.length) - barWidth) / 2;
            const barY = height - padding.bottom - barHeight;

            return (
              <g key={`bar-${index}`}>
                {/* Bar */}
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={animate ? barHeight : 0}
                  fill={item.color}
                  rx="2"
                  className="transition-all duration-500"
                  style={{
                    transitionProperty: 'height, y',
                    transitionDelay: animate ? `${index * 100}ms` : '0ms',
                  }}
                />

                {/* Value label above bar */}
                <text
                  x={barX + barWidth / 2}
                  y={barY - 5}
                  textAnchor="middle"
                  className="text-xs font-semibold"
                  style={{
                    opacity: animate ? 1 : 0,
                    transition: 'opacity 0.5s',
                    transitionDelay: animate ? `${(index * 100) + 300}ms` : '0ms',
                  }}
                >
                  {item.value}
                </text>

                {/* X-axis label */}
                <text
                  x={barX + barWidth / 2}
                  y={height - padding.bottom + 15}
                  textAnchor="middle"
                  className="text-xs text-gray-500"
                >
                  {item.label.length > 12
                    ? `${item.label.substring(0, 10)}...`
                    : item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {chartData.map((item, index) => (
            <div key={`legend-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 rounded-sm mr-1"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const LineChart: React.FC<ChartProps & { 
  xAxisLabel?: string; 
  yAxisLabel?: string;
  timeSeries?: boolean;
}> = ({
  data,
  title,
  height = 300,
  showLegend = true,
  animate = true,
  className = '',
  xAxisLabel,
  yAxisLabel,
  timeSeries = false,
}) => {
  // Assign colors if not provided
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    }));
  }, [data]);

  // Calculate maximum value for scaling
  const maxValue = useMemo(() => {
    return Math.max(...chartData.map((item) => item.value), 0) * 1.1; // Add 10% padding
  }, [chartData]);

  // Chart dimensions
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = 800;
  const chartHeight = height - padding.top - padding.bottom;

  // Generate points for the line
  const points = useMemo(() => {
    return chartData.map((item, index) => {
      const x = padding.left + index * ((chartWidth - padding.left - padding.right) / (chartData.length - 1 || 1));
      const y = height - padding.bottom - (item.value / maxValue) * chartHeight;
      return { x, y, ...item };
    });
  }, [chartData, chartWidth, chartHeight, height, maxValue, padding]);

  // Create SVG path from points
  const linePath = useMemo(() => {
    if (points.length < 2) return '';
    
    return points.reduce(
      (path, point, i) => 
        `${path}${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`,
      ''
    );
  }, [points]);

  // Create area under the line
  const areaPath = useMemo(() => {
    if (points.length < 2) return '';
    
    const baseY = height - padding.bottom;
    
    const path = points.reduce(
      (path, point, i) => 
        `${path}${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`,
      ''
    );
    
    return `${path} L ${points[points.length-1].x},${baseY} L ${points[0].x},${baseY} Z`;
  }, [points, height, padding.bottom]);

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
          {title}
        </h3>
      )}

      <div className="overflow-x-auto">
        <svg
          width={Math.max(chartWidth, points.length * 60)}
          height={height}
          className="mx-auto"
        >
          {/* Y-axis labels and grid lines */}
          {Array.from({ length: 5 }).map((_, index) => {
            const value = maxValue * (1 - index / 4);
            const yPosition = padding.top + (index / 4) * chartHeight;
            return (
              <g key={`grid-${index}`}>
                <text
                  x={padding.left - 10}
                  y={yPosition}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-xs text-gray-500"
                >
                  {Math.round(value)}
                </text>
                <line
                  x1={padding.left}
                  y1={yPosition}
                  x2={chartWidth - padding.right}
                  y2={yPosition}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray={index === 4 ? '' : '4,4'}
                />
              </g>
            );
          })}

          {/* X-axis */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={chartWidth - padding.right}
            y2={height - padding.bottom}
            stroke="#9ca3af"
            strokeWidth="1"
          />

          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={`x-label-${index}`}
              x={point.x}
              y={height - padding.bottom + 15}
              textAnchor="middle"
              className="text-xs text-gray-500"
            >
              {point.label.length > 8
                ? `${point.label.substring(0, 6)}...`
                : point.label}
            </text>
          ))}

          {/* Area under the line */}
          <path
            d={areaPath}
            fill={`${points[0]?.color || '#3b82f6'}33`} // Adding 33 for 20% opacity
            className={`transition-opacity duration-700 ${
              animate ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={points[0]?.color || '#3b82f6'}
            strokeWidth="2"
            className={`transition-all duration-1000 ${
              animate ? 'opacity-100' : 'opacity-0'
            }`}
            strokeDasharray={animate ? '1000' : '0'}
            strokeDashoffset={animate ? '0' : '1000'}
            style={{
              transition: 'stroke-dashoffset 1.5s ease-in-out, opacity 0.5s',
            }}
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g
              key={`point-${index}`}
              className={`transition-opacity duration-700 ${
                animate ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transitionDelay: animate ? `${(index * 100) + 500}ms` : '0ms',
              }}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke={point.color}
                strokeWidth="2"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="2"
                fill={point.color}
              />
              
              {/* Tooltip on hover - would need JS interactivity for a real implementation */}
              <title>{`${point.label}: ${point.value}`}</title>
            </g>
          ))}

          {/* Axis labels */}
          {yAxisLabel && (
            <text
              x={-height / 2}
              y="15"
              textAnchor="middle"
              className="text-xs font-medium text-gray-500"
              transform="rotate(-90)"
            >
              {yAxisLabel}
            </text>
          )}
          
          {xAxisLabel && (
            <text
              x={chartWidth / 2}
              y={height - 5}
              textAnchor="middle"
              className="text-xs font-medium text-gray-500"
            >
              {xAxisLabel}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

// Composite component for statistics charts
interface StatisticsChartsProps {
  data: Record<string, any>[];
  className?: string;
}

export const StatisticsCharts: React.FC<StatisticsChartsProps> = ({
  data,
  className = '',
}) => {
  const [activeChart, setActiveChart] = useState<'pie' | 'bar' | 'line'>('bar');

  // Generate chart data from the data array
  const generateChartData = () => {
    if (!data || data.length === 0) return [];

    // For simplicity, count occurrences of the first property with string values
    const property = Object.keys(data[0]).find(
      key => typeof data[0][key] === 'string'
    );

    if (!property) return [];

    const counts: Record<string, number> = {};
    data.forEach(item => {
      const value = String(item[property]);
      counts[value] = (counts[value] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Limit to top 10 for readability
  };

  const chartData = useMemo(() => generateChartData(), [data]);

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="border-b px-4 py-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Results Statistics</h3>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeChart === 'bar'
                  ? 'bg-white shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveChart('bar')}
            >
              Bar
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeChart === 'pie'
                  ? 'bg-white shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveChart('pie')}
            >
              Pie
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeChart === 'line'
                  ? 'bg-white shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveChart('line')}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No data available for charting
          </div>
        ) : (
          <>
            {activeChart === 'bar' && (
              <BarChart
                data={chartData}
                height={300}
                animate={true}
              />
            )}
            {activeChart === 'pie' && (
              <PieChart
                data={chartData}
                height={300}
                animate={true}
              />
            )}
            {activeChart === 'line' && (
              <LineChart
                data={chartData}
                height={300}
                animate={true}
                xAxisLabel="Categories"
                yAxisLabel="Count"
              />
            )}
            <div className="text-center text-xs text-gray-500 mt-2">
              Showing distribution of {chartData[0]?.label.split(':')[0]}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatisticsCharts;
