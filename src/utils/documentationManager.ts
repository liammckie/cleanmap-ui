/**
 * Documentation Manager Utility
 * 
 * Provides functionality to automatically update and maintain documentation
 * files based on errors, code changes, and system events.
 */

import { format } from 'date-fns';

// Documentation file paths
export const DOCUMENTATION_PATHS = {
  ERROR_LOG: 'src/documentation/ERROR_LOG.md',
  TYPE_INCONSISTENCIES: 'src/documentation/debugging/TYPE_INCONSISTENCIES.md',
  BUILD_ERROR_RESOLUTION: 'src/documentation/debugging/BUILD_ERROR_RESOLUTION.md',
  DOCUMENTATION_REVIEW: 'src/documentation/DOCUMENTATION_REVIEW_PROCESS.md',
  SCHEMA_CHANGELOG: 'src/documentation/SCHEMA_CHANGELOG.md',
  DATABASE_RULES: 'src/documentation/DATABASE_RULES.md'
};

/**
 * Interface for an error entry to be added to the error log
 */
export interface ErrorEntry {
  title: string;
  status: 'Investigating' | 'In Progress' | 'Resolved';
  description: string;
  errorMessages: string[];
  rootCause?: string;
  affectedFiles: string[];
  resolutionSteps: Array<{
    description: string;
    completed: boolean;
  }>;
}

/**
 * Reads a documentation file
 * @param filePath Path to the documentation file
 * @returns Content of the file as a string
 */
export const readDocumentationFile = (filePath: string): string => {
  try {
    // In a browser environment, we'll need to use fetch to read files
    // This is a simplified implementation for demonstration
    console.log(`Reading documentation file: ${filePath}`);
    
    // For the ERROR_LOG.md, we have it in memory
    if (filePath === DOCUMENTATION_PATHS.ERROR_LOG) {
      return `# Error Log

This document tracks errors, bugs, and build issues encountered in the application, along with their resolution status and steps taken.

## Active Issues

### Work Order Form Type Inconsistencies

**Status:** In Progress  
**First Identified:** 2024-06-14  
**Last Updated:** 2024-06-14  
**Severity:** High  

**Description:**
Type errors in WorkOrderForm and workOrderService preventing successful build.

**Error Messages:**
- \`Property 'isSubmitting' does not exist on type 'IntrinsicAttributes & FormActionsProps'\`
- \`Property 'description' is optional in type but required in Supabase insert call\`

**Root Cause Analysis:**
- The FormActions component doesn't include isSubmitting in its props interface
- The workOrderService.ts insert function requires description field but it's being treated as optional

**Resolution Steps:**
1. ✅ Update FormActions component to include isSubmitting prop
2. ✅ Ensure description is properly handled as required in workOrderService.ts

**Related Files:**
- src/components/operations/workOrder/form-sections/FormActions.tsx
- src/services/workOrders/workOrderService.ts

---

## Resolved Issues

### Example Resolved Issue (Template)

**Status:** Resolved  
**First Identified:** YYYY-MM-DD  
**Resolved On:** YYYY-MM-DD  
**Severity:** Low/Medium/High/Critical  

**Description:**
Brief description of the issue

**Error Messages:**
- Exact error messages

**Root Cause:**
Explanation of what caused the issue

**Resolution:**
How the issue was fixed

**Affected Files:**
- List of files that were modified to fix the issue

**Prevention Measures:**
Steps taken to prevent similar issues in the future (tests, validations, etc.)

---

## Error Log Maintenance Guidelines

### Adding New Issues

When adding a new issue to the log:

1. Create a descriptive title for the issue
2. Set the status to "Investigating" or "In Progress"
3. Record the date identified
4. Document error messages exactly as they appear
5. List files likely to be involved
6. Create initial resolution steps if known

### Updating Issues

When working on an issue:

1. Update the "Last Updated" date
2. Mark completed steps with ✅
3. Add new information discovered during investigation
4. Refine the root cause analysis as more is learned
5. Add new resolution steps as needed

### Resolving Issues

When an issue is resolved:

1. Change status to "Resolved"
2. Add the resolution date
3. Document the final root cause
4. Document the complete resolution
5. List all affected files
6. Move the issue to the "Resolved Issues" section
7. Add any prevention measures implemented

This log should be updated regularly as part of the development process to maintain an accurate record of issues and their resolutions.
`;
    }
    
    // Return empty string for other files
    return '';
  } catch (error) {
    console.error(`Error reading documentation file ${filePath}:`, error);
    return '';
  }
};

