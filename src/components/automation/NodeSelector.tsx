import React from 'react';
import {
  BoltIcon,
  PlayIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
  BellAlertIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { NodeType } from './types';

interface NodeSelectorProps {
  position: { x: number; y: number };
  onSelectNode: (nodeType: NodeType, nodeName: string) => void;
  onClose: () => void;
}

/**
 * Component for selecting different node types to add to the workflow
 * Appears at the clicked position on the canvas
 */
const NodeSelector: React.FC<NodeSelectorProps> = ({
  position,
  onSelectNode,
  onClose,
}) => {
  // Node definitions with metadata
  const nodeOptions = [
    {
      type: NodeType.TRIGGER,
      name: 'Trigger',
      description: 'Start a workflow on schedule or event',
      icon: <PlayIcon className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    },
    {
      type: NodeType.ACTION,
      name: 'Action',
      description: 'Perform a task or operation',
      icon: <BoltIcon className="h-5 w-5 text-purple-500" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
    },
    {
      type: NodeType.CONDITION,
      name: 'Condition',
      description: 'Branch based on a condition',
      icon: <QuestionMarkCircleIcon className="h-5 w-5 text-amber-500" />,
      color: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/30',
    },
    {
      type: NodeType.TRANSFORMATION,
      name: 'Transformation',
      description: 'Transform or map data',
      icon: <ArrowPathIcon className="h-5 w-5 text-green-500" />,
      color: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      hover: 'hover:bg-green-100 dark:hover:bg-green-900/30',
    },
    {
      type: NodeType.NOTIFICATION,
      name: 'Notification',
      description: 'Send notifications',
      icon: <BellAlertIcon className="h-5 w-5 text-red-500" />,
      color: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      hover: 'hover:bg-red-100 dark:hover:bg-red-900/30',
    },
    {
      type: NodeType.DELAY,
      name: 'Delay',
      description: 'Add a time delay',
      icon: <ClockIcon className="h-5 w-5 text-indigo-500" />,
      color: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-200 dark:border-indigo-800',
      hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30',
    },
  ];

  // Handle node selection
  const handleSelect = (nodeType: NodeType, nodeName: string) => {
    onSelectNode(nodeType, nodeName);
  };

  // Position the menu
  const style = {
    left: position.x,
    top: position.y,
  };

  return (
    <div
      className="absolute min-w-[220px] bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden dark:bg-gray-800 dark:border-gray-700"
      style={style}
    >
      <div className="p-2 flex justify-between items-center bg-gray-50 border-b border-gray-200 dark:bg-gray-750 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Add Node</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {nodeOptions.map((node) => (
          <div
            key={node.type}
            className={`p-3 cursor-pointer flex items-start ${node.hover}`}
            onClick={() => handleSelect(node.type, node.name)}
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow/type', node.type);
              event.dataTransfer.setData('application/reactflow/name', node.name);
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            <div className={`flex-shrink-0 rounded-md p-2 ${node.color} ${node.border}`}>
              {node.icon}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{node.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{node.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeSelector;
