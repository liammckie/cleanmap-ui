
/**
 * Utility for collecting browser environment information
 * to help diagnose unexpected errors
 */

export const collectBrowserInfo = (): Record<string, string> => {
  const info: Record<string, string> = {};
  
  // Browser information
  info.userAgent = navigator.userAgent;
  info.browserLanguage = navigator.language;
  info.cookiesEnabled = String(navigator.cookieEnabled);
  info.doNotTrack = navigator.doNotTrack || "Not available";
  info.screenWidth = `${window.screen.width}px`;
  info.screenHeight = `${window.screen.height}px`;
  info.pixelRatio = String(window.devicePixelRatio);
  info.colorDepth = `${window.screen.colorDepth} bits`;
  
  // Available browser APIs
  info.localStorage = String('localStorage' in window);
  info.sessionStorage = String('sessionStorage' in window);
  info.webWorkers = String('Worker' in window);
  info.serviceWorkers = String('serviceWorker' in navigator);
  info.webSockets = String('WebSocket' in window);
  
  return info;
};

export const logBrowserInfo = (): void => {
  const info = collectBrowserInfo();
  console.group('Browser Information');
  Object.entries(info).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.groupEnd();
};

export const checkForBrowserCompatibilityIssues = (): string[] => {
  const issues: string[] = [];
  
  if (!('fetch' in window)) {
    issues.push('Fetch API is not supported in this browser. This may cause issues with data loading.');
  }
  
  if (!('Promise' in window)) {
    issues.push('Promises are not supported in this browser. This will likely cause major issues.');
  }
  
  if (!('Symbol' in window)) {
    issues.push('Symbol is not supported in this browser. This may cause React compatibility issues.');
  }
  
  if (!('Map' in window) || !('Set' in window)) {
    issues.push('Map/Set are not supported in this browser. This may impact application performance.');
  }
  
  return issues;
};
