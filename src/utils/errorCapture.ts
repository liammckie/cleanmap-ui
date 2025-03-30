/**
 * Utility for capturing and logging global errors
 */
import { logBrowserInfo, checkForBrowserCompatibilityIssues } from './browserInfo';
import { diagnoseSyntaxError } from './syntaxChecker';
import { documentError, documentBuildError } from '@/services/documentation/documentationService';
import { ErrorEntry } from '@/utils/documentationManager';
import { writeToStorage, readFromStorage } from './localStorageManager';

// Store for errors that have already been documented
const ERROR_CACHE_KEY = 'error_cache';
const documentedErrors = new Set<string>(
  JSON.parse(readFromStorage(ERROR_CACHE_KEY) || '[]')
);

// Helper to update the error cache
const updateErrorCache = () => {
  writeToStorage(ERROR_CACHE_KEY, JSON.stringify(Array.from(documentedErrors)));
};

/**
 * Sets up global error handlers to capture and log errors
 * that might be missed by the React error boundary
 */
export const captureGlobalErrors = () => {
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
    if (documentedErrors.has(errorKey)) {
      console.log('This error has already been documented, skipping');
      return false;
    }
    
    // Add to documented errors set
    documentedErrors.add(errorKey);
    updateErrorCache();
    
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
    if (documentedErrors.has(errorKey)) {
      console.log('This promise rejection has already been documented, skipping');
      return;
    }
    
    // Add to documented errors set
    documentedErrors.add(errorKey);
    updateErrorCache();
    
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

/**
 * Logs an application error and updates documentation
 * @param error The error object
 * @param context Additional context about where the error occurred
 */
export const logAndDocumentError = (error: Error, context: {
  component?: string;
  operation?: string;
  additionalInfo?: Record<string, any>;
}): void => {
  // Log the error to the console
  console.error('Application error:', {
    message: error.message,
    stack: error.stack,
    ...context
  });
  
  // Create a unique key for this error
  const errorKey = `${context.component || 'unknown'}:${context.operation || 'unknown'}:${error.message}`;
  
  // Check if we've already documented this error
  if (documentedErrors.has(errorKey)) {
    console.log('This application error has already been documented, skipping');
    return;
  }
  
  // Add to documented errors set
  documentedErrors.add(errorKey);
  updateErrorCache();
  
  // Create error entry with relevant information
  const errorEntry: ErrorEntry = {
    title: `Error in ${context.component || 'unknown component'}: ${error.message.substring(0, 50)}`,
    status: 'Investigating',
    description: error.message,
    errorMessages: [error.message],
    affectedFiles: context.component ? [`src/services/${context.component}.ts`] : ['unknown'],
    resolutionSteps: [
      {
        description: `Investigate error in ${context.operation || 'operation'}`,
        completed: false
      }
    ]
  };
  
  // Add additional steps based on error message patterns
  if (error.message.includes('required')) {
    errorEntry.resolutionSteps.push({
      description: 'Check for missing required fields',
      completed: false
    });
  }
  
  if (error.message.includes('type')) {
    errorEntry.resolutionSteps.push({
      description: 'Verify type compatibility between form and database schema',
      completed: false
    });
  }
  
  // Document the error
  documentError(errorEntry).catch(err => {
    console.error('Failed to document error:', err);
  });
};

/**
 * Captures and documents a TypeScript build error
 * @param errorMessage The TypeScript error message
 * @param filePath Path to the file with the error
 */
export const captureBuildError = (errorMessage: string, filePath: string): void => {
  console.error(`Build error in ${filePath}:`, errorMessage);
  
  // Create a unique key for this error
  const errorKey = `build:${filePath}:${errorMessage}`;
  
  // Check if we've already documented this error
  if (documentedErrors.has(errorKey)) {
    console.log('This build error has already been documented, skipping');
    return;
  }
  
  // Add to documented errors set
  documentedErrors.add(errorKey);
  updateErrorCache();
  
  // Parse error for title
  const errorTitle = errorMessage.includes(':')
    ? errorMessage.split(':').slice(0, 2).join(':')
    : errorMessage.substring(0, 50);
  
  // Create error entry
  const errorEntry: ErrorEntry = {
    title: `Build Error: ${errorTitle}`,
    status: 'Investigating',
    description: `TypeScript build error in ${filePath}`,
    errorMessages: [errorMessage],
    affectedFiles: [filePath],
    resolutionSteps: [
      {
        description: 'Investigate TypeScript error',
        completed: false
      }
    ]
  };
  
  // Add additional steps based on error patterns
  if (errorMessage.includes('No overload matches this call')) {
    errorEntry.resolutionSteps.push({
      description: 'Check function parameter types',
      completed: false
    });
    
    if (errorMessage.includes('required')) {
      errorEntry.resolutionSteps.push({
        description: 'Ensure required fields are provided',
        completed: false
      });
    }
  }
  
  // Document the error
  documentBuildError(errorEntry).catch(err => {
    console.error('Failed to document build error:', err);
  });
};

/**
 * Creates a single comprehensive error report for an issue
 * @param title Title of the error
 * @param description Detailed description
 * @param errors Collection of error messages
 * @param files Affected files
 * @returns The error entry that was created
 */
export const createComprehensiveErrorReport = (
  title: string,
  description: string,
  errors: string[],
  files: string[]
): ErrorEntry => {
  // Create a unique key for this error
  const errorKey = `report:${title}`;
  
  // Check if we've already documented this error
  if (documentedErrors.has(errorKey)) {
    console.log('This error report has already been documented, skipping');
    return {
      title,
      status: 'Investigating',
      description,
      errorMessages: errors,
      affectedFiles: files,
      resolutionSteps: []
    };
  }
  
  // Add to documented errors set
  documentedErrors.add(errorKey);
  updateErrorCache();
  
  // Create error entry
  const errorEntry: ErrorEntry = {
    title,
    status: 'Investigating',
    description,
    errorMessages: errors,
    affectedFiles: files,
    resolutionSteps: [
      {
        description: 'Investigate issue',
        completed: false
      }
    ]
  };
  
  // Auto-analyze errors and suggest resolution steps
  if (errors.some(e => e.includes('type'))) {
    errorEntry.resolutionSteps.push({
      description: 'Check type compatibility',
      completed: false
    });
  }
  
  if (errors.some(e => e.includes('undefined') || e.includes('null'))) {
    errorEntry.resolutionSteps.push({
      description: 'Add null/undefined checks',
      completed: false
    });
  }
  
  if (errors.some(e => e.includes('async') || e.includes('promise'))) {
    errorEntry.resolutionSteps.push({
      description: 'Review async/await flow',
      completed: false
    });
  }
  
  // Document the error
  documentError(errorEntry).catch(err => {
    console.error('Failed to document comprehensive error report:', err);
  });
  
  return errorEntry;
};
