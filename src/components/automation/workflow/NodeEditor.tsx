import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface NodeEditorProps {
  onSave?: (node: any) => void;
  onCancel?: () => void;
  nodeId?: string;
}

/**
 * Node Editor component for workflow builder
 * Allows creating and editing workflow nodes
 */
const NodeEditor: React.FC<NodeEditorProps> = ({ onSave, onCancel, nodeId }) => {
  const [node, setNode] = useState<any>({
    id: '',
    type: 'scraper',
    name: '',
    config: {}
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useParams();
  
  // If nodeId is provided via props or URL param, load the node data
  useEffect(() => {
    const id = nodeId || params.nodeId;
    if (id) {
      setIsLoading(true);
      // Simulated node data fetch
      setTimeout(() => {
        setNode({
          id,
          type: 'scraper',
          name: `Node ${id}`,
          config: {
            url: 'https://example.com',
            selectors: ['.example-class']
          }
        });
        setIsLoading(false);
      }, 500);
    }
  }, [nodeId, params.nodeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNode({
        ...node,
        [parent]: {
          ...node[parent],
          [child]: value
        }
      });
    } else {
      setNode({
        ...node,
        [name]: value
      });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(node);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">{node.id ? 'Edit Node' : 'Create Node'}</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Node Type
          </label>
          <select
            name="type"
            value={node.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            <option value="scraper">Scraper</option>
            <option value="processor">Data Processor</option>
            <option value="exporter">Data Exporter</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Node Name
          </label>
          <input
            type="text"
            name="name"
            value={node.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            placeholder="Enter node name"
          />
        </div>
        
        {node.type === 'scraper' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target URL
            </label>
            <input
              type="text"
              name="config.url"
              value={node.config.url || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              placeholder="https://example.com"
            />
          </div>
        )}
      </div>
      
      <div className="mt-6 flex space-x-3">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
        >
          Save Node
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NodeEditor;
