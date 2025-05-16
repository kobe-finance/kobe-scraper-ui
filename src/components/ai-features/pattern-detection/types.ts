import { ReactNode } from 'react';

// Define the types of patterns that can be created
export type PatternType = 
  | 'text'       // Simple text matching
  | 'regex'      // Regular expression
  | 'css'        // CSS selector
  | 'xpath'      // XPath selector
  | 'attribute'  // HTML attribute
  | 'table'      // Table extraction
  | 'list'       // List extraction
  | 'nested';    // Nested pattern

// Define the base properties that all patterns share
export interface BasePattern {
  id: string;
  name: string;
  type: PatternType;
  description?: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Text pattern for simple text matching
export interface TextPattern extends BasePattern {
  type: 'text';
  content: string;
  isCaseSensitive: boolean;
  isWholeWord: boolean;
}

// Regex pattern for regular expression matching
export interface RegexPattern extends BasePattern {
  type: 'regex';
  expression: string;
  flags: string; // e.g., 'gi' for global, case-insensitive
  groups?: string[]; // Named capture groups
}

// CSS Selector pattern
export interface CssPattern extends BasePattern {
  type: 'css';
  selector: string;
  extractAttribute?: string; // e.g., 'href', 'src', etc.
  multiple: boolean; // Whether to extract multiple elements
}

// XPath Selector pattern
export interface XPathPattern extends BasePattern {
  type: 'xpath';
  path: string;
  multiple: boolean; // Whether to extract multiple elements
}

// HTML Attribute pattern
export interface AttributePattern extends BasePattern {
  type: 'attribute';
  elementSelector: string; // CSS selector for the element
  attributeName: string;   // Name of the attribute to extract
}

// Table pattern for extracting tabular data
export interface TablePattern extends BasePattern {
  type: 'table';
  tableSelector: string;     // CSS selector for the table
  headerSelector?: string;   // CSS selector for table headers
  rowSelector: string;       // CSS selector for table rows
  cellSelector: string;      // CSS selector for table cells
  includeHeaders: boolean;   // Whether to include headers in extraction
}

// List pattern for extracting list items
export interface ListPattern extends BasePattern {
  type: 'list';
  listSelector: string;      // CSS selector for the list
  itemSelector: string;      // CSS selector for list items
  extractItemText: boolean;  // Whether to extract item text or HTML
}

// Nested pattern for complex hierarchical data
export interface NestedPattern extends BasePattern {
  type: 'nested';
  rootSelector: string;      // CSS selector for the root element
  children: Array<
    | TextPattern
    | RegexPattern
    | CssPattern
    | XPathPattern
    | AttributePattern
  >;
}

// Union type of all pattern types
export type Pattern = 
  | TextPattern
  | RegexPattern
  | CssPattern
  | XPathPattern
  | AttributePattern
  | TablePattern
  | ListPattern
  | NestedPattern;

// Pattern test result
export interface PatternTestResult {
  patternId: string;
  success: boolean;
  matches: Array<{
    content: string;
    path?: string;
    index?: number;
  }>;
  error?: string;
  executionTime: number; // in milliseconds
}

// Pattern library item with metadata
export interface PatternLibraryItem {
  pattern: Pattern;
  author: string;
  tags: string[];
  usageCount: number;
  rating: number;
  isPublic: boolean;
  isVerified: boolean;
}

// Pattern analytics data
export interface PatternAnalytics {
  patternId: string;
  usageCount: number;
  successRate: number;
  averageExecutionTime: number;
  lastUsed: string;
  websitesUsedOn: Array<{
    domain: string;
    count: number;
    successRate: number;
  }>;
}
