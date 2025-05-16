# API Documentation

This document outlines the API endpoints and data models used by the Kobe Scraper UI application. The application uses a central `DataProvider` interface that can be implemented with either real API calls or mock data for testing.

## Data Models

### ScheduledJob

```typescript
interface ScheduledJob {
  id: string;
  name: string;
  description?: string;
  workflow: string; // ID of the workflow to execute
  schedule: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    time?: string; // HH:MM format
    day?: string; // For weekly schedule (Monday, Tuesday, etc.)
    dayOfMonth?: number; // For monthly schedule (1-31)
    cron?: string; // For custom schedules
  };
  status: 'active' | 'paused' | 'failed' | 'completed';
  lastRun?: string; // ISO date string
  nextRun?: string; // ISO date string
  created: string; // ISO date string
  updated: string; // ISO date string
}
```

### Workflow

```typescript
interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  connected: { sources: string[]; targets: string[] };
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: Array<{ id: string; source: string; target: string }>;
  created: string;
  updated: string;
}
```

## API Endpoints

The application uses a REST API with the following endpoints:

### Jobs API

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/api/jobs` | Get all scheduled jobs | - | `ScheduledJob[]` |
| GET | `/api/jobs/:id` | Get a specific job by ID | - | `ScheduledJob` |
| POST | `/api/jobs` | Create a new job | `Omit<ScheduledJob, 'id'>` | `ScheduledJob` |
| PUT | `/api/jobs/:id` | Update an existing job | `ScheduledJob` | `ScheduledJob` |
| DELETE | `/api/jobs/:id` | Delete a job | - | `{ success: boolean }` |
| POST | `/api/jobs/:id/run` | Manually run a job | - | `{ jobRunId: string }` |
| GET | `/api/jobs/:id/history` | Get job run history | - | `JobRunHistory[]` |

### Workflows API

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/api/workflows` | Get all workflows | - | `Workflow[]` |
| GET | `/api/workflows/:id` | Get a specific workflow | - | `Workflow` |
| POST | `/api/workflows` | Create a new workflow | `Omit<Workflow, 'id'>` | `Workflow` |
| PUT | `/api/workflows/:id` | Update a workflow | `Workflow` | `Workflow` |
| DELETE | `/api/workflows/:id` | Delete a workflow | - | `{ success: boolean }` |
| POST | `/api/workflows/:id/validate` | Validate a workflow | - | `{ valid: boolean; errors?: string[] }` |

## DataProvider Implementation

The application uses a `DataProvider` interface to abstract API calls, allowing for easy switching between real and mock data:

```typescript
export interface DataProvider {
  // Jobs
  getJobs(): Promise<ScheduledJob[]>;
  getJob(id: string): Promise<ScheduledJob>;
  createJob(job: Omit<ScheduledJob, 'id'>): Promise<ScheduledJob>;
  updateJob(job: ScheduledJob): Promise<ScheduledJob>;
  deleteJob(id: string): Promise<boolean>;
  runJob(id: string): Promise<{ jobRunId: string }>;
  getJobHistory(id: string): Promise<JobRunHistory[]>;
  
  // Workflows
  getWorkflows(): Promise<Workflow[]>;
  getWorkflow(id: string): Promise<Workflow>;
  saveWorkflow(workflow: Workflow): Promise<Workflow>;
  deleteWorkflow(id: string): Promise<boolean>;
  validateWorkflow(id: string): Promise<{ valid: boolean; errors?: string[] }>;
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error responses follow this format:

```json
{
  "error": true,
  "message": "Error message",
  "code": "ERROR_CODE",
  "details": {} // Optional additional details
}
```

## Authentication

API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer {token}
```

## Rate Limiting

API requests are rate-limited to 100 requests per minute per API key. Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1620000000
```
