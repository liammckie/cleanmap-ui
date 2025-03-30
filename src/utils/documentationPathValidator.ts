
/**
 * Documentation Path Validator
 * 
 * Validates that file paths referenced in documentation actually exist in the codebase.
 */

import { DOCUMENTATION_PATHS } from './documentationManager';
import { readFromStorage } from './localStorageManager';

// Regular expression to match file paths in Markdown
const FILE_PATH_REGEX = /`(src\/[^`]+\.[a-z]+)`/g;

/**
 * Validates file paths mentioned in documentation
 * @returns Map of documentation files with invalid paths
 */
export function validateDocumentationPaths(): Map<string, string[]> {
  const invalidPaths = new Map<string, string[]>();
  
  // Get list of files that actually exist in the project
  // In a real implementation, this would be fetched from the filesystem
  // For our demo, we'll use a mock list
  const existingFiles = getExistingFiles();
  
  // Check each documentation file
  Object.values(DOCUMENTATION_PATHS).forEach(docPath => {
    const content = readFromStorage(docPath);
    if (!content) return;
    
    const pathMatches = Array.from(content.matchAll(FILE_PATH_REGEX));
    const mentionedPaths = pathMatches.map(match => match[1]);
    
    const invalid = mentionedPaths.filter(path => !existingFiles.includes(path));
    
    if (invalid.length > 0) {
      invalidPaths.set(docPath, invalid);
    }
  });
  
  return invalidPaths;
}

/**
 * Checks if a specific file path exists in the project
 * @param path File path to check
 * @returns True if the file exists
 */
export function filePathExists(path: string): boolean {
  return getExistingFiles().includes(path);
}

/**
 * Gets a list of files that exist in the project
 * In a real implementation, this would be fetched from the filesystem
 * @returns Array of file paths
 */
function getExistingFiles(): string[] {
  // This is a mock implementation
  // In a real project, this would be populated by the build system
  // For now, we'll include paths we know exist from the files we've seen
  return [
    'src/components/operations/workOrder/WorkOrderForm.tsx',
    'src/components/operations/client/ClientForm.tsx',
    'src/components/operations/ClientForm/ClientFormStepper.tsx',
    'src/components/operations/ClientForm/ClientSiteForm.tsx',
    'src/components/hr/AddEmployeeDialog.tsx',
    'src/components/hr/EmployeeDetailsDialog.tsx',
    'src/components/hr/AddressForm.tsx',
    'src/components/common/AddressAutocomplete.tsx',
    'src/schema/operations/workOrder.schema.ts',
    'src/schema/operations/client.schema.ts',
    'src/schema/hr.schema.ts',
    'src/services/workOrders/workOrderService.ts',
    'src/services/clients/clientService.ts',
    'src/services/sites/siteService.ts',
    'src/services/employeeService.ts',
    'src/services/contracts/contractService.ts',
    'src/services/sales/leadService.ts',
    'src/services/sales/quoteService.ts',
    'src/utils/documentationManager.ts',
    'src/utils/localStorageManager.ts',
    'src/services/documentation/documentationService.ts',
    'src/components/documentation/DocumentationDashboard.tsx'
  ];
}

/**
 * Generate a report of invalid documentation paths
 * @returns Report string
 */
export function generatePathValidationReport(): string {
  const invalidPaths = validateDocumentationPaths();
  
  if (invalidPaths.size === 0) {
    return "✅ All file paths in documentation are valid.";
  }
  
  let report = "# Documentation Path Validation Report\n\n";
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  report += "## Invalid Paths Found\n\n";
  
  invalidPaths.forEach((paths, docFile) => {
    report += `### In ${docFile}\n\n`;
    paths.forEach(path => {
      report += `- \`${path}\` does not exist\n`;
    });
    report += "\n";
  });
  
  return report;
}

/**
 * Suggestion for fixing an invalid path
 * @param invalidPath The invalid file path
 * @returns Suggested correct path or null if no suggestion available
 */
export function suggestCorrectPath(invalidPath: string): string | null {
  const existingFiles = getExistingFiles();
  
  // Try to find a similar file by filename
  const filename = invalidPath.split('/').pop() || '';
  const similarFiles = existingFiles.filter(path => path.endsWith(filename));
  
  if (similarFiles.length === 1) {
    return similarFiles[0];
  }
  
  // Try to find a file in a similar directory
  const dirParts = invalidPath.split('/');
  const dirPath = dirParts.slice(0, -1).join('/');
  
  const filesInSimilarDirs = existingFiles.filter(path => {
    return path.startsWith(dirPath) || path.includes(dirParts[dirParts.length - 2] || '');
  });
  
  if (filesInSimilarDirs.length > 0) {
    // Return the most similar path
    return filesInSimilarDirs[0];
  }
  
  return null;
}
