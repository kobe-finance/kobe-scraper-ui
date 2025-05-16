import React from 'react';
import { StepProps } from '../OnboardingWizard';
import { useAuth } from '../../../context';

const CompletionStep: React.FC<StepProps> = ({ onNext, currentData }) => {
  const { user } = useAuth();
  
  // Calculate completion percentage for each section
  const getProfileCompletion = () => {
    const { profile } = currentData;
    const fields = ['fullName', 'jobTitle', 'company', 'industry'];
    const completed = fields.filter(field => !!profile[field]).length;
    return Math.round((completed / fields.length) * 100);
  };
  
  const getProjectCompletion = () => {
    const { project } = currentData;
    let score = 0;
    if (project.name) score += 1;
    if (project.description) score += 1;
    if (project.targetWebsites && project.targetWebsites.length) score += 1;
    return Math.round((score / 3) * 100);
  };
  
  const getDataSourcesCompletion = () => {
    const { dataSources } = currentData;
    let score = 0;
    if (dataSources.sources && dataSources.sources.length) score += 1;
    if (dataSources.frequency) score += 1;
    return Math.round((score / 2) * 100);
  };
  
  // Overall completion percentage
  const overallCompletion = Math.round(
    (getProfileCompletion() + getProjectCompletion() + getDataSourcesCompletion()) / 3
  );
  
  return (
    <div className="p-6 sm:p-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
          <svg 
            className="h-10 w-10 text-green-600 dark:text-green-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <h3 className="mt-6 text-2xl font-extrabold text-gray-900 dark:text-white">
          You're all set!
        </h3>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Your scraper is now ready to start collecting data.
        </p>
        
        {/* Setup Summary */}
        <div className="mt-8 text-left">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Your Setup Summary</h4>
          
          <dl className="mt-4 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Overall Completion
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 flex-grow">
                    <div 
                      className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${overallCompletion}%` }}
                    ></div>
                  </div>
                  <span>{overallCompletion}%</span>
                </div>
              </dd>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Profile
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                <p><span className="font-medium">Name:</span> {currentData.profile.fullName || user?.name}</p>
                <p><span className="font-medium">Job Title:</span> {currentData.profile.jobTitle}</p>
                <p><span className="font-medium">Company:</span> {currentData.profile.company}</p>
                <p><span className="font-medium">Industry:</span> {currentData.profile.industry}</p>
              </dd>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Project
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                <p><span className="font-medium">Name:</span> {currentData.project.name}</p>
                <p><span className="font-medium">Description:</span> {currentData.project.description}</p>
                <div className="mt-2">
                  <p className="font-medium">Target Websites:</p>
                  <ul className="list-disc pl-5 mt-1">
                    {currentData.project.targetWebsites.map((site, index) => (
                      <li key={index}>{site}</li>
                    ))}
                  </ul>
                </div>
              </dd>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Data Sources
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                <p><span className="font-medium">Scraping Frequency:</span> {currentData.dataSources.frequency}</p>
                <p><span className="font-medium">Proxy Rotation:</span> {currentData.dataSources.proxyEnabled ? 'Enabled' : 'Disabled'}</p>
                {currentData.dataSources.sources && currentData.dataSources.sources.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Selected Data Types:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {currentData.dataSources.sources.map((source) => (
                        <span 
                          key={source}
                          className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                        >
                          {source.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </dd>
            </div>
          </dl>
        </div>
        
        {/* Next steps */}
        <div className="mt-8 text-left">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Next Steps</h4>
          <ul className="mt-4 space-y-4">
            {[
              {
                title: 'Customize Your Scraper',
                description: 'Refine what data to extract from each website',
                icon: (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
              },
              {
                title: 'Schedule Your First Run',
                description: 'Set up and launch your first data collection job',
                icon: (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Configure Notifications',
                description: 'Set up alerts for completed scraping jobs',
                icon: (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary-500 dark:bg-primary-600 text-white">
                    {item.icon}
                  </div>
                </div>
                <div className="ml-4">
                  <h5 className="text-base font-medium text-gray-900 dark:text-white">{item.title}</h5>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Help resources */}
        <div className="mt-8 rounded-md bg-blue-50 dark:bg-blue-900 p-4 text-left">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Need help?</h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  Visit our <a href="#" className="font-medium underline">Help Center</a> for tutorials, or <a href="#" className="font-medium underline">contact support</a> if you have questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            type="button"
            onClick={() => onNext()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 w-full justify-center"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionStep;
