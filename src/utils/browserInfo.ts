
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
    console.group('Vite Client Compatibility Check');
    
    // Test if we can create a WebSocket connection (important for Vite)
    const hasWebSocket = 'WebSocket' in window;
    console.log('WebSocket support:', hasWebSocket);
    
    // Check if CSP allows connections to Vite domains
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    console.log('CSP meta tag found:', !!cspMeta);
    
    if (cspMeta) {
      const cspContent = cspMeta.getAttribute('content');
      console.log('CSP Content:', cspContent);
      
      // Check for key Vite requirements in CSP
      const hasUnsafeEval = cspContent?.includes("'unsafe-eval'");
      const hasUnsafeInline = cspContent?.includes("'unsafe-inline'");
      const hasWsConnections = cspContent?.includes('ws:') || cspContent?.includes('wss:');
      
      console.log('CSP allows unsafe-eval:', hasUnsafeEval);
      console.log('CSP allows unsafe-inline:', hasUnsafeInline);
      console.log('CSP allows WebSocket connections:', hasWsConnections);
      
      if (!hasUnsafeEval || !hasUnsafeInline || !hasWsConnections) {
        console.warn('CSP may block Vite functionality. Consider adjusting CSP settings.');
      }
    }
    
    // Test if eval is allowed (needed for some Vite operations)
    try {
      // This will throw if eval is blocked by CSP
      // eslint-disable-next-line no-eval
      eval('true');
      console.log('eval() is allowed by CSP');
      console.groupEnd();
      return hasWebSocket;
    } catch (e) {
      console.warn('CSP blocks eval() which may affect Vite development server', e);
      console.groupEnd();
      return false;
    }
  } catch (e) {
    console.error('Error checking Vite compatibility:', e);
    console.groupEnd();
    return false;
  }
};

/**
 * Attempts to diagnose Vite client loading issues
 */
export const diagnoseViteClientIssues = () => {
  try {
    console.group('Vite Client Diagnostics');
    
    // Check if the Vite client script tag exists
    const viteClientScript = document.querySelector('script[src*="@vite/client"]');
    console.log('Vite client script tag found:', !!viteClientScript);
    
    if (viteClientScript) {
      console.log('Vite client src:', viteClientScript.getAttribute('src'));
    } else {
      // Try to manually load the Vite client script to test loading
      const testScript = document.createElement('script');
      testScript.type = 'module';
      testScript.src = '/@vite/client';
      testScript.id = 'vite-client-test';
      
      // Log when the script errors
      testScript.onerror = (event) => {
        console.error('Vite client test script failed to load:', event);
      };
      
      // Add to DOM temporarily
      document.head.appendChild(testScript);
      setTimeout(() => {
        if (document.getElementById('vite-client-test')) {
          document.head.removeChild(testScript);
        }
      }, 3000);
    }
    
    // Check for error events related to Vite
    window.addEventListener('error', (event) => {
      if (event.filename?.includes('@vite') || event.message?.includes('Vite')) {
        console.error('Vite-related error detected:', {
          filename: event.filename,
          message: event.message,
          lineno: event.lineno,
          colno: event.colno
        });
      }
    }, { once: true });
    
    console.groupEnd();
  } catch (e) {
    console.error('Error diagnosing Vite client:', e);
    console.groupEnd();
  }
};
