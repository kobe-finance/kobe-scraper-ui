import React, { useState, useEffect } from 'react';
import { ScheduledJob, JobNotification } from './types';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface NotificationSettingsProps {
  job: ScheduledJob;
  onUpdateNotifications: (notifications: JobNotification[]) => void;
}

/**
 * Notification Settings component for configuring job notifications
 * Allows users to set up email, slack, webhook, and in-app notifications
 * for different job events (start, success, failure, timeout)
 */
const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  job,
  onUpdateNotifications
}) => {
  const [notifications, setNotifications] = useState<JobNotification[]>(job.notifications || []);
  const [newNotification, setNewNotification] = useState<Partial<JobNotification>>({
    type: 'email',
    events: ['failure'],
    includeResults: true
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Update notifications when job changes
  useEffect(() => {
    setNotifications(job.notifications || []);
  }, [job]);

  // Handle adding a new notification
  const handleAddNotification = () => {
    if (!newNotification.type || !newNotification.events || newNotification.events.length === 0) {
      return; // Don't add incomplete notifications
    }

    // Validate based on notification type
    if (newNotification.type === 'email' && (!newNotification.recipients || newNotification.recipients.length === 0)) {
      return;
    }
    
    if (newNotification.type === 'webhook' && !newNotification.webhookUrl) {
      return;
    }
    
    if (newNotification.type === 'slack' && !newNotification.channel) {
      return;
    }

    const notification: JobNotification = {
      id: `notification-${Date.now()}`,
      type: newNotification.type,
      recipients: newNotification.recipients,
      webhookUrl: newNotification.webhookUrl,
      channel: newNotification.channel,
      events: newNotification.events as ('start' | 'success' | 'failure' | 'timeout')[],
      message: newNotification.message,
      includeResults: newNotification.includeResults
    };

    const updatedNotifications = [...notifications, notification];
    setNotifications(updatedNotifications);
    onUpdateNotifications(updatedNotifications);
    
    // Reset form
    setNewNotification({
      type: 'email',
      events: ['failure'],
      includeResults: true
    });
    setShowAddForm(false);
  };

  // Handle removing a notification
  const handleRemoveNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    onUpdateNotifications(updatedNotifications);
  };

  // Handle checkbox change for events
  const handleEventCheckboxChange = (event: 'start' | 'success' | 'failure' | 'timeout') => {
    const currentEvents = newNotification.events || [];
    const newEvents = currentEvents.includes(event)
      ? currentEvents.filter(e => e !== event)
      : [...currentEvents, event];
    
    setNewNotification({
      ...newNotification,
      events: newEvents
    });
  };

  // Handle email recipients input
  const handleRecipientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const recipients = e.target.value.split(',')
      .map(email => email.trim())
      .filter(email => email !== '');
    
    setNewNotification({
      ...newNotification,
      recipients
    });
  };

  // Get human-readable notification type
  const getNotificationTypeLabel = (type: string): string => {
    switch (type) {
      case 'email':
        return 'Email';
      case 'slack':
        return 'Slack';
      case 'webhook':
        return 'Webhook';
      case 'inApp':
        return 'In-App Notification';
      default:
        return type;
    }
  };

  // Get human-readable event type
  const getEventTypeLabel = (event: string): string => {
    switch (event) {
      case 'start':
        return 'Job Started';
      case 'success':
        return 'Job Succeeded';
      case 'failure':
        return 'Job Failed';
      case 'timeout':
        return 'Job Timed Out';
      default:
        return event;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Notification Settings
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Configure notifications for important job events
        </p>
      </div>

      {/* Existing notifications */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden">
        {notifications.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500 dark:text-gray-400">
            <p>No notifications configured. You won't be notified of job events.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <li key={notification.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {getNotificationTypeLabel(notification.type)}
                    </span>
                    
                    {notification.type === 'email' && notification.recipients && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        To: {notification.recipients.join(', ')}
                      </span>
                    )}
                    
                    {notification.type === 'slack' && notification.channel && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Channel: {notification.channel}
                      </span>
                    )}
                    
                    {notification.type === 'webhook' && notification.webhookUrl && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">
                        URL: {notification.webhookUrl}
                      </span>
                    )}
                    
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Events: {notification.events.map(event => getEventTypeLabel(event)).join(', ')}
                    </span>
                    
                    {notification.includeResults && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Includes job results
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveNotification(notification.id)}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                  >
                    <TrashIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add notification form */}
      {showAddForm ? (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Add New Notification</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="notificationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notification Type
              </label>
              <select
                id="notificationType"
                name="notificationType"
                value={newNotification.type || 'email'}
                onChange={(e) => setNewNotification({
                  ...newNotification,
                  type: e.target.value as 'email' | 'slack' | 'webhook' | 'inApp'
                })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="email">Email</option>
                <option value="slack">Slack</option>
                <option value="webhook">Webhook</option>
                <option value="inApp">In-App Notification</option>
              </select>
            </div>
            
            {/* Email-specific fields */}
            {newNotification.type === 'email' && (
              <div>
                <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recipients (comma-separated)
                </label>
                <input
                  type="text"
                  name="recipients"
                  id="recipients"
                  value={(newNotification.recipients || []).join(', ')}
                  onChange={handleRecipientsChange}
                  className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="user@example.com, admin@example.com"
                />
              </div>
            )}
            
            {/* Slack-specific fields */}
            {newNotification.type === 'slack' && (
              <div>
                <label htmlFor="channel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Channel
                </label>
                <input
                  type="text"
                  name="channel"
                  id="channel"
                  value={newNotification.channel || ''}
                  onChange={(e) => setNewNotification({ ...newNotification, channel: e.target.value })}
                  className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="#general"
                />
              </div>
            )}
            
            {/* Webhook-specific fields */}
            {newNotification.type === 'webhook' && (
              <div>
                <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Webhook URL
                </label>
                <input
                  type="text"
                  name="webhookUrl"
                  id="webhookUrl"
                  value={newNotification.webhookUrl || ''}
                  onChange={(e) => setNewNotification({ ...newNotification, webhookUrl: e.target.value })}
                  className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="https://example.com/webhook"
                />
              </div>
            )}
            
            {/* Event triggers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notify On
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="event-start"
                    name="event-start"
                    type="checkbox"
                    checked={(newNotification.events || []).includes('start')}
                    onChange={() => handleEventCheckboxChange('start')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="event-start" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Job Started
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="event-success"
                    name="event-success"
                    type="checkbox"
                    checked={(newNotification.events || []).includes('success')}
                    onChange={() => handleEventCheckboxChange('success')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="event-success" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Job Succeeded
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="event-failure"
                    name="event-failure"
                    type="checkbox"
                    checked={(newNotification.events || []).includes('failure')}
                    onChange={() => handleEventCheckboxChange('failure')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="event-failure" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Job Failed
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="event-timeout"
                    name="event-timeout"
                    type="checkbox"
                    checked={(newNotification.events || []).includes('timeout')}
                    onChange={() => handleEventCheckboxChange('timeout')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="event-timeout" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Job Timed Out
                  </label>
                </div>
              </div>
            </div>

            {/* Message template */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={newNotification.message || ''}
                onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Enter a custom message template. Use {{jobName}}, {{status}}, {{duration}}, etc. for variables."
              />
            </div>
            
            {/* Include results */}
            <div className="flex items-center">
              <input
                id="includeResults"
                name="includeResults"
                type="checkbox"
                checked={newNotification.includeResults || false}
                onChange={(e) => setNewNotification({ ...newNotification, includeResults: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="includeResults" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Include job results in notification
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNotification}
                disabled={
                  !newNotification.type || 
                  !newNotification.events || 
                  newNotification.events.length === 0 ||
                  (newNotification.type === 'email' && (!newNotification.recipients || newNotification.recipients.length === 0)) ||
                  (newNotification.type === 'webhook' && !newNotification.webhookUrl) ||
                  (newNotification.type === 'slack' && !newNotification.channel)
                }
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Notification
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Add Notification
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
