import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background decorative pattern */}
      <div className="hidden lg:block lg:absolute lg:inset-0">
        <svg
          className="absolute top-0 left-1/2 transform translate-x-64 -translate-y-8"
          width="640"
          height="784"
          fill="none"
          viewBox="0 0 640 784"
        >
          <defs>
            <pattern
              id="grid-pattern"
              x="118"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" className="text-gray-200 dark:text-gray-700" fill="currentColor" />
            </pattern>
          </defs>
          <rect y="72" width="640" height="640" className="text-gray-50 dark:text-gray-800" fill="currentColor" />
          <rect x="118" width="404" height="784" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="relative pt-6 pb-16 sm:pb-24 lg:pb-32">
        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 lg:mt-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-base lg:text-sm xl:text-base">
                  Advanced Web Scraping
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900 dark:text-white">Extract Insights From</span>
                  <span className="block text-primary-600 dark:text-primary-500">The Entire Web</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Kobe Scraper is a powerful, easy-to-use web scraping platform that helps businesses collect, analyze, and utilize web data at scale. 
                Transform unstructured web content into actionable intelligence without writing a single line of code.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  Start extracting data in minutes. No credit card required.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/auth/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get started for free
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/onboarding/demo"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:text-primary-400 dark:bg-gray-800 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
                    >
                      Live demo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <img
                    className="w-full"
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
                    alt="Dashboard preview"
                  />
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <svg className="h-20 w-20 text-primary-500" fill="currentColor" viewBox="0 0 84 84">
                      <circle opacity="0.9" cx="42" cy="42" r="42" fill="white" />
                      <path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trusted by section */}
          <div className="mt-24">
            <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
              <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
                <h2 className="text-center text-gray-500 font-semibold tracking-wide uppercase dark:text-gray-400">
                  TRUSTED BY INNOVATIVE COMPANIES
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4">
                  <div className="col-span-1 flex justify-center md:col-span-1">
                    <img className="h-10 opacity-60 hover:opacity-100 transition-opacity duration-200" src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg" alt="Tuple" />
                  </div>
                  <div className="col-span-1 flex justify-center md:col-span-1">
                    <img className="h-10 opacity-60 hover:opacity-100 transition-opacity duration-200" src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg" alt="Mirage" />
                  </div>
                  <div className="col-span-1 flex justify-center md:col-span-1">
                    <img className="h-10 opacity-60 hover:opacity-100 transition-opacity duration-200" src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg" alt="StaticKit" />
                  </div>
                  <div className="col-span-1 flex justify-center md:col-span-1">
                    <img className="h-10 opacity-60 hover:opacity-100 transition-opacity duration-200" src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg" alt="Transistor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HeroSection;
