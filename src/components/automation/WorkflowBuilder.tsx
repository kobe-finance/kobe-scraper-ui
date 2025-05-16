import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  PlusIcon, 
  ArrowPathIcon, 
  DocumentDuplicateIcon,
  TrashIcon,
  ArrowsPointingOutIcon,
  DocumentTextIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

import { Workflow, WorkflowNode, NodeConnection, NodeType } from './types';
import TriggerNodeComponent from './nodes/TriggerNode';
import ActionNodeComponent from './nodes/ActionNode';
import ConditionNodeComponent from './nodes/ConditionNode';
import TransformationNodeComponent from './nodes/TransformationNode';
import NotificationNodeComponent from './nodes/NotificationNode';
import DelayNodeComponent from './nodes/DelayNode';
import CustomEdge from './edges/CustomEdge';
import NodeSelector from './NodeSelector';
import WorkflowPropertiesPanel from './WorkflowPropertiesPanel';

// Define node types map for ReactFlow
const nodeTypes: NodeTypes = {
  [NodeType.TRIGGER]: TriggerNodeComponent,
  [NodeType.ACTION]: ActionNodeComponent,
  [NodeType.CONDITION]: ConditionNodeComponent,
  [NodeType.TRANSFORMATION]: TransformationNodeComponent,
  [NodeType.NOTIFICATION]: NotificationNodeComponent,
  [NodeType.DELAY]: DelayNodeComponent,
};

// Define edge types map for ReactFlow
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

interface WorkflowBuilderProps {
  workflow: Workflow;
  onWorkflowChange: (workflow: Workflow) => void;
  onSave: () => Promise<void>;
  onTest: (workflowId: string) => Promise<void>;
  onToggleActive: (workflowId: string, isActive: boolean) => Promise<void>;
  readonly?: boolean;
  className?: string;
}

/**
 * Visual workflow builder component for creating automation workflows
 * Allows users to add, connect, and configure nodes for automation
 */
