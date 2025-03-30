
/**
 * Error reporting utilities
 * 
 * Provides functionality for logging and documenting application errors
 */
import { documentError, documentBuildError } from '@/services/documentation/documentationService';
import { ErrorEntry } from '@/utils/documentationManager';
import { ErrorContext } from './types';
import { isErrorDocumented, addToDocumentedErrors } from './errorCache';
import { createErrorEntry } from './errorAnalysis';

/**
 * Logs an application error and updates documentation
 * @param error The error object
 * @param context Additional context about where the error occurred
 */
export const logAndDocumentError = (error: Error, context: ErrorContext): void => {
  // Log the error to the console
  console.error('Application error:', {
    message: error.message,
    stack: error.stack,
    ...context
  });
  
  // Create a unique key for this error
  const errorKey = `${context.component || 'unknown'}:${context.operation || 'unknown'}:${error.message}`;
  
  // Check if we've already documented this error
  if (isErrorDocumented(errorKey)) {
    console.log('This application error has already been documented, skipping');
    return;
  }
  
  // Add to documented errors set
  addToDocumentedErrors(errorKey);
  
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
  if (isErrorDocumented(errorKey)) {
    console.log('This build error has already been documented, skipping');
    return;
  }
  
  // Add to documented errors set
  addToDocumentedErrors(errorKey);
  
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
  documentBuildError(errorEntry);
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
  if (isErrorDocumented(errorKey)) {
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
  addToDocumentedErrors(errorKey);
  
  // Create error entry
  const errorEntry = createErrorEntry(title, description, errors, files);
  
  // Document the error
  documentError(errorEntry).catch(err => {
    console.error('Failed to document comprehensive error report:', err);
  });
  
  return errorEntry;
};
