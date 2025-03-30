
/**
 * Documentation Service
 * 
 * Provides functionality to generate and manage documentation
 */

import { writeToStorage, readFromStorage } from '@/utils/localStorageManager';
import { generatePathValidationReport } from '@/utils/documentationPathValidator';
import { DOCUMENTATION_PATHS, ErrorEntry } from '@/utils/documentationManager';

import {
  generateServiceDocumentation,
  updateDocumentationFile,
  generateServicesIndex,
  generateDocumentationArchive,
  generateStructureDocumentation
} from '@/utils/documentationGenerator';

import { captureBuildError } from '@/utils/buildErrorCapture';
import { format } from 'date-fns';

// Initialize the documentation system
if (typeof window !== 'undefined') {
  initializeDocumentationSystem();
}

/**
 * Documents an error entry in the error log
 * @param errorEntry Error entry to document
 */
export async function documentError(errorEntry: ErrorEntry): Promise<void> {
  console.info('Documenting error:', errorEntry.title);
  
  // Read existing error log
  const errorLog = readFromStorage(DOCUMENTATION_PATHS.ERROR_LOG) || '';
  
  // Format the error entry
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const errorTemplate = `
### ${errorEntry.title}

**Status:** ${errorEntry.status}  
**First Identified:** ${errorEntry.firstIdentified || currentDate}  
**Last Updated:** ${currentDate}  
**Severity:** ${errorEntry.severity || 'High'}  

**Description:**
${errorEntry.description}

**Error Messages:**
${errorEntry.errorMessages.map(msg => `- \`${msg}\``).join('\n')}

**Root Cause Analysis:**
${errorEntry.rootCause || 'Under investigation'}

**Resolution Steps:**
${errorEntry.resolutionSteps.map(step => 
  `${step.completed ? '✅' : '⬜'} ${step.description}`
).join('\n')}

**Related Files:**
${errorEntry.affectedFiles.map(file => `- ${file}`).join('\n')}

---
`;

  // Insert the new error after the "Active Issues" header
  const updatedErrorLog = errorLog.replace(
    '## Active Issues',
    '## Active Issues\n\n' + errorTemplate
  );

  // Write the updated error log
  updateDocumentationFile(DOCUMENTATION_PATHS.ERROR_LOG, updatedErrorLog);
  
  console.info('Error documented successfully');
  return Promise.resolve();
}

/**
 * Validates all documentation file paths and generates a report
 * @returns Report of invalid file paths
 */
export async function validateDocumentation(): Promise<string> {
  console.info('Validating documentation file paths');
  
  // Validate documentation file paths
  const report = generatePathValidationReport();
  
  // Save the report to the documentation
  updateDocumentationFile('src/documentation/validation-report.md', report);
  
  return report;
}

/**
 * Automatically generates documentation for all services
 */
export async function generateAllServiceDocumentation(): Promise<void> {
  console.info('Generating documentation for all services');
  
  // In a real implementation, this would scan the services directory
  // For now, we'll generate docs for a few known services
  const services = [
    {
      path: 'src/services/workOrders/workOrderService.ts',
      code: `
/**
 * @description Fetches work orders from the database
 * @param filter Filter criteria
 * @returns Array of work orders
 */
export async function getWorkOrders(filter: WorkOrderFilter) {
  // Implementation
}

/**
 * @description Creates a new work order
 * @param {WorkOrder} workOrder Work order data
 * @returns Created work order
 */
export async function createWorkOrder(workOrder: WorkOrder) {
  // Implementation
}
      `
    },
    {
      path: 'src/services/clients/clientService.ts',
      code: `
/**
 * @description Fetches clients from the database
 * @param {ClientFilter} filter Filter criteria
 * @returns Array of clients
 */
export async function getClients(filter: ClientFilter) {
  // Implementation
}

/**
 * @description Creates a new client
 * @param {Client} client Client data
 * @returns Created client
 */
