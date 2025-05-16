import React, { useState, useMemo, useEffect } from 'react';
import { AdjustmentsHorizontalIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export interface HeatmapData {
  x: string;
  y: string;
  value: number;
  metadata?: Record<string, any>;
}

interface ContentHeatmapProps {
  data: HeatmapData[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
  colorScale?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'grey';
  showLegend?: boolean;
  showLabels?: boolean;
  onCellClick?: (cell: HeatmapData) => void;
  className?: string;
  maxCellWidth?: number;
  maxCellHeight?: number;
}

const ContentHeatmap: React.FC<ContentHeatmapProps> = ({
  data,
  title = 'Content Distribution',
  xLabel = 'X Axis',
  yLabel = 'Y Axis',
  colorScale = 'blue',
  showLegend = true,
  showLabels = true,
  onCellClick,
  className = '',
  maxCellWidth = 60,
  maxCellHeight = 40,
}) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapData | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [normalizeValues, setNormalizeValues] = useState(true);
  const [logarithmicScale, setLogarithmicScale] = useState(false);
  const [showValues, setShowValues] = useState(true);
  const [invertYAxis, setInvertYAxis] = useState(false);
  
  // Generate arrays of unique x and y values
  const { xValues, yValues, maxValue, minValue } = useMemo(() => {
    if (!data || data.length === 0) {
      return { xValues: [], yValues: [], maxValue: 0, minValue: 0 };
    }
    
    const xSet = new Set<string>();
    const ySet = new Set<string>();
    let max = -Infinity;
    let min = Infinity;
    
    data.forEach(item => {
      xSet.add(item.x);
      ySet.add(item.y);
      max = Math.max(max, item.value);
      min = Math.min(min, item.value);
    });
    
    // Convert sets to sorted arrays
    const xArr = Array.from(xSet).sort();
    const yArr = Array.from(ySet).sort();
    
    // Invert y-axis if requested
    const finalYArr = invertYAxis ? [...yArr].reverse() : yArr;
    
    return { xValues: xArr, yValues: finalYArr, maxValue: max, minValue: min };
  }, [data, invertYAxis]);
  
  // Color scale functions
  const getColorScale = (value: number, min: number, max: number) => {
    // Normalize value between 0 and 1
    const normalized = max > min ? (value - min) / (max - min) : 0;
    
    // Apply logarithmic scale if selected
    const scaledValue = logarithmicScale
      ? Math.log1p(normalized * 9) / Math.log1p(9) // log1p for ln(1+x)
      : normalized;
    
    // Color scales
    const colorScales = {
      blue: [
        'rgba(239, 246, 255, 0.9)', // blue-50
        'rgba(219, 234, 254, 0.9)', // blue-100
        'rgba(191, 219, 254, 0.9)', // blue-200
        'rgba(147, 197, 253, 0.9)', // blue-300
        'rgba(96, 165, 250, 0.9)',  // blue-400
        'rgba(59, 130, 246, 0.9)',  // blue-500
        'rgba(37, 99, 235, 0.9)',   // blue-600
        'rgba(29, 78, 216, 0.9)',   // blue-700
        'rgba(30, 64, 175, 0.9)',   // blue-800
        'rgba(30, 58, 138, 0.9)',   // blue-900
      ],
      green: [
        'rgba(240, 253, 244, 0.9)', // green-50
        'rgba(220, 252, 231, 0.9)', // green-100
        'rgba(187, 247, 208, 0.9)', // green-200
        'rgba(134, 239, 172, 0.9)', // green-300
        'rgba(74, 222, 128, 0.9)',  // green-400
        'rgba(34, 197, 94, 0.9)',   // green-500
        'rgba(22, 163, 74, 0.9)',   // green-600
        'rgba(21, 128, 61, 0.9)',   // green-700
        'rgba(22, 101, 52, 0.9)',   // green-800
        'rgba(20, 83, 45, 0.9)',    // green-900
      ],
      red: [
        'rgba(254, 242, 242, 0.9)', // red-50
        'rgba(254, 226, 226, 0.9)', // red-100
        'rgba(254, 202, 202, 0.9)', // red-200
        'rgba(252, 165, 165, 0.9)', // red-300
        'rgba(248, 113, 113, 0.9)', // red-400
        'rgba(239, 68, 68, 0.9)',   // red-500
        'rgba(220, 38, 38, 0.9)',   // red-600
        'rgba(185, 28, 28, 0.9)',   // red-700
        'rgba(153, 27, 27, 0.9)',   // red-800
        'rgba(127, 29, 29, 0.9)',   // red-900
      ],
      purple: [
        'rgba(250, 245, 255, 0.9)', // purple-50
        'rgba(243, 232, 255, 0.9)', // purple-100
        'rgba(233, 213, 255, 0.9)', // purple-200
        'rgba(216, 180, 254, 0.9)', // purple-300
        'rgba(192, 132, 252, 0.9)', // purple-400
        'rgba(168, 85, 247, 0.9)',  // purple-500
        'rgba(147, 51, 234, 0.9)',  // purple-600
        'rgba(126, 34, 206, 0.9)',  // purple-700
        'rgba(107, 33, 168, 0.9)',  // purple-800
        'rgba(88, 28, 135, 0.9)',   // purple-900
      ],
      orange: [
        'rgba(255, 247, 237, 0.9)', // orange-50
        'rgba(255, 237, 213, 0.9)', // orange-100
        'rgba(254, 215, 170, 0.9)', // orange-200
        'rgba(253, 186, 116, 0.9)', // orange-300
        'rgba(251, 146, 60, 0.9)',  // orange-400
        'rgba(249, 115, 22, 0.9)',  // orange-500
        'rgba(234, 88, 12, 0.9)',   // orange-600
        'rgba(194, 65, 12, 0.9)',   // orange-700
        'rgba(154, 52, 18, 0.9)',   // orange-800
        'rgba(124, 45, 18, 0.9)',   // orange-900
      ],
      grey: [
        'rgba(249, 250, 251, 0.9)', // gray-50
        'rgba(243, 244, 246, 0.9)', // gray-100
        'rgba(229, 231, 235, 0.9)', // gray-200
        'rgba(209, 213, 219, 0.9)', // gray-300
        'rgba(156, 163, 175, 0.9)', // gray-400
        'rgba(107, 114, 128, 0.9)', // gray-500
        'rgba(75, 85, 99, 0.9)',    // gray-600
        'rgba(55, 65, 81, 0.9)',    // gray-700
        'rgba(31, 41, 55, 0.9)',    // gray-800
        'rgba(17, 24, 39, 0.9)',    // gray-900
      ],
    };
    
    const colorArray = colorScales[colorScale] || colorScales.blue;
    const index = Math.min(colorArray.length - 1, Math.floor(scaledValue * colorArray.length));
    return colorArray[index];
  };
  
  // Find cell value at specific coordinates
  const getCellValue = (x: string, y: string) => {
    const cell = data.find(item => item.x === x && item.y === y);
    return cell ? cell.value : 0;
  };
  
  // Format value for display
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toString();
    }
  };
  
  // Calculate cell colors
  const cellColors = useMemo(() => {
    const colors: Record<string, Record<string, string>> = {};
    
    xValues.forEach(x => {
      colors[x] = {};
      yValues.forEach(y => {
        const value = getCellValue(x, y);
        colors[x][y] = getColorScale(
          value,
          normalizeValues ? minValue : 0,
          maxValue
        );
      });
    });
    
    return colors;
  }, [xValues, yValues, normalizeValues, minValue, maxValue, colorScale, logarithmicScale]);
  
  // Calculate cell font color based on background brightness
  const getTextColor = (backgroundColor: string) => {
    // Extract RGB values from the rgba string
    const match = backgroundColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),/);
    if (!match) return '#000';
    
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    
    // Calculate brightness using a common formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return white for dark backgrounds, black for light backgrounds
    return brightness > 150 ? '#000' : '#fff';
  };
  
  // Generate legend items
  const legendItems = useMemo(() => {
    if (maxValue <= minValue) return [];
    
    const items = [];
    const steps = 5;
    
    for (let i = 0; i <= steps; i++) {
      const normalizedValue = i / steps;
      
      // Calculate actual value
      let value: number;
      if (logarithmicScale) {
        // Calculate value on the log scale
        const logValue = Math.exp(normalizedValue * Math.log(maxValue - minValue + 1)) - 1 + minValue;
        value = Math.min(maxValue, logValue);
      } else {
        // Linear scale
        value = minValue + normalizedValue * (maxValue - minValue);
      }
      
      items.push({
        color: getColorScale(value, minValue, maxValue),
        value: normalizeValues ? value : Math.max(0, value),
      });
    }
    
    return items;
  }, [minValue, maxValue, colorScale, logarithmicScale, normalizeValues]);
  
  // Calculate cell dimensions based on available space
  const getCellDimensions = () => {
    const cellWidth = Math.min(maxCellWidth, 800 / (xValues.length + 1));
    const cellHeight = Math.min(maxCellHeight, 500 / (yValues.length + 1));
    return { cellWidth, cellHeight };
  };
  
  const { cellWidth, cellHeight } = getCellDimensions();
  
  // Calculate total width and height of the heatmap
  const totalWidth = cellWidth * (xValues.length + 1) + 80; // extra for y-axis label
  const totalHeight = cellHeight * (yValues.length + 1) + 80; // extra for x-axis label
  
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="border-b px-4 py-3 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center"
            onClick={() => setShowSettings(!showSettings)}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
            Settings
            <ChevronDownIcon
              className={`h-4 w-4 ml-1 transition-transform ${
                showSettings ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>
      
      {showSettings && (
        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Display Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showValues}
                    onChange={() => setShowValues(!showValues)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span>Show Values</span>
                </label>
                
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={invertYAxis}
                    onChange={() => setInvertYAxis(!invertYAxis)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span>Invert Y-Axis</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Scale Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={normalizeValues}
                    onChange={() => setNormalizeValues(!normalizeValues)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span>Normalize Values</span>
                </label>
                
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={logarithmicScale}
                    onChange={() => setLogarithmicScale(!logarithmicScale)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span>Logarithmic Scale</span>
                </label>
                
                <div className="flex space-x-2 pt-1">
                  <label className="flex items-center space-x-1 text-sm">
                    <input
                      type="radio"
                      name="colorScale"
                      checked={colorScale === 'blue'}
                      onChange={() => onCellClick && onCellClick({ x: '', y: '', value: 0, metadata: { colorScale: 'blue' }})}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className="flex items-center">
                      <span className="inline-block w-4 h-4 bg-blue-500 rounded-sm mr-1"></span>
                      Blue
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-1 text-sm">
                    <input
                      type="radio"
                      name="colorScale"
                      checked={colorScale === 'green'}
                      onChange={() => onCellClick && onCellClick({ x: '', y: '', value: 0, metadata: { colorScale: 'green' }})}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <span className="flex items-center">
                      <span className="inline-block w-4 h-4 bg-green-500 rounded-sm mr-1"></span>
                      Green
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-1 text-sm">
                    <input
                      type="radio"
                      name="colorScale"
                      checked={colorScale === 'red'}
                      onChange={() => onCellClick && onCellClick({ x: '', y: '', value: 0, metadata: { colorScale: 'red' }})}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="flex items-center">
                      <span className="inline-block w-4 h-4 bg-red-500 rounded-sm mr-1"></span>
                      Red
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4 overflow-auto">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No data available</div>
        ) : (
          <div className="relative">
            <svg width={totalWidth} height={totalHeight}>
              {/* Y-axis label */}
              <text
                x="15"
                y={totalHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90, 15, ${totalHeight / 2})`}
                className="text-xs font-medium text-gray-500"
              >
                {yLabel}
              </text>
              
              {/* X-axis label */}
              <text
                x={totalWidth / 2}
                y={totalHeight - 15}
                textAnchor="middle"
                className="text-xs font-medium text-gray-500"
              >
                {xLabel}
              </text>
              
              {/* Y-axis labels */}
              {showLabels && yValues.map((y, i) => (
                <text
                  key={`y-${y}`}
                  x={cellWidth}
                  y={cellHeight * (i + 1.5)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="text-xs text-gray-500"
                  transform={`translate(-5, 0)`}
                >
                  {y.length > 15 ? `${y.substring(0, 12)}...` : y}
                </text>
              ))}
              
              {/* X-axis labels */}
              {showLabels && xValues.map((x, j) => (
                <text
                  key={`x-${x}`}
                  x={cellWidth * (j + 1.5)}
                  y={cellHeight * (yValues.length + 1)}
                  textAnchor="middle"
                  className="text-xs text-gray-500"
                  transform={`translate(0, -5)`}
                >
                  {x.length > 15 ? `${x.substring(0, 12)}...` : x}
                </text>
              ))}
              
              {/* Heatmap cells */}
              {yValues.map((y, i) => (
                <g key={`row-${y}`}>
                  {xValues.map((x, j) => {
                    const value = getCellValue(x, y);
                    const cellColor = cellColors[x][y];
                    const textColor = getTextColor(cellColor);
                    const isHovered = hoveredCell && hoveredCell.x === x && hoveredCell.y === y;
                    
                    return (
                      <g
                        key={`cell-${x}-${y}`}
                        onMouseEnter={() => setHoveredCell({ x, y, value })}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => {
                          const cellData = data.find(item => item.x === x && item.y === y);
                          if (cellData && onCellClick) {
                            onCellClick(cellData);
                          }
                        }}
                        style={{ cursor: onCellClick ? 'pointer' : 'default' }}
                      >
                        <rect
                          x={cellWidth * (j + 1)}
                          y={cellHeight * (i + 1)}
                          width={cellWidth}
                          height={cellHeight}
                          fill={cellColor}
                          stroke={isHovered ? '#000' : '#fff'}
                          strokeWidth={isHovered ? 2 : 0.5}
                          rx="1"
                        />
                        
                        {showValues && value > 0 && (
                          <text
                            x={cellWidth * (j + 1.5)}
                            y={cellHeight * (i + 1.5)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={textColor}
                            fontSize={value >= 1000 ? "8" : "10"}
                            fontWeight={isHovered ? "bold" : "normal"}
                            className="select-none pointer-events-none"
                          >
                            {formatValue(value)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              ))}
            </svg>
            
            {/* Legend */}
            {showLegend && (
              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Min: {formatValue(normalizeValues ? minValue : Math.max(0, minValue))}</span>
                  <div className="flex h-4">
                    {legendItems.map((item, i) => (
                      <div
                        key={`legend-${i}`}
                        className="w-8 h-4"
                        style={{ backgroundColor: item.color }}
                        title={`${formatValue(item.value)}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">Max: {formatValue(maxValue)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Tooltip for hovered cell */}
      {hoveredCell && (
        <div className="text-xs text-gray-500 border-t px-4 py-2">
          <span className="font-medium">{hoveredCell.x}</span> × <span className="font-medium">{hoveredCell.y}</span>: <span className="font-semibold">{hoveredCell.value}</span>
        </div>
      )}
    </div>
  );
};

export default ContentHeatmap;
