
/**
 * Global error handlers
 * 
 * Sets up global error event listeners to capture unhandled errors
 */
import { logBrowserInfo, checkForBrowserCompatibilityIssues } from '@/utils/browserInfo';
import { diagnoseSyntaxError } from '@/utils/syntaxChecker';
import { documentError } from '@/services/documentation/documentationService';
import { ErrorEntry } from '@/utils/documentationManager';
import { isErrorDocumented, addToDocumentedErrors } from './errorCache';

/**
 * Sets up global error handlers to capture and log errors
 * that might be missed by the React error boundary
 */
export const captureGlobalErrors = (): void => {
  // Log browser information on startup
  logBrowserInfo();
  
  // Check for browser compatibility issues
  const compatibilityIssues = checkForBrowserCompatibilityIssues();
  if (compatibilityIssues.length > 0) {
    console.warn('Browser compatibility issues detected:');
    compatibilityIssues.forEach(issue => console.warn(`- ${issue}`));
  }
  
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
    
    // Create a unique error key to avoid duplicates
    const errorKey = `${event.message}:${event.filename}:${event.lineno}`;
    
    // Check if we've already documented this error
    if (isErrorDocumented(errorKey)) {
      console.log('This error has already been documented, skipping');
      return false;
    }
    
    // Add to documented errors set
    addToDocumentedErrors(errorKey);
    
    // Create an error entry and document it
    const errorEntry: ErrorEntry = {
      title: `Runtime Error: ${event.message.substring(0, 50)}`,
      status: 'Investigating',
      description: event.message,
      errorMessages: [event.message],
      affectedFiles: [event.filename || 'unknown'],
      resolutionSteps: [
        {
          description: 'Investigate error source',
          completed: false
        }
      ]
    };
    
    // Document the error
    documentError(errorEntry).catch(err => {
      console.error('Failed to document error:', err);
    });
    
    // Try to diagnose syntax errors
    if (event.error instanceof SyntaxError && event.filename) {
      fetch(event.filename)
        .then(response => response.text())
        .then(code => {
          diagnoseSyntaxError(event.filename, code);
        })
        .catch(err => {
          console.error(`Could not analyze ${event.filename}:`, err);
        });
    }
    
    // Return false to allow the default browser error handling
    return false;
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', {
      reason: event.reason,
      stack: event.reason?.stack,
    });
    
    // Create a unique key for this error
    const errorKey = `promise:${event.reason.toString()}`;
    
    // Check if we've already documented this error
    if (isErrorDocumented(errorKey)) {
      console.log('This promise rejection has already been documented, skipping');
      return;
    }
    
    // Add to documented errors set
    addToDocumentedErrors(errorKey);
    
    // Create an error entry and document it
    const errorEntry: ErrorEntry = {
      title: `Unhandled Promise Rejection: ${event.reason.toString().substring(0, 50)}`,
      status: 'Investigating',
      description: event.reason.toString(),
      errorMessages: [event.reason.toString()],
      affectedFiles: ['unknown'],
      resolutionSteps: [
        {
          description: 'Investigate promise rejection source',
          completed: false
        }
      ]
    };
    
    // Document the error
    documentError(errorEntry).catch(err => {
      console.error('Failed to document error:', err);
    });
  });

  console.info('Global error handlers installed');
};
