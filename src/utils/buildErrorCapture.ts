
/**
 * Build Error Capture Utility
 * 
 * Monitors TypeScript build errors and automatically documents them
 */
import { captureBuildError } from './errorCapture';

// Error message pattern for TypeScript errors
const TS_ERROR_PATTERN = /([^()\n:]+\.ts\w*):(\d+):(\d+)(?:: error TS\d+:)?\s*(.*)/;

/**
 * Parses TypeScript error messages
 * @param errorOutput Raw error output from compiler
 * @returns Structured error information
 */
export function parseTypeScriptErrors(errorOutput: string): Array<{
  filePath: string;
  line: number;
  column: number;
  message: string;
}> {
  const errors = [];
  const lines = errorOutput.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(TS_ERROR_PATTERN);
    
    if (match) {
      const [_, filePath, lineNum, colNum, message] = match;
      errors.push({
        filePath,
        line: parseInt(lineNum, 10),
        column: parseInt(colNum, 10),
        message: message.trim()
      });
    }
  }
  
  return errors;
}

/**
 * Processes a collection of TypeScript errors and adds them to documentation
 * @param errorOutput Raw output from TypeScript compiler
 */
export function processBuildErrors(errorOutput: string): void {
  console.info('Processing TypeScript build errors');
  
  const errors = parseTypeScriptErrors(errorOutput);
  
  if (errors.length === 0) {
    console.info('No TypeScript errors found');
    return;
  }
  
  console.info(`Found ${errors.length} TypeScript errors`);
  
  // Group errors by file
  const errorsByFile: Record<string, string[]> = {};
  
  errors.forEach(error => {
    const { filePath, message } = error;
    if (!errorsByFile[filePath]) {
      errorsByFile[filePath] = [];
    }
    errorsByFile[filePath].push(message);
  });
  
  // Document each file's errors
  Object.entries(errorsByFile).forEach(([filePath, messages]) => {
    messages.forEach(message => {
      captureBuildError(message, filePath);
    });
  });
}

/**
 * Simulated build error capture for development environment
 * In a real implementation, this would be connected to the build process
 * @param sampleErrors Array of sample error messages for testing
 */
export function simulateBuildErrorCapture(sampleErrors?: string[]): void {
  console.info('Simulating build error capture');
  
  // Default sample errors if none provided
  const errors = sampleErrors || [
    'src/utils/formSchemaValidator.ts:42:5: error TS2345: Argument of type \'unknown\' is not assignable to parameter of type \'ZodTypeAny\'.',
    'src/components/operations/workOrder/WorkOrderForm.tsx:128:23: Type \'Date | undefined\' is not assignable to type \'Date\'.',
    'src/services/workOrders/workOrderService.ts:56:18: Property \'site_id\' is optional in type but required in type.'
  ];
  
  // Process the sample errors
  processBuildErrors(errors.join('\n'));
}

// Setup to capture console errors that might be TypeScript-related
export function setupConsoleErrorCapture(): void {
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Call the original console.error
    originalConsoleError.apply(console, args);
    
    // Check if this might be a TypeScript error
    const errorMsg = args.join(' ');
    if (
      errorMsg.includes('error TS') || 
      errorMsg.includes('Type ') && errorMsg.includes(' is not assignable to type ')
    ) {
      // Try to parse as TypeScript error
      const errors = parseTypeScriptErrors(errorMsg);
      if (errors.length > 0) {
        errors.forEach(error => {
          captureBuildError(error.message, error.filePath);
        });
      } else {
        // If we couldn't parse, just capture the raw message
        captureBuildError(errorMsg, 'unknown');
      }
    }
  };
}
