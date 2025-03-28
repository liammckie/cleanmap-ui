
/**
 * Utility functions to handle date formatting and conversion 
 * between JavaScript Date objects and ISO string format for database operations
 */

/**
 * Converts a date object or string to an ISO string format for database operations
 * @param date Date object or ISO date string
 * @returns ISO string format suitable for database operations
 */
export function toISOString(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  
  if (typeof date === 'string') {
    // If already a string, ensure it's in ISO format
    try {
      return new Date(date).toISOString();
    } catch (e) {
      console.error('Invalid date string:', date);
      return null;
    }
  }
  
  // If it's a Date object
  return date.toISOString();
}

/**
 * Prepare an object with dates for database operations by converting Date objects to strings
 * @param obj Object containing potential Date objects or date strings
 * @returns Same object with dates converted to strings
 */
export function prepareObjectForDb<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  
  // Remove id, created_at, and updated_at as they're typically managed by the database
  const { id, created_at, updated_at, ...rest } = obj as any;
  
  // Process each property
  Object.entries(rest).forEach(([key, value]) => {
    // If the value is a Date or a date string, convert it to ISO string
    if (value instanceof Date || (typeof value === 'string' && isDateString(value))) {
      result[key] = toISOString(value);
    } else {
      result[key] = value;
    }
  });
  
  return result;
}

/**
 * Format a date for display in the UI
 * @param date Date object or ISO date string
 * @param format Format to use (default is 'yyyy-MM-dd')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | null | undefined, format: string = 'yyyy-MM-dd'): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  } catch (e) {
    console.error('Invalid date:', date);
    return '';
  }
}

/**
 * Helper function to check if a string is a valid date string
 * @param value String to check
 * @returns Boolean indicating if the string is a valid date
 */
function isDateString(value: string): boolean {
  if (!value) return false;
  
  // Try to create a Date object from the string
  const date = new Date(value);
  
  // Check if the date is valid
  return !isNaN(date.getTime());
}
