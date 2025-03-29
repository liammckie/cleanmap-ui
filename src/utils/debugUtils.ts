
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

/**
 * Helps detect syntax errors in code strings (for debugging)
 * Modified to not use Function constructor for CSP compliance
 * @param codeString String containing code to evaluate
 * @returns Error message if syntax error found, null otherwise
 */
export const detectSyntaxError = (codeString: string): string | null => {
  try {
    // Simple checks for common syntax errors instead of using Function constructor
    const issues = [];
    
    // Check for unbalanced brackets/braces/parentheses
    const bracketsStack: string[] = [];
    const bracketPairs: Record<string, string> = {
      ')': '(',
      '}': '{',
      ']': '['
    };
    
    for (let i = 0; i < codeString.length; i++) {
      const char = codeString[i];
      
      if (char === '(' || char === '{' || char === '[') {
        bracketsStack.push(char);
      } else if (char === ')' || char === '}' || char === ']') {
        if (bracketsStack.length === 0 || bracketsStack.pop() !== bracketPairs[char]) {
          issues.push(`Unbalanced bracket/brace at position ${i}: ${char}`);
        }
      }
    }
    
    if (bracketsStack.length > 0) {
      issues.push(`Unclosed brackets/braces: ${bracketsStack.join('')}`);
    }
    
    return issues.length > 0 ? issues.join(', ') : null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

/**
 * Scans the document for script errors by examining all script tags
 * @returns Array of potential error sources
 */
export const scanForScriptErrors = (): Array<{ src: string | null, error: string | null }> => {
  const results: Array<{ src: string | null, error: string | null }> = [];
  
  try {
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      // For inline scripts, try to detect syntax errors
      if (!script.src && script.textContent) {
        const error = detectSyntaxError(script.textContent);
        if (error) {
          results.push({ src: null, error });
        }
      } else if (script.src) {
        // For external scripts, just log the source
        results.push({ src: script.src, error: null });
      }
    });
  } catch (error) {
    console.error('Error scanning scripts:', error);
  }
  
  return results;
}

// Export additional debugging functions
export const debugUtils = {
  logAllProps: (obj: any, name = 'Object') => {
    console.log(`[DEBUG] ${name} properties:`, Object.getOwnPropertyNames(obj));
    return obj;
  },
  
  inspectDOM: (selector: string) => {
    const elements = document.querySelectorAll(selector);
    console.log(`[DEBUG] Found ${elements.length} elements matching "${selector}":`, Array.from(elements));
    return elements;
  },
  
  measureRenderTime: (componentName: string, callback: () => void) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    console.log(`[PERFORMANCE] ${componentName} rendered in ${(end - start).toFixed(2)}ms`);
  }
};