/**
 * Updates a documentation file
 * @param filePath Path to the documentation file
 * @param content New content for the file
 */
export const writeDocumentationFile = (filePath: string, content: string): void => {
  try {
    // In a production environment, this would write to actual files
    // For this implementation, we'll log what would be written
    console.log(`Writing to documentation file: ${filePath}`);
    console.log('Content preview:', content.substring(0, 200) + '...');
    
    // In a real implementation with Node.js:
    // fs.writeFileSync(filePath, content, 'utf8');
    
    // For now, we can store this in localStorage for demo purposes
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`doc:${filePath}`, content);
    }
  } catch (error) {
    console.error(`Error writing to documentation file ${filePath}:`, error);
  }
};

/**
 * Adds a new error entry to the error log
 * @param error Error entry to add
 */
export const addErrorToLog = (error: ErrorEntry): void => {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const errorTemplate = `
### ${error.title}

**Status:** ${error.status}  
**First Identified:** ${currentDate}  
**Last Updated:** ${currentDate}  
**Severity:** High  

**Description:**
${error.description}

**Error Messages:**
${error.errorMessages.map(msg => `- \`${msg}\``).join('\n')}

**Root Cause Analysis:**
${error.rootCause || 'Under investigation'}

**Resolution Steps:**
${error.resolutionSteps.map(step => 
  `${step.completed ? '✅' : '⬜'} ${step.description}`
).join('\n')}

**Related Files:**
${error.affectedFiles.map(file => `- ${file}`).join('\n')}

