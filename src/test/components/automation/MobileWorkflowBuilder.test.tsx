import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../utils/test-utils';
import { createConsistentSnapshot } from '../../utils/snapshot-utils';
import { checkAccessibility } from '../../utils/accessibility-utils';
import MobileWorkflowBuilder from '../../../components/automation/MobileWorkflowBuilder';
import { Workflow } from '../../../components/automation/types';

// Create a sample workflow for testing
const mockWorkflow: Workflow = {
  id: 'test-workflow-1',
  name: 'Test Workflow',
  nodes: [
    {
      id: 'node-1',
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: {
        triggerType: 'manual',
        configuration: {},
      }
    }
  ],
  connections: [],
  createdAt: '2025-05-01T00:00:00.000Z',
  updatedAt: '2025-05-10T00:00:00.000Z'
};

// Mock ReactFlow's useNodesState and useEdgesState hooks
vi.mock('reactflow', async () => {
  const actual = await vi.importActual('reactflow');
  return {
    ...actual,
    useNodesState: () => {
      const [nodes, setNodes] = React.useState(mockWorkflow.nodes);
      const onNodesChange = vi.fn();
      return [nodes, setNodes, onNodesChange];
    },
    useEdgesState: () => {
      const [edges, setEdges] = React.useState(mockWorkflow.connections);
      const onEdgesChange = vi.fn();
      return [edges, setEdges, onEdgesChange];
    }
  };
});

describe('MobileWorkflowBuilder', () => {
  // Mock handlers
  const onWorkflowChangeMock = vi.fn();
  const onSaveMock = vi.fn();
  
  beforeEach(() => {
    // Clear mocks before each test
    onWorkflowChangeMock.mockClear();
    onSaveMock.mockClear();
    
    // Resize window to mobile size for testing
    Object.defineProperty(window, 'innerWidth', { value: 390 });
    Object.defineProperty(window, 'innerHeight', { value: 844 });
    window.dispatchEvent(new Event('resize'));
  });
  
  it('renders correctly', async () => {
    // Render the component
    render(
      <MobileWorkflowBuilder 
        workflow={mockWorkflow}
        onWorkflowChange={onWorkflowChangeMock}
        onSave={onSaveMock}
      />
    );
    
    // Check if the ReactFlow component rendered
    expect(document.querySelector('.react-flow')).toBeInTheDocument();
  });
  
  it('opens node menu when add button is clicked', async () => {
    const user = userEvent.setup();
    
    // Render the component
    render(
      <MobileWorkflowBuilder 
        workflow={mockWorkflow}
        onWorkflowChange={onWorkflowChangeMock}
        onSave={onSaveMock}
      />
    );
    
    // Find and click the add button (has PlusIcon)
    const addButton = screen.getByLabelText('Add Node');
    await user.click(addButton);
    
    // Check if the node menu is visible
    expect(screen.getByText('Add Node')).toBeInTheDocument();
    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
  
  it('adds a new node when node type is selected', async () => {
    const user = userEvent.setup();
    
    // Render the component
    render(
      <MobileWorkflowBuilder 
        workflow={mockWorkflow}
        onWorkflowChange={onWorkflowChangeMock}
        onSave={onSaveMock}
      />
    );
    
    // Open the node menu
    await user.click(screen.getByLabelText('Add Node'));
    
    // Click on the Action node type
    await user.click(screen.getByText('Action'));
    
    // Check if onWorkflowChange was called with a new node
    await waitFor(() => {
      expect(onWorkflowChangeMock).toHaveBeenCalled();
      const updatedWorkflow = onWorkflowChangeMock.mock.calls[0][0];
      expect(updatedWorkflow.nodes.length).toBe(2);
      expect(updatedWorkflow.nodes[1].type).toBe('action');
    });
  });
  
  it('saves workflow when save button is clicked', async () => {
    const user = userEvent.setup();
    
    // Render the component
    render(
      <MobileWorkflowBuilder 
        workflow={mockWorkflow}
        onWorkflowChange={onWorkflowChangeMock}
        onSave={onSaveMock}
      />
    );
    
    // Find and click the save button
    const saveButton = screen.getByLabelText('Save Workflow');
    await user.click(saveButton);
    
    // Check if onSave was called with the workflow
    expect(onSaveMock).toHaveBeenCalledWith({
      ...mockWorkflow,
      nodes: expect.any(Array),
      connections: expect.any(Array),
      updatedAt: expect.any(String)
    });
  });
  
  // Snapshot test with mock data
  it('matches snapshot', () => {
    createConsistentSnapshot(
      <MobileWorkflowBuilder 
        workflow={mockWorkflow}
        onWorkflowChange={onWorkflowChangeMock}
        onSave={onSaveMock}
      />
    );
  });
  
  // Accessibility test
  it('is accessible', async () => {
    const { container } = render(
      <MobileWorkflowBuilder 
        workflow={mockWorkflow}
        onWorkflowChange={onWorkflowChangeMock}
        onSave={onSaveMock}
      />
    );
    
    await checkAccessibility({ container });
  });
});
