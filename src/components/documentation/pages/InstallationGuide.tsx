import React from 'react';

/**
 * Installation Guide documentation page
 */
const InstallationGuide: React.FC = () => {
  return (
    <article className="prose prose-blue max-w-none dark:prose-invert">
      <h1>Installation Guide</h1>
      
      <p>
        This guide will walk you through the process of installing and setting up Kobe Scraper on your system.
        Kobe Scraper consists of two main components: the core scraper engine and the user interface.
      </p>
      
      <h2>System Requirements</h2>
      
      <p>Before installing, ensure your system meets the following requirements:</p>
      
      <ul>
        <li><strong>Operating System:</strong> Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)</li>
        <li><strong>CPU:</strong> 2+ cores recommended</li>
        <li><strong>RAM:</strong> 4GB minimum, 8GB+ recommended</li>
        <li><strong>Disk Space:</strong> 2GB minimum</li>
        <li><strong>Python:</strong> Python 3.9+ (for the scraper engine)</li>
        <li><strong>Node.js:</strong> v16+ (for the user interface)</li>
      </ul>
      
      <h2>Installation Methods</h2>
      
      <div className="not-prose mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <nav className="flex" aria-label="Tabs">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-gray-100 dark:bg-gray-700 dark:text-blue-400 border-r border-gray-200 dark:border-gray-700">
              Docker
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              Python Package
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              Source Code
            </button>
          </nav>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-3">Docker Installation (Recommended)</h3>
            
            <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <p className="font-medium">Install Docker:</p>
                <p>Download and install Docker from <a href="https://www.docker.com/products/docker-desktop" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">docker.com</a></p>
              </li>
              <li>
                <p className="font-medium">Pull the Kobe Scraper image:</p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded overflow-x-auto">docker pull kobescraper/all-in-one:latest</pre>
              </li>
              <li>
                <p className="font-medium">Run the container:</p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded overflow-x-auto">docker run -d -p 8000:8000 -p 3000:3000 --name kobe-scraper kobescraper/all-in-one:latest</pre>
              </li>
              <li>
                <p className="font-medium">Access the web interface:</p>
                <p>Open your browser and navigate to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">http://localhost:3000</code></p>
              </li>
            </ol>
          </div>
        </div>
      </div>
      
      <h2>Configuration</h2>
      
      <p>
        After installation, you'll need to configure Kobe Scraper with your settings.
        The configuration file is located at:
      </p>
      
      <ul>
        <li><strong>Docker:</strong> Inside the container at <code>/app/config/settings.yaml</code></li>
        <li><strong>Python Package:</strong> In your virtual environment at <code>$VENV/lib/python3.x/site-packages/kobescraper/config/settings.yaml</code></li>
        <li><strong>Source Installation:</strong> In the repository root at <code>./config/settings.yaml</code></li>
      </ul>
      
      <p>Key configuration options include:</p>
      
      <div className="not-prose mb-6">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Setting</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Description</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Default</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">API_KEY</td>
              <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Your API key for authentication</td>
              <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">None (required)</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">DATA_DIRECTORY</td>
              <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Directory to store scraped data</td>
              <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">/data</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">LOG_LEVEL</td>
              <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Logging verbosity</td>
              <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">INFO</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h2>Verification</h2>
      
      <p>To verify your installation is working correctly:</p>
      
      <ol>
        <li>Open your browser and navigate to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">http://localhost:3000</code></li>
        <li>Log in with the default credentials (username: <code>admin</code>, password: <code>password</code>)</li>
        <li>Navigate to the Jobs section and create a test job</li>
        <li>Run the job and check if data is being scraped correctly</li>
      </ol>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-6">
        <h3 className="font-bold text-yellow-800 dark:text-yellow-400 mb-2">⚠️ Security Note</h3>
        <p className="mb-0 text-yellow-700 dark:text-yellow-300">
          After installation, immediately change the default admin password to a secure one.
          You can do this by navigating to <strong>Settings &gt; User Management</strong> in the UI.
        </p>
      </div>
      
      <h2>Next Steps</h2>
      
      <p>Now that you have Kobe Scraper installed, you can proceed to:</p>
      
      <ul>
        <li>Complete the <a href="/docs/first-scraper" className="text-blue-600 hover:underline">First Scraper Tutorial</a></li>
        <li>Learn about the <a href="/docs/workflow-basics" className="text-blue-600 hover:underline">Workflow Builder</a></li>
        <li>Explore our <a href="/docs/ecommerce-scraping" className="text-blue-600 hover:underline">E-commerce Scraping</a> tutorial</li>
      </ul>
    </article>
  );
};

export default InstallationGuide;
