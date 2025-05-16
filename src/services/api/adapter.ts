/**
 * API Adapter Layer
 * 
 * This module provides an adapter between the existing API interfaces and the new
 * API abstraction layer. It allows for incremental migration without breaking
 * existing functionality.
 */

import { feature_flags } from '../config/feature_flags';
import { scraper_service } from './scraper_service';
import type { 
  scraper_preview_response,
  extraction_field
} from '../../types/api/scraper_types';

// Get feature flags for use in this module
// Only destructure what we actually use to avoid lint errors
const { use_new_api_layer } = feature_flags;

/**
 * Convert legacy JobsApi style extraction fields to new API format
 */
function convert_extraction_fields(fields: Array<{
  name: string;
  selector: string;
  selectorType: string;
}> | undefined): extraction_field[] {
  if (!fields) return [];
  
  return fields.map(field => ({
    name: field.name,
    selector: field.selector,
    selector_type: field.selectorType,
  }));
}

/**
 * Convert new API style extraction fields to legacy format
 * Note: This function is prepared for future use when we need to convert 
 * data from new format back to the legacy format.
 */
// function convert_extraction_fields_to_legacy(
//   fields: extraction_field[]
// ): Array<{
//   name: string;
//   selector: string;
//   selectorType: string;
// }> {
//   return fields.map(field => ({
//     name: field.name,
//     selector: field.selector,
//     selectorType: field.selector_type,
//   }));
// }

/**
 * Adapter for the JobsApi.previewExtraction method
 * This function provides a bridge between the old and new API architectures
 */
export async function preview_extraction_adapter(previewData: {
  url: string;
  selectorType: string;
  mainSelector?: string;
  extractionFields?: Array<{
    name: string;
    selector: string;
    selectorType: string;
  }>;
  javascriptEnabled: boolean;
}): Promise<scraper_preview_response> {
  // If not using the new API layer, fall back to the old implementation
  if (!use_new_api_layer) {
    // This would call the original implementation
    // For now we'll just route through the new implementation
    console.log('Using legacy API implementation (via adapter)');
  }
  
  // Use the new implementation
  try {
    const result = await scraper_service.preview_extraction({
      url: previewData.url,
      selector_type: previewData.selectorType,
      main_selector: previewData.mainSelector,
      extraction_fields: convert_extraction_fields(previewData.extractionFields),
      javascript_enabled: previewData.javascriptEnabled
    });
    
    return result;
  } catch (error) {
    // Format error to match what the existing code expects
    console.error('Preview extraction error in adapter:', error);
    
    // Rethrow with appropriate structure
    if (error instanceof Error) {
      // Enhance error with any additional properties
      const enhancedError = error as Error & { 
        status?: number; 
        data?: any;
      };
      
      throw enhancedError;
    }
    
    throw error;
  }
}

// Additional adapter functions can be added here as needed
// for other API endpoints that need to be migrated
