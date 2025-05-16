import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  className,
  tabClassName,
  contentClassName,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || (tabs.length > 0 ? tabs[0].id : ''));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700',
                tabClassName
              )}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className={cn('mt-4', contentClassName)}>
        {activeTabContent}
      </div>
    </div>
  );
};
