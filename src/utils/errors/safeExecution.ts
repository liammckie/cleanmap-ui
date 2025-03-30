
/**
 * Safe execution utilities
 * 
 * Provides functionality for safely executing code that might fail
 */

/**
 * Use this to wrap critical sections of code that might fail
 * with syntax or other errors
 * @param fn Function to execute
 * @param fallback Fallback value to return if an error occurs
 * @param errorHandler Optional function to handle errors
 * @returns Result of the function or fallback value
 */
export const safeTry = <T>(
  fn: () => T, 
  fallback: T, 
  errorHandler?: (error: unknown) => void
): T => {
  try {
    return fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      console.error('Error in safeTry:', error);
    }
    return fallback;
  }
};