---
`;

  // Get the current error log
  const errorLogPath = DOCUMENTATION_PATHS.ERROR_LOG;
  const errorLog = readDocumentationFile(errorLogPath);

  // Insert the new error after the "Active Issues" header
  const updatedErrorLog = errorLog.replace(
    '## Active Issues',
    '## Active Issues\n\n' + errorTemplate
  );

  // Write the updated error log
  writeDocumentationFile(errorLogPath, updatedErrorLog);
  
  // Now that we've added to ERROR_LOG.md, also update type inconsistencies if relevant
  if (
    error.title.toLowerCase().includes('type') || 
    error.description.toLowerCase().includes('type') ||
    error.errorMessages.some(msg => 
      msg.toLowerCase().includes('type') || 
      msg.toLowerCase().includes('overload') ||
      msg.toLowerCase().includes('parameter')
    )
  ) {
    updateTypeInconsistenciesDoc(error);
  }
  
  // Update build error resolution if relevant
  if (
    error.title.toLowerCase().includes('build') || 
    error.title.toLowerCase().includes('error') ||
    error.errorMessages.some(msg => msg.toLowerCase().includes('error'))
  ) {
    updateBuildErrorResolutionDoc(error);
  }
};

/**
 * Updates the type inconsistencies documentation with a new error
 * @param error Error entry to add
 */
const updateTypeInconsistenciesDoc = (error: ErrorEntry): void => {
  // Get the current type inconsistencies doc
  const typeDocPath = DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES;
  const typeDoc = readDocumentationFile(typeDocPath);
  
  // For now, just log that we would update it
  console.log(`Would update ${typeDocPath} with error: ${error.title}`);
  console.log('Error messages:', error.errorMessages);
};

/**
 * Updates the build error resolution documentation with a new error
 * @param error Error entry to add
 */
const updateBuildErrorResolutionDoc = (error: ErrorEntry): void => {
  // Get the current build error resolution doc
  const buildErrorDocPath = DOCUMENTATION_PATHS.BUILD_ERROR_RESOLUTION;
  const buildErrorDoc = readDocumentationFile(buildErrorDocPath);
  
  // For now, just log that we would update it
  console.log(`Would update ${buildErrorDocPath} with error: ${error.title}`);
  console.log('Error messages:', error.errorMessages);
};

/**
 * Updates the status of an existing error in the error log
 * @param errorTitle Title of the error to update
 * @param updates Updates to apply to the error entry
 */
export const updateErrorStatus = (
  errorTitle: string,
  updates: {
    status?: 'Investigating' | 'In Progress' | 'Resolved';
    completedSteps?: number[];
    newSteps?: Array<{
      description: string;
      completed: boolean;
    }>;
    rootCause?: string;
    additionalErrorMessages?: string[];
  }
): void => {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const errorLogPath = DOCUMENTATION_PATHS.ERROR_LOG;
  const errorLog = readDocumentationFile(errorLogPath);

  // Find the error entry in the error log
  const errorStartRegex = new RegExp(`### ${errorTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  const errorStartMatch = errorLog.match(errorStartRegex);
  
  if (!errorStartMatch) {
    console.error(`Error "${errorTitle}" not found in error log`);
    return;
  }
  
  // Find the end of the error entry (either the next error or the end of the section)
  const errorStartIndex = errorStartMatch.index!;
  let errorEndIndex = errorLog.indexOf('### ', errorStartIndex + 1);
  if (errorEndIndex === -1) {
    errorEndIndex = errorLog.indexOf('## ', errorStartIndex + 1);
  }
  if (errorEndIndex === -1) {
    errorEndIndex = errorLog.length;
  }
  
  // Extract the error entry
  const errorEntry = errorLog.substring(errorStartIndex, errorEndIndex);
  
  // Update the entry based on the updates object
  let updatedEntry = errorEntry;
  
  // Update status if provided
  if (updates.status) {
    updatedEntry = updatedEntry.replace(
      /\*\*Status:\*\* [^\n]*/, 
      `**Status:** ${updates.status}`
    );
  }
  
  // Update last updated date
  updatedEntry = updatedEntry.replace(
    /\*\*Last Updated:\*\* [^\n]*/, 
    `**Last Updated:** ${currentDate}`
  );
  
  // Update root cause if provided
  if (updates.rootCause) {
    updatedEntry = updatedEntry.replace(
      /\*\*Root Cause Analysis:\*\*\n.*(?:\n(?![\*\n]).*)*/, 
      `**Root Cause Analysis:**\n${updates.rootCause}`
    );
  }
  
  // Update completed steps if provided
  if (updates.completedSteps && updates.completedSteps.length > 0) {
    const stepsLines = updatedEntry.match(/\*\*Resolution Steps:\*\*\n((?:⬜|✅)[^\n]*\n)*/);
    if (stepsLines) {
      const stepsText = stepsLines[0];
      const stepsArray = stepsText.split('\n').filter(line => line.trim().startsWith('⬜') || line.trim().startsWith('✅'));
      
      updates.completedSteps.forEach(stepIndex => {
        if (stepIndex >= 0 && stepIndex < stepsArray.length) {
          stepsArray[stepIndex] = stepsArray[stepIndex].replace('⬜', '✅');
        }
      });
      
      const updatedStepsText = `**Resolution Steps:**\n${stepsArray.join('\n')}`;
      updatedEntry = updatedEntry.replace(/\*\*Resolution Steps:\*\*\n((?:⬜|✅)[^\n]*\n)*/, updatedStepsText);
    }
  }
  
  // Add new steps if provided
  if (updates.newSteps && updates.newSteps.length > 0) {
    const newStepsText = updates.newSteps.map(step => 
      `${step.completed ? '✅' : '⬜'} ${step.description}`
    ).join('\n');
    
    // Add to existing steps
    updatedEntry = updatedEntry.replace(
      /(\*\*Resolution Steps:\*\*\n(?:(?:⬜|✅)[^\n]*\n)*)/, 
      `$1${newStepsText}\n`
    );
  }
  
  // Update the error log with the updated entry
  const updatedErrorLog = errorLog.substring(0, errorStartIndex) + updatedEntry + errorLog.substring(errorEndIndex);
  
  // If the error is resolved, move it to the resolved section
  if (updates.status === 'Resolved') {
    // Remove from active issues
    let withoutEntry = errorLog.substring(0, errorStartIndex) + errorLog.substring(errorEndIndex);
    
    // Add to resolved issues section
    withoutEntry = withoutEntry.replace(
      '## Resolved Issues', 
      `## Resolved Issues\n\n${updatedEntry}`
    );
    
    writeDocumentationFile(errorLogPath, withoutEntry);
  } else {
    // Otherwise just update in place
    writeDocumentationFile(errorLogPath, updatedErrorLog);
  }
};

