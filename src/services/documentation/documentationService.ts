
/**
 * Documentation Service
 * 
 * Provides functionality to manage, update, and review documentation
 * as part of the development workflow.
 */

import { 
  addErrorToLog,
  updateErrorStatus, 
  performDocumentationReview,
  updateSchemaChangelog,
  createDocumentationReference,
  DOCUMENTATION_PATHS,
  type ErrorEntry
} from '@/utils/documentationManager';
import { captureBuildError } from '@/utils/errorCapture';
import { format } from 'date-fns';

/**
 * Documents a new error or issue in the system
 * @param errorDetails Details of the error to document
 */
export async function documentError(errorDetails: ErrorEntry): Promise<void> {
  console.info('Documenting new error:', errorDetails.title);
  
  // Log the error in the error log
  addErrorToLog(errorDetails);
  
  // If this is a type inconsistency, also update the TYPE_INCONSISTENCIES.md
  if (errorDetails.title.toLowerCase().includes('type') || 
      errorDetails.description.toLowerCase().includes('type') ||
      errorDetails.errorMessages.some(msg => msg.toLowerCase().includes('type'))) {
    
    console.info('Type-related error detected, updating TYPE_INCONSISTENCIES.md');
    
    // In a full implementation, we would update the TYPE_INCONSISTENCIES.md file
    // with details from the error
    
    // Find patterns in error messages that indicate specific type issues
    const isRequiredVsOptional = errorDetails.errorMessages.some(msg => 
      msg.includes('required') && msg.includes('optional')
    );
    
    const isWrongType = errorDetails.errorMessages.some(msg => 
      msg.includes('not assignable to') || msg.includes('No overload matches')
    );
    
    if (isRequiredVsOptional) {
      console.info('Required vs. Optional field mismatch detected');
      // Would update TYPE_INCONSISTENCIES.md with specific advice
    }
    
    if (isWrongType) {
      console.info('Type incompatibility detected');
      // Would update TYPE_INCONSISTENCIES.md with specific advice
    }
  }
  
  // Create references in related documentation
  createErrorReferences(errorDetails);
}

/**
 * Updates the status or details of an existing error
 * @param errorTitle Title of the error to update
 * @param errorUpdates Updates to apply to the error
 */
export async function updateErrorDocumentation(
  errorTitle: string,
  errorUpdates: {
    status?: 'Investigating' | 'In Progress' | 'Resolved';
    completedSteps?: number[];
    newSteps?: Array<{
      description: string;
      completed: boolean;
    }>;
    rootCause?: string;
    additionalErrorMessages?: string[];
  }
): Promise<void> {
  console.info('Updating error documentation for:', errorTitle);
  
  // Update the error in the error log
  updateErrorStatus(errorTitle, errorUpdates);
  
  // If error is resolved, move it to resolved section
  if (errorUpdates.status === 'Resolved') {
    console.info('Error resolved, moving to Resolved section in ERROR_LOG.md');
    
    // Would add a note in SCHEMA_CHANGELOG.md if this was a schema-related error
    if (errorTitle.toLowerCase().includes('schema') || 
        errorTitle.toLowerCase().includes('database') ||
        errorTitle.toLowerCase().includes('type')) {
      
      updateSchemaChangelog('Fixed', [
        `Fixed issue: ${errorTitle}`
      ]);
    }
  }
}

/**
 * Performs a pre-implementation documentation review
 * @param errorTitle Optional title of the related error
 * @returns Review results including status and relevant documents
 */
export async function reviewDocumentation(errorTitle?: string): Promise<{
  passed: boolean;
  issues: string[];
  relevantDocuments: Array<{ path: string; relevantSection: string }>;
}> {
  console.info('Performing documentation review');
  
  // Perform the review
  const reviewResults = performDocumentationReview(errorTitle);
  
  // Log review results
  console.info(`Documentation review ${reviewResults.passed ? 'passed' : 'failed'}`);
  if (reviewResults.issues.length > 0) {
    console.warn('Documentation issues found:', reviewResults.issues);
  }
  
  return reviewResults;
}

/**
 * Documents a schema change in the SCHEMA_CHANGELOG.md
 * @param changeType Type of schema change
 * @param changes Array of change descriptions
 */
export async function documentSchemaChange(
  changeType: 'Added' | 'Modified' | 'Fixed' | 'Refactored' | 'Security',
  changes: string[]
): Promise<void> {
  console.info(`Documenting schema change (${changeType}):`, changes);
  
  // Update the schema changelog
  updateSchemaChangelog(changeType, changes);
}

/**
 * Creates references between an error and related documentation
 * @param errorDetails Details of the error to reference
 */
