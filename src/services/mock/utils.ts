/**
 * Mock Data Utilities
 * 
 * Common utility functions for mock data generation and manipulation.
 */

/**
 * Generate a random string ID of specified length
 * 
 * @param length - The length of the ID to generate (default: 10)
 * @returns A random alphanumeric string
 */
export function generate_id(length: number = 10): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Generate a random date within a specified range
 * 
 * @param start - The start date for the range (default: 30 days ago)
 * @param end - The end date for the range (default: now)
 * @returns A date string in ISO format
 */
export function generate_random_date(start?: Date, end?: Date): string {
  const startDate = start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days ago
  const endDate = end || new Date(); // Default to now
  
  const randomTimestamp = startDate.getTime() + 
    Math.random() * (endDate.getTime() - startDate.getTime());
    
  return new Date(randomTimestamp).toISOString();
}

/**
 * Generate mock pagination data
 * 
 * @param items - The array of items to paginate
 * @param page - The current page number (default: 1)
 * @param per_page - The number of items per page (default: 10)
 * @returns Object with pagination data
 */
export function generate_pagination_data<T>(items: T[], page = 1, per_page = 10) {
  const start = (page - 1) * per_page;
  const end = start + per_page;
  const paged_items = items.slice(start, end);
  
  return {
    data: paged_items,
    items: paged_items.length,
    total: items.length,
    page,
    per_page,
    total_pages: Math.ceil(items.length / per_page)
  };
}
