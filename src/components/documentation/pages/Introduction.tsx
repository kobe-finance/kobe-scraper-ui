import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Introduction documentation page
 */
const Introduction: React.FC = () => {
  return (
    <article className="prose prose-blue max-w-none dark:prose-invert">
      <h1>Introduction to Kobe Scraper</h1>
      
      <p>
        Welcome to Kobe Scraper, a powerful web scraping and data automation platform designed to help you
        extract, transform, and analyze data from websites and APIs with ease.
      </p>
      
      <h2>What is Kobe Scraper?</h2>
      
      <p>
        Kobe Scraper is a comprehensive web scraping solution that combines the following key features:
      </p>
      
      <ul>
        <li>
          <strong>Visual Scraper Builder</strong> - Create scrapers without coding using our intuitive visual interface
        </li>
        <li>
          <strong>Data Workflows</strong> - Design complex data processing pipelines to transform and enrich your data
        </li>
        <li>
          <strong>Job Scheduling</strong> - Automate your scraping tasks with flexible scheduling options
        </li>
        <li>
          <strong>Real-time Monitoring</strong> - Track your scraping jobs with detailed logs and performance metrics
        </li>
        <li>
          <strong>Data Export</strong> - Export your data in various formats (CSV, JSON, Excel) or connect to databases
        </li>
      </ul>
      
      <h2>Key Benefits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">No Coding Required</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Our visual interface lets you build scrapers without writing a single line of code,
            making web scraping accessible to everyone.
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">Powerful Automation</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Schedule your scraping jobs to run automatically at specified intervals,
            ensuring your data is always up-to-date.
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-2">Data Transformation</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Clean, filter, and transform your scraped data into the exact format you need
            with our workflow builder.
          </p>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <h3 className="font-bold text-orange-700 dark:text-orange-400 mb-2">Scalable Infrastructure</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Our platform handles the heavy lifting, allowing you to scale your scraping operations
            without worrying about infrastructure.
          </p>
        </div>
      </div>
      
      <h2>Getting Started</h2>
      
      <p>
        Ready to start scraping? Follow these steps to get up and running quickly:
      </p>
      
      <ol>
        <li>
          <strong>Installation</strong> - Check the <Link to="../installation" className="text-blue-600 hover:underline">Installation Guide</Link> to set up Kobe Scraper
        </li>
        <li>
          <strong>Create Your First Scraper</strong> - Follow our <Link to="../first-scraper" className="text-blue-600 hover:underline">First Scraper Tutorial</Link>
        </li>
        <li>
          <strong>Build a Workflow</strong> - Learn how to process your data with the <Link to="../workflow-basics" className="text-blue-600 hover:underline">Workflow Builder</Link>
        </li>
        <li>
          <strong>Schedule Jobs</strong> - Automate your scraping with the <Link to="../schedule-types" className="text-blue-600 hover:underline">Scheduler</Link>
        </li>
      </ol>
      
      <h2>Use Cases</h2>
      
      <p>
        Kobe Scraper is used across various industries for different data collection needs:
      </p>
      
      <ul>
        <li>
          <strong>E-commerce</strong> - Price monitoring, product catalog extraction, competitive analysis
        </li>
        <li>
          <strong>Finance</strong> - Market data collection, financial statement analysis, news monitoring
        </li>
        <li>
          <strong>Research</strong> - Academic data collection, trend analysis, content aggregation
        </li>
        <li>
          <strong>Marketing</strong> - Lead generation, social media monitoring, content curation
        </li>
        <li>
          <strong>Real Estate</strong> - Property listing data, market trends, investment opportunities
        </li>
      </ul>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-6">
        <h3 className="font-bold text-lg mb-2">⚠️ Responsible Scraping</h3>
        <p className="mb-0">
          Remember to always scrape responsibly and ethically. Respect website terms of service,
          implement proper rate limiting, and avoid overloading servers with requests.
          Check our <a href="/docs/best-practices" className="text-blue-600 hover:underline">Best Practices</a> guide for ethical scraping guidelines.
        </p>
      </div>
    </article>
  );
};

export default Introduction;
