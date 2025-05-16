import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind CSS classes
 * This utility prevents class name conflicts and ensures proper specificity
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
