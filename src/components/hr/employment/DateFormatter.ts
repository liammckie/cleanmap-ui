
import { format, isValid, parseISO } from 'date-fns'

export const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) return 'N/A'
  
  try {
    // Handle string dates by parsing them first
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    
    // Check if the date is valid using isValid
    if (!isValid(dateObj)) {
      return 'Invalid date'
    }
    
    return format(dateObj, 'dd MMM yyyy')
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}