const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow,
  onWorkflowChange,
  onSave,
  onTest,
  onToggleActive,
  readonly = false,
  className = '',
}) => {
  // Convert workflow model to ReactFlow nodes and edges
  const createNodesFromWorkflow = (workflow: Workflow): Node[] => {
    return workflow.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        ...node.data,
        name: node.name,
        description: node.description,
        onNodeChange: handleNodeDataChange,
      },
    }));
  };

  const createEdgesFromWorkflow = (workflow: Workflow): Edge[] => {
    return workflow.connections.map((connection) => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      label: connection.label,
      animated: connection.animated,
      style: connection.style,
      type: 'custom',
    }));
  };

  // State for the ReactFlow nodes and edges
  const [nodes, setNodes] = useState<Node[]>(createNodesFromWorkflow(workflow));
  const [edges, setEdges] = useState<Edge[]>(createEdgesFromWorkflow(workflow));
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [nodeSelectorPosition, setNodeSelectorPosition] = useState({ x: 0, y: 0 });
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Reference to the ReactFlow instance
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<any>(null);

  // Update nodes and edges when workflow changes
  useEffect(() => {
    setNodes(createNodesFromWorkflow(workflow));
    setEdges(createEdgesFromWorkflow(workflow));
  }, [workflow.id, workflow.updatedAt]);

  // Handle node changes
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // If in readonly mode, don't allow changes
      if (readonly) return;

      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);

      // Update workflow with new node positions
      const updatedWorkflow = {
        ...workflow,
        nodes: workflow.nodes.map((node) => {
          const updatedNode = updatedNodes.find((n) => n.id === node.id);
          if (updatedNode) {
            return {
              ...node,
              position: updatedNode.position,
            };
          }
          return node;
        }),
      };

      onWorkflowChange(updatedWorkflow);
    },
    [nodes, workflow, onWorkflowChange, readonly]
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // If in readonly mode, don't allow changes
      if (readonly) return;

      setEdges((eds) => applyEdgeChanges(changes, eds));

      // Remove connections when edges are removed
      const deletedEdges = changes.filter((change) => change.type === 'remove');
      if (deletedEdges.length > 0) {
        const updatedConnections = workflow.connections.filter(
          (connection) => !deletedEdges.some((change) => change.id === connection.id)
        );
        
        const updatedWorkflow = {
          ...workflow,
          connections: updatedConnections,
        };
        
        onWorkflowChange(updatedWorkflow);
      }
    },
    [edges, workflow, onWorkflowChange, readonly]
  );

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      // If in readonly mode, don't allow connections
      if (readonly) return;

      const newEdge = {
        ...connection,
        id: `e-${Date.now()}`,
        animated: false,
        type: 'custom',
      };
      
      setEdges((eds) => addEdge(newEdge, eds));

      // Add new connection to workflow
      const newConnection: NodeConnection = {
        id: newEdge.id,
        source: connection.source!,
        sourceHandle: connection.sourceHandle,
        target: connection.target!,
        targetHandle: connection.targetHandle,
      };
      
      const updatedWorkflow = {
        ...workflow,
        connections: [...workflow.connections, newConnection],
      };
      
      onWorkflowChange(updatedWorkflow);
    },
    [workflow, onWorkflowChange, readonly]
  );

  // Handle drag over event
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop event
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // If in readonly mode, don't allow drops
      if (readonly) return;

      if (reactFlowWrapper.current && reactFlowInstance.current) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const nodeType = event.dataTransfer.getData('application/reactflow/type') as NodeType;
        const nodeName = event.dataTransfer.getData('application/reactflow/name');
        
        if (!nodeType) {
          return;
        }

        const position = reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Create a new node
        const newNode: WorkflowNode = {
          id: `node-${Date.now()}`,
          type: nodeType,
          name: nodeName || `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}`,
          position,
          data: createDefaultNodeData(nodeType),
        };

        // Add new node to workflow
        const updatedWorkflow = {
          ...workflow,
          nodes: [...workflow.nodes, newNode],
        };
        
        onWorkflowChange(updatedWorkflow);
      }
    },
    [reactFlowInstance, workflow, onWorkflowChange, readonly]
  );

  // Create default node data based on node type
  const createDefaultNodeData = (nodeType: NodeType): Record<string, any> => {
    switch (nodeType) {
      case NodeType.TRIGGER:
        return {
          triggerType: 'manual',
          configuration: {},
        };
      case NodeType.ACTION:
        return {
          actionType: 'scrape',
          configuration: {},
        };
      case NodeType.CONDITION:
        return {
          condition: 'equals',
          expression: '',
          parameters: {},
        };
      case NodeType.TRANSFORMATION:
        return {
          transformationType: 'map',
          configuration: {},
        };
      case NodeType.NOTIFICATION:
        return {
          notificationType: 'email',
          template: '',
          recipients: [],
          configuration: {},
        };
      case NodeType.DELAY:
        return {
          delayType: 'fixed',
          duration: 5,
          timeUnit: 'minutes',
        };
      default:
        return {};
    }
  };

  // Handle node click
  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setShowPropertiesPanel(true);
  };

  // Handle background click
  const onPaneClick = () => {
    setShowNodeSelector(false);
    setSelectedNode(null);
    setShowPropertiesPanel(false);
  };

  // Handle right click to show node selector
  const onContextMenu = (event: React.MouseEvent) => {
    // If in readonly mode, don't show node selector
    if (readonly) return;

    event.preventDefault();
    
    if (reactFlowWrapper.current && reactFlowInstance.current) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      setNodeSelectorPosition(position);
      setShowNodeSelector(true);
    }
  };

  // Handle node data change
  const handleNodeDataChange = (nodeId: string, newData: any) => {
    // If in readonly mode, don't allow changes
    if (readonly) return;

    // Update node data in workflow
    const updatedWorkflow = {
      ...workflow,
      nodes: workflow.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            name: newData.name || node.name,
            description: newData.description,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      }),
    };
    
    onWorkflowChange(updatedWorkflow);
  };

  // Handle adding node from selector
  const handleAddNode = (nodeType: NodeType, nodeName: string) => {
    // If in readonly mode, don't allow adding nodes
    if (readonly) return;

    // Create a new node
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      name: nodeName,
      position: nodeSelectorPosition,
      data: createDefaultNodeData(nodeType),
    };

    // Add new node to workflow
    const updatedWorkflow = {
      ...workflow,
      nodes: [...workflow.nodes, newNode],
    };
    
    onWorkflowChange(updatedWorkflow);
    setShowNodeSelector(false);
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  // Handle toggle active
  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      await onToggleActive(workflow.id, !workflow.isActive);
    } finally {
      setIsToggling(false);
    }
  };

  // Handle test
  const handleTest = async () => {
    setIsTesting(true);
    try {
      await onTest(workflow.id);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{workflow.name}</h2>
          {workflow.isActive ? (
            <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Active
            </span>
          ) : (
            <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400">
              Inactive
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {!readonly && (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isSaving ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving
                  </>
                ) : (
                  <>Save</>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleToggleActive}
                disabled={isToggling}
                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                  workflow.isActive
                    ? 'text-white bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 dark:bg-amber-700 dark:hover:bg-amber-600'
                    : 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600'
                }`}
              >
                {isToggling ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Updating
                  </>
                ) : workflow.isActive ? (
                  <>
                    <PauseIcon className="-ml-1 mr-1.5 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <PlayIcon className="-ml-1 mr-1.5 h-4 w-4" />
                    Activate
                  </>
                )}
              </button>
            </>
          )}
          
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            {isTesting ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Testing
              </>
            ) : (
              <>
                <PlayIcon className="-ml-1 mr-1.5 h-4 w-4" />
                Test Run
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            title={isPanelOpen ? 'Hide panel' : 'Show panel'}
          >
            <DocumentTextIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={(instance) => {
                reactFlowInstance.current = instance;
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onContextMenu={onContextMenu}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              defaultEdgeOptions={{
                type: 'custom',
                animated: true,
              }}
              fitView
              snapToGrid
              snapGrid={[15, 15]}
              minZoom={0.1}
              maxZoom={1.5}
              deleteKeyCode={['Backspace', 'Delete']}
              multiSelectionKeyCode={['Control', 'Meta']}
              selectionKeyCode={['Shift']}
              attributionPosition="bottom-right"
              proOptions={{ hideAttribution: true }}
            >
              <Panel position="top-right">
                <Controls showInteractive={false} />
              </Panel>
              
              <Panel position="bottom-right">
                <MiniMap
                  nodeStrokeWidth={3}
                  zoomable
                  pannable
                  maskColor="rgba(240, 240, 240, 0.6)"
                  className="dark:bg-gray-750 dark:border-gray-700"
                />
              </Panel>
              
              <Background variant="dots" gap={12} size={1} color="#cccccc" />
              
              {showNodeSelector && (
                <NodeSelector
                  position={nodeSelectorPosition}
                  onSelectNode={handleAddNode}
                  onClose={() => setShowNodeSelector(false)}
                />
              )}
            </ReactFlow>
          </ReactFlowProvider>
        </div>
        
        {showPropertiesPanel && selectedNode && isPanelOpen && (
          <div className="w-72 border-l dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
            <WorkflowPropertiesPanel
              node={selectedNode}
              onClose={() => setShowPropertiesPanel(false)}
              onNodeChange={(newData) => handleNodeDataChange(selectedNode.id, newData)}
              readonly={readonly}
            />
          </div>
        )}
        
        {!showPropertiesPanel && isPanelOpen && (
          <div className="w-72 border-l dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Workflow Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <div className="mt-1 text-sm text-gray-900 dark:text-white">{workflow.name}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {workflow.description || 'No description'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(workflow.createdAt).toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(workflow.updatedAt).toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <div className="mt-1">
                    {workflow.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Components</label>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {workflow.nodes.length} nodes, {workflow.connections.length} connections
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;
