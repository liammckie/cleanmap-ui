import { format } from 'date-fns'

/**
 * Formats a date to a human-readable string format
 *
 * @param date The date to format (can be Date object, ISO string, or null/undefined)
 * @param formatString Optional format string (defaults to 'dd MMM yyyy')
 * @returns A formatted date string, or '-' if the date is null/undefined
 */
export function formatDate(
  date: Date | string | null | undefined,
  formatString = 'dd MMM yyyy',
): string {
  if (!date) return '-'

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatString)
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

/**
 * Type guard to check if a value is a Record (object)
 */
function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

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
export function prepareObjectForDb<T>(obj: T): T {
  if (!isRecord(obj)) return obj

  const result = { ...obj }

  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = result[key]

      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        result[key] = value.toISOString() as any
      }

      // Convert null to undefined for optional fields
      // This helps with Supabase's handling of null values
      if (value === null) {
        result[key] = undefined as any
      }

      // Recursively process nested objects
      if (isRecord(value)) {
        result[key] = prepareObjectForDb(value) as any
      }
    }
  }

  return result
}
