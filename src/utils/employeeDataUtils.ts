
// Helper function to validate termination reasons
export function isValidTerminationReason(reason: string | null | undefined): boolean {
  if (!reason) return false;
  const validReasons = [
    'Resignation', 'Contract End', 'Termination', 'Retirement', 'Other'
  ];
  return validReasons.includes(reason);
}

export function processEmployeeData(employeesRaw: any[] | undefined) {
  if (!employeesRaw || !Array.isArray(employeesRaw)) {
    console.warn('processEmployeeData received invalid data:', employeesRaw);
    return [];
  }
  
  try {
    return employeesRaw.map(emp => {
      if (!emp) return null;
      
      return {
        ...emp,
        end_of_employment_reason: isValidTerminationReason(emp.end_of_employment_reason) 
          ? emp.end_of_employment_reason 
          : null
      };
    }).filter(Boolean); // Filter out null values
  } catch (error) {
    console.error('Error in processEmployeeData:', error);
    return [];
  }
}
