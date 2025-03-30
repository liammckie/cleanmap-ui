/**
 * Documentation Manager Utility
 * 
 * Provides functionality to automatically update and maintain documentation
 * files based on errors, code changes, and system events.
 */

import { format } from 'date-fns';
import { 
  readFromStorage, 
  writeToStorage, 
  getAllDocumentation 
} from './localStorageManager';

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
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  firstIdentified?: string;
  resolvedOn?: string;
}

/**
 * Reads a documentation file
 * @param filePath Path to the documentation file
 * @returns Content of the file as a string
 */
export const readDocumentationFile = (filePath: string): string => {
  try {
    // First, try to read from localStorage
    const storedContent = readFromStorage(filePath);
    if (storedContent) {
      return storedContent;
    }
    
    // If not in localStorage, fallback to default content
    console.log(`Documentation file not found in localStorage: ${filePath}, loading default content`);
    
    // Return default content for ERROR_LOG.md
    if (filePath === DOCUMENTATION_PATHS.ERROR_LOG) {
      return `# Error Log

This document tracks errors, bugs, and build issues encountered in the application, along with their resolution status and steps taken.

## Active Issues

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
    
    if (filePath === DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES) {
      return `# Type Inconsistencies Documentation

This document provides detailed analysis of type inconsistencies in the application.

## Common Type Issues

### Date Handling Inconsistencies

A common source of typing errors stems from inconsistent date handling:

- **Database**: Stores dates as ISO strings
- **API Responses**: Return dates as strings
- **UI Components**: Expect Date objects for date pickers
- **Form Validation**: Zod schema expects Date objects

This leads to a cycle of conversions:
1. String from DB → Date for UI
2. Date in form → String for DB insert/update
3. String from DB → Date for form default values

### Required vs Optional Field Mismatches

Another common issue is mismatches between optional fields in forms and required fields in the database:

- Form fields are often marked as optional for user experience
- Database fields may be required for data integrity
- This creates a disconnect that must be handled in service layer

## Recommended Solutions

### Date Handling

1. Implement consistent date handling utilities:
   - \`toApiDate(date: Date): string\` - Convert for API calls
   - \`fromApiDate(dateString: string): Date\` - Convert from API responses
   - \`toFormDate(dateInput: Date | string): Date\` - Safely convert to form Date

### Required Field Validation

1. Add automatic validation of required fields:
   - Create a utility that validates all required fields before database operations
   - Generate validation code from database schema
   - Example:
  
\`\`\`typescript
// Validate required fields before submission
if (!formData.site_id) {
  throw new Error('Site ID is required for work orders');
}
\`\`\`

## Testing Strategy

1. Add TypeScript tests that verify type compatibility between layers
2. Add unit tests for date conversion utilities
3. Add integration tests that verify the full cycle: form submission → API → database → retrieval
4. Add runtime checks that validate database requirements are met before submission

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
    // Write to localStorage
    if (writeToStorage(filePath, content)) {
      console.log(`Successfully wrote to documentation file: ${filePath}`);
    } else {
      console.error(`Failed to write to documentation file: ${filePath}`);
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
  error.firstIdentified = error.firstIdentified || currentDate;
  
  const errorTemplate = `
### ${error.title}

**Status:** ${error.status}  
**First Identified:** ${error.firstIdentified}  
**Last Updated:** ${currentDate}  
**Severity:** ${error.severity || 'High'}  

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
  
  // Create a section for this specific error
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const typeSection = `
## ${error.title} (${currentDate})

**Status:** ${error.status}
**Related Files:** ${error.affectedFiles.join(', ')}

### Issue Description
${error.description}

### Error Messages
${error.errorMessages.map(msg => `- \`${msg}\``).join('\n')}

### Analysis
${analyzeTypeError(error)}

### Recommended Solution
${suggestTypeSolution(error)}

`;
  
  // Add the section to the document
  const updatedTypeDoc = typeDoc + typeSection;
  writeDocumentationFile(typeDocPath, updatedTypeDoc);
};

/**
 * Analyzes a type error and returns a description
 */
function analyzeTypeError(error: ErrorEntry): string {
  const errorText = error.errorMessages.join(' ');
  
  if (errorText.includes('required') && errorText.includes('optional')) {
    return 'This error is caused by a mismatch between required and optional fields. A field that is marked as optional in the form schema is required in the database schema.';
  }
  
  if (errorText.includes('Date') || errorText.includes('string') || errorText.includes('date')) {
    return 'This error is related to date handling. There is likely a mismatch between Date objects used in the application and string dates used in the database.';
  }
  
  if (errorText.includes('no overload matches')) {
    return 'This error indicates a function is being called with parameters that don\'t match any of its defined signatures. Check parameter types and required vs optional parameters.';
  }
  
  return 'This type error requires further investigation to determine the root cause.';
}

/**
 * Suggests a solution for a type error
 */
function suggestTypeSolution(error: ErrorEntry): string {
  const errorText = error.errorMessages.join(' ');
  
  if (errorText.includes('required') && errorText.includes('optional')) {
    return `
1. Add validation before database submission:
\`\`\`typescript
// Validate required fields
if (!data.requiredField) {
  throw new Error('Required field is missing');
}
\`\`\`

2. Or make the field required in the form schema:
\`\`\`typescript
const formSchema = z.object({
  requiredField: z.string(), // No .optional()
});
\`\`\`
`;
  }
  
  if (errorText.includes('Date') || errorText.includes('string') || errorText.includes('date')) {
    return `
1. Use proper date conversion utilities:
\`\`\`typescript
// When sending to API/database
const preparedData = {
  ...formData,
  dateField: formatDateForDb(formData.dateField)
};

// When receiving from API/database for form
const formDefaultValues = {
  ...data,
  dateField: data.dateField ? new Date(data.dateField) : undefined
};
\`\`\`
`;
  }
  
  return 'A detailed review of the code is needed to determine the appropriate solution for this type error.';
}

