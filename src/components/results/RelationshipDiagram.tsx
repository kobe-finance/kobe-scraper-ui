import React, { useState, useEffect, useRef } from 'react';
import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  CameraIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

export interface Node {
  id: string;
  label: string;
  type: string;
  size?: number;
  color?: string;
  image?: string;
  data?: any;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  weight?: number;
  color?: string;
  data?: any;
}

export interface RelationshipDiagramProps {
  nodes: Node[];
  edges: Edge[];
  className?: string;
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge) => void;
  showControls?: boolean;
  width?: number;
  height?: number;
  title?: string;
}

// Color palette for node types
const DEFAULT_COLORS: Record<string, string> = {
  // Entity types
  product: '#3b82f6',
  category: '#10b981',
  brand: '#6366f1',
  review: '#f59e0b',
  user: '#8b5cf6',
  post: '#ec4899',
  comment: '#14b8a6',
  image: '#06b6d4',
  document: '#f97316',
  location: '#84cc16',
  
  // Generic types
  default: '#9ca3af',
  group1: '#ef4444',
  group2: '#f59e0b',
  group3: '#10b981',
  group4: '#3b82f6',
  group5: '#8b5cf6',
};

// Helper function to generate SVG path for an edge
const generateEdgePath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  nodeSize: number
): string => {
  // Calculate direction vector
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Adjust start and end points to account for node size
  const startNodeRadius = nodeSize / 2;
  const endNodeRadius = nodeSize / 2;
  
  const adjustedStartX = startX + (dx / length) * startNodeRadius;
  const adjustedStartY = startY + (dy / length) * startNodeRadius;
  const adjustedEndX = endX - (dx / length) * endNodeRadius;
  const adjustedEndY = endY - (dy / length) * endNodeRadius;
  
  // Draw curved path
  const curveFactor = 0.2;
  const controlPointX = (adjustedStartX + adjustedEndX) / 2;
  const controlPointY = (adjustedStartY + adjustedEndY) / 2;
  
  // Calculate perpendicular vector for curve control point
  const perpX = -dy * curveFactor;
  const perpY = dx * curveFactor;
  
  return `M${adjustedStartX},${adjustedStartY} Q${controlPointX + perpX},${controlPointY + perpY} ${adjustedEndX},${adjustedEndY}`;
};

// Generates an arrow marker for directed edges
const ArrowMarker: React.FC<{ id: string; color: string }> = ({ id, color }) => (
  <marker
    id={id}
    viewBox="0 0 10 10"
    refX="5"
    refY="5"
    markerWidth="6"
    markerHeight="6"
    orient="auto-start-reverse"
  >
    <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
  </marker>
);

// Helper function to export the diagram as an SVG image
const exportAsSVG = (svgElement: SVGSVGElement | null, filename: string = 'relationship-diagram.svg') => {
  if (!svgElement) return;
  
  // Create a copy of the SVG element
  const svgCopy = svgElement.cloneNode(true) as SVGSVGElement;
  
  // Set white background and append to document
  svgCopy.setAttribute('background', 'white');
  
  // Convert to a data URL
  const svgData = new XMLSerializer().serializeToString(svgCopy);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  // Create download link
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Helper function to export the diagram as a PNG image
const exportAsPNG = (svgElement: SVGSVGElement | null, filename: string = 'relationship-diagram.png') => {
  if (!svgElement) return;
  
  // Create a copy of the SVG element
  const svgCopy = svgElement.cloneNode(true) as SVGSVGElement;
  
  // Set white background and append to document
  svgCopy.setAttribute('background', 'white');
  
  // Convert to a data URL
  const svgData = new XMLSerializer().serializeToString(svgCopy);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  // Create an Image element to draw on canvas
  const img = new Image();
  img.onload = () => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = svgElement.clientWidth * 2; // Higher resolution
    canvas.height = svgElement.clientHeight * 2;
    
    // Draw SVG on canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to PNG and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    }
  };
  img.src = url;
};

