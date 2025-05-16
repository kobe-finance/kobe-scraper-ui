import { z } from 'zod';
import { SelectorType, DataType } from '../../../core/types/scraper';
import { JobPriority } from '../../../core/types/job';

// Define extraction field schema aligned with core API types
const extractionFieldSchema = z.object({
  name: z.string().min(1, { message: 'Field name is required' }),
  selector: z.string().min(1, { message: 'Selector is required' }),
  selector_type: z.nativeEnum(SelectorType).default(SelectorType.CSS),
  data_type: z.nativeEnum(DataType).default(DataType.STRING),
  required: z.boolean().default(false),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type ExtractionField = z.infer<typeof extractionFieldSchema>;

// Define the schema for job creation aligned with API types
export const jobConfigurationSchema = z.object({
  // Basic Information
  name: z.string().min(3, { message: 'Job name must be at least 3 characters' }),
  description: z.string().optional(),
  scraper_id: z.string().optional(), // Will be set when creating from a specific scraper
  
  // Extraction Fields
  extraction_fields: z.array(extractionFieldSchema).default([]),

  // Scraper Configuration
  url: z.string().url({ message: 'Please enter a valid URL' }),
  url_pattern: z.string().optional(),
  selector_type: z.nativeEnum(SelectorType).default(SelectorType.CSS),
  main_selector: z.string().optional(),
  pagination_type: z.enum(['none', 'next_button', 'page_number', 'infinite_scroll', 'load_more']).default('none'),
  pagination_selector: z.string().optional(),
  max_pages: z.number().int().min(1).optional(),
  
  // Schedule Configuration (will be converted to JobSchedule in API)
  schedule_frequency: z.enum(['once', 'hourly', 'daily', 'weekly', 'monthly', 'custom']).default('once'),
  scheduled_date: z.string().optional(),
  recurring_type: z.enum(['hourly', 'daily', 'weekly', 'monthly', 'custom']).optional(),
  hourly_interval: z.number().int().min(1).max(24).optional(),
  daily_time: z.string().optional(),
  weekly_days: z.record(z.boolean()).optional(),
  weekly_time: z.string().optional(),
  monthly_day: z.number().int().min(1).max(31).optional(),
  monthly_time: z.string().optional(),
  cron_expression: z.string().optional(),
  priority: z.nativeEnum(JobPriority).default(JobPriority.NORMAL),
  run_immediate: z.boolean().default(false),
  
  // Proxy Configuration
  proxy_type: z.enum(['none', 'http', 'socks5', 'rotating']).default('none'),
  proxy_url: z.string().optional(),
  proxy_api_key: z.string().optional(),
  proxy_host: z.string().optional(),
  proxy_port: z.number().int().positive().optional(),
  proxy_username: z.string().optional(),
  proxy_password: z.string().optional(),
  
  // Headers & Cookies
  custom_user_agent: z.string().optional(),
  use_browser_cookies: z.boolean().default(false),
  
  // Retry Settings
  max_retries: z.number().int().min(0).max(10).default(3),
  retry_delay: z.number().int().min(1).max(300).default(5),
  retry_status_codes: z.string().optional(),
  exponential_backoff: z.boolean().default(true),
  
  // Export Options
  export_format: z.enum(['json', 'csv', 'excel', 'database']).default('json'),
  database_connection_string: z.string().optional(),
  export_path: z.string().optional(),
  include_metadata: z.boolean().default(true),
  auto_export_on_complete: z.boolean().default(false),
  
  // Browser Options
  javascript_enabled: z.boolean().default(false),
  wait_for_selector: z.string().optional(),
  wait_time: z.number().int().min(0).max(60000).optional(),
  
  // Metadata for additional custom fields
  metadata: z.record(z.string(), z.any()).optional(),
});

// Define type for form values
export type JobFormValues = z.infer<typeof jobConfigurationSchema>;

/**
 * Type definition for job creation API request structure
 * This matches the expected API request format in the backend
 */
export interface CreateJobRequest {
  name: string;
  description?: string;
  scraper_id?: string;
  schedule?: {
    frequency: string;
    cron_expression?: string;
    start_date?: string;
    end_date?: string;
    max_runs?: number;
  };
  options?: {
    max_pages?: number;
    delay_between_requests_ms?: number;
    custom_headers?: Record<string, string>;
    priority: JobPriority;
    timeout_seconds?: number;
  };
  metadata?: Record<string, any>;
}

/**
 * Helper function to map form values to API CreateJobRequest format
 * @param formValues - Form values from JobConfigurationModal
 * @param scraperId - Optional scraper ID if creating a job from a specific scraper
 * @returns CreateJobRequest object compatible with the API
 */
export function mapFormValuesToApiRequest(formValues: JobFormValues, scraperId?: string): CreateJobRequest {
  // Basic job information
  const createJobRequest = {
    name: formValues.name,
    description: formValues.description,
    scraper_id: formValues.scraper_id || scraperId,
    
    // Schedule configuration
    schedule: {
      frequency: formValues.schedule_frequency,
      cron_expression: formValues.cron_expression,
      start_date: formValues.scheduled_date,
      end_date: undefined, // Can be added if required
      max_runs: undefined // Can be added if required
    },
    
    // Options for job execution
    options: {
      max_pages: formValues.max_pages,
      delay_between_requests_ms: formValues.retry_delay ? formValues.retry_delay * 1000 : undefined,
      custom_headers: formValues.custom_user_agent ? {
        'User-Agent': formValues.custom_user_agent
      } : undefined,
      priority: formValues.priority,
      timeout_seconds: formValues.wait_time ? Math.floor(formValues.wait_time / 1000) : undefined
    },
    
    // Combine all other settings into metadata
    metadata: {
      ...formValues.metadata,
      url_pattern: formValues.url_pattern,
      pagination_type: formValues.pagination_type,
      pagination_selector: formValues.pagination_selector,
      export_format: formValues.export_format,
      export_path: formValues.export_path,
      include_metadata: formValues.include_metadata,
      auto_export_on_complete: formValues.auto_export_on_complete,
      proxy_settings: formValues.proxy_type !== 'none' ? {
        type: formValues.proxy_type,
        url: formValues.proxy_url,
        api_key: formValues.proxy_api_key,
        host: formValues.proxy_host,
        port: formValues.proxy_port,
        username: formValues.proxy_username,
        password: formValues.proxy_password
      } : undefined,
      retry_settings: {
        max_retries: formValues.max_retries,
        retry_delay: formValues.retry_delay,
        retry_status_codes: formValues.retry_status_codes,
        exponential_backoff: formValues.exponential_backoff
      },
      browser_settings: {
        javascript_enabled: formValues.javascript_enabled,
        wait_for_selector: formValues.wait_for_selector,
        use_browser_cookies: formValues.use_browser_cookies
      }
    }
  };
  
  return createJobRequest;
}
