/**
 * ValidationError
 * 
 * Custom error class for form and data validation errors.
 * Used to distinguish validation errors from other types of API errors.
 */
export class ValidationError extends Error {
  fieldErrors?: Record<string, string>;
  
  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