export async function createClient(client: Client) {
  // Implementation
}
      `
    }
  ];
  
  // Generate documentation for each service
  for (const service of services) {
    const documentation = generateServiceDocumentation(service.path, service.code);
    const domain = service.path.split('/').slice(-2)[0];
    const filename = service.path.split('/').pop()?.replace('.ts', '') || '';
    const docPath = `src/documentation/services/${domain}/${filename}.md`;
    
    // Create the documentation file
    updateDocumentationFile(docPath, documentation);
  }
  
  // Generate services index
  const indexDoc = generateServicesIndex(services.map(s => s.path));
  updateDocumentationFile('src/documentation/services/index.md', indexDoc);
  
  console.info('Service documentation generated');
}

/**
 * Generates documentation for the project structure
 */
export async function generateProjectStructureDocumentation(): Promise<void> {
  console.info('Generating project structure documentation');
  
  // Mock structure object
  const structure = [
    {
      name: 'src',
      children: [
        {
          name: 'components',
          children: [
            { name: 'Dashboard', children: [] },
            { name: 'Layout', children: [] },
            { name: 'operations', children: [] },
            { name: 'hr', children: [] },
            { name: 'ui', children: [] }
          ]
        },
        {
          name: 'services',
          children: [
            { name: 'clients', children: [] },
            { name: 'contracts', children: [] },
            { name: 'documentation', children: [] },
            { name: 'employees', children: [] },
            { name: 'sites', children: [] },
            { name: 'workOrders', children: [] }
          ]
        },
        {
          name: 'utils',
          children: [
            { name: 'dateFormatters.ts', children: [] },
            { name: 'formValidation.ts', children: [] },
            { name: 'errorCapture.ts', children: [] },
            { name: 'documentationManager.ts', children: [] }
          ]
        },
        {
          name: 'pages',
          children: [
            { name: 'Dashboard.tsx', children: [] },
            { name: 'Reports.tsx', children: [] },
            { name: 'Documentation.tsx', children: [] }
          ]
        }
      ]
    }
  ];
  
  // Generate structure documentation
  const documentation = generateStructureDocumentation(structure);
  
  // Update documentation file
  updateDocumentationFile('src/documentation/structure.md', documentation);
  
  console.info('Project structure documentation generated');
}

/**
 * Automatically documents a build error
 * @param error Build error details (string or ErrorEntry)
 */
export function documentBuildError(error: string | ErrorEntry): void {
  console.info('Documenting build error');
  
  // If error is already an ErrorEntry, use it directly
  if (typeof error !== 'string') {
    documentError(error).catch(err => {
      console.error('Failed to document error entry:', err);
    });
    return;
  }
  
  // Extract error information from string error message
  const errorInfo = captureBuildError(error);
  
  if (!errorInfo) {
    console.warn('Could not parse build error');
    return;
  }
  
  // Read existing error log
  const errorLog = readFromStorage(DOCUMENTATION_PATHS.ERROR_LOG) || '';
  
  // Add new error to log
  const newErrorEntry = `
### ${errorInfo.message}

**Status:** Investigating

**File:** ${errorInfo.file}
**Line:** ${errorInfo.line}
**Column:** ${errorInfo.column}

**Error Type:** TypeScript Error
**Detected At:** ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}

**Error Details:**
\`\`\`
${errorInfo.originalMessage}
\`\`\`

**Suggested Fix:**
- Review the TypeScript types in ${errorInfo.file}
- Ensure all required properties are provided
- Check for duplicate definitions

---
`;

  // Update the error log with the new entry
  updateDocumentationFile(DOCUMENTATION_PATHS.ERROR_LOG, errorLog + newErrorEntry);
  
  // Update type inconsistencies doc if it's a type error
  if (errorInfo.message.includes('type') || errorInfo.message.includes('Type')) {
    documentTypeInconsistency(errorInfo);
  }
  
  console.info('Build error documented');
}

/**
 * Documents a type inconsistency
 * @param errorInfo Error information
 */
function documentTypeInconsistency(errorInfo: any): void {
  console.info('Documenting type inconsistency');
  
  // Read existing type inconsistencies doc
  const typeDoc = readFromStorage(DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES) || '';
  
  // Extract affected types from error message
  const typeMatch = errorInfo.originalMessage.match(/Type '([^']+)' is not assignable to type '([^']+)'/);
  
  let affectedTypes = '';
  if (typeMatch && typeMatch.length >= 3) {
    affectedTypes = `
**Source Type:** \`${typeMatch[1]}\`
**Target Type:** \`${typeMatch[2]}\`
`;
  }
  
  // Add new inconsistency to doc
  const newInconsistency = `
## ${errorInfo.file}

**Error:** ${errorInfo.message}
**Location:** Line ${errorInfo.line}, Column ${errorInfo.column}
**Detected At:** ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}

${affectedTypes}

**Original Error:**
\`\`\`
${errorInfo.originalMessage}
\`\`\`

**Potential Solution:**
- Review the type definitions in the file
- Update interfaces to match the required structure
- Consider adding type assertions if necessary

---
`;

  // Update the type inconsistencies doc
  updateDocumentationFile(DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES, typeDoc + newInconsistency);
  
  console.info('Type inconsistency documented');
}

