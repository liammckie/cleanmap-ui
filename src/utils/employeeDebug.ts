
/**
 * Temporary debugging utility for employee data issues
 */

/**
 * Validates employee data structure and logs any inconsistencies
 */
export const validateEmployeeData = (data: any): boolean => {
  if (!data) {
    console.error('Employee data is null or undefined');
    return false;
  }
  
  if (!Array.isArray(data)) {
    console.error('Employee data is not an array', data);
    return false;
  }
  
  const issues: string[] = [];
  
  // Check each employee record
  data.forEach((employee, index) => {
    if (!employee) {
      issues.push(`Employee at index ${index} is null or undefined`);
      return;
    }
    
    // Check required fields
    ['id', 'first_name', 'last_name', 'job_title', 'department', 'status'].forEach(field => {
      if (employee[field] === undefined) {
        issues.push(`Employee at index ${index} is missing required field: ${field}`);
      }
    });
    
    // Check date fields
    ['start_date', 'end_of_employment_date'].forEach(dateField => {
      if (employee[dateField] !== undefined && employee[dateField] !== null) {
        try {
          new Date(employee[dateField]);
        } catch (e) {
          issues.push(`Employee at index ${index} has invalid date format for ${dateField}: ${employee[dateField]}`);
        }
      }
    });
  });
  
  if (issues.length > 0) {
    console.error('Employee data validation issues:', issues);
    return false;
  }
  
  console.log('Employee data validation passed for', data.length, 'records');
  return true;
};

/**
 * Attempts to manually fetch employee data for debugging
 */
export const debugEmployeeData = async (): Promise<void> => {
  try {
    console.group('Employee Data Debug');
    
    const response = await fetch('/api/employees');
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Raw employee data:', data);
    
    validateEmployeeData(data);
    
    console.groupEnd();
  } catch (error) {
    console.error('Error debugging employee data:', error);
    console.groupEnd();
  }
};
