#!/bin/bash

# Create a function to generate a basic documentation page
create_doc_page() {
  local file_name="$1"
  local title="$2"
  local description="$3"
  
  cat > "/Users/daddy/Projects/kobe-scraper-ui/src/components/documentation/pages/${file_name}.tsx" << END
import React from 'react';

/**
 * ${title} documentation page
 */
const ${file_name}: React.FC = () => {
  return (
    <article className="prose prose-blue max-w-none dark:prose-invert">
      <h1>${title}</h1>
      
      <p>
        ${description}
      </p>
      
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 my-6">
        <h2 className="text-xl font-bold mb-4">This page is under construction</h2>
        <p className="mb-4">
          We're currently working on expanding our documentation with detailed content for this topic.
          Check back soon for a complete guide.
        </p>
        <p className="mb-4">
          In the meantime, you can explore our other documentation sections or reach out to our support
          team if you have specific questions about ${title}.
        </p>
        <p>
          Thank you for your patience as we continue to improve our documentation.
        </p>
      </div>
    </article>
  );
};

export default ${file_name};
END

  echo "Created ${file_name}.tsx"
}

# Create all the remaining documentation pages
create_doc_page "AdvancedWorkflows" "Advanced Workflows" "Learn advanced techniques for creating complex data processing workflows in Kobe Scraper."
create_doc_page "Authentication" "API Authentication" "Learn how to authenticate with the Kobe Scraper API for programmatic access to all features."
create_doc_page "ScraperEndpoints" "Scraper API Endpoints" "Complete reference of all available API endpoints for managing scrapers and jobs."
create_doc_page "ResultsAPI" "Results API" "Documentation for the Results API that allows you to access and manage scraped data."
create_doc_page "ScheduleTypes" "Schedule Types" "Learn about different scheduling options for automating your scraping jobs."
create_doc_page "CronExpressions" "Cron Expressions" "Guide to using cron expressions for advanced job scheduling in Kobe Scraper."
create_doc_page "ManagingSchedules" "Managing Schedules" "Learn how to create, update, and manage scheduled jobs effectively."
create_doc_page "EcommerceScraping" "E-commerce Scraping" "Step-by-step tutorial for scraping product data from e-commerce websites."
create_doc_page "WorkingWithAPIs" "Working with APIs" "Learn how to integrate external APIs into your scraping workflows."
create_doc_page "DataProcessing" "Data Processing" "Guide to processing, transforming, and cleaning scraped data effectively."
create_doc_page "CommonIssues" "Common Issues" "Solutions to frequently encountered problems when using Kobe Scraper."
create_doc_page "BestPractices" "Best Practices" "Recommended practices for efficient and ethical web scraping."
create_doc_page "SupportResources" "Support Resources" "Additional resources for getting help with Kobe Scraper."

echo "All documentation pages have been created."
