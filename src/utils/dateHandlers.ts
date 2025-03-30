
import { format, parseISO } from 'date-fns'

/**
 * Safely formats a date to a human-readable string
 * Centralized date formatting utility to ensure consistency
 * 
 * @param date The date value (string, Date, or null/undefined)
 * @param formatString Optional date format string (defaults to 'dd MMM yyyy')
 * @returns A formatted date string or 'N/A' if input is invalid
 */
export const formatDateString = (
  date: string | Date | undefined | null, 
  formatString = 'dd MMM yyyy'
): string => {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatString)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

/**
 * Converts a date or string to a Date object safely
 * 
 * @param date The date value (string, Date, or null/undefined)
 * @returns A Date object or null if input is invalid
 */
export const toDateObject = (date: string | Date | undefined | null): Date | null => {
  if (!date) return null
  
  try {
    return typeof date === 'string' ? parseISO(date) : date
  } catch (error) {
    console.error('Error converting to Date object:', error)
    return null
  }
}

/**
 * Safely converts a database date string to a Date object
 * 
 * @param dateString The date string from the database
 * @returns A Date object or null if input is invalid
 */
export const fromDbDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null
  
  try {
    return parseISO(dateString)
  } catch (error) {
    console.error('Error parsing DB date:', error, dateString)
    return null
  }
}

/**
 * Format a work order date for display
 * 
 * @param date The date to format
 * @param includeTime Whether to include time in the output
 * @returns Formatted date string
 */
export const formatWorkOrderDate = (
  date: string | Date | undefined | null,
  includeTime = false
): string => {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, includeTime ? 'PPp' : 'PP') // PPp = 'Jan 1, 2020, 12:00 PM'
  } catch (error) {
    console.error('Error formatting work order date:', error)
    return 'Invalid date'
  }
}
