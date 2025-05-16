import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMonitoring } from '../../context/MonitoringContext';

// Individual notification types and interfaces
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionLabel?: string;
  actionCallback?: () => void;
  autoClose?: boolean;
  duration?: number;
}

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
  onAction?: (id: string) => void;
}

// Individual notification component
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
  onAction
}) => {
  const [closing, setClosing] = useState(false);

  // Handle auto-close
  useEffect(() => {
    if (notification.autoClose && notification.duration) {
      const timer = setTimeout(() => {
        setClosing(true);
        
        // Add a small delay for animation
        setTimeout(() => {
          onClose(notification.id);
        }, 300);
      }, notification.duration);
      
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  // Get the appropriate background color based on notification type
  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success': return 'bg-green-50 border-green-500';
      case 'warning': return 'bg-yellow-50 border-yellow-500';
      case 'error': return 'bg-red-50 border-red-500';
      default: return 'bg-blue-50 border-blue-500';
    }
  };

  // Get the appropriate icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return (
        <div className="flex-shrink-0 w-5 h-5 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
      case 'warning': return (
        <div className="flex-shrink-0 w-5 h-5 text-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
      case 'error': return (
        <div className="flex-shrink-0 w-5 h-5 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
      default: return (
        <div className="flex-shrink-0 w-5 h-5 text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div 
      className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto border-l-4 ${getBackgroundColor()} mb-3 transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {notification.message}
            </p>
            {notification.actionLabel && (
              <div className="mt-2">
                <button
                  onClick={() => onAction && onAction(notification.id)}
                  className="inline-flex text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  {notification.actionLabel}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => {
                setClosing(true);
                setTimeout(() => onClose(notification.id), 300);
              }}
              className="inline-flex text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification container that displays multiple notifications
const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { logs, errors, jobs } = useMonitoring();

  // Process logs and errors to generate notifications
  useEffect(() => {
    // Process new errors for notifications
    if (errors.length > 0) {
      const latestError = errors[errors.length - 1];
      
      // Only create notification for new errors
      if (!notifications.some(n => n.id === `error-${latestError.id}`)) {
        addNotification({
          id: `error-${latestError.id}`,
          type: 'error',
          title: 'Error Occurred',
          message: latestError.message,
          timestamp: latestError.timestamp,
          read: false,
          actionLabel: 'View Details',
          actionCallback: () => {
            // Navigate to error details or highlight in UI
            window.location.href = `/monitoring/${latestError.jobId || ''}?tab=errors`;
          },
          autoClose: true,
          duration: 10000 // 10 seconds
        });
      }
    }

    // Process logs for important events (warnings and critical info)
    if (logs.length > 0) {
      const latestLog = logs[logs.length - 1];
      
      // Only create notifications for warning logs
      if (latestLog.level === 'warning' && !notifications.some(n => n.id === `log-${latestLog.id}`)) {
        addNotification({
          id: `log-${latestLog.id}`,
          type: 'warning',
          title: 'Warning',
          message: latestLog.message,
          timestamp: latestLog.timestamp,
          read: false,
          autoClose: true,
          duration: 7000 // 7 seconds
        });
      }
    }

    // Process job status changes
    Object.entries(jobs).forEach(([jobId, job]) => {
      const notificationId = `job-${jobId}-${job.status}`;
      
      // Only create notifications for completed or failed jobs
      if ((job.status === 'completed' || job.status === 'failed') && 
          !notifications.some(n => n.id === notificationId)) {
        
        addNotification({
          id: notificationId,
          type: job.status === 'completed' ? 'success' : 'error',
          title: job.status === 'completed' ? 'Job Completed' : 'Job Failed',
          message: `Job ${jobId.substring(0, 8)}... has ${job.status}`,
          timestamp: Date.now(),
          read: false,
          actionLabel: 'View Results',
          actionCallback: () => {
            window.location.href = `/monitoring/${jobId}`;
          },
          autoClose: true,
          duration: 8000 // 8 seconds
        });
      }
    });
  }, [logs, errors, jobs]);

  // Add a new notification
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
  };

  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Handle action click
  const handleAction = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && notification.actionCallback) {
      notification.actionCallback();
    }
    removeNotification(id);
  };

  // Only render if there are notifications
  if (notifications.length === 0) {
    return null;
  }

  // Create a portal to render notifications at the top of the DOM
  return createPortal(
    <div className="fixed right-0 top-0 p-4 z-50 w-full max-w-sm pointer-events-none flex flex-col items-end">
      {notifications.map(notification => (
        <div key={notification.id} className="pointer-events-auto w-full">
          <NotificationItem
            notification={notification}
            onClose={removeNotification}
            onAction={handleAction}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default NotificationContainer;
