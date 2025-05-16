import React from 'react';

const features = [
  {
    name: 'Point-and-Click Extraction',
    description: 'Select any element on a webpage and our AI will automatically extract similar elements across the entire website.',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
  {
    name: 'Scheduled Scraping',
    description: 'Set up recurring scraping jobs to run on your schedule - hourly, daily, weekly, or monthly.',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'Data Transformation',
    description: 'Clean, transform, and structure your data with our powerful processing tools before export.',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
  },
  {
    name: 'Proxy Rotation',
    description: 'Automatically rotate through thousands of proxy servers to avoid IP blocks and rate limits.',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    name: 'Headless Browsers',
    description: 'Extract data from JavaScript-heavy websites with our built-in headless browser automation.',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    name: 'Export to Anywhere',
    description: 'Export your data to CSV, JSON, Excel, Google Sheets, or directly to your database or API.',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    ),
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <div id="features" className="py-16 bg-white dark:bg-gray-900 overflow-hidden lg:py-24">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <svg
          className="hidden lg:block absolute left-full transform -translate-x-1/2 -translate-y-1/4"
          width={404}
          height={404}
          fill="none"
          viewBox="0 0 404 404"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={4} height={4} className="text-gray-200 dark:text-gray-700" fill="currentColor" />
            </pattern>
          </defs>
          <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
        </svg>
        <svg
          className="hidden lg:block absolute right-full bottom-0 transform translate-x-1/2 translate-y-1/4"
          width={404}
          height={404}
          fill="none"
          viewBox="0 0 404 404"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27-bottom"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={4} height={4} className="text-gray-200 dark:text-gray-700" fill="currentColor" />
            </pattern>
          </defs>
          <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27-bottom)" />
        </svg>

        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600 dark:text-primary-500 tracking-wide uppercase">POWERFUL FEATURES</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
            Web scraping made simple
          </p>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Everything you need to extract, process, and utilize web data at scale, without writing code.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className="pt-6 group"
              >
                <div className="flow-root bg-gray-50 dark:bg-gray-800 rounded-lg px-6 pb-8 h-full border border-transparent transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-900 hover:shadow-md">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 dark:bg-primary-600 rounded-md shadow-lg transform transition-transform duration-200 group-hover:scale-110">
                        <span className="text-white">{feature.icon}</span>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature highlight */}
        <div className="mt-24 lg:mt-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-3xl">
                Advanced data extraction with AI
              </h2>
              <p className="mt-3 text-lg text-gray-500 dark:text-gray-300">
                Our intelligent content extraction system automatically understands website structures and identifies the most valuable data to extract.
              </p>
              <div className="mt-10 space-y-4">
                {[
                  'Automatic pattern recognition',
                  'Structured data extraction',
                  'Dynamic content handling',
                  'Anti-detection measures',
                  'Intelligent rate limiting',
                ].map((item) => (
                  <div key={item} className="flex">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-base text-gray-500 dark:text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-7">
              <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <img
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="https://tailwindui.com/img/component-images/inbox-app-screenshot-1.jpg"
                  alt="Inbox user interface"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
