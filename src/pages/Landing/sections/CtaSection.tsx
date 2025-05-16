import React from 'react';
import { Link } from 'react-router-dom';

const CtaSection: React.FC = () => {
  return (
    <div className="bg-primary-700 dark:bg-primary-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to supercharge your data collection?</span>
          <span className="block text-primary-200">Start your free trial today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link
              to="/auth/register"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Get started
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link
              to="/onboarding/demo"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 transition-colors duration-200"
            >
              View demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;
