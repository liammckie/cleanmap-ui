
import { format } from 'date-fns'

/**
 * Safely formats a date to a human-readable string
 * @param date The date value (string, Date, or null/undefined)
 * @param formatString Optional date format string (defaults to 'dd MMM yyyy')
 * @returns A formatted date string or 'N/A' if input is invalid
 */
export const formatDate = (
  date: string | Date | undefined | null, 
  formatString = 'dd MMM yyyy'
): string => {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatString)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}
