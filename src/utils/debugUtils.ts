
/**
 * Utility functions for debugging application issues
 */

/**
 * Logs component lifecycle events to help track rendering issues
 * @param componentName The name of the component being debugged
 * @param event The lifecycle event (mount, update, error, etc.)
 * @param data Additional data to log
 */
export const debugComponent = (
  componentName: string,
  event: 'mount' | 'update' | 'unmount' | 'error' | 'render',
  data?: any
) => {
  console.log(`[${componentName}] ${event.toUpperCase()}:`, data || '')
}

/**
 * Wraps a function with error logging to help catch errors in callbacks
 * @param fn The function to wrap
 * @param fnName Optional name for the function (for logging)
 * @returns A wrapped function that catches and logs errors
 */
export const withErrorLogging = <T extends (...args: any[]) => any>(
  fn: T,
  fnName: string = 'anonymous'
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      return fn(...args)
    } catch (error) {
      console.error(`Error in function ${fnName}:`, error)
      console.error('Arguments:', args)
      throw error
    }
  }
}

/**
 * Logs any runtime type errors to help debug TypeScript issues
 * @param value The value to check
 * @param expectedType Description of the expected type
 * @param valueName Name of the value being checked
 */
export const checkType = (
  value: any, 
  expectedType: string, 
  valueName: string
) => {
  const actualType = typeof value
  const isValid = actualType === expectedType || 
    (expectedType === 'array' && Array.isArray(value)) ||
    (expectedType === 'object' && actualType === 'object' && !Array.isArray(value))
  
  if (!isValid) {
    console.warn(`Type error: ${valueName} should be ${expectedType}, but got ${Array.isArray(value) ? 'array' : actualType}`, value)
  }
  
  return isValid
}