function createErrorReferences(errorDetails: ErrorEntry): void {
  // Determine which documentation files are relevant to this error
  const relevantDocuments: string[] = [];
  
  // Type errors are relevant to TYPE_INCONSISTENCIES.md
  if (errorDetails.title.toLowerCase().includes('type') || 
      errorDetails.description.toLowerCase().includes('type') ||
      errorDetails.errorMessages.some(msg => msg.toLowerCase().includes('type'))) {
    relevantDocuments.push(DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES);
  }
  
  // Build errors are relevant to BUILD_ERROR_RESOLUTION.md
  if (errorDetails.title.toLowerCase().includes('build') || 
      errorDetails.description.toLowerCase().includes('build') ||
      errorDetails.errorMessages.some(msg => msg.toLowerCase().includes('error'))) {
    relevantDocuments.push(DOCUMENTATION_PATHS.BUILD_ERROR_RESOLUTION);
  }
  
  // Schema-related errors are relevant to SCHEMA_CHANGELOG.md
  if (errorDetails.title.toLowerCase().includes('schema') || 
      errorDetails.description.toLowerCase().includes('schema') ||
      errorDetails.affectedFiles.some(file => file.includes('schema'))) {
    relevantDocuments.push(DOCUMENTATION_PATHS.SCHEMA_CHANGELOG);
  }
  
  // Create references to/from all relevant documents
  for (const docPath of relevantDocuments) {
    createDocumentationReference(
      DOCUMENTATION_PATHS.ERROR_LOG,
      docPath,
      errorDetails.title,
      `See also: ${docPath}`
    );
    
    createDocumentationReference(
      docPath,
      DOCUMENTATION_PATHS.ERROR_LOG,
      'Related Errors',
      `See error: ${errorDetails.title} in ERROR_LOG.md`
    );
  }
}

/**
 * Finalizes documentation for a completed feature or bug fix
 * @param errorTitle Optional title of the related error that was fixed
 * @param summary Summary of changes made
 * @param affectedFiles Files that were modified
 */
export async function finalizeDocumentation(
  errorTitle: string | undefined,
  summary: string,
  affectedFiles: string[]
): Promise<void> {
  console.info('Finalizing documentation for:', errorTitle || 'feature implementation');
  
  // Update error status if this was fixing a documented error
  if (errorTitle) {
    updateErrorStatus(errorTitle, { 
      status: 'Resolved',
      rootCause: summary
    });
    
    // Document the resolution date
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    console.info(`Resolution date: ${currentDate}`);
  }
  
  // Document any schema changes if relevant
  if (affectedFiles.some(file => file.includes('schema'))) {
    documentSchemaChange('Fixed', [summary]);
  }
  
  console.info('Documentation finalized');
}

/**
 * Set up monitoring to automatically capture build errors
 */
export function setupBuildErrorMonitoring(): void {
  console.info('Setting up build error monitoring for documentation');
  
  // In a real CI/CD environment, this would hook into the build process
  // For now we'll listen for error messages in the console that match build error patterns
  
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Call the original console.error
    originalConsoleError.apply(console, args);
    
    // Check if this might be a build error
    const errorStr = args.join(' ');
    if (
      errorStr.includes('error TS') || 
      errorStr.includes('No overload matches') ||
      errorStr.includes('is not assignable to type')
    ) {
      // Try to extract file path and error message
      const match = errorStr.match(/([^()\n:]+\.ts\w*):(\d+):(\d+):\s*(.*)/);
      if (match) {
        const [_, filePath, line, column, message] = match;
        captureBuildError(message, filePath);
      } else {
        // If we can't extract details, just use the whole string
        captureBuildError(errorStr, 'unknown');
      }
    }
  };
}

/**
 * Documents the resolution of a type inconsistency
 * @param errorTitle Title of the error being resolved
 * @param resolution Details of how the type issue was resolved
 * @param affectedFiles Files that were modified
 */
export async function documentTypeResolution(
  errorTitle: string,
  resolution: string,
  affectedFiles: string[]
): Promise<void> {
  // Update error status
  await updateErrorDocumentation(errorTitle, {
    status: 'Resolved',
    rootCause: resolution
  });
  
  // Add to TYPE_INCONSISTENCIES.md
  console.info('Updating TYPE_INCONSISTENCIES.md with resolution details');
  
  // Would update the type inconsistencies document with details about how
  // the resolution was implemented and lessons learned
  
  // Also add to schema changelog if schema files were affected
  if (affectedFiles.some(file => file.includes('schema'))) {
    await documentSchemaChange('Fixed', [
      `Fixed type inconsistency: ${errorTitle} - ${resolution}`
    ]);
  }
}

/**
 * Documents the current state of TypeScript errors in the project
 * @param errors Array of TypeScript error messages
 */
export async function documentTypeScriptErrors(errors: string[]): Promise<void> {
  console.info(`Documenting ${errors.length} TypeScript errors`);
  
  // Group errors by file
  const errorsByFile: Record<string, string[]> = {};
  
  errors.forEach(error => {
    const match = error.match(/([^()\n:]+\.ts\w*):(\d+):(\d+):\s*(.*)/);
    if (match) {
      const [_, filePath, line, column, message] = match;
      if (!errorsByFile[filePath]) {
        errorsByFile[filePath] = [];
      }
      errorsByFile[filePath].push(message);
    } else {
      // If we can't extract file, put in 'unknown'
      if (!errorsByFile['unknown']) {
        errorsByFile['unknown'] = [];
      }
      errorsByFile['unknown'].push(error);
    }
  });
  
  // For each file with errors, create an error entry
  Object.entries(errorsByFile).forEach(([filePath, messages]) => {
    const errorEntry: ErrorEntry = {
      title: `TypeScript Errors in ${filePath}`,
      status: 'Investigating',
      description: `Build failing due to TypeScript errors in ${filePath}`,
      errorMessages: messages,
      affectedFiles: [filePath],
      resolutionSteps: [
        {
          description: 'Review TypeScript errors',
          completed: false
        },
        {
          description: 'Fix type inconsistencies',
          completed: false
        },
        {
          description: 'Update error documentation',
          completed: false
        }
      ]
    };
    
    // Add the error to the log
    addErrorToLog(errorEntry);
  });
}
