import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  Node,
  NodeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Workflow } from './types';
import GestureHandler from '../common/GestureHandler';
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import TransformationNode from './nodes/TransformationNode';
import NotificationNode from './nodes/NotificationNode';
import DelayNode from './nodes/DelayNode';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline';

interface MobileWorkflowBuilderProps {
  workflow: Workflow;
  onWorkflowChange: (workflow: Workflow) => void;
  onSave: (workflow: Workflow) => void;
}

/**
 * Mobile-optimized workflow builder component
 * Features touch-friendly controls, larger tap targets, and gesture support
 */
const MobileWorkflowBuilder: React.FC<MobileWorkflowBuilderProps> = ({
  workflow,
  onWorkflowChange,
  onSave
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow.connections);
  const [nodeMenuOpen, setNodeMenuOpen] = useState(false);
  const [scale, setScale] = useState(0.8); // Start with a zoomed-out view for mobile
  
  // Define custom node types
  const nodeTypes: NodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
    condition: ConditionNode,
    transformation: TransformationNode,
    notification: NotificationNode,
    delay: DelayNode
  };

  // Handle connecting nodes
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // Update edges
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      
      // Update workflow with new connections
      const updatedWorkflow = {
        ...workflow,
        connections: newEdges
      };
      onWorkflowChange(updatedWorkflow);
    },
    [edges, workflow, onWorkflowChange, setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      // Highlight the selected node by setting all nodes' selected property
      const updatedNodes = nodes.map(n => ({
        ...n,
        selected: n.id === node.id
      }));
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  // Handle adding a new node
  const handleAddNode = (type: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      position: { x: 100, y: 100 + nodes.length * 100 }, // Stagger new nodes vertically
      data: {
        // Different initial data based on node type
        ...(type === 'trigger' && { 
          triggerType: 'manual',
          configuration: {},
          onNodeChange: handleNodeDataChange
        }),
        ...(type === 'action' && { 
          actionType: 'scrape',
          configuration: {},
          onNodeChange: handleNodeDataChange
        }),
        ...(type === 'condition' && { 
          condition: 'equals',
          expression: '',
          parameters: {},
          onNodeChange: handleNodeDataChange
        }),
        ...(type === 'transformation' && { 
          transformationType: 'map',
          configuration: {},
          onNodeChange: handleNodeDataChange
        }),
        ...(type === 'notification' && { 
          notificationType: 'email',
          configuration: {},
          onNodeChange: handleNodeDataChange
        }),
        ...(type === 'delay' && { 
          delayType: 'duration',
          configuration: {},
          onNodeChange: handleNodeDataChange
        }),
      }
    };
    
    // Add the new node
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    
    // Update workflow with new node
    const updatedWorkflow = {
      ...workflow,
      nodes: updatedNodes
    };
    onWorkflowChange(updatedWorkflow);
    
    // Close the node menu
    setNodeMenuOpen(false);
  };

  // Handle node data changes
  const handleNodeDataChange = (nodeId: string, updates: Record<string, any>) => {
    const updatedNodes = nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...updates
          }
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    
    // Update workflow with updated nodes
    const updatedWorkflow = {
      ...workflow,
      nodes: updatedNodes
    };
    onWorkflowChange(updatedWorkflow);
  };

  // Handle deleting a node
  const handleDeleteNode = (nodeId: string) => {
    // Remove the node
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    setNodes(updatedNodes);
    
    // Remove any edges connected to this node
    const updatedEdges = edges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    );
    setEdges(updatedEdges);
    
    // Update workflow
    const updatedWorkflow = {
      ...workflow,
      nodes: updatedNodes,
      connections: updatedEdges
    };
    onWorkflowChange(updatedWorkflow);
  };

  // Handle save workflow
  const handleSave = () => {
    const updatedWorkflow = {
      ...workflow,
      nodes,
      connections: edges,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedWorkflow);
  };

  // Handle zoom in/out using gestures
  const handlePinchToZoom = (scale: number) => {
    setScale(prevScale => {
      const newScale = prevScale * scale;
      return Math.min(Math.max(newScale, 0.1), 2); // Limit scale between 0.1 and 2
    });
  };

  // Node type options for the add menu
  const nodeTypeOptions = [
    { type: 'trigger', label: 'Trigger', color: 'bg-blue-500' },
    { type: 'action', label: 'Action', color: 'bg-green-500' },
    { type: 'condition', label: 'Condition', color: 'bg-amber-500' },
    { type: 'transformation', label: 'Transform', color: 'bg-green-500' },
    { type: 'notification', label: 'Notify', color: 'bg-blue-500' },
    { type: 'delay', label: 'Delay', color: 'bg-purple-500' }
  ];

  return (
    <div className="h-[70vh] md:h-[80vh] w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden relative">
      <GestureHandler 
        className="h-full w-full" 
        onSwipeLeft={() => setNodeMenuOpen(false)}
        onSwipeRight={() => setNodeMenuOpen(true)}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          minZoom={0.1}
          maxZoom={2}
          defaultZoom={scale}
        >
          <Background />
          <Controls 
            showInteractive={false} // Simplified controls for mobile
            className="!bottom-4 !right-4 !left-auto !top-auto" // Position in bottom right
          />
        </ReactFlow>
      </GestureHandler>

      {/* Mobile action buttons */}
      <div className="absolute bottom-16 right-4 flex flex-col space-y-2">
        <button
          type="button"
          onClick={() => setNodeMenuOpen(!nodeMenuOpen)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          aria-label="Add Node"
        >
          <PlusIcon className="h-8 w-8" aria-hidden="true" />
        </button>
        
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-green-600 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
          aria-label="Save Workflow"
        >
          <CheckIcon className="h-8 w-8" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile node selection menu with larger touch targets */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform ${
          nodeMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } z-20 overflow-y-auto`}
        aria-labelledby="node-menu-heading"
        tabIndex={0}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4">
          <h3 id="node-menu-heading" className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Add Node
          </h3>
          <div className="space-y-2">
            {nodeTypeOptions.map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => handleAddNode(option.type)}
                className="w-full flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                aria-label={`Add ${option.label} Node`}
              >
                <div className={`${option.color} w-8 h-8 rounded-md flex items-center justify-center mr-3`}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-900 dark:text-white font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected node actions */}
      {nodes.some(node => node.selected) && (
        <div className="absolute left-0 right-0 bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Node selected
            </span>
            <button
              type="button"
              onClick={() => {
                const selectedNode = nodes.find(node => node.selected);
                if (selectedNode) {
                  handleDeleteNode(selectedNode.id);
                }
              }}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
              aria-label="Delete Node"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileWorkflowBuilder;
