
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

/**
 * Checks if Vite client is loaded correctly
 * @returns Object with diagnostic information about Vite client status
 */
export const checkViteClientStatus = (): Record<string, any> => {
  const status = {
    viteGlobalsPresent: false,
    hmrSocketExists: false,
    moduleHotExists: false,
    viteElementsFound: [] as string[],
    scriptSources: [] as string[],
    viteCspCompatible: true,
    errors: [] as string[]
  };
  
  try {
    // Check for vite globals
    status.viteGlobalsPresent = typeof (window as any).__vite_plugin_react_preamble_installed__ !== 'undefined';
    
    // Check if module.hot exists
    status.moduleHotExists = typeof (import.meta as any).hot !== 'undefined';
    
    // Look for Vite-specific elements in the DOM
    document.querySelectorAll('[data-vite-dev-id]').forEach(el => {
      status.viteElementsFound.push((el as HTMLElement).dataset.viteDevId || 'unknown');
    });
    
    // Check script sources for Vite
    document.querySelectorAll('script').forEach(script => {
      if (script.src) {
        status.scriptSources.push(script.src);
        if (script.src.includes('vite') || script.src.includes('@vite')) {
          // Check if the script actually loaded
          if (script instanceof HTMLScriptElement) {
            if (!script.dataset.loaded) {
              // Mark the script to check if it loads
              script.dataset.loaded = 'pending';
              script.addEventListener('load', () => {
                script.dataset.loaded = 'loaded';
              });
              script.addEventListener('error', (e) => {
                script.dataset.loaded = 'error';
                status.errors.push(`Failed to load Vite script: ${script.src}`);
                console.error('Vite script load error:', e);
              });
            }
          }
        }
      }
    });
    
    // Check CSP compatibility
    const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (metaCSP) {
      const cspContent = metaCSP.getAttribute('content') || '';
      if (!cspContent.includes("'unsafe-eval'")) {
        status.viteCspCompatible = false;
        status.errors.push("CSP missing 'unsafe-eval' which Vite requires");
      }
      if (!cspContent.includes('ws:') && !cspContent.includes('wss:')) {
        status.viteCspCompatible = false;
        status.errors.push("CSP missing WebSocket (ws: or wss:) permissions which Vite HMR requires");
      }
    }
  } catch (error) {
    status.errors.push(`Error checking Vite status: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return status;
};

/**
 * Attempts to diagnose and fix common Vite client issues
 * @returns Object with diagnostic information and fix attempts
 */
export const diagnoseAndFixViteClientIssues = (): Record<string, any> => {
  const diagnosis = {
    initialStatus: checkViteClientStatus(),
    attemptedFixes: [] as string[],
    fixResult: false,
  };
  
  try {
    // 1. Try to detect if vite/client.js was blocked
    const blockedScripts = Array.from(document.querySelectorAll('script[src*="vite"][data-loaded="error"]'));
    if (blockedScripts.length > 0) {
      diagnosis.attemptedFixes.push('Detected blocked Vite scripts');
      
      // 2. Check if it's a CSP issue and try to patch it dynamically (for development only)
      if (!diagnosis.initialStatus.viteCspCompatible && process.env.NODE_ENV === 'development') {
        diagnosis.attemptedFixes.push('Attempting to patch CSP for development environment');
        
        // Create a more permissive CSP meta tag for development
        const existingCsp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (existingCsp) {
          // Remove restrictive CSP in development mode only
          existingCsp.remove();
          diagnosis.attemptedFixes.push('Removed restrictive CSP in development mode');
          
          // Add development-friendly CSP
          const metaEl = document.createElement('meta');
          metaEl.setAttribute('http-equiv', 'Content-Security-Policy');
          metaEl.setAttribute('content', 
            "default-src 'self'; " +
            "connect-src 'self' ws: wss: https://*.lovableproject.com https://*.supabase.co; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co https://*.lovableproject.com; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "font-src 'self' data: https://fonts.gstatic.com; " +
            "img-src 'self' data: https: blob:; " +
            "object-src 'none';"
          );
          document.head.appendChild(metaEl);
          diagnosis.attemptedFixes.push('Added development-friendly CSP');
        }
        
        // Try to reload vite client script
        const newScript = document.createElement('script');
        newScript.type = 'module';
        newScript.src = '/@vite/client';
        document.body.appendChild(newScript);
        diagnosis.attemptedFixes.push('Attempted to reload Vite client script');
      }
    }
    
    // Check status after fix attempts
    setTimeout(() => {
      const newStatus = checkViteClientStatus();
      diagnosis.fixResult = newStatus.viteGlobalsPresent && !newStatus.errors.length;
      console.log('Vite client fix diagnosis complete:', {
        initialStatus: diagnosis.initialStatus,
        attemptedFixes: diagnosis.attemptedFixes,
        newStatus,
        fixResult: diagnosis.fixResult
      });
      
      if (!diagnosis.fixResult && process.env.NODE_ENV === 'development') {
        console.info('For development, try manually adding these Vite HMR debug logs to main.tsx:');
        console.info("if (import.meta.hot) { import.meta.hot.on('vite:beforeUpdate', (data) => console.log('vite:beforeUpdate', data)); }");
      }
    }, 1000);
    
  } catch (error) {
    diagnosis.attemptedFixes.push(`Error during fix attempt: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return diagnosis;
};

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
  },
  
  // New utilities for Vite client debugging
  viteClientCheck: checkViteClientStatus,
  diagnoseAndFixViteClient: diagnoseAndFixViteClientIssues,
  
  debugViteHMR: () => {
    // Listen for Vite HMR events
    if ((window as any).__vite_plugin_react_preamble_installed__) {
      console.log('[DEBUG] Vite React plugin is installed');
    } else {
      console.warn('[DEBUG] Vite React plugin is NOT installed');
    }
    
    // Add manual debug logs for HMR
    if ((import.meta as any).hot) {
      console.log('[DEBUG] HMR is available');
      (import.meta as any).hot.on('vite:beforeUpdate', (data: any) => 
        console.log('[VITE HMR] Before update:', data)
      );
      (import.meta as any).hot.on('vite:beforeFullReload', (data: any) => 
        console.log('[VITE HMR] Before full reload:', data)
      );
      (import.meta as any).hot.on('vite:error', (data: any) => 
        console.error('[VITE HMR] Error:', data)
      );
    } else {
      console.warn('[DEBUG] HMR is NOT available');
    }
    
    return {
      isViteInstalled: !!(window as any).__vite_plugin_react_preamble_installed__,
      hasHMR: !!(import.meta as any).hot
    };
  }
};
