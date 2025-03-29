
import { format } from 'date-fns'

export const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) return 'N/A'
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, 'dd MMM yyyy')
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}
