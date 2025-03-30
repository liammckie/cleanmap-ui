
/**
 * Error analysis utilities
 * 
 * Provides tools for analyzing and diagnosing errors
 */
import { ErrorEntry } from '@/utils/documentationManager';
import { ErrorContext } from './types';

/**
 * Analyzes an error message to create additional resolution steps
 * @param errorMessage The error message to analyze
 * @returns Array of resolution steps
 */
export const analyzeErrorForResolutionSteps = (errorMessage: string): Array<{
  description: string;
  completed: boolean;
}> => {
  const steps: Array<{ description: string; completed: boolean }> = [
    {
      description: 'Investigate error source',
      completed: false
    }
  ];
  
  // Add additional steps based on error message patterns
  if (errorMessage.includes('required')) {
    steps.push({
      description: 'Check for missing required fields',
      completed: false
    });
  }
  
  if (errorMessage.includes('type')) {
    steps.push({
      description: 'Verify type compatibility between form and database schema',
      completed: false
    });
  }
  
  if (errorMessage.includes('undefined') || errorMessage.includes('null')) {
    steps.push({
      description: 'Add null/undefined checks',
      completed: false
    });
  }
  
  if (errorMessage.includes('async') || errorMessage.includes('promise')) {
    steps.push({
      description: 'Review async/await flow',
      completed: false
    });
  }
  
  return steps;
};

/**
 * Creates an error entry for documentation
 * @param title Error title
 * @param description Error description
 * @param errorMessages Array of error messages
 * @param affectedFiles Array of affected files
 * @param context Additional context
 * @returns The created error entry
 */
export const createErrorEntry = (
  title: string,
  description: string,
  errorMessages: string[],
  affectedFiles: string[],
  context?: ErrorContext
): ErrorEntry => {
  const steps = [
    {
      description: `Investigate error${context?.operation ? ' in ' + context.operation : ''}`,
      completed: false
    }
  ];
  
  // Add additional steps based on error message patterns
  if (errorMessages.length > 0) {
    const additionalSteps = analyzeErrorForResolutionSteps(errorMessages[0]);
    additionalSteps.forEach(step => {
      if (!steps.some(s => s.description === step.description)) {
        steps.push(step);
      }
    });
  }
  
  return {
    title,
    status: 'Investigating',
    description,
    errorMessages,
    affectedFiles,
    resolutionSteps: steps
  };
};
