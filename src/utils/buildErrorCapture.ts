
/**
 * Build Error Capture Utility
 * 
 * Provides functionality to capture and parse build errors
 */

import { documentBuildError } from '@/services/documentation/documentationService';
import { trackErrors } from '@/utils/errorAnalytics';

/**
 * Captures and documents a build error
 * @param errorMessage Build error message
 * @returns Parsed error info
 */
export function captureBuildError(errorMessage: string): {
  message: string;
  file: string;
  line: number;
  column: number;
  originalMessage: string;
} | null {
  console.info('Capturing build error');
  
  // Simple regex to extract error details
  const errorRegex = /(.+):(\d+):(\d+): (.+)/;
  const match = errorMessage.match(errorRegex);
  
  if (!match) {
    console.warn('Could not parse error message:', errorMessage);
    return null;
  }
  
  const [, file, line, column, message] = match;
  
  // Create error info object
  const errorInfo = {
    message,
    file,
    line: parseInt(line, 10),
    column: parseInt(column, 10),
    originalMessage: errorMessage
  };
  
  // Record errors for analytics
  const errorsByFile: Record<string, string[]> = {
    [file]: [message]
  };
  trackErrors(errorsByFile);
  
  console.info('Build error captured:', errorInfo);
  
  return errorInfo;
}

/**
 * Simulates capturing build errors for testing
 * @param errors Array of error messages to simulate
 */
export function simulateBuildErrorCapture(errors: string[]): void {
  console.info('Simulating build error capture for', errors.length, 'errors');
  
  // Process each error
  const errorsByFile: Record<string, string[]> = {};
  
  errors.forEach(error => {
    // Document the error
    const errorInfo = captureBuildError(error);
    
    if (errorInfo) {
      documentBuildError(error);
      
      // Add to errorsByFile for analytics
      if (!errorsByFile[errorInfo.file]) {
        errorsByFile[errorInfo.file] = [];
      }
      
      errorsByFile[errorInfo.file].push(errorInfo.message);
    }
  });
  
  // Track errors for analytics
  if (Object.keys(errorsByFile).length > 0) {
    trackErrors(errorsByFile);
  }
  
  console.info('Build error simulation complete');
}
