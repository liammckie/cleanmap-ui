
/**
 * Documentation Review Service
 * 
 * Provides functionality to review documentation before implementing
 * code changes, especially for fixing bugs or errors.
 */

import { 
  DOCUMENTATION_PATHS,
  performDocumentationReview
} from '@/utils/documentationManager';

/**
 * Interface for a documentation review checklist item
 */
export interface ReviewChecklistItem {
  id: string;
  description: string;
  documentationPath: string;
  required: boolean;
  checked: boolean;
}

/**
 * Gets the pre-implementation review checklist
 * @param errorType Optional type of error being fixed (to customize checklist)
 * @returns Checklist of documentation to review
 */
export function getPreImplementationChecklist(errorType?: 'type' | 'build' | 'runtime' | 'schema'): ReviewChecklistItem[] {
  const checklist: ReviewChecklistItem[] = [
    {
      id: 'error-log',
      description: 'Review current and past errors in ERROR_LOG.md',
      documentationPath: DOCUMENTATION_PATHS.ERROR_LOG,
      required: true,
      checked: false
    },
    {
      id: 'review-process',
      description: 'Review documentation review process',
      documentationPath: DOCUMENTATION_PATHS.DOCUMENTATION_REVIEW,
      required: true,
      checked: false
    }
  ];
  
  // Add specific items based on error type
  if (errorType === 'type' || !errorType) {
    checklist.push({
      id: 'type-inconsistencies',
      description: 'Check for related type issues in TYPE_INCONSISTENCIES.md',
      documentationPath: DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES,
      required: errorType === 'type',
      checked: false
    });
  }
  
  if (errorType === 'build' || !errorType) {
    checklist.push({
      id: 'build-errors',
      description: 'Review standard approaches in BUILD_ERROR_RESOLUTION.md',
      documentationPath: DOCUMENTATION_PATHS.BUILD_ERROR_RESOLUTION,
      required: errorType === 'build',
      checked: false
    });
  }
  
  if (errorType === 'schema' || !errorType) {
    checklist.push({
      id: 'schema-changelog',
      description: 'Understand recent schema changes in SCHEMA_CHANGELOG.md',
      documentationPath: DOCUMENTATION_PATHS.SCHEMA_CHANGELOG,
      required: errorType === 'schema',
      checked: false
    });
  }
  
  return checklist;
}

/**
 * Performs an automated documentation review for an error
 * @param errorTitle Title of the error to review documentation for
 * @returns Review results with status and any issues found
 */
export async function reviewDocumentationForError(errorTitle: string): Promise<{
  passed: boolean;
  issues: string[];
  relevantDocuments: Array<{ path: string; section: string; importance: 'high' | 'medium' | 'low' }>;
}> {
  console.info(`Reviewing documentation for error: ${errorTitle}`);
  
  // Determine error type based on title
  let errorType: 'type' | 'build' | 'runtime' | 'schema' | undefined;
  
  if (errorTitle.toLowerCase().includes('type')) {
    errorType = 'type';
  } else if (errorTitle.toLowerCase().includes('build')) {
    errorType = 'build';
  } else if (errorTitle.toLowerCase().includes('schema')) {
    errorType = 'schema';
  } else {
    errorType = 'runtime';
  }
  
  // Get the checklist for this error type
  const checklist = getPreImplementationChecklist(errorType);
  
  // Perform the review
  const reviewResults = performDocumentationReview(errorTitle);
  
  // Convert review results to expected format
  const relevantDocuments = reviewResults.relevantDocuments.map(doc => ({
    path: doc.path,
    section: doc.relevantSection,
    importance: doc.path === DOCUMENTATION_PATHS.ERROR_LOG ? 'high' : 'medium' as 'high' | 'medium' | 'low'
  }));
  
  // Add any high importance documents that were missed
  const requiredChecklist = checklist.filter(item => item.required);
  for (const item of requiredChecklist) {
    if (!relevantDocuments.some(doc => doc.path === item.documentationPath)) {
      relevantDocuments.push({
        path: item.documentationPath,
        section: 'All',
        importance: 'high'
      });
    }
  }
  
  return {
    passed: reviewResults.passed,
    issues: reviewResults.issues,
    relevantDocuments
  };
}

/**
 * Checks if a file is documented in the schema changelog
 * @param filePath Path of the file to check
 * @returns Whether the file has documentation in the schema changelog
 */
export async function isFileDocumented(filePath: string): Promise<boolean> {
  console.info(`Checking if file is documented: ${filePath}`);
  
  // This would need a real implementation to check the documentation
  // For now, we just return true for schema files and false for others
  return filePath.includes('schema');
}

/**
 * Suggests documentation updates for a code change
 * @param filePaths Paths of files being changed
 * @param changeDescription Description of the changes being made
 * @returns Suggested documentation updates
 */
export async function suggestDocumentationUpdates(
  filePaths: string[],
  changeDescription: string
): Promise<Array<{
  documentPath: string;
  updateType: 'add' | 'modify' | 'review';
  suggestion: string;
}>> {
  console.info('Suggesting documentation updates for changes');
  
  const suggestions: Array<{
    documentPath: string;
    updateType: 'add' | 'modify' | 'review';
    suggestion: string;
  }> = [];
  
  // Check each file path for potential documentation needs
  for (const filePath of filePaths) {
    if (filePath.includes('schema')) {
      suggestions.push({
        documentPath: DOCUMENTATION_PATHS.SCHEMA_CHANGELOG,
        updateType: 'add',
        suggestion: `Document schema changes in ${filePath}`
      });
    }
    
    if (filePath.includes('service') || filePath.includes('Service')) {
      suggestions.push({
        documentPath: 'src/documentation/modules/' + filePath.split('/').slice(-2)[0] + '.md',
        updateType: 'modify',
        suggestion: `Update service documentation for ${filePath}`
      });
    }
  }
  
  // If this is a bug fix, suggest updating the error log
  if (changeDescription.toLowerCase().includes('fix') || 
      changeDescription.toLowerCase().includes('bug') ||
      changeDescription.toLowerCase().includes('error')) {
    suggestions.push({
      documentPath: DOCUMENTATION_PATHS.ERROR_LOG,
      updateType: 'modify',
      suggestion: 'Update error status to Resolved'
    });
  }
  
  return suggestions;
}