const RelationshipDiagram: React.FC<RelationshipDiagramProps> = ({
  nodes,
  edges,
  className = '',
  onNodeClick,
  onEdgeClick,
  showControls = true,
  width = 800,
  height = 600,
  title = 'Relationship Diagram',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number, y: number }>>({});
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [highlightConnections, setHighlightConnections] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [layoutType, setLayoutType] = useState<'force' | 'circular' | 'grid'>('force');
  const [showNodeTypes, setShowNodeTypes] = useState(true);
  
  // Initialize node positions with a force-directed layout
  useEffect(() => {
    const initializePositions = () => {
      const newPositions: Record<string, { x: number, y: number }> = { ...nodePositions };
      let changed = false;
      
      if (layoutType === 'force') {
        // Force-directed layout
        nodes.forEach((node, i) => {
          if (!newPositions[node.id]) {
            // Place nodes in a spiral pattern initially
            const angle = i * 0.5;
            const radius = 10 + i * 5;
            newPositions[node.id] = {
              x: width / 2 + Math.cos(angle) * radius,
              y: height / 2 + Math.sin(angle) * radius
            };
            changed = true;
          }
        });
      } else if (layoutType === 'circular') {
        // Circular layout
        nodes.forEach((node, i) => {
          const angle = (2 * Math.PI * i) / nodes.length;
          const radius = Math.min(width, height) * 0.35;
          newPositions[node.id] = {
            x: width / 2 + radius * Math.cos(angle),
            y: height / 2 + radius * Math.sin(angle)
          };
          changed = true;
        });
      } else if (layoutType === 'grid') {
        // Grid layout
        const cols = Math.ceil(Math.sqrt(nodes.length));
        const rows = Math.ceil(nodes.length / cols);
        const cellWidth = width / (cols + 1);
        const cellHeight = height / (rows + 1);
        
        nodes.forEach((node, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          newPositions[node.id] = {
            x: cellWidth * (col + 1),
            y: cellHeight * (row + 1)
          };
          changed = true;
        });
      }
      
      if (changed) {
        setNodePositions(newPositions);
      }
    };
    
    initializePositions();
    
    // Run simple force-directed algorithm to improve layout
    if (layoutType === 'force') {
      const runForceDirected = () => {
        const newPositions = { ...nodePositions };
        
        // Repulsive forces between all nodes
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const nodeA = nodes[i];
            const nodeB = nodes[j];
            
            const posA = newPositions[nodeA.id];
            const posB = newPositions[nodeB.id];
            
            if (posA && posB) {
              const dx = posB.x - posA.x;
              const dy = posB.y - posA.y;
              const distanceSquared = dx * dx + dy * dy;
              const distance = Math.sqrt(distanceSquared);
              
              // Avoid division by zero
              if (distance > 0) {
                // Repulsive force (inversely proportional to distance)
                const repulsiveForce = 2000 / distanceSquared;
                const forceX = dx / distance * repulsiveForce;
                const forceY = dy / distance * repulsiveForce;
                
                // Apply forces
                newPositions[nodeA.id] = {
                  x: posA.x - forceX,
                  y: posA.y - forceY
                };
                
                newPositions[nodeB.id] = {
                  x: posB.x + forceX,
                  y: posB.y + forceY
                };
              }
            }
          }
        }
        
        // Attractive forces along edges
        edges.forEach(edge => {
          const sourcePos = newPositions[edge.source];
          const targetPos = newPositions[edge.target];
          
          if (sourcePos && targetPos) {
            const dx = targetPos.x - sourcePos.x;
            const dy = targetPos.y - sourcePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Avoid division by zero
            if (distance > 0) {
              // Attractive force (proportional to distance)
              const attractiveForce = distance * 0.05;
              const forceX = dx / distance * attractiveForce;
              const forceY = dy / distance * attractiveForce;
              
              // Apply forces
              newPositions[edge.source] = {
                x: sourcePos.x + forceX,
                y: sourcePos.y + forceY
              };
              
              newPositions[edge.target] = {
                x: targetPos.x - forceX,
                y: targetPos.y - forceY
              };
            }
          }
        });
        
        // Keep nodes within bounds
        Object.keys(newPositions).forEach(nodeId => {
          newPositions[nodeId] = {
            x: Math.max(50, Math.min(width - 50, newPositions[nodeId].x)),
            y: Math.max(50, Math.min(height - 50, newPositions[nodeId].y))
          };
        });
        
        setNodePositions(newPositions);
      };
      
      // Run a few iterations of the algorithm
      const iterations = 20;
      let i = 0;
      
      const intervalId = setInterval(() => {
        if (i++ >= iterations) {
          clearInterval(intervalId);
        } else {
          runForceDirected();
        }
      }, 50);
      
      return () => clearInterval(intervalId);
    }
  }, [nodes, edges, layoutType, width, height]);
  
  // Handle node drag events
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggedNode(nodeId);
    setSelectedNode(nodeId);
  };
  
  // Handle SVG mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode) {
      // Calculate mouse position in SVG coordinates
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (svgRect) {
        const mouseX = (e.clientX - svgRect.left - pan.x) / zoom;
        const mouseY = (e.clientY - svgRect.top - pan.y) / zoom;
        
        setNodePositions(prev => ({
          ...prev,
          [draggedNode]: { x: mouseX, y: mouseY }
        }));
      }
    } else if (isDragging) {
      // Pan the diagram
      setPan({
        x: pan.x + (e.clientX - dragStart.x),
        y: pan.y + (e.clientY - dragStart.y)
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };
  
  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prevZoom => Math.max(0.1, Math.min(3, prevZoom + delta)));
  };
  
  // Reset view
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  
  // Get node color based on type
  const getNodeColor = (node: Node): string => {
    if (node.color) return node.color;
    
    return DEFAULT_COLORS[node.type] || DEFAULT_COLORS.default;
  };
  
  // Get node size
  const getNodeSize = (node: Node): number => {
    return node.size || 36;
  };
  
  // Check if an edge is connected to a node
  const isEdgeConnectedToNode = (edge: Edge, nodeId: string): boolean => {
    return edge.source === nodeId || edge.target === nodeId;
  };
  
  // Check if an edge should be highlighted
  const shouldHighlightEdge = (edge: Edge): boolean => {
    if (!highlightConnections || !selectedNode) return false;
    return isEdgeConnectedToNode(edge, selectedNode);
  };
  
  // Check if a node should be highlighted
  const shouldHighlightNode = (nodeId: string): boolean => {
    if (!highlightConnections || !selectedNode) return false;
    if (nodeId === selectedNode) return true;
    
    // Check if the node is connected to the selected node via an edge
    return edges.some(edge => 
      (edge.source === selectedNode && edge.target === nodeId) ||
      (edge.target === selectedNode && edge.source === nodeId)
    );
  };
  
  // Generate a unique marker ID for each edge color
  const getMarkerEndId = (color: string): string => {
    return `arrow-${color.replace('#', '')}`;
  };
  
  // Create a list of all unique edge colors for arrow markers
  const uniqueEdgeColors = new Set<string>();
  edges.forEach(edge => {
    const color = edge.color || '#9ca3af';
    uniqueEdgeColors.add(color);
  });
  
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="border-b px-4 py-3">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          
          {showControls && (
            <div className="flex items-center space-x-2">
              {/* Layout type selector */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    layoutType === 'force'
                      ? 'bg-white shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setLayoutType('force')}
                  title="Force-directed layout"
                >
                  Force
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    layoutType === 'circular'
                      ? 'bg-white shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setLayoutType('circular')}
                  title="Circular layout"
                >
                  Circle
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    layoutType === 'grid'
                      ? 'bg-white shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setLayoutType('grid')}
                  title="Grid layout"
                >
                  Grid
                </button>
              </div>
              
              {/* Options */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    highlightConnections
                      ? 'bg-white shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setHighlightConnections(!highlightConnections)}
                  title="Highlight connections"
                >
                  Highlight
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    showLabels
                      ? 'bg-white shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setShowLabels(!showLabels)}
                  title="Show labels"
                >
                  Labels
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    showNodeTypes
                      ? 'bg-white shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setShowNodeTypes(!showNodeTypes)}
                  title="Show node types"
                >
                  Types
                </button>
              </div>
              
              {/* Zoom controls */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  className="p-1 rounded hover:bg-gray-200"
                  onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}
                  title="Zoom out"
                >
                  <MinusIcon className="h-3 w-3" />
                </button>
                <span className="text-xs px-1">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  className="p-1 rounded hover:bg-gray-200"
                  onClick={() => setZoom(z => Math.min(3, z + 0.1))}
                  title="Zoom in"
                >
                  <PlusIcon className="h-3 w-3" />
                </button>
                <button
                  className="p-1 rounded hover:bg-gray-200"
                  onClick={resetView}
                  title="Reset view"
                >
                  <ArrowPathIcon className="h-3 w-3" />
                </button>
              </div>
              
              {/* Export options */}
              <div className="flex space-x-1">
                <button
                  className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                  onClick={() => exportAsSVG(svgRef.current)}
                  title="Export as SVG"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
                <button
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                  onClick={() => exportAsPNG(svgRef.current)}
                >
                  Export PNG
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative overflow-hidden" style={{ height: `${height}px` }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Arrow markers for directed edges */}
          <defs>
            {[...uniqueEdgeColors].map(color => (
              <ArrowMarker key={color} id={getMarkerEndId(color)} color={color} />
            ))}
          </defs>
          
          {/* Edges */}
          {edges.map(edge => {
            const sourcePos = nodePositions[edge.source];
            const targetPos = nodePositions[edge.target];
            
            if (!sourcePos || !targetPos) return null;
            
            const isHighlighted = shouldHighlightEdge(edge);
            const isHovered = hoveredEdge === edge.id;
            const edgeColor = edge.color || '#9ca3af';
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return null;
            
            const path = generateEdgePath(
              sourcePos.x,
              sourcePos.y,
              targetPos.x,
              targetPos.y,
              Math.max(getNodeSize(sourceNode), getNodeSize(targetNode))
            );
            
            return (
              <g
                key={edge.id}
                className={`transition-opacity duration-200 ${
                  highlightConnections && selectedNode && !isHighlighted
                    ? 'opacity-20'
                    : 'opacity-100'
                }`}
                onMouseEnter={() => setHoveredEdge(edge.id)}
                onMouseLeave={() => setHoveredEdge(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdgeClick && onEdgeClick(edge);
                }}
                style={{ cursor: onEdgeClick ? 'pointer' : 'default' }}
              >
                <path
                  d={path}
                  stroke={edgeColor}
                  strokeWidth={isHovered ? 3 : isHighlighted ? 2 : 1.5}
                  fill="none"
                  markerEnd={`url(#${getMarkerEndId(edgeColor)})`}
                  strokeDasharray={edge.type === 'dashed' ? '5,5' : undefined}
                />
                
                {/* Edge label */}
                {showLabels && edge.label && (
                  <text
                    x={(sourcePos.x + targetPos.x) / 2}
                    y={(sourcePos.y + targetPos.y) / 2}
                    textAnchor="middle"
                    dy="-5"
                    fill="#374151"
                    fontSize="10"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    className="pointer-events-none select-none"
                  >
                    <textPath href={`#${edge.id}-path`} startOffset="50%">
                      {edge.label}
                    </textPath>
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Nodes */}
          {nodes.map(node => {
            const pos = nodePositions[node.id];
            if (!pos) return null;
            
            const isSelected = node.id === selectedNode;
            const isHighlighted = shouldHighlightNode(node.id);
            const isHovered = hoveredNode === node.id;
            const nodeColor = getNodeColor(node);
            const nodeSize = getNodeSize(node);
            
            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onNodeClick && onNodeClick(node);
                }}
                className={`transition-opacity duration-200 ${
                  highlightConnections && selectedNode && !isHighlighted
                    ? 'opacity-30'
                    : 'opacity-100'
                }`}
                style={{ cursor: 'move' }}
              >
                {/* Node circle */}
                <circle
                  r={nodeSize / 2}
                  fill={nodeColor}
                  opacity={0.8}
                  stroke={isSelected || isHovered ? '#000' : '#fff'}
                  strokeWidth={isSelected || isHovered ? 2 : 1}
                  className="transition-all duration-200"
                />
                
                {/* Label */}
                {showLabels && (
                  <text
                    y={nodeSize / 2 + 12}
                    textAnchor="middle"
                    fill="#374151"
                    fontSize={isHovered ? 12 : 11}
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    className="pointer-events-none select-none transition-all duration-200"
                  >
                    {node.label}
                  </text>
                )}
                
                {/* Type */}
                {showNodeTypes && (
                  <text
                    y={-nodeSize / 2 - 4}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="9"
                    className="pointer-events-none select-none opacity-70"
                  >
                    {node.type}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="border-t px-4 py-2 text-xs text-gray-500">
        {nodes.length} nodes • {edges.length} relationships • Double-click canvas to reset view
      </div>
    </div>
  );
};

export default RelationshipDiagram;
