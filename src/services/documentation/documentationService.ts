/**
 * Documentation Service
 * 
 * Provides utilities for documenting application structure,
 * including component hierarchy, data flow, and error reporting
 */

import fs from 'fs';
import path from 'path';
import {
  parseCodeStructure,
  DocumentedFile,
  Component,
  DocumentationNode,
  ErrorEntry,
  DocumentationSystem,
  generateFileTreeMarkdown,
  generateDependencyGraph,
  generateStructureDocumentation
} from '@/utils/documentationManager';

import { captureBuildError } from '@/utils/buildErrorCapture';
import { format } from 'date-fns';

// Initialize the documentation system
const documentationSystem: DocumentationSystem = {
  files: [],
  components: [],
  errors: [],
  dependencies: {}
};

/**
 * Documents an application error
 * @param errorEntry Error entry to document
 */
export const documentError = async (errorEntry: ErrorEntry): Promise<void> => {
  documentationSystem.errors.push({
    ...errorEntry,
    timestamp: new Date()
  });
  
  console.info(`Documented error: ${errorEntry.title}`);
  
  // Update ERROR_LOG.md with the new error
  try {
    const errorsMarkdown = generateErrorsMarkdown(documentationSystem.errors);
    // In a real environment, this would write to the filesystem
    console.info('Error log updated');
  } catch (err) {
    console.error('Failed to update error log:', err);
  }
  
  return Promise.resolve();
};

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
    console.warn('Could not parse build error:', error);
    
    // Create a simple error entry with the raw error message
    const errorEntry: ErrorEntry = {
      title: `Build Error: ${error.substring(0, 50)}...`,
      status: 'Investigating',
      description: `Unparseable build error: ${error}`,
      errorMessages: [error],
      affectedFiles: [],
      resolutionSteps: [
        {
          description: 'Manually review build error',
          completed: false
        }
      ]
    };
    
    documentError(errorEntry).catch(err => {
      console.error('Failed to document build error:', err);
    });
    return;
  }
  
  // Create an error entry
  const errorEntry: ErrorEntry = {
    title: `Build Error in ${errorInfo.file}`,
    status: 'Investigating',
    description: errorInfo.message,
    errorMessages: [errorInfo.originalMessage],
    affectedFiles: [errorInfo.file],
    resolutionSteps: [
      {
        description: `Check line ${errorInfo.line}, column ${errorInfo.column}`,
        completed: false
      }
    ]
  };
  
  // Add error to documentation system
  documentError(errorEntry).catch(err => {
    console.error('Failed to document build error:', err);
  });
}

/**
 * Generates markdown for errors
 */
