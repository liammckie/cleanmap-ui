
/**
 * Employee Data Utilities
 * 
 * @deprecated Consider using functions from src/mappers/employeeMappers.ts instead
 */

import { mapEmployeesFromDb, isValidTerminationReason } from '@/mappers/employeeMappers'

// Re-export the function for backward compatibility
export { isValidTerminationReason }

/**
 * Process raw employee data from API/database into properly typed employee objects
 * @deprecated Use mapEmployeesFromDb from src/mappers/employeeMappers.ts instead
 */
export function processEmployeeData(employeesRaw: any[] | undefined) {
  return mapEmployeesFromDb(employeesRaw || [])
}
