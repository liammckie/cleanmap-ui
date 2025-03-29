
/**
 * Utility for capturing and logging global errors
 */

/**
 * Sets up global error handlers to capture and log errors
 * that might be missed by the React error boundary
 */
export const captureGlobalErrors = () => {
  // Log browser information on startup
  console.info('Browser information:', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    isOnline: navigator.onLine
  });
  
  // Capture global unhandled errors
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error?.stack,
    });
    
    // Log additional information about the document state
    console.info('Document readyState:', document.readyState);
    console.info('Current scripts:', Array.from(document.scripts).map(s => s.src || 'inline script'));
    
    // Return false to allow the default browser error handling
    return false;
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', {
      reason: event.reason,
      stack: event.reason?.stack,
    });
  });

  // Log when the document is fully loaded
  window.addEventListener('load', () => {
    console.info('Document fully loaded');
    
    // Check DOM structure
    const rootElement = document.getElementById('root');
    if (rootElement) {
      console.info('Root element content on load:', {
        childNodes: rootElement.childNodes.length,
        hasChildren: rootElement.hasChildNodes(),
      });
    } else {
      console.error('Root element not found after document load');
    }
  });

  console.info('Global error handlers installed');
};

/**
 * Use this to wrap critical sections of code that might fail
 * with syntax or other errors
 */
export const safeTry = <T>(fn: () => T, fallback: T, errorHandler?: (error: unknown) => void): T => {
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
