
/**
 * Utility for detecting and diagnosing syntax errors in the codebase
 */

/**
 * Scans for syntax errors in a string of JavaScript/TypeScript code
 * @param code The code to check for syntax errors
 * @returns null if no errors, or an error message
 */
export const checkSyntax = (code: string): string | null => {
  try {
    // Use Function constructor to validate syntax without executing
    new Function(code);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
};

/**
 * Safely evaluates a string to check for syntax errors
 * without actually executing the code
 */
export const validateModuleImport = (importPath: string): boolean => {
  try {
    // This is just for checking, not actually importing
    new Function(`import('${importPath}');`);
    return true;
  } catch (error) {
    console.error(`Syntax error detected in module: ${importPath}`, error);
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
