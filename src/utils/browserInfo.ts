
/**
 * Utility for gathering browser information and checking for compatibility issues
 */

/**
 * Log information about the current browser environment
 */
export const logBrowserInfo = () => {
  console.info('Browser Information:', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
    windowDimensions: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    },
    devicePixelRatio: window.devicePixelRatio,
    location: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
  });
};

/**
 * Check for browser compatibility issues that might affect the application
 * @returns Array of compatibility issues
 */
export const checkForBrowserCompatibilityIssues = (): string[] => {
  const issues: string[] = [];
  
  // Check if we're using an outdated browser
  const isIE = /MSIE|Trident/.test(navigator.userAgent);
  if (isIE) {
    issues.push('Internet Explorer is not supported. Please use a modern browser like Chrome, Firefox, or Edge.');
  }
  
  // Check for LocalStorage
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
  } catch (e) {
    issues.push('LocalStorage is not available. Some features may not work properly.');
  }
  
  // Check if JavaScript is enabled (if this code is running, it is)
  // But we can check for other critical APIs
  
  // Check for Fetch API
  if (!('fetch' in window)) {
    issues.push('Fetch API is not available. Please use a modern browser.');
  }
  
  // Check for ES6 support
  try {
    new Function('() => {}');
  } catch (e) {
    issues.push('ES6 arrow functions are not supported. Please use a modern browser.');
  }
  
  // Check WebSocket support (important for Vite HMR)
  if (!('WebSocket' in window)) {
    issues.push('WebSockets are not supported. Hot Module Replacement will not work.');
  }
  
  return issues;
};

/**
 * Checks if Vite's client script can be loaded properly
 */
export const checkViteClientCompatibility = (): boolean => {
  try {
    // Test if we can create a WebSocket connection (important for Vite)
    const testWs = 'WebSocket' in window;
    
    // Check if CSP allows eval (needed for some Vite operations)
    try {
      // This will throw if eval is blocked by CSP
      // eslint-disable-next-line no-eval
      eval('true');
      return testWs;
    } catch (e) {
      console.warn('CSP blocks eval() which may affect Vite development server');
      return false;
    }
  } catch (e) {
    console.error('Error checking Vite compatibility:', e);
    return false;
  }
};
