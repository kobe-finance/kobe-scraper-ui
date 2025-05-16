import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpenIcon,
  CodeBracketIcon,
  CalendarIcon,
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

// Documentation pages
import Introduction from './pages/Introduction';
import InstallationGuide from './pages/InstallationGuide';
import FirstScraperTutorial from './pages/FirstScraperTutorial';
import WorkflowBasics from './pages/WorkflowBasics';
import NodeTypes from './pages/NodeTypes';
import AdvancedWorkflows from './pages/AdvancedWorkflows';
import Authentication from './pages/Authentication';
import ScraperEndpoints from './pages/ScraperEndpoints';
import ResultsAPI from './pages/ResultsAPI';
import ScheduleTypes from './pages/ScheduleTypes';
import CronExpressions from './pages/CronExpressions';
import ManagingSchedules from './pages/ManagingSchedules';
import EcommerceScraping from './pages/EcommerceScraping';
import WorkingWithAPIs from './pages/WorkingWithAPIs';
import DataProcessing from './pages/DataProcessing';
import CommonIssues from './pages/CommonIssues';
import BestPractices from './pages/BestPractices';
import SupportResources from './pages/SupportResources';

// Documentation categories and items
const docCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpenIcon,
    description: 'Learn the basics of Kobe Scraper and create your first scraper.',
    items: [
      { id: 'introduction', title: 'Introduction', path: 'introduction', component: Introduction },
      { id: 'installation', title: 'Installation Guide', path: 'installation', component: InstallationGuide },
      { id: 'first-scraper', title: 'First Scraper Tutorial', path: 'first-scraper', component: FirstScraperTutorial },
    ],
  },
  {
    id: 'workflow-builder',
    title: 'Workflow Builder',
    icon: Squares2X2Icon,
    description: 'Create complex data processing pipelines visually.',
    items: [
      { id: 'workflow-basics', title: 'Workflow Basics', path: 'workflow-basics', component: WorkflowBasics },
      { id: 'node-types', title: 'Node Types', path: 'node-types', component: NodeTypes },
      { id: 'advanced-workflows', title: 'Advanced Workflows', path: 'advanced-workflows', component: AdvancedWorkflows },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: CodeBracketIcon,
    description: 'Complete reference for the Kobe Scraper API.',
    items: [
      { id: 'authentication', title: 'Authentication', path: 'authentication', component: Authentication },
      { id: 'scraper-endpoints', title: 'Scraper Endpoints', path: 'scraper-endpoints', component: ScraperEndpoints },
      { id: 'results-api', title: 'Results API', path: 'results-api', component: ResultsAPI },
    ],
  },
  {
    id: 'scheduler',
    title: 'Scheduler',
    icon: CalendarIcon,
    description: 'Learn how to automate scraper jobs with the scheduler.',
    items: [
      { id: 'schedule-types', title: 'Schedule Types', path: 'schedule-types', component: ScheduleTypes },
      { id: 'cron-expressions', title: 'Cron Expressions', path: 'cron-expressions', component: CronExpressions },
      { id: 'managing-schedules', title: 'Managing Schedules', path: 'managing-schedules', component: ManagingSchedules },
    ],
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    icon: AcademicCapIcon,
    description: 'Step-by-step guides for common tasks.',
    items: [
      { id: 'ecommerce-scraping', title: 'E-commerce Scraping', path: 'ecommerce-scraping', component: EcommerceScraping },
      { id: 'working-with-apis', title: 'Working with APIs', path: 'working-with-apis', component: WorkingWithAPIs },
      { id: 'data-processing', title: 'Data Processing', path: 'data-processing', component: DataProcessing },
    ],
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: QuestionMarkCircleIcon,
    description: 'Common questions and troubleshooting.',
    items: [
      { id: 'common-issues', title: 'Common Issues', path: 'common-issues', component: CommonIssues },
      { id: 'best-practices', title: 'Best Practices', path: 'best-practices', component: BestPractices },
      { id: 'support-resources', title: 'Support Resources', path: 'support-resources', component: SupportResources },
    ],
  },
];

// Utility to get all doc items in a flat array
const allDocItems = docCategories.flatMap(category => category.items);

interface DocumentationPageProps {
  page?: string;
}

/**
 * Documentation page component with navigation and routing
 */
const DocumentationPage: React.FC<DocumentationPageProps> = ({ page }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Find if we're on a specific doc page
  const currentPath = location.pathname;
  const isDocHome = (currentPath === '/app/docs' || currentPath === '/app/docs/') && !page;
  
  // Find current document if we're on a specific page or from the page prop
  const currentDoc = page ? 
    allDocItems.find(item => item.id === page) : 
    (isDocHome ? null : allDocItems.find(item => currentPath.includes(item.id)));
  
  // Add basePath for consistent routing
  const basePath = '/app/docs';
  
  // Filter items based on search query
  const filteredCategories = searchQuery ? 
    docCategories.map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.items.length > 0) : 
    docCategories;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Documentation header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documentation</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Everything you need to know about Kobe Scraper
            </p>
          </div>
          
          {/* Search bar */}
          <div className="relative max-w-xs">
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 lg:w-72 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 md:min-h-screen">
            {currentDoc && (
              <button
                onClick={() => navigate('/app/docs')}
                className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Overview
              </button>
            )}
            
            <div className="space-y-8">
              {filteredCategories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center mb-2">
                    <category.icon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{category.title}</h3>
                  </div>
                  
                  <ul className="space-y-1 pl-7">
                    {category.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={`${basePath}/${item.id}`}
                          className={`text-sm block py-1 ${currentPath.includes(item.id) ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {filteredCategories.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">No results found for "{searchQuery}"</p>
                  <button 
                    className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            {currentDoc ? (
              // If we have a specific page to show
              <div key={currentDoc.id}>
                {React.createElement(currentDoc.component)}
              </div>
            ) : (
              // Otherwise show the home page
              <DocHome categories={docCategories} basePath={basePath} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Documentation home page (categories grid)
const DocHome: React.FC<{ categories: typeof docCategories, basePath: string }> = ({ categories, basePath }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Documentation</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Welcome to the Kobe Scraper documentation. Here you'll find guides, tutorials, and API reference 
        materials to help you get the most out of the platform.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2">
              <category.icon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{category.title}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {category.description}
            </p>
            <ul className="space-y-1 text-sm">
              {category.items.map((item) => (
                <li key={item.id}>
                  <Link 
                    to={`${basePath}/${item.id}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentationPage;