/**
 * Documents a solution to a build error
 * @param error Original error
 * @param solution Solution description
 */
export function documentBuildErrorResolution(error: string, solution: string): void {
  console.info('Documenting build error resolution');
  
  // Read existing resolutions
  const resolutions = readFromStorage(DOCUMENTATION_PATHS.BUILD_ERROR_RESOLUTION) || '';
  
  // Add new resolution
  const newResolution = `
## ${error}

**Resolution Date:** ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}

**Solution:**
${solution}

**Code Example:**
\`\`\`typescript
// Example implementation of the solution
// (Replace with actual code used to fix the issue)
\`\`\`

---
`;

  // Update the resolutions doc
  updateDocumentationFile(DOCUMENTATION_PATHS.BUILD_ERROR_RESOLUTION, resolutions + newResolution);
  
  // Update the status in the error log
  updateErrorLogStatus(error, 'Resolved', solution);
  
  console.info('Build error resolution documented');
}

/**
 * Updates the status of an error in the error log
 * @param errorMessage Error message to update
 * @param status New status
 * @param resolution Resolution details
 */
function updateErrorLogStatus(errorMessage: string, status: string, resolution?: string): void {
  console.info('Updating error log status');
  
  // Read existing error log
  const errorLog = readFromStorage(DOCUMENTATION_PATHS.ERROR_LOG) || '';
  
  // Replace the Status line
  const updatedLog = errorLog.replace(
    new RegExp(`### ${escapeRegExp(errorMessage)}\\s*\\n\\s*\\*\\*Status:\\*\\* [^\\n]+`),
    `### ${errorMessage}\n\n**Status:** ${status}`
  );
  
  // Add resolution details if provided
  let finalLog = updatedLog;
  if (resolution && status === 'Resolved') {
    finalLog = updatedLog.replace(
      new RegExp(`### ${escapeRegExp(errorMessage)}[\\s\\S]+?---`),
      (match) => {
        return match.replace(
          /\*\*Suggested Fix:\*\*[^-]*---/,
          `**Suggested Fix:**
${match.includes('**Suggested Fix:**') ? '' : '\n'}- ${resolution}

**Resolved On:** ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}

---`
        );
      }
    );
  }
  
  // Update the error log
  updateDocumentationFile(DOCUMENTATION_PATHS.ERROR_LOG, finalLog);
  
  console.info('Error log status updated');
}

/**
 * Escapes special characters in a string for use in a regular expression
 * @param string String to escape
 * @returns Escaped string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Initializes the documentation system
 */
function initializeDocumentationSystem(): void {
  console.info('Initializing documentation system');
  
  // Set up default documentation if not present
  if (!readFromStorage(DOCUMENTATION_PATHS.ERROR_LOG)) {
    updateDocumentationFile(DOCUMENTATION_PATHS.ERROR_LOG, `# Error Log\n\nThis document captures TypeScript and runtime errors encountered during development.\n\n---\n`);
  }
  
  if (!readFromStorage(DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES)) {
    updateDocumentationFile(DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES, `# Type Inconsistencies Documentation\n\nThis document provides detailed analysis of type inconsistencies in the application.\n\n---\n`);
  }
  
  if (!readFromStorage(DOCUMENTATION_PATHS.BUILD_ERROR_RESOLUTION)) {
    updateDocumentationFile(DOCUMENTATION_PATHS.BUILD_ERROR_RESOLUTION, `# Build Error Resolution Guide\n\nThis document provides strategies for resolving common build errors in the application.\n\n---\n`);
  }
  
  if (!readFromStorage(DOCUMENTATION_PATHS.SCHEMA_CHANGELOG)) {
    updateDocumentationFile(DOCUMENTATION_PATHS.SCHEMA_CHANGELOG, `# Schema Changelog\n\nThis document tracks changes to the database schema over time.\n\n---\n`);
  }
  
  // Generate initial documentation
  generateProjectStructureDocumentation();
  
  console.info('Documentation system initialized');
}

/**
 * Sets up automated documentation for errors and schema changes
 */
export function setupAutomatedDocumentation(): void {
  console.info('Setting up automated documentation');
  
  // Initialize the documentation system
  initializeDocumentationSystem();
  
  // Set up error listeners (in a real app)
  // window.addEventListener('error', documentRuntimeError);
  
  console.info('Automated documentation set up');
}
