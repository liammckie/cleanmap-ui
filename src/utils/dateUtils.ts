
import { format, parseISO } from 'date-fns'

/**
 * Formats a date object to ISO string for database storage
 * @param date Date to format for database
 * @returns ISO string representation of the date
 */
export function formatDateForDb(date: Date): string {
  return date.toISOString()
}

/**
 * Formats a date for display in the UI
 * @param date Date object or ISO string
 * @returns Formatted date string (e.g., "15 Jan 2023")
 */
export function formatDateForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd MMM yyyy')
}

/**
 * Formats a datetime for display in the UI
 * @param datetime Date object or ISO string
 * @returns Formatted datetime string (e.g., "15 Jan 2023 2:30 PM")
 */
export function formatDateTimeForDisplay(datetime: Date | string): string {
  const dateObj = typeof datetime === 'string' ? parseISO(datetime) : datetime
  return format(dateObj, 'dd MMM yyyy h:mm a')
}

/**
 * Parses an ISO date string into a Date object
 * @param dateString ISO date string
 * @returns Date object
 */
export function parseDbDate(dateString: string): Date {
  return parseISO(dateString)
}
