// TypeScript type definitions for the application
// These types correspond to the backend models from your Python scraper

export interface Scraper {
  id: string;
  name: string;
  url: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  config: ScraperConfig;
}

export interface ScraperConfig {
  max_depth?: number;
  max_pages?: number;
  follow_external_links?: boolean;
  respect_robots_txt?: boolean;
  crawl_delay?: number;
  extract_content?: boolean;
  detect_patterns?: boolean;
  extract_images?: boolean;
  extract_tables?: boolean;
}

export interface ScraperResult {
  id: string;
  scraper_id: string;
  url: string;
  status: string;
  content: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// Add more type definitions as needed
