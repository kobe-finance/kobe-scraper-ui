import React from 'react';

const WorkflowBasics: React.FC = () => {
  return (
    <article className="prose prose-blue max-w-none dark:prose-invert">
      <h1>Workflow Basics</h1>
      
      <p>
        Kobe Scraper's Workflow Builder lets you create powerful data processing pipelines visually.
        This guide introduces the fundamental concepts and components of workflows.
      </p>
      
      <h2>What is a Workflow?</h2>
      
      <p>
        A workflow is a series of connected nodes that define how data should flow and be processed.
        Each node in a workflow performs a specific operation on the data, such as:
      </p>
      
      <ul>
        <li>Extracting data from a website</li>
        <li>Transforming data format</li>
        <li>Filtering records</li>
        <li>Enriching data with additional information</li>
        <li>Exporting results to different destinations</li>
      </ul>
      
      <div className="not-prose my-6">
        <img 
          src="/assets/doc-images/workflow-example.png" 
          alt="Example Workflow" 
          className="rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-3xl mx-auto"
        />
      </div>
      
      <h2>Workflow Components</h2>
      
      <h3>Nodes</h3>
      
      <p>
        Nodes are the building blocks of workflows. Each node represents a specific operation
        or data processing step. Nodes have inputs and outputs that allow them to connect with other nodes.
      </p>
      
      <h3>Connections</h3>
      
      <p>
        Connections define how data flows between nodes. They link the output of one node
        to the input of another, creating a pipeline for data to flow through.
      </p>
      
      <h3>Properties</h3>
      
      <p>
        Each node has properties that can be configured to control its behavior.
        Properties can be static values or dynamic expressions that reference data from previous nodes.
      </p>
      
      <h2>Basic Workflow Types</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Data Extraction Workflow</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Extracts data from websites using scrapers and transforms it into structured formats.
            Ideal for gathering information from multiple sources.
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">Data Transformation Workflow</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Processes existing data by cleaning, filtering, and reformatting it.
            Focuses on preparing data for analysis or integration.
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-2">Integration Workflow</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Connects multiple systems by extracting data from one source and importing it into another.
            Often includes mapping and transformation steps.
          </p>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <h3 className="font-bold text-orange-700 dark:text-orange-400 mb-2">Monitoring Workflow</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Regularly checks for changes in data sources and sends notifications when specific
            conditions are met. Useful for price monitoring and content tracking.
          </p>
        </div>
      </div>
      
      <h2>Creating Your First Workflow</h2>
      
      <ol>
        <li>
          <p><strong>Create a New Workflow</strong></p>
          <p>Go to the Workflows section and click "Create New Workflow". Give your workflow a name and description.</p>
        </li>
        <li>
          <p><strong>Add a Trigger Node</strong></p>
          <p>Every workflow starts with a trigger node. Add a "Manual Trigger" to start with a simple workflow that you'll run manually.</p>
        </li>
        <li>
          <p><strong>Add Processing Nodes</strong></p>
          <p>Add nodes for data processing steps, such as "Scraper", "Filter", or "Transform" nodes.</p>
        </li>
        <li>
          <p><strong>Connect the Nodes</strong></p>
          <p>Create connections between nodes by dragging from the output port of one node to the input port of another.</p>
        </li>
        <li>
          <p><strong>Configure Node Properties</strong></p>
          <p>Click on each node to configure its properties in the right panel.</p>
        </li>
        <li>
          <p><strong>Save and Test</strong></p>
          <p>Save your workflow and run a test to see if it works as expected.</p>
        </li>
      </ol>
      
      <h2>Best Practices</h2>
      
      <ul>
        <li><strong>Keep workflows modular</strong> - Break complex processes into smaller, more manageable workflows</li>
        <li><strong>Use descriptive names</strong> - Name nodes and workflows clearly to make them easier to understand</li>
        <li><strong>Add comments</strong> - Use comment nodes to explain complex parts of your workflow</li>
        <li><strong>Test incrementally</strong> - Test each part of the workflow as you build it</li>
        <li><strong>Monitor performance</strong> - Use the monitoring tools to identify bottlenecks</li>
      </ul>
      
      <h2>Next Steps</h2>
      
      <p>
        Now that you understand the basics of workflows, explore these related topics:
      </p>
      
      <ul>
        <li><a href="/docs/node-types" className="text-blue-600 hover:underline">Node Types</a> - Learn about the different types of nodes available</li>
        <li><a href="/docs/advanced-workflows" className="text-blue-600 hover:underline">Advanced Workflows</a> - Discover advanced techniques for complex workflows</li>
        <li><a href="/docs/schedule-types" className="text-blue-600 hover:underline">Schedule Types</a> - Learn how to automate workflow execution</li>
      </ul>
    </article>
  );
};

export default WorkflowBasics;
