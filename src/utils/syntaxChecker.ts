
/**
 * Utility for detecting and diagnosing syntax errors in the codebase
 */

/**
 * Scans for syntax errors in a string of JavaScript/TypeScript code
 * This implementation avoids using the Function constructor
 * @param code The code to check for syntax errors
 * @returns null if no errors, or an error message
 */
export const checkSyntax = (code: string): string | null => {
  try {
    // Instead of using Function constructor, we'll do a simpler syntax check
    // Look for common syntax errors
    return findCommonSyntaxIssues(code).length > 0 
      ? `Potential syntax issues found: ${findCommonSyntaxIssues(code).join(', ')}` 
      : null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
};

/**
 * Safely checks for import syntax without executing code
 */
export const validateModuleImport = (importPath: string): boolean => {
  try {
    // Basic path validation instead of using Function
    return importPath.length > 0 && 
           !importPath.includes('..') && 
           !importPath.startsWith('/');
  } catch (error) {
    console.error(`Error validating module: ${importPath}`, error);
    return false;
  }
};

/**
 * Checks for common syntax mistakes in code
 * @param code The code to analyze
 * @returns List of potential issues
 */
export const findCommonSyntaxIssues = (code: string): string[] => {
  const issues: string[] = [];
  
  // Check for unbalanced brackets/braces/parentheses
  const bracketsStack: string[] = [];
  const bracketPairs: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    
    if (char === '(' || char === '{' || char === '[') {
      bracketsStack.push(char);
    } else if (char === ')' || char === '}' || char === ']') {
      if (bracketsStack.length === 0 || bracketsStack.pop() !== bracketPairs[char]) {
        issues.push(`Unbalanced bracket/brace at position ${i}: ${char}`);
      }
    }
  }
  
  if (bracketsStack.length > 0) {
    issues.push(`Unclosed brackets/braces: ${bracketsStack.join('')}`);
  }
  
  // Check for unclosed string literals
  let inString = false;
  let stringChar = '';
  let stringStart = -1;
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    
    if (!inString && (char === "'" || char === '"' || char === '`')) {
      inString = true;
      stringChar = char;
      stringStart = i;
    } else if (inString && char === stringChar && code[i-1] !== '\\') {
      inString = false;
    }
  }
  
  if (inString) {
    issues.push(`Unclosed string literal starting at position ${stringStart} with character ${stringChar}`);
  }
  
  return issues;
};

/**
 * Diagnoses a file for syntax errors
 * @param filePath The path to the file
 * @param code The file contents
 */
export const diagnoseSyntaxError = (filePath: string, code: string): void => {
  console.group(`Diagnosing syntax in: ${filePath}`);
  
  const syntaxError = checkSyntax(code);
  if (syntaxError) {
    console.error(`✘ Syntax error found: ${syntaxError}`);
  } else {
    console.log('✓ Basic syntax check passed');
  }
  
  const commonIssues = findCommonSyntaxIssues(code);
  if (commonIssues.length > 0) {
    console.error('Common syntax issues:');
    commonIssues.forEach(issue => console.error(`- ${issue}`));
  } else {
    console.log('✓ No common syntax issues found');
  }
  
  console.groupEnd();
};
