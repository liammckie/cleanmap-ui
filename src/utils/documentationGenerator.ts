
/**
 * Documentation Generator
 * 
 * Automatically generates and updates documentation based on the code structure.
 */

import { writeToStorage } from './localStorageManager';

/**
 * Generates documentation for a service
 * @param servicePath Path to the service file
 * @param serviceCode Service code content
 * @returns Generated documentation
 */
export function generateServiceDocumentation(servicePath: string, serviceCode: string): string {
  // Extract information from the service code
  const serviceName = servicePath.split('/').pop()?.replace('.ts', '') || '';
  const functionMatches = serviceCode.matchAll(/export\s+(async\s+)?function\s+(\w+)/g);
  const functions = Array.from(functionMatches).map(match => match[2]);
  
  // Extract JSDoc comments
  const jsdocMatches = serviceCode.matchAll(/\/\*\*\s*\n([^*]|\*[^\/])*\*\/\s*\n\s*export/g);
  const jsdocs = Array.from(jsdocMatches).map(match => match[0]);
  
  // Generate documentation
  let documentation = `# ${formatServiceName(serviceName)}\n\n`;
  documentation += `Path: \`${servicePath}\`\n\n`;
  documentation += `## Overview\n\n`;
  documentation += `This service provides functionality for managing ${getServiceDomain(servicePath)}.\n\n`;
  
  // Add functions section
  documentation += `## Functions\n\n`;
  
  functions.forEach((functionName, index) => {
    documentation += `### ${functionName}\n\n`;
    
    // Try to find JSDoc for this function
    const relevantJsDoc = jsdocs.find(doc => doc.includes(`function ${functionName}`));
    if (relevantJsDoc) {
      const description = extractJSDocDescription(relevantJsDoc);
      const params = extractJSDocParams(relevantJsDoc);
      const returns = extractJSDocReturns(relevantJsDoc);
      
      if (description) {
        documentation += `${description}\n\n`;
      }
      
      if (params.length > 0) {
        documentation += `**Parameters:**\n\n`;
        params.forEach(param => {
          documentation += `- \`${param.name}\` (${param.type}): ${param.description}\n`;
        });
        documentation += `\n`;
      }
      
      if (returns) {
        documentation += `**Returns:** ${returns}\n\n`;
      }
    } else {
      documentation += `No description available.\n\n`;
    }
  });
  
  // Add usage example
  documentation += `## Usage Example\n\n`;
  documentation += `\`\`\`typescript\n`;
  documentation += `import { ${functions[0] || 'exampleFunction'} } from '${servicePath.replace('.ts', '')}';\n\n`;
  documentation += `// Example usage\n`;
  
  if (functions[0]) {
    documentation += `const result = await ${functions[0]}(/* parameters */);\n`;
    documentation += `console.log(result);\n`;
  }
  
  documentation += `\`\`\`\n`;
  
  return documentation;
}

/**
 * Formats a service name for display
 * @param serviceName Raw service name
 * @returns Formatted service name
 */
function formatServiceName(serviceName: string): string {
  // Convert camelCase to Title Case with spaces
  return serviceName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

/**
 * Gets the domain of a service based on its path
 * @param servicePath Path to the service
 * @returns Domain description
 */
function getServiceDomain(servicePath: string): string {
  if (servicePath.includes('/clients/')) return 'clients';
  if (servicePath.includes('/workOrders/')) return 'work orders';
  if (servicePath.includes('/employees/')) return 'employees';
  if (servicePath.includes('/sites/')) return 'sites';
  if (servicePath.includes('/contracts/')) return 'contracts';
  if (servicePath.includes('/sales/')) return 'sales';
  return 'application data';
}

/**
 * Extracts the description from a JSDoc comment
 * @param jsDoc JSDoc comment
 * @returns Description text
 */
function extractJSDocDescription(jsDoc: string): string {
  const descriptionMatch = jsDoc.match(/\* @description (.*?)(\n\s*\*|$)/);
  if (descriptionMatch) {
    return descriptionMatch[1].trim();
  }
  
  // If no @description tag, try to get the first line of the comment
  const firstLineMatch = jsDoc.match(/\/\*\*\s*\n\s*\* ([^\n]*)/);
  if (firstLineMatch) {
    return firstLineMatch[1].trim();
  }
  
  return '';
}

/**
 * Extracts parameter information from a JSDoc comment
 * @param jsDoc JSDoc comment
 * @returns Array of parameter objects
 */
function extractJSDocParams(jsDoc: string): Array<{name: string, type: string, description: string}> {
  const paramMatches = jsDoc.matchAll(/@param\s+{([^}]+)}\s+(\w+)\s+(.*?)(\n\s*\*|$)/g);
  return Array.from(paramMatches).map(match => ({
    type: match[1].trim(),
    name: match[2].trim(),
    description: match[3].trim()
  }));
}

