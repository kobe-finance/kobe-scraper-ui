import { rest } from 'msw';
import { testConfig } from '../../config/testConfig';
import jobsData from '../fixtures/scheduler/jobs.json';
import workflowsData from '../fixtures/scheduler/workflows.json';

/**
 * API route handlers for MSW
 * These intercept network requests during tests and return mock data
 * 
 * Following best practices:
 * - Mock data is kept in separate fixture files
 * - Handlers closely mimic real API behavior
 * - Status codes and error responses are realistic
 */
export const handlers = [
  // Jobs API endpoints
  rest.get(`${testConfig.apiBaseUrl}/jobs`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(jobsData)
    );
  }),
  
  rest.get(`${testConfig.apiBaseUrl}/jobs/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const job = jobsData.find(job => job.id === id);
    
    if (!job) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Job not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(job)
    );
  }),
  
  rest.post(`${testConfig.apiBaseUrl}/jobs`, async (req, res, ctx) => {
    const jobData = await req.json();
    
    // Validate required fields
    if (!jobData.name || !jobData.workflowId) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Missing required fields' })
      );
    }
    
    // Create new job with ID and timestamps
    const newJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return res(
      ctx.status(201),
      ctx.json(newJob)
    );
  }),
  
  rest.put(`${testConfig.apiBaseUrl}/jobs/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const jobData = await req.json();
    
    // Check if job exists
    if (!jobsData.some(job => job.id === id)) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Job not found' })
      );
    }
    
    // Update job
    const updatedJob = {
      ...jobData,
      updatedAt: new Date().toISOString()
    };
    
    return res(
      ctx.status(200),
      ctx.json(updatedJob)
    );
  }),
  
  rest.delete(`${testConfig.apiBaseUrl}/jobs/:id`, (req, res, ctx) => {
    const { id } = req.params;
    
    // Check if job exists
    if (!jobsData.some(job => job.id === id)) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Job not found' })
      );
    }
    
    return res(
      ctx.status(204)
    );
  }),
  
  // Job dependencies endpoints
  rest.get(`${testConfig.apiBaseUrl}/jobs/:id/dependencies`, (req, res, ctx) => {
    const { id } = req.params;
    const job = jobsData.find(job => job.id === id);
    
    if (!job) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Job not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(job.dependencies || [])
    );
  }),
  
  rest.put(`${testConfig.apiBaseUrl}/jobs/:id/dependencies`, async (req, res, ctx) => {
    const { id } = req.params;
    const dependencies = await req.json();
    
    // Check if job exists
    if (!jobsData.some(job => job.id === id)) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Job not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(dependencies)
    );
  }),
  
  // Job notifications endpoints
  rest.get(`${testConfig.apiBaseUrl}/jobs/:id/notifications`, (req, res, ctx) => {
    const { id } = req.params;
    const job = jobsData.find(job => job.id === id);
    
    if (!job) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Job not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(job.notifications || [])
    );
  }),
  
  rest.put(`${testConfig.apiBaseUrl}/jobs/:id/notifications`, async (req, res, ctx) => {
    const { id } = req.params;
    const notifications = await req.json();
    
    // Check if job exists
    if (!jobsData.some(job => job.id === id)) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Job not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(notifications)
    );
  }),
  
  // Workflows API endpoints
  rest.get(`${testConfig.apiBaseUrl}/workflows`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(workflowsData)
    );
  }),
  
  rest.get(`${testConfig.apiBaseUrl}/workflows/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const workflow = workflowsData.find(workflow => workflow.id === id);
    
    if (!workflow) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Workflow not found' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(workflow)
    );
  }),
  
  rest.post(`${testConfig.apiBaseUrl}/workflows`, async (req, res, ctx) => {
    const workflowData = await req.json();
    
    // Validate required fields
    if (!workflowData.name) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Missing required fields' })
      );
    }
    
    // Create new workflow with ID and timestamps
    const newWorkflow = {
      ...workflowData,
      id: `workflow-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return res(
      ctx.status(201),
      ctx.json(newWorkflow)
    );
  }),
  
  rest.put(`${testConfig.apiBaseUrl}/workflows/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const workflowData = await req.json();
    
    // Check if workflow exists
    if (!workflowsData.some(workflow => workflow.id === id)) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Workflow not found' })
      );
    }
    
    // Update workflow
    const updatedWorkflow = {
      ...workflowData,
      updatedAt: new Date().toISOString()
    };
    
    return res(
      ctx.status(200),
      ctx.json(updatedWorkflow)
    );
  }),
  
  rest.delete(`${testConfig.apiBaseUrl}/workflows/:id`, (req, res, ctx) => {
    const { id } = req.params;
    
    // Check if workflow exists
    if (!workflowsData.some(workflow => workflow.id === id)) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Workflow not found' })
      );
    }
    
    return res(
      ctx.status(204)
    );
  })
];
