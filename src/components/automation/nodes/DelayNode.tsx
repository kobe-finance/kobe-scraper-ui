import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  ClockIcon, 
  CalendarIcon
} from '@heroicons/react/24/outline';
import { DelayNode as DelayNodeType } from '../types';

/**
 * Delay node component for adding wait times and scheduling
 * Supports different delay types: fixed duration, until specific time, or cron schedule
 */
const DelayNode: React.FC<NodeProps> = ({ data, isConnectable, selected }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Get icon based on delay type
  const getDelayIcon = () => {
    switch (data.delayType) {
      case 'untilTime':
      case 'cron':
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-purple-500" />;
    }
  };

  // Get display name for delay type
  const getDelayName = () => {
    switch (data.delayType) {
      case 'duration':
        return 'Wait Duration';
      case 'untilTime':
        return 'Wait Until Time';
      case 'cron':
        return 'Cron Schedule';
      default:
        return 'Delay';
    }
  };

  // Handle change in delay type
  const handleDelayTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    data.onNodeChange(data.id, {
      delayType: newType,
      configuration: {},
    });
  };

  // Toggle config panel
  const toggleConfig = useCallback(() => {
    setIsConfigOpen(!isConfigOpen);
  }, [isConfigOpen]);

  // Get a human-readable summary of the delay
  const getDelaySummary = (): string => {
    if (!data.configuration) return '';
    
    switch (data.delayType) {
      case 'duration':
        const value = data.configuration.value || 0;
        const unit = data.configuration.unit || 'minutes';
        return `Wait for ${value} ${unit}`;
        
      case 'untilTime':
        const time = data.configuration.time || '';
        const date = data.configuration.date || '';
        if (date && time) {
          return `Wait until ${date} at ${time}`;
        } else if (time) {
          return `Wait until ${time} today`;
        } else if (date) {
          return `Wait until ${date}`;
        }
        return 'Wait until specific time';
        
      case 'cron':
        const expression = data.configuration.cronExpression || '';
        return expression ? `Schedule: ${expression}` : 'Cron schedule';
        
      default:
        return '';
    }
  };

  return (
    <div 
      className={`relative rounded-lg p-3 w-64 border-2 ${
        selected 
          ? 'border-purple-500 dark:border-purple-600' 
          : 'border-purple-200 dark:border-purple-800'
      } bg-white dark:bg-gray-800 transition-colors shadow-sm hover:shadow`}
    >
      {/* Node header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-900/30 mr-2">
            {getDelayIcon()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {data.name || 'Delay'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getDelayName()}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleConfig}
          className="p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <svg
            className={`h-4 w-4 transition-transform ${isConfigOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Configuration panel */}
      {isConfigOpen && (
        <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
              Delay Type
            </label>
            <select
              value={data.delayType}
              onChange={handleDelayTypeChange}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="duration">Wait Duration</option>
              <option value="untilTime">Wait Until Time</option>
              <option value="cron">Cron Schedule</option>
            </select>
          </div>

          {/* Type-specific configuration */}
          {data.delayType === 'duration' && (
            <DurationDelayConfig
              config={data.configuration || {}}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.delayType === 'untilTime' && (
            <TimeDelayConfig
              config={data.configuration || {}}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.delayType === 'cron' && (
            <CronDelayConfig
              config={data.configuration || {}}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}
        </div>
      )}

      {/* Node description or summary */}
      {!isConfigOpen && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {data.description || getDelaySummary() || 'Configure this delay...'}
        </div>
      )}

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: '#a855f7', width: '10px', height: '10px', border: '2px solid white' }}
        isConnectable={isConnectable}
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#a855f7', width: '10px', height: '10px', border: '2px solid white' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

// Duration delay configuration component
interface DurationDelayConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const DurationDelayConfig: React.FC<DurationDelayConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Duration Value
        </label>
        <input
          type="number"
          min="0"
          value={config.value || 0}
          onChange={(e) => updateConfig('value', parseInt(e.target.value) || 0)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Time Unit
        </label>
        <select
          value={config.unit || 'minutes'}
          onChange={(e) => updateConfig('unit', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
        </select>
      </div>
    </div>
  );
};

// Time-based delay configuration component
interface TimeDelayConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const TimeDelayConfig: React.FC<TimeDelayConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Time (24-hour format)
        </label>
        <input
          type="time"
          value={config.time || ''}
          onChange={(e) => updateConfig('time', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Date (optional)
        </label>
        <input
          type="date"
          value={config.date || ''}
          onChange={(e) => updateConfig('date', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          If no date is specified, the next occurrence of the time today will be used.
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="useWorkingHours"
          checked={config.useWorkingHours || false}
          onChange={(e) => updateConfig('useWorkingHours', e.target.checked)}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="useWorkingHours" className="ml-2 block text-xs text-gray-700 dark:text-gray-300">
          Only execute during working hours (9 AM - 5 PM)
        </label>
      </div>
    </div>
  );
};

// Cron schedule configuration component
interface CronDelayConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const CronDelayConfig: React.FC<CronDelayConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  // Common cron presets
  const cronPresets = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every day at midnight', value: '0 0 * * *' },
    { label: 'Every Monday at 9 AM', value: '0 9 * * 1' },
    { label: 'Every 15 minutes', value: '*/15 * * * *' },
    { label: 'First day of month', value: '0 0 1 * *' },
  ];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Cron Expression
        </label>
        <input
          type="text"
          value={config.cronExpression || ''}
          onChange={(e) => updateConfig('cronExpression', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="* * * * *"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Format: minute hour day month weekday
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Common Presets
        </label>
        <select
          value={config.cronExpression || ''}
          onChange={(e) => updateConfig('cronExpression', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Select a preset</option>
          {cronPresets.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Timezone
        </label>
        <select
          value={config.timezone || 'UTC'}
          onChange={(e) => updateConfig('timezone', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Europe/Paris">Paris (CET)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
        </select>
      </div>
    </div>
  );
};

export default DelayNode;
