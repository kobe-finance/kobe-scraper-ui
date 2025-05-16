import React from 'react';

/**
 * First Scraper Tutorial documentation page
 */
const FirstScraperTutorial: React.FC = () => {
  return (
    <article className="prose prose-blue max-w-none dark:prose-invert">
      <h1>Your First Scraper Tutorial</h1>
      
      <p>
        This step-by-step tutorial will guide you through creating your first web scraper using Kobe Scraper.
        By the end, you'll have a fully functional scraper that extracts data from a website.
      </p>
      
      <h2>What We'll Build</h2>
      
      <p>
        In this tutorial, we'll build a simple scraper that extracts product information from a demo e-commerce website.
        Our scraper will collect the following data points:
      </p>
      
      <ul>
        <li>Product name</li>
        <li>Price</li>
        <li>Description</li>
        <li>Rating</li>
        <li>Image URL</li>
      </ul>
      
      <h2>Step 1: Creating a New Scraper</h2>
      
      <ol>
        <li>
          <p>Log in to the Kobe Scraper dashboard</p>
        </li>
        <li>
          <p>Navigate to the <strong>Jobs</strong> section and click <strong>Create New Job</strong></p>
        </li>
        <li>
          <p>Enter the following details:</p>
          <ul>
            <li><strong>Job Name:</strong> Product Catalog Scraper</li>
            <li><strong>Description:</strong> Extracts product information from demo e-commerce site</li>
            <li><strong>Target URL:</strong> https://demo-store.kobescraper.com/products</li>
          </ul>
        </li>
        <li>
          <p>Click <strong>Create</strong> to proceed to the scraper builder</p>
        </li>
      </ol>
      
      <div className="not-prose my-6">
        <img 
          src="/assets/doc-images/first-scraper-step1.png" 
          alt="Create New Job Screen" 
          className="rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-auto"
        />
      </div>
      
      <h2>Step 2: Defining Selectors</h2>
      
      <p>
        Now we'll define CSS selectors to extract each data point from the product page.
      </p>
      
      <ol>
        <li>
          <p>In the scraper builder, click <strong>Add Selector</strong></p>
        </li>
        <li>
          <p>Create the following selectors:</p>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                  <th className="py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Selector</th>
                  <th className="py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                  <th className="py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Attribute</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">product_name</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">.product-title</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">Text</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">-</td>
                </tr>
                <tr>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">price</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">.product-price</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">Text</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">-</td>
                </tr>
                <tr>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">description</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">.product-description</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">Text</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">-</td>
                </tr>
                <tr>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">rating</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">.product-rating</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">Text</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">-</td>
                </tr>
                <tr>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">image_url</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">.product-image</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">Attribute</td>
                  <td className="py-2 text-sm text-gray-900 dark:text-white">src</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>
      </ol>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-6">
        <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-2">💡 Tip: Using the Element Picker</h3>
        <p className="mb-0 text-blue-700 dark:text-blue-300">
          You can use the <strong>Element Picker</strong> tool to automatically generate selectors.
          Just click the picker icon and then click on elements in the preview pane.
        </p>
      </div>
      
      <h2>Step 3: Setting Up Pagination</h2>
      
      <p>
        To scrape multiple pages of products, we need to set up pagination:
      </p>
      
      <ol>
        <li>
          <p>In the <strong>Pagination</strong> tab, select <strong>Next Button</strong> as the pagination type</p>
        </li>
        <li>
          <p>Set the Next Button Selector to <code>.pagination .next</code></p>
        </li>
        <li>
          <p>Set the Max Pages to <code>5</code> to limit our scraping to the first 5 pages</p>
        </li>
      </ol>
      
      <h2>Step 4: Configuring Settings</h2>
      
      <p>
        Let's configure a few additional settings to optimize our scraper:
      </p>
      
      <ol>
        <li>
          <p>In the <strong>Settings</strong> tab, set the following options:</p>
          <ul>
            <li><strong>Request Delay:</strong> 2 seconds (to avoid overloading the server)</li>
            <li><strong>User Agent:</strong> Default (or select a specific browser user agent)</li>
            <li><strong>Retry Attempts:</strong> 3 (the scraper will retry failed requests up to 3 times)</li>
            <li><strong>Output Format:</strong> JSON</li>
          </ul>
        </li>
      </ol>
      
      <h2>Step 5: Testing the Scraper</h2>
      
      <p>
        Before running the full job, let's test our scraper on a single page:
      </p>
      
      <ol>
        <li>
          <p>Click the <strong>Test</strong> button in the top right corner</p>
        </li>
        <li>
          <p>Review the extracted data in the preview pane</p>
        </li>
        <li>
          <p>If needed, adjust your selectors and test again</p>
        </li>
      </ol>
      
      <div className="not-prose my-6">
        <img 
          src="/assets/doc-images/first-scraper-step5.png" 
          alt="Test Results Screen" 
          className="rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-auto"
        />
      </div>
      
      <h2>Step 6: Running the Scraper</h2>
      
      <p>
        Now that everything is set up and tested, let's run the full scraper:
      </p>
      
      <ol>
        <li>
          <p>Click <strong>Save</strong> to save your scraper configuration</p>
        </li>
        <li>
          <p>Click <strong>Run Now</strong> to start the scraping job</p>
        </li>
        <li>
          <p>Navigate to the <strong>Monitoring</strong> tab to track the progress of your job</p>
        </li>
      </ol>
      
      <h2>Step 7: Viewing the Results</h2>
      
      <p>
        Once the scraper has finished running, you can view and download the results:
      </p>
      
      <ol>
        <li>
          <p>Go to the <strong>Results</strong> section</p>
        </li>
        <li>
          <p>Find your job in the list and click <strong>View Results</strong></p>
        </li>
        <li>
          <p>You can preview the data directly in the browser or download it in your chosen format</p>
        </li>
      </ol>
      
      <h2>Next Steps</h2>
      
      <p>
        Congratulations! You've created your first scraper with Kobe Scraper. Here's what you can explore next:
      </p>
      
      <ul>
        <li>
          <a href="/docs/workflow-basics" className="text-blue-600 hover:underline">Workflow Builder</a> - Learn how to process and transform your scraped data
        </li>
        <li>
          <a href="/docs/schedule-types" className="text-blue-600 hover:underline">Scheduler</a> - Set up automated scraping on a schedule
        </li>
        <li>
          <a href="/docs/ecommerce-scraping" className="text-blue-600 hover:underline">E-commerce Scraping</a> - A more advanced tutorial for e-commerce sites
        </li>
      </ul>
      
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-6">
        <h3 className="font-bold text-green-800 dark:text-green-400 mb-2">✅ Tutorial Complete!</h3>
        <p className="mb-0 text-green-700 dark:text-green-300">
          You now know the basics of creating a scraper with Kobe Scraper.
          Feel free to experiment with different selectors and settings to scrape various data types.
        </p>
      </div>
    </article>
  );
};

export default FirstScraperTutorial;
