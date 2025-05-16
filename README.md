# Kobe Scraper UI

Kobe Scraper UI is a web-based application for creating, managing, and monitoring web scraping jobs. The application is built with React, TypeScript, and Vite, following domain-driven design principles for a maintainable and scalable codebase.

## Features

- **Scraper Management**: Create, view, update, and delete web scrapers
- **Job Management**: Create and monitor scraping jobs
- **Real-time Monitoring**: Track job progress and results
- **Scheduling**: Schedule scraping jobs to run at specified times
- **Data Export**: Export scraped data in various formats
- **Authentication & Authorization**: Secure access to scrapers and jobs

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm/yarn/pnpm for package management

### Installation

1. Clone the repository

```bash
git clone https://github.com/kobe-finance/kobe-scraper-ui.git
cd kobe-scraper-ui
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` to configure your environment

4. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Navigate to `http://localhost:5173` to view the application

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

## API Architecture

The Kobe Scraper UI follows a domain-driven design approach with a clear separation of concerns. The API architecture is designed to be type-safe, testable, and maintainable.

### Key Components

1. **Domain Models**: TypeScript interfaces representing business entities
2. **Zod Schemas**: Runtime validation of data structures
3. **Service Layer**: Domain-specific API operations
4. **Adapter Layer**: Compatibility with legacy API implementations
5. **React Integration**: Hooks for accessing API functionality

### Feature Flags

The application supports feature flags for toggling between different implementations:

- `USE_NEW_API`: Toggle between new API implementation and legacy code
- `USE_MOCK_DATA`: Toggle between real API calls and mock data

### Documentation

Detailed documentation is available in the `/docs` directory:

- [API Architecture](./docs/api/architecture.md): Detailed overview of the API design
- [Integration Guide](./docs/api/integration-guide.md): How to integrate with the API

## Integrating with the API

### Using the API Hook

The primary way to interact with the API is through the `useApi` hook:

```tsx
import { useApi } from '../hooks/useApi';

const MyComponent = () => {
  const { job, scraper, isLoading, error } = useApi();

  const handleCreateJob = async () => {
    try {
      const newJob = await job.createJob({
        name: 'My Scraper Job',
        scraper_id: 'scraper-123',
        // other job options
      });
      console.log('Created job:', newJob);
    } catch (err) {
      console.error('Failed to create job:', err);
    }
  };

  return (
    <div>
      {/* Component JSX */}
      <button onClick={handleCreateJob} disabled={isLoading}>
        Create Job
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};
```

### Available API Methods

#### Job API

- `createJob`: Create a new scraping job
- `listJobs`: List all jobs with optional filtering
- `getJob`: Get a job by ID
- `updateJob`: Update an existing job
- `deleteJob`: Delete a job
- `getJobResults`: Get results for a job
- `getJobStatus`: Get the current status of a job

#### Scraper API

- `createScraper`: Create a new scraper
- `listScrapers`: List all scrapers with optional filtering
- `getScraper`: Get a scraper by ID
- `updateScraper`: Update an existing scraper
- `deleteScraper`: Delete a scraper
- `runScraper`: Run a scraper immediately
- `previewExtraction`: Preview scraper results without creating a job

## Testing

The project includes comprehensive testing for API integration:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Test Structure

- Unit tests for services and adapters
- Integration tests for form-to-service flows
- End-to-end tests for complete user workflows

## Contributing

Contributions are welcome! Please see our [Contributing Guide](./CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
