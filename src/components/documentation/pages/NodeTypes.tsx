import React from 'react';

const NodeTypes: React.FC = () => {
  return (
    <article className="prose prose-blue max-w-none dark:prose-invert">
      <h1>Node Types</h1>
      
      <p>
        The Workflow Builder offers a variety of node types that serve different purposes in your data processing pipelines.
        This reference guide explains each node type, its function, and how to use it effectively.
      </p>
      
      <h2>Trigger Nodes</h2>
      
      <p>
        Trigger nodes initiate workflow execution. They define when and how a workflow should start running.
      </p>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden not-prose mb-6">
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Available Trigger Nodes</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="px-4 py-3">
            <h4 className="font-medium text-blue-600 dark:text-blue-400">Manual Trigger</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Starts a workflow when manually triggered by a user.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-blue-600 dark:text-blue-400">Schedule Trigger</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Starts a workflow based on a schedule (time-based trigger).
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-blue-600 dark:text-blue-400">Webhook Trigger</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Starts a workflow when an HTTP webhook is received.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-blue-600 dark:text-blue-400">Data Change Trigger</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Starts a workflow when data changes are detected in a monitored source.
            </p>
          </div>
        </div>
      </div>
      
      <h2>Action Nodes</h2>
      
      <p>
        Action nodes perform specific operations on data, such as scraping websites, making API calls, or transforming data.
      </p>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden not-prose mb-6">
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Common Action Nodes</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="px-4 py-3">
            <h4 className="font-medium text-green-600 dark:text-green-400">Scraper Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Extracts data from websites using defined selectors.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-green-600 dark:text-green-400">HTTP Request Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Makes HTTP requests to APIs and services.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-green-600 dark:text-green-400">Transform Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Applies transformations to data using JavaScript expressions.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-green-600 dark:text-green-400">CSV/JSON Parser Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Parses CSV or JSON data into structured formats.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-green-600 dark:text-green-400">Database Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Interacts with databases (read/write operations).
            </p>
          </div>
        </div>
      </div>
      
      <h2>Condition Nodes</h2>
      
      <p>
        Condition nodes introduce branching logic into workflows, allowing different paths based on conditions.
      </p>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden not-prose mb-6">
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Condition Node Types</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="px-4 py-3">
            <h4 className="font-medium text-purple-600 dark:text-purple-400">IF Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Creates a branch based on a true/false condition.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-purple-600 dark:text-purple-400">Switch Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Creates multiple branches based on different possible values.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-purple-600 dark:text-purple-400">Filter Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Filters data based on specified criteria.
            </p>
          </div>
        </div>
      </div>
      
      <h2>Loop Nodes</h2>
      
      <p>
        Loop nodes allow for iteration over data collections, processing each item individually.
      </p>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden not-prose mb-6">
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Loop Node Types</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="px-4 py-3">
            <h4 className="font-medium text-orange-600 dark:text-orange-400">For Each Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Iterates through each item in an array or collection.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-orange-600 dark:text-orange-400">While Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Executes a loop as long as a condition remains true.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-orange-600 dark:text-orange-400">Pagination Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Handles pagination when scraping multiple pages of data.
            </p>
          </div>
        </div>
      </div>
      
      <h2>Output Nodes</h2>
      
      <p>
        Output nodes define where the processed data is sent or stored.
      </p>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden not-prose mb-6">
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Output Node Types</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="px-4 py-3">
            <h4 className="font-medium text-red-600 dark:text-red-400">File Output Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Saves data to a file (CSV, JSON, Excel, etc.).
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-red-600 dark:text-red-400">Database Output Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Stores data in a database.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-red-600 dark:text-red-400">API Output Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Sends data to an external API.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-red-600 dark:text-red-400">Email Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Sends email notifications with optional data attachments.
            </p>
          </div>
        </div>
      </div>
      
      <h2>Utility Nodes</h2>
      
      <p>
        Utility nodes perform supporting functions within workflows.
      </p>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden not-prose mb-6">
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Utility Node Types</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="px-4 py-3">
            <h4 className="font-medium text-gray-600 dark:text-gray-400">Delay Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Adds a timed delay in the workflow execution.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-gray-600 dark:text-gray-400">Merge Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Combines data from multiple branches.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-gray-600 dark:text-gray-400">Comment Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Adds documentation comments to the workflow.
            </p>
          </div>
          <div className="px-4 py-3">
            <h4 className="font-medium text-gray-600 dark:text-gray-400">Error Handler Node</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Defines error handling behavior for a workflow.
            </p>
          </div>
        </div>
      </div>
      
      <h2>Working with Nodes</h2>
      
      <h3>Adding Nodes</h3>
      
      <p>
        To add a node to your workflow:
      </p>
      
      <ol>
        <li>Click the "+" button in the Workflow Builder toolbar</li>
        <li>Select the node type you want to add</li>
        <li>Click in the workflow canvas where you want to place the node</li>
      </ol>
      
      <h3>Configuring Nodes</h3>
      
      <p>
        Each node has specific properties that can be configured:
      </p>
      
      <ol>
        <li>Click on a node in the workflow canvas to select it</li>
        <li>The node properties panel will appear on the right</li>
        <li>Configure the node's properties according to your needs</li>
      </ol>
      
      <h3>Connecting Nodes</h3>
      
      <p>
        To connect nodes and create data flow:
      </p>
      
      <ol>
        <li>Hover over the output port of the source node</li>
        <li>Click and drag to the input port of the target node</li>
        <li>Release to create the connection</li>
      </ol>
      
      <h2>Next Steps</h2>
      
      <p>
        Now that you understand the different node types, you can explore:
      </p>
      
      <ul>
        <li><a href="/docs/advanced-workflows" className="text-blue-600 hover:underline">Advanced Workflows</a> - Learn advanced techniques for complex data processing</li>
        <li><a href="/docs/workflow-examples" className="text-blue-600 hover:underline">Workflow Examples</a> - See examples of common workflow patterns</li>
        <li><a href="/docs/custom-nodes" className="text-blue-600 hover:underline">Custom Nodes</a> - Create your own custom node types</li>
      </ul>
    </article>
  );
};

export default NodeTypes;