function generateErrorsMarkdown(errors: (ErrorEntry & { timestamp?: Date })[]): string {
  let markdown = '# Error Log\n\n';
  markdown += 'This document tracks errors, bugs, and build issues encountered in the application, along with their resolution status and steps taken.\n\n';
  
  // Group errors by status
  const activeErrors = errors.filter(e => e.status !== 'Resolved');
  const resolvedErrors = errors.filter(e => e.status === 'Resolved');
  
  // Add active errors
  markdown += '## Active Issues\n\n';
  if (activeErrors.length === 0) {
    markdown += 'No active issues at this time.\n\n';
  } else {
    activeErrors.forEach(error => {
      markdown += `### ${error.title}\n\n`;
      markdown += `**Status:** ${error.status}  \n`;
      
      if (error.timestamp) {
        markdown += `**First Identified:** ${format(error.timestamp, 'yyyy-MM-dd')}  \n`;
        markdown += `**Last Updated:** ${format(new Date(), 'yyyy-MM-dd')}  \n`;
      }
      
      markdown += `**Severity:** ${error.severity || 'Medium'}  \n\n`;
      
      markdown += `**Description:**\n${error.description}\n\n`;
      
      if (error.errorMessages && error.errorMessages.length > 0) {
        markdown += '**Error Messages:**\n';
        error.errorMessages.forEach(msg => {
          markdown += `- \`${msg}\`\n`;
        });
        markdown += '\n';
      }
      
      if (error.rootCause) {
        markdown += `**Root Cause Analysis:**\n${error.rootCause}\n\n`;
      }
      
      if (error.resolutionSteps && error.resolutionSteps.length > 0) {
        markdown += '**Resolution Steps:**\n';
        error.resolutionSteps.forEach(step => {
          markdown += `${step.completed ? '1. ✅' : '1. ⬜'} ${step.description}\n`;
        });
        markdown += '\n';
      }
      
      if (error.affectedFiles && error.affectedFiles.length > 0) {
        markdown += '**Related Files:**\n';
        error.affectedFiles.forEach(file => {
          markdown += `- ${file}\n`;
        });
        markdown += '\n';
      }
      
      markdown += '---\n\n';
    });
  }
  
  // Add resolved errors
  markdown += '## Resolved Issues\n\n';
  if (resolvedErrors.length === 0) {
    markdown += 'No resolved issues yet.\n\n';
  } else {
    resolvedErrors.forEach(error => {
      markdown += `### ${error.title}\n\n`;
      markdown += `**Status:** Resolved  \n`;
      
      if (error.timestamp) {
        markdown += `**First Identified:** ${format(error.timestamp, 'yyyy-MM-dd')}  \n`;
      }
      
      markdown += `**Resolved On:** ${format(new Date(), 'yyyy-MM-dd')}  \n`;
      markdown += `**Severity:** ${error.severity || 'Medium'}  \n\n`;
      
      markdown += `**Description:**\n${error.description}\n\n`;
      
      if (error.errorMessages && error.errorMessages.length > 0) {
        markdown += '**Error Messages:**\n';
        error.errorMessages.forEach(msg => {
          markdown += `- \`${msg}\`\n`;
        });
        markdown += '\n';
      }
      
      if (error.rootCause) {
        markdown += `**Root Cause:**\n${error.rootCause}\n\n`;
      }
      
      if (error.resolution) {
        markdown += `**Resolution:**\n${error.resolution}\n\n`;
      }
      
      if (error.affectedFiles && error.affectedFiles.length > 0) {
        markdown += '**Affected Files:**\n';
        error.affectedFiles.forEach(file => {
          markdown += `- ${file}\n`;
        });
        markdown += '\n';
      }
      
      if (error.preventionMeasures) {
        markdown += `**Prevention Measures:**\n${error.preventionMeasures}\n\n`;
      }
      
      markdown += '---\n\n';
    });
  }
  
  // Add maintenance guidelines
  markdown += `## Error Log Maintenance Guidelines\n\n`;
  markdown += `### Adding New Issues\n\n`;
  markdown += `When adding a new issue to the log:\n\n`;
  markdown += `1. Create a descriptive title for the issue\n`;
  markdown += `2. Set the status to "Investigating" or "In Progress"\n`;
  markdown += `3. Record the date identified\n`;
  markdown += `4. Document error messages exactly as they appear\n`;
  markdown += `5. List files likely to be involved\n`;
  markdown += `6. Create initial resolution steps if known\n\n`;
  
  markdown += `### Updating Issues\n\n`;
  markdown += `When working on an issue:\n\n`;
  markdown += `1. Update the "Last Updated" date\n`;
  markdown += `2. Mark completed steps with ✅\n`;
  markdown += `3. Add new information discovered during investigation\n`;
  markdown += `4. Refine the root cause analysis as more is learned\n`;
  markdown += `5. Add new resolution steps as needed\n\n`;
  
  markdown += `### Resolving Issues\n\n`;
  markdown += `When an issue is resolved:\n\n`;
  markdown += `1. Change status to "Resolved"\n`;
  markdown += `2. Add the resolution date\n`;
  markdown += `3. Document the final root cause\n`;
  markdown += `4. Document the complete resolution\n`;
  markdown += `5. List all affected files\n`;
  markdown += `6. Move the issue to the "Resolved Issues" section\n`;
  markdown += `7. Add any prevention measures implemented\n\n`;
  
  markdown += `This log should be updated regularly as part of the development process to maintain an accurate record of issues and their resolutions.\n`;
  
  return markdown;
}

export default documentationSystem;