/**
 * Updates the build error resolution documentation with a new error
 * @param error Error entry to add
 */
const updateBuildErrorResolutionDoc = (error: ErrorEntry): void => {
  // Get the current build error resolution doc
  const buildErrorDocPath = DOCUMENTATION_PATHS.BUILD_ERROR_RESOLUTION;
  const buildErrorDoc = readDocumentationFile(buildErrorDocPath);
  
  // Check if we need to add a new error type section
  let errorType = 'General Error';
  if (error.errorMessages.some(msg => msg.includes('Type') || msg.includes('type'))) {
    errorType = 'Type Incompatibility';
  } else if (error.errorMessages.some(msg => msg.includes('property') || msg.includes('Property'))) {
    errorType = 'Property Does Not Exist on Type';
  } else if (error.errorMessages.some(msg => msg.includes('overload') || msg.includes('Overload'))) {
    errorType = 'No Overload Matches Call';
  }
  
  // Create a section for this error type if it doesn't exist
  if (!buildErrorDoc.includes(`### ${errorType}`)) {
    const newSection = `
### ${errorType}

**Example Error:**
\`\`\`
${error.errorMessages[0] || 'Error message'}
\`\`\`

**Resolution Steps:**
1. ${suggestBuildErrorResolution(error)}

`;
    
    // Add the section to the document
    const updatedBuildErrorDoc = buildErrorDoc + newSection;
    writeDocumentationFile(buildErrorDocPath, updatedBuildErrorDoc);
  }
};

/**
 * Suggests a resolution for a build error
 */
function suggestBuildErrorResolution(error: ErrorEntry): string {
  const errorText = error.errorMessages.join(' ');
  
  if (errorText.includes('required') && errorText.includes('optional')) {
    return 'Add validation before database operations to catch missing required fields.';
  }
  
  if (errorText.includes('Date') || errorText.includes('string') || errorText.includes('date')) {
    return 'Use proper date formatting utilities to convert between Date objects and strings.';
  }
  
  if (errorText.includes('no overload matches')) {
    return 'Check the function signature and ensure you\'re passing the correct parameter types.';
  }
  
  if (errorText.includes('property') || errorText.includes('Property')) {
    return 'Check the interface definition and ensure all required properties are defined.';
  }
  
  return 'Analyze the error message carefully to understand the specific type mismatch or issue.';
}

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
    
    // If resolved, also add resolved date
    if (updates.status === 'Resolved') {
      if (updatedEntry.includes('**Resolved On:**')) {
        updatedEntry = updatedEntry.replace(
          /\*\*Resolved On:\*\* [^\n]*/, 
          `**Resolved On:** ${currentDate}`
        );
      } else {
        // Add resolved date after last updated
        updatedEntry = updatedEntry.replace(
          /\*\*Last Updated:\*\* [^\n]*/, 
          `**Last Updated:** ${currentDate}  \n**Resolved On:** ${currentDate}`
        );
      }
    }
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
    const updatedErrorLog = errorLog.substring(0, errorStartIndex) + updatedEntry + errorLog.substring(errorEndIndex);
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
      relevantSection: "Common Type Issues" 
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
  
  // Read the source file
  const sourceContent = readDocumentationFile(sourcePath);
  
  // Check if the reference already exists
  if (sourceContent.includes(referenceText)) {
    console.log('Reference already exists, skipping');
    return;
  }
  
  // Find the source section
  const sectionMatch = new RegExp(`## ${sourceSection.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).exec(sourceContent);
  
  if (sectionMatch && sectionMatch.index !== undefined) {
    // Find the next section
    let nextSectionIndex = sourceContent.indexOf('## ', sectionMatch.index + sourceSection.length);
    if (nextSectionIndex === -1) {
      nextSectionIndex = sourceContent.length;
    }
    
    // Add the reference before the next section
    const updatedContent = 
      sourceContent.substring(0, nextSectionIndex) + 
      `\n> ${referenceText}\n\n` + 
      sourceContent.substring(nextSectionIndex);
    
    // Write the updated content
    writeDocumentationFile(sourcePath, updatedContent);
  } else {
    console.warn(`Section "${sourceSection}" not found in ${sourcePath}`);
  }
};

// Export a function to add runtime error capture
export const initializeDocumentationSystem = () => {
  console.log('Documentation system initialized');
  
  // Load initial documentation from localStorage
  const allDocs = getAllDocumentation();
  console.log(`Loaded ${Object.keys(allDocs).length} documentation files from localStorage`);
  
  // In a real implementation, this would set up listeners for errors
  window.addEventListener('error', (event) => {
    // Capture errors and log them to documentation
    console.log('Runtime error detected:', event.error);
    
    // Create an error entry
    const errorEntry: ErrorEntry = {
      title: `Runtime Error: ${event.message.substring(0, 50)}`,
      status: 'Investigating',
      description: event.message,
      errorMessages: [event.message],
      affectedFiles: [event.filename || 'unknown'],
      severity: 'High',
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
