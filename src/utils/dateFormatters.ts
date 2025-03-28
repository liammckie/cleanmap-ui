
/**
 * Prepares an object for database operations by:
 * 1. Converting Date objects to ISO strings
 * 2. Converting null to undefined for optional fields
 * 
 * This is necessary because Supabase expects dates in ISO string format
 * 
 * @param obj The object to prepare for database operations
 * @returns A copy of the object with dates converted to ISO strings
 */
export function prepareObjectForDb<T extends Record<string, any>>(obj: T): T {
  if (!obj) return obj;
  
  const result = { ...obj };
  
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = result[key];
      
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        result[key] = value.toISOString() as any;
      }
      
      // Convert null to undefined for optional fields
      // This helps with Supabase's handling of null values
      if (value === null) {
        result[key] = undefined as any;
      }
    }
  }
  
  return result;
}
