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
  type ErrorEntry,
  initializeDocumentationSystem,
  documentationUtils
} from '@/utils/documentationManager';

import { validateDocumentationPaths, generatePathValidationReport } from '@/utils/documentationPathValidator';

import {
  generateServiceDocumentation,
  generateStructureDocumentation,
  updateDocumentationFile,
  generateServicesIndex,
  generateDocumentationArchive
} from '@/utils/documentationGenerator';

import { captureBuildError } from '@/utils/errorCapture';
import { format } from 'date-fns';

// Initialize the documentation system
if (typeof window !== 'undefined') {
  initializeDocumentationSystem();
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
export async function generateStructureDocumentation(): Promise<void> {
  console.info('Generating project structure documentation');
  
  // Mock structure object
  const structure = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'common', type: 'folder' },
            { name: 'hr', type: 'folder' },
            { name: 'operations', type: 'folder' },
            { name: 'ui', type: 'folder' }
          ]
        },
        {
          name: 'pages',
          type: 'folder',
          children: [
            { name: 'Index.tsx', type: 'file' },
            { name: 'Dashboard.tsx', type: 'file' },
            { name: 'Documentation.tsx', type: 'file' }
          ]
        },
        {
          name: 'services',
          type: 'folder',
          children: [
            { name: 'clients', type: 'folder' },
            { name: 'workOrders', type: 'folder' },
            { name: 'employees', type: 'folder' }
          ]
        }
      ]
    }
  ];
  
  // Generate structure documentation
  const documentation = generateStructureDocumentation(structure);
  updateDocumentationFile(DOCUMENTATION_PATHS.PROJECT_STRUCTURE, documentation);
  
  console.info('Project structure documentation generated');
}

/**
 * Generates a downloadable archive of all documentation
 * @returns URL for downloading the archive
 */
export async function generateDocumentationArchiveForDownload(): Promise<string> {
  console.info('Generating documentation archive for download');
  
  // Generate the archive
  const archiveBlob = generateDocumentationArchive();
  
  // Create a URL for the blob
  const url = URL.createObjectURL(archiveBlob);
  
  return url;
}

/**
 * Checks how up-to-date all documentation is
 * @returns Array of documentation status objects
 */
export async function checkDocumentationFreshness(): Promise<Array<{
  path: string;
  lastUpdated: Date | null;
  ageInDays: number | null;
  stale: boolean;
}>> {
  console.info('Checking documentation freshness');
  
  return documentationUtils.checkDocumentationFreshness();
}

/**
 * Sets up automated documentation generation
 */
export function setupAutomatedDocumentation(): void {
  console.info('Setting up automated documentation generation');
  
  // In a real implementation, this would set up interval-based checks
  // For now, we'll just log a message
  
  // Generate service documentation on startup
  setTimeout(() => {
    generateAllServiceDocumentation();
  }, 5000);
  
  // Validate documentation paths on startup
  setTimeout(() => {
    validateDocumentation();
  }, 10000);
  
  // Generate structure documentation on startup
  setTimeout(() => {
    generateStructureDocumentation();
  }, 15000);
  
  console.info('Automated documentation generation scheduled');
}

/**
 * Documents a new error or issue in the system
 * @param errorDetails Details of the error to document
 */
export async function documentError(errorDetails: ErrorEntry): Promise<void> {
  console.info('Documenting new error:', errorDetails.title);
  
  // Log the error in the error log
  addErrorToLog(errorDetails);
  
  // If this is a type inconsistency, also create cross-references
  if (errorDetails.title.toLowerCase().includes('type') || 
      errorDetails.description.toLowerCase().includes('type') ||
      errorDetails.errorMessages.some(msg => msg.toLowerCase().includes('type'))) {
    
    console.info('Type-related error detected, updating cross-references');
    
    // Create references between documentation files
    createDocumentationReference(
      DOCUMENTATION_PATHS.ERROR_LOG,
      DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES,
      'Active Issues',
      `See also: Type inconsistency details in TYPE_INCONSISTENCIES.md`
    );
    
    createDocumentationReference(
      DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES,
      DOCUMENTATION_PATHS.ERROR_LOG,
      'Common Type Issues',
      `See error: ${errorDetails.title} in ERROR_LOG.md`
    );
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
      'Active Issues',
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
  
  const typeDocPath = DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES;
  const typeDoc = readDocumentationFile(typeDocPath);
  
  // Find the section for this error
  const errorSectionRegex = new RegExp(`## ${errorTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  const match = errorSectionRegex.exec(typeDoc);
  
  if (match && match.index !== undefined) {
    // Add resolution details to the section
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const resolutionText = `
### Resolution (${currentDate})
${resolution}

**Affected Files:**
${affectedFiles.map(file => `- ${file}`).join('\n')}

**Prevention Measures:**
- Added validation for required fields
- Enhanced type safety with proper validations
- Documented patterns for handling similar issues
`;
    
    // Find the next section
    let nextSectionIndex = typeDoc.indexOf('## ', match.index + errorTitle.length);
    if (nextSectionIndex === -1) {
      nextSectionIndex = typeDoc.length;
    }
    
    // Insert the resolution before the next section
    const updatedTypeDoc = 
      typeDoc.substring(0, nextSectionIndex) + 
      resolutionText + 
      typeDoc.substring(nextSectionIndex);
    
    writeDocumentationFile(typeDocPath, updatedTypeDoc);
  }
  
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

/**
 * Creates a dashboard report of all errors and documentation
 * @returns HTML string for the dashboard
 */
export function generateDocumentationDashboard(): string {
  return `
    <div class="documentation-dashboard">
      <h2>Documentation Dashboard</h2>
      <p>Last updated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</p>
      
      <h3>Active Issues</h3>
      <ul>
        <!-- This would be populated with actual active issues -->
        <li>TypeScript Errors in formSchemaValidator.ts - <span class="status-investigating">Investigating</span></li>
        <li>Work Order Form Type Inconsistencies - <span class="status-in-progress">In Progress</span></li>
      </ul>
      
      <h3>Recently Resolved</h3>
      <ul>
        <!-- This would be populated with actual resolved issues -->
        <li>Missing isSubmitting prop in FormActions - <span class="status-resolved">Resolved</span></li>
      </ul>
    </div>
  `;
}

// Export the internal functions for testing
export const _internal = {
  createErrorReferences
};
