
// Helper function to validate termination reasons
export function isValidTerminationReason(reason: string | null | undefined): boolean {
  if (!reason) return false;
  const validReasons = [
    'Resignation', 'Contract End', 'Termination', 'Retirement', 'Other'
  ];
  return validReasons.includes(reason);
}

export function processEmployeeData(employeesRaw: any[] | undefined) {
  if (!employeesRaw) return [];
  
  return employeesRaw.map(emp => ({
    ...emp,
    end_of_employment_reason: isValidTerminationReason(emp.end_of_employment_reason) 
      ? emp.end_of_employment_reason 
      : null
  }));
}
