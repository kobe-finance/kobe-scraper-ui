# Kobe Scraper UI API Architecture

This document provides an overview of the API architecture used in the Kobe Scraper UI application. The architecture follows domain-driven design principles and provides a gradual migration path from legacy code to a more modern, maintainable codebase.

## Architecture Overview

![API Architecture Diagram](./assets/api-architecture.png)

The Kobe Scraper UI API architecture is designed with the following key principles:

1. **Domain-Driven Design**: Business logic is organized around domain models that represent real-world entities like scrapers and jobs.
2. **Type Safety**: Comprehensive TypeScript types and runtime validation with Zod ensure data integrity.
3. **Separation of Concerns**: Clear boundaries between UI components, services, and data access layers.
4. **Backward Compatibility**: Adapter pattern to support gradual migration from legacy code.
5. **Testability**: Modular design that facilitates unit, integration, and end-to-end testing.

## Key Components

### 1. Domain Models

Located in `src/core/types/`, these are TypeScript interfaces representing the core business entities:

- `scraper.ts`: Defines scraper-related types like `Scraper`, `ScraperStatus`, and `SelectorType`.
- `job.ts`: Defines job-related types like `Job`, `JobStatus`, and `JobPriority`.
- `api.ts`: Defines common API types like `PaginatedResponse` and `ApiResponse`.

Example:
```typescript
export interface Job {
  id: string;
  name: string;
  description?: string;
  scraper_id: string;
  status: JobStatus;
  created_at: string;
  // ...other properties
}
```

### 2. Zod Schemas

Located in `src/core/schemas/`, these provide runtime validation for domain models:

- `scraper_schemas.ts`: Schemas for scraper-related data validation.
- `job_schemas.ts`: Schemas for job-related data validation.

Example:
```typescript
export const job_schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  scraper_id: z.string(),
  status: z.nativeEnum(JobStatus),
  // ...other validations
});
```

### 3. Error Handling

Located in `src/core/errors/`, the error system provides:

- Custom error classes for different types of errors
- Consistent error formatting and handling
- Error propagation from API to UI

Example:
```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### 4. HTTP Client

Located in `src/services/http/`, provides a type-safe abstraction over Axios:

- Automatic error handling and translation
- Logging and monitoring capabilities
- Consistent request formatting

### 5. Service Layer

Located in `src/services/api/`, provides domain-specific functionality:

- `scraper_service.ts`: Methods for scraper management
- `job_service.ts`: Methods for job management
- Each service validates inputs/outputs with Zod schemas

Example:
```typescript
export class JobService extends BaseApiService {
  async create_job(data: CreateJobRequest): Promise<Job> {
    // Validate request
    const validated_data = this.validate<CreateJobRequest>(data, create_job_schema);
    // Make API call
    const response = await this.post<Job>('/jobs', validated_data);
    // Validate response
    return this.validate<Job>(response, job_schema);
  }
}
```

### 6. Adapter Layer

Located in `src/services/adapters/`, provides backward compatibility:

- `scraper_adapter.ts`: Adapters for scraper-related operations
- `job_adapter.ts`: Adapters for job-related operations
- Maps between legacy and modern data structures

Example:
```typescript
export async function create_job_adapter(data: job_create_request): Promise<Job> {
  if (use_new_api_layer()) {
    const mapped_request = map_create_request(data);
    return await job_service.create_job(mapped_request);
  } else {
    // Use legacy implementation
    // ...
  }
}
```

### 7. Configuration

Located in `src/core/config/`:

- Feature flags for toggling between implementations
- Environment-specific settings
- Mock data configuration

Example:
```typescript
export const api_config = {
  use_new_api_layer: process.env.USE_NEW_API === 'true',
  use_mock_data: process.env.USE_MOCK_DATA === 'true',
  // ...
};
```

### 8. React Integration

Located in `src/hooks/`:

- `useApi.tsx`: React hook for accessing API services
- Manages loading states and error handling
- Provides consistent interface for components

## Data Flow

1. **UI Component** -> React component calls the `useApi` hook to access API functionality
2. **useApi Hook** -> Manages loading state, error handling, and service access
3. **API Service Layer** -> Validate inputs, make HTTP requests, validate responses
4. **HTTP Client** -> Make actual API requests with error handling and logging
5. **Backend API** -> External API or mock data provider

## Backward Compatibility

The architecture supports a gradual migration path:

1. **Legacy Path**: UI Component -> `useApi` hook -> Adapter Layer -> Legacy Client -> Backend API
2. **Modern Path**: UI Component -> `useApi` hook -> Service Layer -> HTTP Client -> Backend API

The active path is determined by the `use_new_api_layer` feature flag in `api_config`.

## Testing Strategy

1. **Unit Tests**: Test individual functions and classes in isolation
   - Service methods
   - Adapter functions
   - Validation logic
   
2. **Integration Tests**: Test interactions between components
   - Form to service flow
   - API hook behavior
   
3. **End-to-End Tests**: Test complete user workflows
   - UI interactions triggering API calls
   - Response handling and state updates

## Adding New Features

When adding new features to the API layer:

1. Define domain models in `src/core/types/`
2. Create Zod schemas in `src/core/schemas/`
3. Implement service methods in `src/services/api/`
4. Create adapter functions in `src/services/adapters/`
5. Expose functionality through `useApi` hook
6. Add comprehensive tests
