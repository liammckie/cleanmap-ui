
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
    
    console.info('Type-related error detected, would update TYPE_INCONSISTENCIES.md');
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
    console.info('Error resolved, would move to Resolved section in ERROR_LOG.md');
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
      errorDetails.description.toLowerCase().includes('type')) {
    relevantDocuments.push(DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES);
  }
  
  // Build errors are relevant to BUILD_ERROR_RESOLUTION.md
  if (errorDetails.title.toLowerCase().includes('build') || 
      errorDetails.description.toLowerCase().includes('build')) {
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
    updateErrorStatus(errorTitle, { status: 'Resolved' });
  }
  
  // Document any schema changes if relevant
  if (affectedFiles.some(file => file.includes('schema'))) {
    documentSchemaChange('Fixed', [summary]);
  }
  
  console.info('Documentation finalized');
}

// Export a function to monitor for build errors and automatically document them
export function setupBuildErrorMonitoring(): void {
  console.info('Setting up build error monitoring for documentation');
  
  // This would need a real implementation integrated with the build system
  // For now, we'll just log that it would be set up
  console.info('Build error monitoring would capture errors and update documentation');
}
