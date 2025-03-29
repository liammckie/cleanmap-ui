
/**
 * Utility for capturing browser information and checking compatibility
 */

// Get basic browser information
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  const browserInfo = {
    userAgent,
    vendor: navigator.vendor,
    platform: navigator.platform,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    isOnline: navigator.onLine,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  
  return browserInfo;
};

// Log browser information
export const logBrowserInfo = () => {
  const info = getBrowserInfo();
  console.info('Browser information:', info);
  return info;
};

// Check for potential browser compatibility issues
export const checkForBrowserCompatibilityIssues = () => {
  const issues = [];
  
  // Check for basic ES6 features
  if (!window.Promise) {
    issues.push('Browser does not support Promise');
  }
  
  if (!window.fetch) {
    issues.push('Browser does not support fetch');
  }
  
  if (!window.localStorage) {
    issues.push('Browser does not support localStorage');
  }
  
  // Check for Content Security Policy issues
  try {
    const metaElement = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (metaElement) {
      const cspContent = metaElement.getAttribute('content');
      if (cspContent) {
        if (!cspContent.includes('unsafe-eval') && !cspContent.includes("'unsafe-eval'")) {
          issues.push('CSP does not allow unsafe-eval, which Vite requires in development mode');
        }
        
        if (!cspContent.includes('ws:') && !cspContent.includes('wss:')) {
          issues.push('CSP does not allow WebSocket connections, which Vite requires for HMR');
        }
      }
    }
  } catch (error) {
    console.error('Error checking CSP:', error);
  }
  
  return issues;
};

// Safely check if dynamic imports are supported
const checkDynamicImportSupport = () => {
  try {
    // Use Function constructor to avoid direct 'import' syntax that causes parsing errors
    new Function('try { return new Function("return import(\\"\\")"); } catch(e) { return false; }')();
    return true;
  } catch (e) {
    return false;
  }
};

// Check specifically for Vite client compatibility
export const checkViteClientCompatibility = () => {
  // This is a simple heuristic to detect if the Vite client will work
  const compatibility = {
    hasWebSocket: typeof WebSocket !== 'undefined',
    hasEval: typeof eval === 'function',
    hasSessionStorage: typeof sessionStorage !== 'undefined',
    hasImport: checkDynamicImportSupport(),
    hasCspIssues: false,
    cspDetails: null,
  };
  
  // Check CSP for Vite compatibility
  try {
    const metaElement = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (metaElement) {
      const cspContent = metaElement.getAttribute('content');
      compatibility.cspDetails = cspContent;
      
      if (cspContent) {
        if (!cspContent.includes("'unsafe-eval'")) {
          compatibility.hasCspIssues = true;
        }
        
        // Parse CSP to check for specific directives
        const cspParts = cspContent.split(';').map(part => part.trim());
        for (const part of cspParts) {
          // Check for script-src directive
          if (part.startsWith('script-src')) {
            if (!part.includes("'unsafe-eval'")) {
              compatibility.hasCspIssues = true;
            }
          }
          
          // Check for connect-src directive
          if (part.startsWith('connect-src')) {
            if (!part.includes('ws:') && !part.includes('wss:')) {
              compatibility.hasCspIssues = true;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking CSP for Vite compatibility:', error);
  }
  
  return compatibility;
};

// Diagnose Vite client issues
export const diagnoseViteClientIssues = () => {
  const compatibility = checkViteClientCompatibility();
  console.info('Vite client compatibility check:', compatibility);
  
  // Check for specific issues
  if (!compatibility.hasWebSocket) {
    console.warn('WebSocket API is not available, which Vite HMR requires');
  }
  
  if (!compatibility.hasEval) {
    console.warn('Eval is not available, which Vite requires for module processing');
  }
  
  if (compatibility.hasCspIssues) {
    console.warn('Content Security Policy issues detected that may affect Vite:');
    console.warn('CSP:', compatibility.cspDetails);
    console.warn('Make sure your CSP allows: unsafe-eval, WebSocket connections, and required domains');
  }
  
  return compatibility;
};

// Export utility functions
export default {
  getBrowserInfo,
  logBrowserInfo,
  checkForBrowserCompatibilityIssues,
  checkViteClientCompatibility,
  diagnoseViteClientIssues,
};
