import React, { useState, useEffect, useRef } from 'react';
import { 
  DocumentIcon,
  DocumentTextIcon, 
  FolderIcon, 
  LinkIcon, 
  PhotoIcon, 
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface SiteNode {
  id: string;
  url: string;
  title?: string;
  type: 'page' | 'image' | 'document' | 'folder' | 'link';
  status?: 'crawled' | 'pending' | 'error';
  children?: SiteNode[];
  depth: number;
  parent?: string;
  metadata?: Record<string, any>;
}

interface SiteMapVisualizationProps {
  data: {
    nodes: SiteNode[];
    edges?: Array<{
      source: string;
      target: string;
      type?: string; 
    }>;
    baseUrl?: string;
  };
  onNodeClick?: (node: SiteNode) => void;
  maxDepth?: number;
  className?: string;
  expandAll?: boolean;
  showControls?: boolean;
}

const SiteMapVisualization: React.FC<SiteMapVisualizationProps> = ({
  data,
  onNodeClick,
  maxDepth = 5,
  className = '',
  expandAll = false,
  showControls = true,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [filteredNodes, setFilteredNodes] = useState<SiteNode[]>([]);
  const [zoom, setZoom] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewType, setViewType] = useState<'tree' | 'graph'>('tree');
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number, y: number }>>({});

  // Process data for visualization
  useEffect(() => {
    if (!data || !data.nodes) {
      setFilteredNodes([]);
      return;
    }

    // Apply search filter
    let processed = [...data.nodes];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      processed = processed.filter(
        node => 
          node.url.toLowerCase().includes(term) || 
          (node.title && node.title.toLowerCase().includes(term))
      );
    }

    // Apply depth filter
    processed = processed.filter(node => node.depth <= maxDepth);

    // Sort by parent/child relationships
    processed.sort((a, b) => {
      // Sort by parent first
      if (a.parent !== b.parent) {
        return (a.parent || '').localeCompare(b.parent || '');
      }
      // Then by depth
      if (a.depth !== b.depth) {
        return a.depth - b.depth;
      }
      // Then by URL
      return a.url.localeCompare(b.url);
    });

    setFilteredNodes(processed);

    // Set initial expanded nodes based on expandAll prop
    if (expandAll) {
      const rootNodes = processed.filter(node => !node.parent || node.depth === 0);
      const initialExpandedNodes = new Set<string>();
      
      rootNodes.forEach(node => {
        initialExpandedNodes.add(node.id);
      });
      
      setExpandedNodes(initialExpandedNodes);
    }
  }, [data, searchTerm, maxDepth, expandAll]);

  // Toggle expand/collapse for a node
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Handle node click
  const handleNodeClick = (node: SiteNode) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  };

  // Expand all nodes
  const handleExpandAll = () => {
    const allIds = new Set(filteredNodes.map(node => node.id));
    setExpandedNodes(allIds);
  };

  // Collapse all nodes
  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Get node icon based on type
  const getNodeIcon = (node: SiteNode) => {
    switch (node.type) {
      case 'page':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <PhotoIcon className="h-5 w-5 text-green-500" />;
      case 'document':
        return <DocumentIcon className="h-5 w-5 text-amber-500" />;
      case 'folder':
        return <FolderIcon className="h-5 w-5 text-yellow-500" />;
      case 'link':
        return <LinkIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Check if a node has children
  const hasChildren = (nodeId: string) => {
    return filteredNodes.some(node => node.parent === nodeId);
  };

  // Get URL display format
  const getDisplayUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname || urlObj.host;
    } catch (e) {
      return url;
    }
  };

  // Reset zoom
  const resetZoom = () => {
    setZoom(1);
  };

  // Render tree view
  const renderTreeView = () => {
    // Build tree structure
    const tree: Record<string, { node: SiteNode; children: string[] }> = {};
    const rootNodes: string[] = [];

    filteredNodes.forEach(node => {
      tree[node.id] = { node, children: [] };
      
      if (!node.parent || node.depth === 0) {
        rootNodes.push(node.id);
      }
    });

    filteredNodes.forEach(node => {
      if (node.parent && tree[node.parent]) {
        tree[node.parent].children.push(node.id);
      }
    });

    // Recursive function to render node and its children
    const renderNode = (nodeId: string, depth: number = 0) => {
      const { node, children } = tree[nodeId];
      const isExpanded = expandedNodes.has(nodeId);
      const hasNodeChildren = children.length > 0;

      return (
        <div key={nodeId} className="ml-4" style={{ marginLeft: `${depth * 20}px` }}>
          <div
            className={`flex items-center py-1 px-2 rounded-md hover:bg-gray-100 ${
              hasNodeChildren ? 'cursor-pointer' : ''
            }`}
            onClick={() => {
              if (hasNodeChildren) {
                toggleNode(nodeId);
              }
            }}
          >
            {hasNodeChildren ? (
              <button className="mr-1 focus:outline-none">
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-4 ml-4" />
            )}
            
            <div 
              className="flex items-center flex-grow truncate" 
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(node);
              }}
            >
              <span className="mr-2">{getNodeIcon(node)}</span>
              <span className="truncate text-sm" title={node.title || node.url}>
                {node.title || getDisplayUrl(node.url)}
              </span>
              {node.status === 'error' && (
                <span className="ml-2 text-xs px-1 py-0.5 bg-red-100 text-red-800 rounded">
                  Error
                </span>
              )}
            </div>
          </div>

          {isExpanded && children.length > 0 && (
            <div className="ml-4">
              {children.map(childId => renderNode(childId, depth + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="overflow-auto max-h-[600px] p-2" style={{ transform: `scale(${zoom})` }}>
        {rootNodes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No data available</div>
        ) : (
          rootNodes.map(nodeId => renderNode(nodeId))
        )}
      </div>
    );
  };

  // Handle node drag start
  const handleDragStart = (e: React.MouseEvent, nodeId: string) => {
    if (viewType !== 'graph') return;
    
    setDraggedNode(nodeId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Handle node drag
  const handleDrag = (e: React.MouseEvent) => {
    if (!draggedNode || viewType !== 'graph') return;
    
    e.preventDefault();
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;
    
    const x = (e.clientX - svgRect.left - dragOffset.x) / zoom;
    const y = (e.clientY - svgRect.top - dragOffset.y) / zoom;
    
    setNodePositions(prev => ({
      ...prev,
      [draggedNode]: { x, y }
    }));
  };

  // Handle node drag end
  const handleDragEnd = () => {
    setDraggedNode(null);
  };

  // Initialize node positions for graph view
  useEffect(() => {
    if (viewType === 'graph' && filteredNodes.length > 0) {
      // Only initialize positions if they don't exist
      if (Object.keys(nodePositions).length !== filteredNodes.length) {
        const newPositions: Record<string, { x: number, y: number }> = {};
        
        // Simple force-directed layout positioning
        filteredNodes.forEach((node, index) => {
          if (!nodePositions[node.id]) {
            const radius = 200;
            const angle = (2 * Math.PI * index) / filteredNodes.length;
            newPositions[node.id] = {
              x: 400 + radius * Math.cos(angle),
              y: 300 + radius * Math.sin(angle)
            };
          } else {
            newPositions[node.id] = nodePositions[node.id];
          }
        });
        
        setNodePositions(newPositions);
      }
    }
  }, [viewType, filteredNodes, nodePositions]);

  // Render graph view
  const renderGraphView = () => {
    if (filteredNodes.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">No data available</div>
      );
    }

    // Create edges
    let edges: Array<{ source: string; target: string; type?: string }> = [];
    
    if (data.edges) {
      // Use provided edges
      edges = data.edges.filter(
        edge => 
          filteredNodes.some(node => node.id === edge.source) && 
          filteredNodes.some(node => node.id === edge.target)
      );
    } else {
      // Create edges from parent-child relationships
      filteredNodes.forEach(node => {
        if (node.parent && filteredNodes.some(n => n.id === node.parent)) {
          edges.push({
            source: node.parent,
            target: node.id,
            type: 'parent-child'
          });
        }
      });
    }

    return (
      <div 
        className="relative overflow-auto" 
        style={{ height: '600px' }}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          {/* Graph edges */}
          {edges.map((edge, index) => {
            const sourcePos = nodePositions[edge.source] || { x: 0, y: 0 };
            const targetPos = nodePositions[edge.target] || { x: 0, y: 0 };
            
            return (
              <line
                key={`edge-${index}`}
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke="#9ca3af"
                strokeWidth="1"
                strokeDasharray={edge.type === 'parent-child' ? undefined : '5,5'}
              />
            );
          })}
          
          {/* Graph nodes */}
          {filteredNodes.map(node => {
            const position = nodePositions[node.id] || { x: 0, y: 0 };
            const nodeType = node.type || 'page';
            
            // Different colors based on node type
            const colors: Record<string, string> = {
              page: '#3b82f6',
              image: '#10b981',
              document: '#f59e0b',
              folder: '#f59e0b',
              link: '#8b5cf6'
            };
            
            return (
              <g
                key={`node-${node.id}`}
                transform={`translate(${position.x}, ${position.y})`}
                onMouseDown={(e) => handleDragStart(e, node.id)}
                style={{ cursor: 'move' }}
                onClick={() => handleNodeClick(node)}
              >
                <circle
                  r="20"
                  fill={colors[nodeType] || '#9ca3af'}
                  opacity="0.7"
                  stroke="#fff"
                  strokeWidth="2"
                />
                
                {/* Icon in center */}
                <foreignObject
                  x="-10"
                  y="-10"
                  width="20"
                  height="20"
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="flex items-center justify-center h-full w-full text-white">
                    {node.type === 'page' && <DocumentTextIcon className="h-4 w-4" />}
                    {node.type === 'image' && <PhotoIcon className="h-4 w-4" />}
                    {node.type === 'document' && <DocumentIcon className="h-4 w-4" />}
                    {node.type === 'folder' && <FolderIcon className="h-4 w-4" />}
                    {node.type === 'link' && <LinkIcon className="h-4 w-4" />}
                  </div>
                </foreignObject>
                
                {/* Label below */}
                <text
                  y="35"
                  textAnchor="middle"
                  fill="#4b5563"
                  fontSize="10"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.title ? 
                    (node.title.length > 20 ? `${node.title.substring(0, 18)}...` : node.title) :
                    getDisplayUrl(node.url).substring(0, 20)
                  }
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="border-b px-4 py-3">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h3 className="text-lg font-medium text-gray-800">Site Map</h3>
          
          {showControls && (
            <div className="flex items-center space-x-2">
              {/* View type toggle */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewType === 'tree'
                      ? 'bg-white shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setViewType('tree')}
                >
                  Tree
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewType === 'graph'
                      ? 'bg-white shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setViewType('graph')}
                >
                  Graph
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded-md py-1 px-3 text-sm w-40 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Zoom controls */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  className="p-1 rounded hover:bg-gray-200"
                  onClick={() => setZoom(zoom => Math.max(0.5, zoom - 0.1))}
                  title="Zoom out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <button
                  className="p-1 rounded hover:bg-gray-200"
                  onClick={resetZoom}
                  title="Reset zoom"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </button>
                <button
                  className="p-1 rounded hover:bg-gray-200"
                  onClick={() => setZoom(zoom => Math.min(2, zoom + 0.1))}
                  title="Zoom in"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              {viewType === 'tree' && (
                <div className="space-x-2">
                  <button
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                    onClick={handleExpandAll}
                  >
                    Expand All
                  </button>
                  <button
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                    onClick={handleCollapseAll}
                  >
                    Collapse All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-2">
        {viewType === 'tree' ? renderTreeView() : renderGraphView()}
      </div>
      
      <div className="border-t px-4 py-2 text-xs text-gray-500">
        {filteredNodes.length} nodes • Max depth: {maxDepth}
        {data.baseUrl && <span> • Base URL: {data.baseUrl}</span>}
      </div>
    </div>
  );
};

export default SiteMapVisualization;
