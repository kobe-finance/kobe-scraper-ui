```mermaid
graph TD
    subgraph "UI Layer"
        UI[UI Components]
        ReactHooks[React Hooks]
    end
    
    subgraph "API Layer"
        APIHook[useApi Hook]
        FeatureFlags[Feature Flags]
        
        subgraph "Service Layer"
            ScraperService[Scraper Service]
            JobService[Job Service]
            BaseService[Base Service]
        end
        
        subgraph "Adapter Layer"
            ScraperAdapter[Scraper Adapter]
            JobAdapter[Job Adapter]
        end
        
        subgraph "HTTP Layer"
            HTTPClient[HTTP Client]
            ErrorHandling[Error Handling]
        end
    end
    
    subgraph "Validation Layer"
        TypeValidation[TypeScript Types]
        ZodValidation[Zod Schema Validation]
    end
    
    subgraph "External Services"
        Backend[Backend API]
        MockData[Mock Data]
    end
    
    %% Connections
    UI --> ReactHooks
    ReactHooks --> APIHook
    
    APIHook --> FeatureFlags
    FeatureFlags -- "new API layer" --> Service Layer
    FeatureFlags -- "legacy implementation" --> Adapter Layer
    
    ScraperService --> BaseService
    JobService --> BaseService
    BaseService --> HTTPClient
    BaseService --> ZodValidation
    
    ScraperAdapter --> HTTPClient
    JobAdapter --> HTTPClient
    
    ScraperAdapter -.-> ScraperService
    JobAdapter -.-> JobService
    
    HTTPClient -- "use_mock_data: false" --> Backend
    HTTPClient -- "use_mock_data: true" --> MockData
    
    HTTPClient --> ErrorHandling
    ErrorHandling --> APIHook
    
    ZodValidation --> TypeValidation

    %% Style
    classDef uiLayer fill:#d0e0ff,stroke:#333,stroke-width:1px
    classDef apiLayer fill:#ffe0b0,stroke:#333,stroke-width:1px
    classDef validationLayer fill:#d0ffb0,stroke:#333,stroke-width:1px
    classDef externalLayer fill:#ffb0b0,stroke:#333,stroke-width:1px
    
    class UI,ReactHooks uiLayer
    class APIHook,FeatureFlags,ScraperService,JobService,BaseService,ScraperAdapter,JobAdapter,HTTPClient,ErrorHandling apiLayer
    class TypeValidation,ZodValidation validationLayer
    class Backend,MockData externalLayer
```
