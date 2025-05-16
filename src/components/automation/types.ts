/**
 * Types for the automation and workflow builder system
 */

// Base node interface all workflow nodes inherit from
export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  description?: string;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, any>;
}

// Connection between nodes
export interface NodeConnection {
  id: string;
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string;
  label?: string;
  animated?: boolean;
  style?: Record<string, any>;
}

// Workflow definition
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  nodes: WorkflowNode[];
  connections: NodeConnection[];
}

// Types of nodes available in the workflow
export enum NodeType {
  TRIGGER = 'trigger',
  ACTION = 'action',
  CONDITION = 'condition',
  TRANSFORMATION = 'transformation',
  NOTIFICATION = 'notification',
  DELAY = 'delay',
  INPUT = 'input',
  OUTPUT = 'output'
}

// Specific node types
export interface TriggerNode extends WorkflowNode {
  type: NodeType.TRIGGER;
  data: {
    triggerType: 'schedule' | 'webhook' | 'event' | 'manual';
    configuration: Record<string, any>;
    onNodeChange?: (nodeId: string, updates: Record<string, any>) => void;
  };
}

export interface ActionNode extends WorkflowNode {
  type: NodeType.ACTION;
  data: {
    actionType: 'scrape' | 'extract' | 'download' | 'copy' | 'transform' | string;
    configuration: Record<string, any>;
    onNodeChange?: (nodeId: string, updates: Record<string, any>) => void;
  };
}

export interface ConditionNode extends WorkflowNode {
  type: NodeType.CONDITION;
  data: {
    condition: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'exists' | 'notExists' | 'empty' | 'notEmpty' | 'greaterThan' | 'lessThan' | 'custom' | string;
    expression: string;
    parameters: Record<string, any>;
    onNodeChange?: (nodeId: string, updates: Record<string, any>) => void;
  };
}

export interface TransformationNode extends WorkflowNode {
  type: NodeType.TRANSFORMATION;
  data: {
    transformationType: 'map' | 'template' | 'filter' | 'sort' | 'format' | 'convert' | string;
    configuration: Record<string, any>;
    onNodeChange?: (nodeId: string, updates: Record<string, any>) => void;
  };
}

export interface NotificationNode extends WorkflowNode {
  type: NodeType.NOTIFICATION;
  data: {
    notificationType: 'email' | 'sms' | 'inApp' | 'webhook' | 'slack';
    configuration: Record<string, any>;
    onNodeChange?: (nodeId: string, updates: Record<string, any>) => void;
  };
}

export interface DelayNode extends WorkflowNode {
  type: NodeType.DELAY;
  data: {
    delayType: 'duration' | 'untilTime' | 'cron';
    configuration: Record<string, any>;
    onNodeChange?: (nodeId: string, updates: Record<string, any>) => void;
  };
}

// Workflow template
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  previewImageUrl?: string;
  workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>;
}

// Workflow execution
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt?: string;
  completedAt?: string;
  logs?: ExecutionLog[];
  result?: Record<string, any>;
  error?: {
    message: string;
    nodeId?: string;
    details?: any;
  };
}

export interface ExecutionLog {
  timestamp: string;
  nodeId: string;
  nodeName: string;
  status: 'started' | 'completed' | 'error';
  message: string;
  data?: any;
}
