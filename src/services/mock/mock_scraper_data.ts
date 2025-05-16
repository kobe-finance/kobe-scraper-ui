/**
 * Mock Scraper Data
 * 
 * Provides mock responses for the Scraper API service
 * Used during development or when the backend API is not available
 */
import type { Scraper } from '../../core/types/scraper';
import { SelectorType, ProxyType, ScraperStatus, DataType } from '../../core/types/scraper';
import type { PaginatedResponse } from '../../core/types/api';
import type {
  ScraperPreviewRequest,
  ScraperPreviewResponse,
  CreateScraperRequest,
  UpdateScraperRequest,
  ListScrapersParams,
  RunScraperRequest,
  RunScraperResponse
} from '../../core/schemas/scraper_schemas';

// Sample scrapers for testing
const mock_scrapers: Scraper[] = [
  {
    id: '1',
    name: 'Product Scraper',
    description: 'Scrapes product details from e-commerce sites',
    url: 'https://example.com/products',
    selector: '.product-item',
    max_depth: 2,
    proxy_type: 'none',
    javascript_enabled: true,
    respect_robots_txt: true,
    creation_date: new Date().toISOString(),
    status: 'active',
    extraction_fields: [
      {
        name: 'title',
        selector: '.product-title',
        selector_type: SelectorType.CSS,
        data_type: DataType.STRING,
        required: true
      },
      {
        name: 'price',
        selector: '.product-price',
        selector_type: 'css',
        data_type: 'number'
      },
      {
        name: 'description',
        selector: '.product-description',
        selector_type: 'css'
      },
      {
        name: 'rating',
        selector: '.product-rating',
        selector_type: 'css',
        data_type: 'number'
      }
    ]
  },
  {
    id: '2',
    name: 'News Article Scraper',
    description: 'Extracts news articles',
    url: 'https://example.com/news',
    selector: 'article',
    max_depth: 1,
    proxy_type: 'none',
    javascript_enabled: false,
    respect_robots_txt: true,
    creation_date: new Date(Date.now() - 86400000).toISOString(),  // Yesterday
    last_run_date: new Date(Date.now() - 43200000).toISOString(),  // 12 hours ago
    status: 'active',
    extraction_fields: [
      {
        name: 'headline',
        selector: 'h1',
        selector_type: 'css',
        required: true
      },
      {
        name: 'date',
        selector: '.publish-date',
        selector_type: 'css'
      },
      {
        name: 'content',
        selector: '.article-content',
        selector_type: 'css'
      }
    ]
  },
  {
    id: '3',
    name: 'Real Estate Listings',
    description: 'Scrapes real estate listings',
    url: 'https://example.com/realestate',
    selector: '.property-listing',
    max_depth: 3,
    proxy_type: ProxyType.HTTP,
    proxy_url: 'http://proxy.example.com:8080',
    javascript_enabled: true,
    respect_robots_txt: true,
    creation_date: new Date(Date.now() - 172800000).toISOString(),  // Two days ago
    last_run_date: new Date(Date.now() - 86400000).toISOString(),   // Yesterday
    status: ScraperStatus.ERROR,
    extraction_fields: [
      {
        name: 'address',
        selector: '.property-address',
        selector_type: 'css',
        required: true
      },
      {
        name: 'price',
        selector: '.property-price',
        selector_type: 'css',
        data_type: 'number'
      },
      {
        name: 'bedrooms',
        selector: '.property-bedrooms',
        selector_type: 'css',
        data_type: 'number'
      },
      {
        name: 'bathrooms',
        selector: '.property-bathrooms',
        selector_type: 'css',
        data_type: 'number'
      },
      {
        name: 'area',
        selector: '.property-area',
        selector_type: 'css',
        data_type: 'number'
      }
    ]
  }
];

// Generate a random string of specified length
function generate_id(length: number = 10): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Mock implementations for the Scraper API endpoints
 */
