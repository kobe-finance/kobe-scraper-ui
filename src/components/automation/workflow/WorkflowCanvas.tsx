import React, { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

interface Node {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  connections: string[];
}

interface WorkflowCanvasProps {
  nodes?: Node[];
  onChange?: (nodes: Node[]) => void;
  onNodeSelect?: (nodeId: string) => void;
}

/**
 * WorkflowCanvas component for visualizing and editing workflow nodes
 */
const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes: initialNodes = [],
  onChange,
  onNodeSelect
}) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Update nodes when prop changes
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange && nodes.length > 0) {
      onChange(nodes);
    }
  }, [nodes, onChange]);

  const handleNodeMove = (id: string, position: { x: number; y: number }) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, position } : node
    ));
  };

  const handleNodeSelect = (id: string) => {
    if (onNodeSelect) {
      onNodeSelect(id);
    }
  };

  const handleConnect = (from: string, to: string) => {
    if (from === to) return;
    
    setNodes(nodes.map(node => {
      if (node.id === from && !node.connections.includes(to)) {
        return { ...node, connections: [...node.connections, to] };
      }
      return node;
    }));
    
    setConnecting(null);
  };

  // Render connection lines between nodes
  const renderConnections = () => {
    return nodes.flatMap(node => 
      node.connections.map(targetId => {
        const target = nodes.find(n => n.id === targetId);
        if (!target) return null;
        
        const startX = node.position.x + 150; // node width
        const startY = node.position.y + 50; // node height/2
        const endX = target.position.x;
        const endY = target.position.y + 50; // node height/2
        
        return (
          <svg 
            key={`${node.id}-${targetId}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            <path
              d={`M${startX},${startY} C${startX + 100},${startY} ${endX - 100},${endY} ${endX},${endY}`}
              stroke="#4B5563"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
              </marker>
            </defs>
          </svg>
        );
      })
    ).filter(Boolean);
  };

  // Node component
  const WorkflowNode: React.FC<{ node: Node }> = ({ node }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'NODE',
      item: { id: node.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
    
    const handleMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleNodeSelect(node.id);
    };
    
    const typeColors = {
      scraper: 'bg-blue-100 border-blue-500',
      processor: 'bg-green-100 border-green-500',
      exporter: 'bg-purple-100 border-purple-500',
      default: 'bg-gray-100 border-gray-500'
    };
    
    const colorClass = typeColors[node.type as keyof typeof typeColors] || typeColors.default;
    
    return (
      <div
        ref={drag}
        className={`absolute rounded-lg border-2 p-4 shadow-md cursor-move ${colorClass} ${
          isDragging ? 'opacity-50' : 'opacity-100'
        }`}
        style={{
          left: node.position.x,
          top: node.position.y,
          width: 150,
          zIndex: 10
        }}
        onClick={handleMouseDown}
      >
        <div className="font-medium text-gray-900">{node.name}</div>
        <div className="text-xs text-gray-500">{node.type}</div>
        
        <div 
          className="absolute -right-3 top-1/2 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setConnecting(node.id);
          }}
        >
          <span className="text-xs">→</span>
        </div>
      </div>
    );
  };

  const [, drop] = useDrop(() => ({
    accept: 'NODE',
    drop: (item: { id: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const node = nodes.find(n => n.id === item.id);
      
      if (delta && node) {
        const x = Math.round(node.position.x + delta.x);
        const y = Math.round(node.position.y + delta.y);
        handleNodeMove(item.id, { x, y });
      }
      
      if (connecting && connecting !== item.id) {
        handleConnect(connecting, item.id);
      }
    },
  }));
  
  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only handle clicks directly on the canvas (not on nodes)
    if (e.currentTarget === e.target) {
      setConnecting(null);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 relative overflow-hidden" style={{ height: '600px' }}>
        <div className="absolute top-0 left-0 p-2 z-20 bg-white dark:bg-gray-800 rounded-br shadow-sm">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {connecting ? 'Select destination node to connect' : 'Drag nodes to reposition'}
          </span>
        </div>
        
        <div 
          ref={(node) => {
            canvasRef.current = node;
            drop(node);
          }}
          className="w-full h-full relative" 
          onClick={handleCanvasClick}
          style={{ 
            backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            overflow: 'auto'
          }}
        >
          {renderConnections()}
          
          {nodes.map(node => (
            <WorkflowNode key={node.id} node={node} />
          ))}
          
          {/* Static nodes for demonstration */}
          {nodes.length === 0 && (
            <>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-center">
                <p>No workflow nodes yet</p>
                <p className="text-sm mt-2">Create nodes using the toolbar</p>
              </div>
            </>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default WorkflowCanvas;
