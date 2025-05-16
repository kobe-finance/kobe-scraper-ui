import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  BellIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftEllipsisIcon, 
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { NotificationNode as NotificationNodeType } from '../types';

/**
 * Notification node component for sending alerts and messages
 * Supports different notification channels: email, SMS, in-app, webhook
 */
const NotificationNode: React.FC<NodeProps> = ({ data, isConnectable, selected }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Get icon based on notification type
  const getNotificationIcon = () => {
    switch (data.notificationType) {
      case 'email':
        return <EnvelopeIcon className="h-5 w-5 text-blue-500" />;
      case 'sms':
        return <DevicePhoneMobileIcon className="h-5 w-5 text-blue-500" />;
      case 'inApp':
        return <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get display name for notification type
  const getNotificationName = () => {
    switch (data.notificationType) {
      case 'email':
        return 'Email';
      case 'sms':
        return 'SMS';
      case 'inApp':
        return 'In-App Message';
      case 'webhook':
        return 'Webhook';
      case 'slack':
        return 'Slack';
      default:
        return 'Notification';
    }
  };

  // Handle change in notification type
  const handleNotificationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    data.onNodeChange(data.id, {
      notificationType: newType,
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
            {getNotificationIcon()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {data.name || 'Notification'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getNotificationName()}
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
              Notification Type
            </label>
            <select
              value={data.notificationType}
              onChange={handleNotificationTypeChange}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="inApp">In-App Message</option>
              <option value="webhook">Webhook</option>
              <option value="slack">Slack</option>
            </select>
          </div>

          {/* Common fields for all notification types */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
              Subject / Title
            </label>
            <input
              type="text"
              value={data.configuration?.subject || ''}
              onChange={(e) => {
                data.onNodeChange(data.id, {
                  configuration: {
                    ...data.configuration,
                    subject: e.target.value
                  }
                });
              }}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Notification subject/title"
            />
          </div>

          {/* Content field */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
              Message Content
            </label>
            <textarea
              value={data.configuration?.content || ''}
              onChange={(e) => {
                data.onNodeChange(data.id, {
                  configuration: {
                    ...data.configuration,
                    content: e.target.value
                  }
                });
              }}
              rows={3}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Message content. Use {{variable}} syntax to include dynamic data."
            />
          </div>

          {/* Type-specific configuration */}
          {data.notificationType === 'email' && (
            <EmailNotificationConfig
              config={data.configuration || {}}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: {
                    ...data.configuration,
                    ...config
                  }
                });
              }}
            />
          )}

          {data.notificationType === 'sms' && (
            <SMSNotificationConfig
              config={data.configuration || {}}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: {
                    ...data.configuration,
                    ...config
                  }
                });
              }}
            />
          )}

          {data.notificationType === 'webhook' && (
            <WebhookNotificationConfig
              config={data.configuration || {}}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: {
                    ...data.configuration,
                    ...config
                  }
                });
              }}
            />
          )}

          {data.notificationType === 'slack' && (
            <SlackNotificationConfig
              config={data.configuration || {}}
              onChange={(config) => {
                data.onNodeChange(data.id, {
                  configuration: {
                    ...data.configuration,
                    ...config
                  }
                });
              }}
            />
          )}
        </div>
      )}

      {/* Node description */}
      {data.description && !isConfigOpen && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {data.description}
        </div>
      )}

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: '#3b82f6', width: '10px', height: '10px', border: '2px solid white' }}
        isConnectable={isConnectable}
      />

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

// Email notification configuration component
interface EmailNotificationConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const EmailNotificationConfig: React.FC<EmailNotificationConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Recipients
        </label>
        <input
          type="text"
          value={config.recipients || ''}
          onChange={(e) => updateConfig('recipients', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="email@example.com, {{user.email}}"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Comma-separated list of email addresses. Use {{variable}} for dynamic values.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          CC
        </label>
        <input
          type="text"
          value={config.cc || ''}
          onChange={(e) => updateConfig('cc', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="cc@example.com"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          BCC
        </label>
        <input
          type="text"
          value={config.bcc || ''}
          onChange={(e) => updateConfig('bcc', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="bcc@example.com"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="htmlContent"
          checked={config.htmlContent || false}
          onChange={(e) => updateConfig('htmlContent', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="htmlContent" className="ml-2 block text-xs text-gray-700 dark:text-gray-300">
          Send as HTML
        </label>
      </div>
    </div>
  );
};

// SMS notification configuration component
interface SMSNotificationConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const SMSNotificationConfig: React.FC<SMSNotificationConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Phone Numbers
        </label>
        <input
          type="text"
          value={config.phoneNumbers || ''}
          onChange={(e) => updateConfig('phoneNumbers', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="+1234567890, {{user.phone}}"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Comma-separated list of phone numbers with country code. Use {{variable}} for dynamic values.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          SMS Provider
        </label>
        <select
          value={config.provider || 'twilio'}
          onChange={(e) => updateConfig('provider', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="twilio">Twilio</option>
          <option value="nexmo">Nexmo/Vonage</option>
          <option value="aws">AWS SNS</option>
          <option value="custom">Custom</option>
        </select>
      </div>
    </div>
  );
};

// Webhook notification configuration component
interface WebhookNotificationConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const WebhookNotificationConfig: React.FC<WebhookNotificationConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Webhook URL
        </label>
        <input
          type="text"
          value={config.webhookUrl || ''}
          onChange={(e) => updateConfig('webhookUrl', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="https://example.com/webhook"
        />
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
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Headers (JSON)
        </label>
        <textarea
          value={config.headers || '{\n  "Content-Type": "application/json"\n}'}
          onChange={(e) => updateConfig('headers', e.target.value)}
          rows={3}
          className="block w-full text-sm font-mono border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Payload Template (JSON)
        </label>
        <textarea
          value={config.payloadTemplate || '{\n  "message": "{{content}}",\n  "title": "{{subject}}"\n}'}
          onChange={(e) => updateConfig('payloadTemplate', e.target.value)}
          rows={3}
          className="block w-full text-sm font-mono border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
};

// Slack notification configuration component
interface SlackNotificationConfigProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

const SlackNotificationConfig: React.FC<SlackNotificationConfigProps> = ({ config, onChange }) => {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Webhook URL
        </label>
        <input
          type="text"
          value={config.webhookUrl || ''}
          onChange={(e) => updateConfig('webhookUrl', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="https://hooks.slack.com/services/..."
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Channel
        </label>
        <input
          type="text"
          value={config.channel || ''}
          onChange={(e) => updateConfig('channel', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="#general"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Optional: Override the default channel in the webhook settings
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Username
        </label>
        <input
          type="text"
          value={config.username || ''}
          onChange={(e) => updateConfig('username', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Automation Bot"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Optional: Override the default username in the webhook settings
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
          Icon Emoji
        </label>
        <input
          type="text"
          value={config.iconEmoji || ''}
          onChange={(e) => updateConfig('iconEmoji', e.target.value)}
          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder=":robot_face:"
        />
      </div>
    </div>
  );
};

export default NotificationNode;
