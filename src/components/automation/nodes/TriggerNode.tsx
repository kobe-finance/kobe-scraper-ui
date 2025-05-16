import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  PlayIcon, 
  ClockIcon, 
  GlobeAltIcon, 
  BellIcon 
} from '@heroicons/react/24/outline';
import { TriggerNode as TriggerNodeType } from '../types';

/**
 * Trigger node component that starts a workflow
 * Supports different trigger types: schedule, webhook, event, manual
 */
const TriggerNode: React.FC<NodeProps> = ({ data, isConnectable, selected }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Map trigger type to icon
  const getTriggerIcon = () => {
    switch (data.triggerType) {
      case 'schedule':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'webhook':
        return <GlobeAltIcon className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <BellIcon className="h-5 w-5 text-blue-500" />;
      case 'manual':
      default:
        return <PlayIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get display name for trigger type
  const getTriggerTypeName = () => {
    switch (data.triggerType) {
      case 'schedule':
        return 'Schedule';
      case 'webhook':
        return 'Webhook';
      case 'event':
        return 'Event';
      case 'manual':
      default:
        return 'Manual';
    }
  };

  // Handle change in trigger type
  const handleTriggerTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTriggerType = e.target.value as TriggerNodeType['data']['triggerType'];
    data.onNodeChange(data.id, {
      triggerType: newTriggerType,
      configuration: {},
    });
  };

  // Toggle config panel
  const toggleConfig = useCallback(() => {
    setIsConfigOpen(!isConfigOpen);
  }, [isConfigOpen]);

  return (
    <div 
      className={`relative rounded-lg p-3 w-64 border-2 ${
        selected 
          ? 'border-blue-500 dark:border-blue-600' 
          : 'border-blue-200 dark:border-blue-800'
      } bg-white dark:bg-gray-800 transition-colors shadow-sm hover:shadow`}
    >
      {/* Node header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/30 mr-2">
            {getTriggerIcon()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {data.name || 'Trigger'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getTriggerTypeName()}
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
              Trigger Type
            </label>
            <select
              value={data.triggerType}
              onChange={handleTriggerTypeChange}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="manual">Manual Trigger</option>
              <option value="schedule">Schedule</option>
              <option value="webhook">Webhook</option>
              <option value="event">Event</option>
            </select>
          </div>

          {/* Render configuration based on trigger type */}
          {data.triggerType === 'schedule' && (
            <ScheduleConfiguration
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.triggerType === 'webhook' && (
            <WebhookConfiguration
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.triggerType === 'event' && (
            <EventConfiguration
              config={data.configuration}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: config,
                });
              }}
            />
          )}

          {data.triggerType === 'manual' && (
            <p className="text-xs text-gray-500 italic dark:text-gray-400">
              This workflow will be triggered manually by the user.
            </p>
          )}
        </div>
      )}

      {/* Node description */}
      {data.description && !isConfigOpen && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {data.description}
        </div>
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#3b82f6', width: '10px', height: '10px', border: '2px solid white' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

// Schedule configuration component
interface ScheduleConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const ScheduleConfiguration: React.FC<ScheduleConfigProps> = ({ config, onChange }) => {
  const frequencyOptions = [
    { value: 'minute', label: 'Minutes' },
    { value: 'hour', label: 'Hours' },
    { value: 'day', label: 'Days' },
    { value: 'week', label: 'Weeks' },
    { value: 'month', label: 'Months' },
    { value: 'cron', label: 'Custom (Cron)' },
  ];

  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Frequency
        </label>
        <select
          value={config.frequency || 'day'}
          onChange={(e) => updateConfig('frequency', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {frequencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {config.frequency !== 'cron' ? (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
              Every
            </label>
            <input
              type="number"
              min="1"
              value={config.interval || 1}
              onChange={(e) => updateConfig('interval', parseInt(e.target.value))}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
              At
            </label>
            <input
              type="time"
              value={config.time || '00:00'}
              onChange={(e) => updateConfig('time', e.target.value)}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
            Cron Expression
          </label>
          <input
            type="text"
            value={config.cronExpression || '* * * * *'}
            onChange={(e) => updateConfig('cronExpression', e.target.value)}
            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="* * * * *"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Format: minute hour day month weekday
          </p>
        </div>
      )}
    </div>
  );
};

// Webhook configuration component
interface WebhookConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const WebhookConfiguration: React.FC<WebhookConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Webhook Path
        </label>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-1 dark:text-gray-400">/api/webhooks/</span>
          <input
            type="text"
            value={config.path || 'my-webhook'}
            onChange={(e) => updateConfig('path', e.target.value)}
            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="my-webhook"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          HTTP Method
        </label>
        <select
          value={config.method || 'POST'}
          onChange={(e) => updateConfig('method', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="POST">POST</option>
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
            Secret Key
          </label>
          <button
            type="button"
            onClick={() => updateConfig('secretKey', Math.random().toString(36).substring(2, 15))}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Generate
          </button>
        </div>
        <input
          type="text"
          value={config.secretKey || ''}
          onChange={(e) => updateConfig('secretKey', e.target.value)}
          className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Optional secret key"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Used to validate webhook requests
        </p>
      </div>
    </div>
  );
};

// Event configuration component
interface EventConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const EventConfiguration: React.FC<EventConfigProps> = ({ config, onChange }) => {
  const eventOptions = [
    { value: 'scrape_completed', label: 'Scrape Completed' },
    { value: 'pattern_matched', label: 'Pattern Matched' },
    { value: 'content_extracted', label: 'Content Extracted' },
    { value: 'error_occurred', label: 'Error Occurred' },
    { value: 'data_updated', label: 'Data Updated' },
  ];

  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Event Type
        </label>
        <select
          value={config.eventType || 'scrape_completed'}
          onChange={(e) => updateConfig('eventType', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {eventOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Filter
        </label>
        <textarea
          value={config.filter || ''}
          onChange={(e) => updateConfig('filter', e.target.value)}
          placeholder="e.g. data.url contains 'example.com'"
          rows={2}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Optional expression to filter events
        </p>
      </div>
    </div>
  );
};

export default TriggerNode;
