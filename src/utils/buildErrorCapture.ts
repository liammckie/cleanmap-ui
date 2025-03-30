
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
 * Sets up console error capturing for build errors
 */
export function setupConsoleErrorCapture(): void {
  const originalConsoleError = console.error;
  
  console.error = function(...args) {
    // Call the original console.error
    originalConsoleError.apply(console, args);
    
    // Check if this is a build error
    const errorString = args.join(' ');
    if (
      errorString.includes('error TS') || 
      errorString.includes('Module not found') ||
      errorString.includes('SyntaxError')
    ) {
      // Document as a build error
      documentBuildError(errorString);
    }
  };
  
  console.info('Console error capture set up for build errors');
}

/**
 * Simulates capturing build errors for testing
 * @param mockErrors Optional array of error messages to simulate
 */
export function simulateBuildErrorCapture(mockErrors?: string[]): void {
  console.info('Simulating build error capture');
  
  // Use provided errors or default to these examples
  const errors = mockErrors || [
    'src/utils/formSchemaValidator.ts:42:5: error TS2345: Argument of type \'unknown\' is not assignable to parameter of type \'ZodTypeAny\'.',
    'src/components/operations/workOrder/WorkOrderForm.tsx:128:23: Type \'Date | undefined\' is not assignable to type \'Date\'.',
    'src/services/workOrders/workOrderService.ts:56:18: Property \'site_id\' is optional in type but required in type.',
    'src/components/hr/EmployeeForm.tsx:89:12: Cannot find name \'EmployeeFormValues\'.'
  ];
  
  // Process each error
  const errorsByFile: Record<string, string[]> = {};
  
  errors.forEach(error => {
    // Document the error
    documentBuildError(error);
    
    // Extract file and message for analytics
    const errorInfo = captureBuildError(error);
    
    if (errorInfo) {
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