export const mock_scraper_responses = {
  /**
   * Mock preview extraction response
   */
  preview_extraction(data: ScraperPreviewRequest): ScraperPreviewResponse {
    // Simulate a successful extraction for provided fields
    const extraction_result: Record<string, any> = {};
    const errors: Record<string, string> = {};
    
    // Generate sample data for each extraction field
    if (data.extraction_fields && data.extraction_fields.length > 0) {
      data.extraction_fields.forEach(field => {
        // Randomly succeed or fail for individual fields to simulate real-world behavior
        const success = Math.random() > 0.1; // 90% success rate
        
        if (success) {
          extraction_result[field.name] = {
            value: generate_mock_value_by_field_name(field.name),
            success: true
          };
        } else {
          extraction_result[field.name] = {
            value: null,
            success: false,
            error: `Could not extract value for selector '${field.selector}'`
          };
          errors[field.name] = `Selector '${field.selector}' not found on page`;
        }
      });
    }
    
    // Return a mock response
    return {
      success: true,
      data: extraction_result,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      html_content: '<html><body><div class="product-item">Sample content</div></body></html>',
      execution_time_ms: Math.floor(Math.random() * 1000) + 500  // Random time between 500-1500ms
    };
  },
  
  /**
   * Mock create scraper response
   */
  create_scraper(data: CreateScraperRequest): Scraper {
    // Create a new mock scraper
    const new_scraper: Scraper = {
      id: generate_id(),
      name: data.name,
      description: data.description || '',
      url: data.url,
      selector: data.selector,
      max_depth: data.max_depth || 1,
      proxy_type: data.proxy_type || 'none',
      proxy_url: data.proxy_url,
      javascript_enabled: data.javascript_enabled !== undefined ? data.javascript_enabled : true,
      respect_robots_txt: data.respect_robots_txt !== undefined ? data.respect_robots_txt : true,
      creation_date: new Date().toISOString(),
      status: ScraperStatus.ACTIVE,
      extraction_fields: data.extraction_fields
    };
    
    // Add to mock data
    mock_scrapers.push(new_scraper);
    
    return new_scraper;
  },
  
  /**
   * Mock list scrapers response
   */
  list_scrapers(params?: ListScrapersParams): PaginatedResponse<Scraper> {
    // Apply filters if provided
    let filtered_scrapers = [...mock_scrapers];
    
    if (params) {
      // Apply status filter
      if (params?.status) {
        filtered_scrapers = filtered_scrapers.filter(s => s.status === params.status);
      }
      
      // Search by name
      if (params.search) {
        const search_term = params.search.toLowerCase();
        filtered_scrapers = filtered_scrapers.filter(s => 
          s.name.toLowerCase().includes(search_term) || 
          (s.description && s.description.toLowerCase().includes(search_term))
        );
      }
      
      // Sort results
      if (params.sort_by) {
        filtered_scrapers.sort((a, b) => {
          let comparison = 0;
          
          switch (params.sort_by) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'creation_date':
              comparison = new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime();
              break;
            case 'last_run_date':
              const a_date = a.last_run_date ? new Date(a.last_run_date).getTime() : 0;
              const b_date = b.last_run_date ? new Date(b.last_run_date).getTime() : 0;
              comparison = a_date - b_date;
              break;
          }
          
          // Apply sort order
          return params.sort_order === 'desc' ? -comparison : comparison;
        });
      }
    }
    
    // Apply pagination
    const page = params?.page || 1;
    const per_page = params?.per_page || 10;
    const start = (page - 1) * per_page;
    const end = start + per_page;
    const paged_scrapers = filtered_scrapers.slice(start, end);
    
    // Structure response according to PaginatedResponse interface
    return {
      data: paged_scrapers,
      items: paged_scrapers.length, // Number of items in current page
      total: filtered_scrapers.length, // Total number of items across all pages
      page, // Current page number
      per_page, // Items per page
      total_pages: Math.ceil(filtered_scrapers.length / per_page) // Total number of pages
    };
  },
  
  /**
   * Mock get scraper by ID
   */
  get_scraper(id: string): Scraper {
    const scraper = mock_scrapers.find(s => s.id === id);
    
    if (!scraper) {
      throw new Error(`Scraper with ID ${id} not found`);
    }
    
    return { ...scraper };
  },
  
  /**
   * Mock update scraper
   */
  update_scraper(id: string, data: UpdateScraperRequest): Scraper {
    const index = mock_scrapers.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error(`Scraper with ID ${id} not found`);
    }
    
    // Update scraper with new data
    const updated_scraper = {
      ...mock_scrapers[index],
      ...data
    };
    
    // Update in mock data
    mock_scrapers[index] = updated_scraper;
    
    return { ...updated_scraper };
  },
  
  /**
   * Mock delete scraper
   */
  delete_scraper(id: string): { success: boolean } {
    const index = mock_scrapers.findIndex(s => s.id === id);
    
    if (index === -1) {
      return { success: false };
    }
    
    // Remove from mock data
    mock_scrapers.splice(index, 1);
    
    return { success: true };
  },
  
  /**
   * Mock run scraper
   */
  run_scraper(data: RunScraperRequest): RunScraperResponse {
    const scraper = mock_scrapers.find(s => s.id === data.scraper_id);
    
    if (!scraper) {
      return {
        success: false,
        error: `Scraper with ID ${data.scraper_id} not found`
      };
    }
    
    // Update last run date
    scraper.last_run_date = new Date().toISOString();
    
    // Return success with mock job ID
    return {
      success: true,
      job_id: generate_id()
    };
  }
};

/**
 * Generate a mock value based on field name
 */
function generate_mock_value_by_field_name(field_name: string): any {
  const lowercase_name = field_name.toLowerCase();
  
  // Price-related fields
  if (lowercase_name.includes('price')) {
    return `$${(Math.random() * 1000).toFixed(2)}`;
  }
  
  // Number-related fields
  if (
    lowercase_name.includes('count') || 
    lowercase_name.includes('qty') || 
    lowercase_name.includes('quantity') ||
    lowercase_name.includes('rating')
  ) {
    return Math.floor(Math.random() * 10);
  }
  
  // Date-related fields
  if (lowercase_name.includes('date') || lowercase_name.includes('time')) {
    return new Date().toISOString();
  }
  
  // Boolean fields
  if (
    lowercase_name.includes('is_') || 
    lowercase_name.includes('has_') || 
    lowercase_name.includes('available')
  ) {
    return Math.random() > 0.5;
  }
  
  // For titles, names, etc.
  if (
    lowercase_name.includes('title') || 
    lowercase_name.includes('name') ||
    lowercase_name.includes('headline')
  ) {
    const titles = [
      'Product A', 
      'Fantastic Solution', 
      'Premium Service', 
      'Exclusive Item',
      'Best Seller'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }
  
  // For descriptions
  if (lowercase_name.includes('description') || lowercase_name.includes('content')) {
    return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.';
  }
  
  // Default case - return a string
  const sample_texts = [
    'Sample text',
    'Example value',
    'Test data',
    'Mock information',
    'Demo content'
  ];
  return sample_texts[Math.floor(Math.random() * sample_texts.length)];
}
