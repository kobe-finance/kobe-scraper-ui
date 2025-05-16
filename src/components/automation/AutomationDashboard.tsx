import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import WorkflowBuilder from './WorkflowBuilder';
import { SchedulerInterface } from './scheduler';
import { 
  Cog6ToothIcon, 
  ClockIcon, 
  PlayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Workflow } from './types';

// Sample workflow for the initial state
const initialWorkflow: Workflow = {
  id: 'workflow-1',
  name: 'E-commerce Scraper',
  description: 'Scrapes product data from e-commerce websites',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
  nodes: [],
  connections: []
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Automation Dashboard component that combines the workflow builder and scheduler
 * Provides a tabbed interface to toggle between different automation features
 */
const AutomationDashboard: React.FC = () => {
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [savedWorkflows, setSavedWorkflows] = useState<Workflow[]>([initialWorkflow]);

  // Handle saving a workflow
  const handleSaveWorkflow = (updatedWorkflow: Workflow) => {
    // Update the workflow state
    setWorkflow(updatedWorkflow);
    
    // Update in savedWorkflows array
    const workflowExists = savedWorkflows.some(w => w.id === updatedWorkflow.id);
    
    if (workflowExists) {
      setSavedWorkflows(savedWorkflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      ));
    } else {
      setSavedWorkflows([...savedWorkflows, updatedWorkflow]);
    }
  };

  // Handle creating a new workflow
  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false,
      nodes: [],
      connections: []
    };
    
    setWorkflow(newWorkflow);
    setSavedWorkflows([...savedWorkflows, newWorkflow]);
  };

  // Tabs for the dashboard
  const tabs = [
    { name: 'Workflow Builder', icon: Cog6ToothIcon },
    { name: 'Scheduler', icon: ClockIcon },
    { name: 'Execution History', icon: PlayIcon },
    { name: 'Templates', icon: DocumentTextIcon }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Automation Dashboard</h1>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleCreateWorkflow}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Create Workflow
          </button>
          <select
            value={workflow.id}
            onChange={(e) => {
              const selectedWorkflow = savedWorkflows.find(w => w.id === e.target.value);
              if (selectedWorkflow) {
                setWorkflow(selectedWorkflow);
              }
            }}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {savedWorkflows.map(w => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'py-4 px-6 text-sm font-medium flex items-center',
                  selected
                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                )
              }
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {/* Workflow Builder Tab */}
          <Tab.Panel>
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">{workflow.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{workflow.description || 'No description'}</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    workflow.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {workflow.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <WorkflowBuilder 
                workflow={workflow} 
                onWorkflowChange={setWorkflow}
                onSave={handleSaveWorkflow}
              />
            </div>
          </Tab.Panel>
          
          {/* Scheduler Tab */}
          <Tab.Panel>
            <SchedulerInterface />
          </Tab.Panel>
          
          {/* Execution History Tab - A placeholder for now */}
          <Tab.Panel>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Execution History</h2>
              <p className="text-gray-500 dark:text-gray-400">
                View the execution history of your automation workflows here.
                This feature will allow you to monitor job runs, analyze performance, and troubleshoot issues.
              </p>
              
              {/* Placeholder table */}
              <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Workflow</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">E-commerce Scraper</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">May 13, 2025 08:00 AM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">10 minutes</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Price Analyzer</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">May 12, 2025 10:00 AM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">15 minutes</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Failed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Tab.Panel>
          
          {/* Templates Tab - A placeholder for now */}
          <Tab.Panel>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Workflow Templates</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Browse and use pre-built workflow templates to jumpstart your automation.
                Templates provide ready-to-use configurations for common scraping and data processing tasks.
              </p>
              
              {/* Template cards grid */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* E-commerce Template */}
                <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">E-commerce Scraper</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Extract product data from online stores</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-2">
                        Popular
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Beginner
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-600 px-5 py-3">
                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                    >
                      Use Template →
                    </button>
                  </div>
                </div>
                
                {/* Content Analyzer Template */}
                <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Content Analyzer</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Extract and analyze text content from websites</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mr-2">
                        Trending
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Beginner
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-600 px-5 py-3">
                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                    >
                      Use Template →
                    </button>
                  </div>
                </div>
                
                {/* Data Export Template */}
                <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Data Export Pipeline</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Process and export data to various formats</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 mr-2">
                        Utility
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Advanced
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-600 px-5 py-3">
                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                    >
                      Use Template →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AutomationDashboard;
