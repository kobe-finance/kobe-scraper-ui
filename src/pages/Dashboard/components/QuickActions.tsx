import React from 'react';
import { Card, CardHeader, CardContent, Button } from '../../../components';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  description?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  title = 'Quick Actions',
  description = 'Common tasks and operations',
}) => {
  return (
    <Card className="h-full">
      <CardHeader title={title} description={description} />
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              className="justify-start gap-2 p-3 h-auto"
              onClick={action.action}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                {action.icon}
              </span>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-medium">{action.label}</span>
                {action.description && (
                  <span className="text-xs text-muted-foreground text-gray-500 dark:text-gray-400">{action.description}</span>
                )}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Default Quick Actions Builder for the Dashboard
export const useDefaultQuickActions = () => {
  const navigate = useNavigate();
  
  const defaultActions: QuickAction[] = [
    {
      id: 'new-scraper',
      label: 'New Scraper',
      description: 'Create a new scraper job',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
        </svg>
      ),
      action: () => navigate('/dashboard/scraper'),
      variant: 'primary',
    },
    {
      id: 'view-jobs',
      label: 'View Jobs',
      description: 'Manage existing scraper jobs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      ),
      action: () => navigate('/dashboard/jobs'),
    },
    {
      id: 'export-data',
      label: 'Export Data',
      description: 'Export scraped data to CSV/JSON',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
      ),
      action: () => navigate('/dashboard/results?action=export'),
    },
    {
      id: 'system-settings',
      label: 'Settings',
      description: 'Configure system preferences',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      action: () => navigate('/dashboard/settings'),
    },
  ];
  
  return defaultActions;
};
