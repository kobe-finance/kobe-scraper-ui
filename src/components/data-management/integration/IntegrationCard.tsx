import React from 'react';
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'cloud_storage' | 'analytics' | 'notification' | 'database' | 'automation' | 'custom';
  isConnected: boolean;
  isPopular?: boolean;
  authType: 'oauth' | 'api_key' | 'basic' | 'custom' | 'webhook';
}

interface IntegrationCardProps {
  integration: Integration;
  onClick: (integration: Integration) => void;
  className?: string;
}

/**
 * Card component for displaying an available integration service
 * Shows status, description, and provides access to configuration
 */
const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onClick,
  className = ''
}) => {
  const getCategoryLabel = (category: Integration['category']): string => {
    switch (category) {
      case 'cloud_storage': return 'Cloud Storage';
      case 'analytics': return 'Analytics';
      case 'notification': return 'Notification';
      case 'database': return 'Database';
      case 'automation': return 'Automation';
      case 'custom': return 'Custom';
      default: return 'Integration';
    }
  };

  return (
    <div 
      className={`border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 ${className}`}
      onClick={() => onClick(integration)}
    >
      <div className="px-4 py-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            {integration.icon}
          </div>
          
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                {integration.name}
              </h3>
              
              <div className="flex items-center">
                {integration.isConnected && (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                )}
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="mt-1 flex items-center">
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded dark:bg-gray-700 dark:text-gray-300">
                {getCategoryLabel(integration.category)}
              </span>
              
              {integration.isPopular && (
                <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded dark:bg-blue-900/30 dark:text-blue-300">
                  Popular
                </span>
              )}
            </div>
            
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {integration.description}
            </p>
            
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {integration.isConnected ? (
                <span className="text-green-600 dark:text-green-400">Connected</span>
              ) : (
                <span>Not connected</span>
              )}
              {' · '}
              <span>{getAuthTypeLabel(integration.authType)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get label for authentication type
function getAuthTypeLabel(authType: Integration['authType']): string {
  switch (authType) {
    case 'oauth': return 'OAuth Authentication';
    case 'api_key': return 'API Key';
    case 'basic': return 'Username/Password';
    case 'webhook': return 'Webhook';
    case 'custom': return 'Custom Authentication';
    default: return 'Authentication Required';
  }
}

// Helper function to get default integrations
export const getDefaultIntegrations = (): Integration[] => {
  return [
    {
      id: 'google_drive',
      name: 'Google Drive',
      description: 'Automatically export scraped data to Google Drive folders or spreadsheets.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M8.8 13.5l-1.6 3H11l1.6-3H8.8zM5.6 7.5l-1.6 3h3.8l1.6-3H5.6zM12.4 7.5l-1.6 3h3.8l1.6-3h-3.8z"/>
          <path d="M15.2 17.3l.8-1.6-1.6-3-5.6 10.3h3.2l3.2-5.7z"/>
        </svg>
      ),
      category: 'cloud_storage',
      isConnected: false,
      isPopular: true,
      authType: 'oauth'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Sync scraped data and images directly to your Dropbox account.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M6 2l6 3.75L6 9.5l6 3.75L6 17l6 3.75L18 17l-6-3.75L18 9.5l-6-3.75L18 2l-6 3.75z" />
        </svg>
      ),
      category: 'cloud_storage',
      isConnected: true,
      authType: 'oauth'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications about scraping jobs and share results with your team.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
          <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
          <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
          <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
          <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
          <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" />
          <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />
        </svg>
      ),
      category: 'notification',
      isConnected: false,
      authType: 'oauth'
    },
    {
      id: 'aws_s3',
      name: 'Amazon S3',
      description: 'Store scraped data, images, and documents in Amazon S3 buckets.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v5.25c0 1.036-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 01-1.875-1.875v-5.25zM7.5 15.375c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v5.25c0 1.036-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 01-1.875-1.875v-5.25zM18.75 7.5h-5.25a.375.375 0 00-.375.375v5.25c0 .207.168.375.375.375h5.25a.375.375 0 00.375-.375v-5.25A.375.375 0 0018.75 7.5zm0 12h-5.25a.375.375 0 01-.375-.375v-5.25c0-.207.168-.375.375-.375h5.25a.375.375 0 01.375.375v5.25a.375.375 0 01-.375.375z" />
        </svg>
      ),
      category: 'cloud_storage',
      isConnected: false,
      isPopular: true,
      authType: 'api_key'
    },
    {
      id: 'google_sheets',
      name: 'Google Sheets',
      description: 'Export scraped data directly to Google Sheets for easy analysis.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M19.5 21.5H4.5V.5h10l5 5v16zm-1-1V6h-4.5V1.5h-9v19h13.5z" />
          <path d="M14.4 11.5v6h-9v-6h9zm-1 1h-7v4h7v-4z" />
        </svg>
      ),
      category: 'analytics',
      isConnected: false,
      authType: 'oauth'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect scraped data to thousands of apps with Zapier automations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 3.09c-4.92 0-8.91 4-8.91 8.91 0 4.92 4 8.91 8.91 8.91 4.92 0 8.91-4 8.91-8.91 0-4.92-4-8.91-8.91-8.91zm0 17.83c-4.92 0-8.91-4-8.91-8.91 0-4.92 4-8.91 8.91-8.91 4.92 0 8.91 4 8.91 8.91 0 4.92-4 8.91-8.91 8.91z" />
          <path d="M9.7 16.7l6.2-6.2-2.3-2.3-3.9 3.9-1.6-1.6-2.3 2.3 3.9 3.9z" />
        </svg>
      ),
      category: 'automation',
      isConnected: false,
      isPopular: true,
      authType: 'api_key'
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      description: 'Store scraped data in MongoDB for flexible document-based storage.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
        </svg>
      ),
      category: 'database',
      isConnected: true,
      authType: 'basic'
    },
    {
      id: 'custom_webhook',
      name: 'Custom Webhook',
      description: 'Send scraped data to your own endpoint via webhooks.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M9.75 3a.75.75 0 0 0-.75.75V4h6v-.25a.75.75 0 0 0-.75-.75h-4.5ZM8.25 5v10.25a.75.75 0 0 0 1.493.102l.007-.102V5h6v10.25a.75.75 0 0 0 1.493.102l.007-.102V5h1.5v12.25a1.75 1.75 0 0 1-1.607 1.744L17 19h-6.25a1.75 1.75 0 0 1-1.744-1.607l-.006-.143V5h-.75Z" />
        </svg>
      ),
      category: 'custom',
      isConnected: false,
      authType: 'webhook'
    }
  ];
};

export default IntegrationCard;
