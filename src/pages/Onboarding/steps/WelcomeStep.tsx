import React from 'react';
import { StepProps } from '../OnboardingWizard';
import { useAuth } from '../../../context';

const WelcomeStep: React.FC<StepProps> = ({ onNext }) => {
  const { user } = useAuth();
  
  return (
    <div className="p-6 sm:p-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900">
          <svg 
            className="h-10 w-10 text-primary-600 dark:text-primary-400" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h3 className="mt-6 text-2xl font-extrabold text-gray-900 dark:text-white">
          Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h3>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          We're excited to have you onboard. Let's set up your scraper in just a few steps.
        </p>
        
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Complete Your Profile',
                description: 'Tell us a bit about yourself and your needs',
                icon: (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
              },
              {
                title: 'Create Your First Project',
                description: 'Set up your first data scraping project',
                icon: (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
              },
              {
                title: 'Configure Data Sources',
                description: 'Choose which websites to scrape data from',
                icon: (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
              },
              {
                title: 'Start Collecting Data',
                description: 'Launch your first scraping job and analyze results',
                icon: (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-500 dark:bg-primary-600 text-white">
                    {item.icon}
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Tooltip */}
          <div className="rounded-md bg-blue-50 dark:bg-blue-900 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Pro tip</h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    This setup process takes less than 5 minutes. You can always edit these settings later from your dashboard.
                  </p>
                </div>
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
            Let's get started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;