/**
 * Performs a pre-implementation documentation review
 * @param relatedError Title of the related error (if any)
 * @returns Review status and any issues that need to be addressed
 */
export const performDocumentationReview = (relatedError?: string): { 
  passed: boolean; 
  issues: string[];
  relevantDocuments: Array<{ path: string; relevantSection: string }>;
} => {
  console.log(`Performing documentation review${relatedError ? ` for error: ${relatedError}` : ''}`);
  
  const relevantDocuments: Array<{ path: string; relevantSection: string }> = [
    { path: DOCUMENTATION_PATHS.ERROR_LOG, relevantSection: "Active Issues" }
  ];
  
  // Check if this is a type-related issue
  if (relatedError && (
    relatedError.toLowerCase().includes('type') || 
    relatedError.toLowerCase().includes('interface') ||
    relatedError.toLowerCase().includes('schema')
  )) {
    relevantDocuments.push({ 
      path: DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES, 
      relevantSection: "WorkOrder Type System" 
    });
  }
  
  // Check if this is a build error
  if (relatedError && (
    relatedError.toLowerCase().includes('build') || 
    relatedError.toLowerCase().includes('error') ||
    relatedError.toLowerCase().includes('typescript')
  )) {
    relevantDocuments.push({ 
      path: DOCUMENTATION_PATHS.BUILD_ERROR_RESOLUTION, 
      relevantSection: "TypeScript Errors" 
    });
  }
  
  return {
    passed: true,
    issues: [],
    relevantDocuments
  };
};

/**
 * Updates the schema changelog with a new entry
 * @param changeType Type of schema change ('Added', 'Modified', 'Fixed', 'Refactored', 'Security')
 * @param changes Array of change descriptions
 */
export const updateSchemaChangelog = (
  changeType: 'Added' | 'Modified' | 'Fixed' | 'Refactored' | 'Security',
  changes: string[]
): void => {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const changelogPath = DOCUMENTATION_PATHS.SCHEMA_CHANGELOG;
  const changelog = readDocumentationFile(changelogPath);

  const changeTemplate = `
## ${currentDate}

### ${changeType}

${changes.map(change => `- ${change}`).join('\n')}

`;

  // Insert the new entry after the title
  const updatedChangelog = changelog.replace(
    '# Schema Change Log',
    '# Schema Change Log' + changeTemplate
  );

  writeDocumentationFile(changelogPath, updatedChangelog);
};

/**
 * Creates a reference between related documentation files
 * @param sourcePath Source documentation file path
 * @param targetPath Target documentation file path
 * @param sourceSection Section in the source file to add the reference
 * @param referenceText Text for the reference link
 */
export const createDocumentationReference = (
  sourcePath: string,
  targetPath: string,
  sourceSection: string,
  referenceText: string
): void => {
  console.log(`Creating reference from ${sourcePath} to ${targetPath}`);
  console.log(`Would add to section "${sourceSection}": ${referenceText}`);
  
  // In a real implementation, we would:
  // 1. Read the source file
  // 2. Find the source section
  // 3. Add the reference text
  // 4. Write the updated file
};

// Export a function to add runtime error capture
export const initializeDocumentationSystem = () => {
  console.log('Documentation system initialized');
  
  // In a real implementation, this would set up listeners for errors
  window.addEventListener('error', (event) => {
    // Capture errors and log them to documentation
    console.log('Would log runtime error to documentation:', event.error);
    
    // Create an error entry
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
    
    // Add the error to the log
    addErrorToLog(errorEntry);
  });
};
