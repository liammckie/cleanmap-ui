
/**
 * Error Analytics Utility
 * 
 * Provides functionality to track and analyze build errors over time
 */

type ErrorsByFile = Record<string, string[]>;

// Store error history in memory (in a real app, this would be persistent)
const errorHistory: Array<{
  timestamp: Date;
  errors: ErrorsByFile;
}> = [];

/**
 * Adds errors to the history for tracking
 * @param errors Errors grouped by file
 */
export function trackErrors(errors: ErrorsByFile): void {
  errorHistory.push({
    timestamp: new Date(),
    errors
  });
  
  // Limit history size to avoid memory issues
  if (errorHistory.length > 100) {
    errorHistory.shift();
  }
  
  console.info(`Added ${Object.keys(errors).length} files with errors to history`);
}

/**
 * Gets the most common error types
 * @returns Array of error types sorted by frequency
 */
export function getMostCommonErrors(): Array<{
  pattern: string;
  count: number;
}> {
  const errorPatterns: Record<string, number> = {};
  
  // Extract common error patterns
  errorHistory.forEach(entry => {
    Object.values(entry.errors).forEach(fileErrors => {
      fileErrors.forEach(error => {
        // Extract error type (e.g., "Type X is not assignable to type Y")
        const pattern = extractErrorPattern(error);
        errorPatterns[pattern] = (errorPatterns[pattern] || 0) + 1;
      });
    });
  });
  
  // Convert to array and sort by frequency
  return Object.entries(errorPatterns)
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Gets the files with the most errors
 * @returns Array of files sorted by error count
 */
export function getMostErrorProneFiles(): Array<{
  filePath: string;
  errorCount: number;
}> {
  const fileErrorCounts: Record<string, number> = {};
  
  // Count errors per file
  errorHistory.forEach(entry => {
    Object.entries(entry.errors).forEach(([filePath, errors]) => {
      fileErrorCounts[filePath] = (fileErrorCounts[filePath] || 0) + errors.length;
    });
  });
  
  // Convert to array and sort by count
  return Object.entries(fileErrorCounts)
    .map(([filePath, errorCount]) => ({ filePath, errorCount }))
    .sort((a, b) => b.errorCount - a.errorCount);
}

/**
 * Gets error trend data for visualization
 * @returns Array of error counts over time
 */
export function getErrorTrendData(): Array<{
  date: string;
  count: number;
}> {
  // Group errors by day
  const errorsByDay: Record<string, number> = {};
  
  errorHistory.forEach(entry => {
    const date = entry.timestamp.toISOString().split('T')[0];
    const errorCount = Object.values(entry.errors)
      .reduce((sum, errors) => sum + errors.length, 0);
    
    errorsByDay[date] = (errorsByDay[date] || 0) + errorCount;
  });
  
  // Convert to array and sort by date
  return Object.entries(errorsByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Extracts a generalized pattern from an error message
 * @param error Error message
 * @returns Generalized error pattern
 */
function extractErrorPattern(error: string): string {
  // Handle common TypeScript error patterns
  if (error.includes('is not assignable to type')) {
    return 'Type assignment error';
  } else if (error.includes('Property') && error.includes('does not exist on type')) {
    return 'Unknown property error';
  } else if (error.includes('Cannot find')) {
    return 'Missing import/reference error';
  } else if (error.includes('No overload matches')) {
    return 'Function parameter mismatch';
  } else {
    // Get first 30 chars as a basic pattern
    return error.substring(0, 30);
  }
}

/**
 * Runs the site form tests to collect error data
 */
export function runAllTests(): void {
  console.log("Running all tests to collect error data");
  
  // Simulate some tests and record errors
  const mockErrors: ErrorsByFile = {
    'src/components/operations/site/SiteForm.tsx': [
      'Type \'string | undefined\' is not assignable to type \'string\'.',
      'Property \'site_type\' is missing in type \'{ address: string; }\'',
    ],
    'src/services/sites/siteService.ts': [
      'Cannot find name \'SiteFormValues\'',
      'No overload matches this call.'
    ]
  };
  
  // Track these errors
  trackErrors(mockErrors);
  
  console.log("Completed test run");
}