/**
 * Extracts return information from a JSDoc comment
 * @param jsDoc JSDoc comment
 * @returns Return description
 */
function extractJSDocReturns(jsDoc: string): string {
  const returnsMatch = jsDoc.match(/@returns\s+(.*?)(\n\s*\*|$)/);
  if (returnsMatch) {
    return returnsMatch[1].trim();
  }
  return '';
}

/**
 * Generates documentation for the project structure
 * @param structure Project structure object
 * @returns Generated documentation
 */
export function generateStructureDocumentation(structure: any): string {
  let documentation = `# Project Structure Documentation\n\n`;
  documentation += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  documentation += `## Directory Structure\n\n`;
  documentation += `\`\`\`\n`;
  documentation += renderStructureTree(structure);
  documentation += `\`\`\`\n\n`;
  
  documentation += `## Key Directories\n\n`;
  
  // Add some explanations for key directories
  documentation += `### src/components\n\n`;
  documentation += `Contains all React components organized by domain and feature.\n\n`;
  
  documentation += `### src/services\n\n`;
  documentation += `Contains services that handle data fetching and business logic.\n\n`;
  
  documentation += `### src/schema\n\n`;
  documentation += `Contains Zod validation schemas for forms and data.\n\n`;
  
  documentation += `### src/utils\n\n`;
  documentation += `Contains utility functions used throughout the application.\n\n`;
  
  documentation += `### src/pages\n\n`;
  documentation += `Contains page components that are rendered at specific routes.\n\n`;
  
  documentation += `### src/documentation\n\n`;
  documentation += `Contains project documentation including error logs, architecture, and conventions.\n\n`;
  
  return documentation;
}

/**
 * Renders a structure tree as a string
 * @param structure Structure object
 * @param prefix Prefix for indentation
 * @returns Rendered tree
 */
function renderStructureTree(structure: any[], prefix = ''): string {
  let result = '';
  
  structure.forEach((item, index) => {
    const isLast = index === structure.length - 1;
    const linePrefix = isLast ? '└── ' : '├── ';
    const childPrefix = isLast ? '    ' : '│   ';
    
    result += `${prefix}${linePrefix}${item.name}\n`;
    
    if (item.children && item.children.length > 0) {
      result += renderStructureTree(item.children, prefix + childPrefix);
    }
  });
  
  return result;
}

/**
 * Updates a documentation file with generated content
 * @param path File path
 * @param content Generated content
 */
export function updateDocumentationFile(path: string, content: string): void {
  writeToStorage(path, content);
}

/**
 * Generates a services index documentation file
 * @param services List of service paths
 */
export function generateServicesIndex(services: string[]): string {
  let documentation = `# Services Documentation Index\n\n`;
  documentation += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Group services by domain
  const domainServices: Record<string, string[]> = {};
  
  services.forEach(service => {
    const parts = service.split('/');
    let domain = 'general';
    
    if (parts.length > 2) {
      domain = parts[parts.length - 2];
    }
    
    if (!domainServices[domain]) {
      domainServices[domain] = [];
    }
    
    domainServices[domain].push(service);
  });
  
  // Generate links to service documentation
  Object.entries(domainServices).forEach(([domain, servicePaths]) => {
    documentation += `## ${domain.charAt(0).toUpperCase() + domain.slice(1)} Services\n\n`;
    
    servicePaths.forEach(path => {
      const serviceName = path.split('/').pop()?.replace('.ts', '') || '';
      const formattedName = formatServiceName(serviceName);
      const docPath = `documentation/services/${domain}/${serviceName}.md`;
      
      documentation += `- [${formattedName}](${docPath})\n`;
    });
    
    documentation += `\n`;
  });
  
  return documentation;
}

/**
 * Generates a client-side documentation archive for download
 * @returns Blob containing the documentation
 */
export function generateDocumentationArchive(): Blob {
  // In a real implementation, this would generate a ZIP file
  // For our demo, we'll just return a text blob
  
  const content = "# Documentation Archive\n\nThis would be a ZIP file containing all documentation.\n";
  return new Blob([content], { type: 'text/plain' });
}
