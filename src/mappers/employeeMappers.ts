
/**
 * 🧠 Employee Mappers
 * 
 * These mappers handle transformations between database representation 
 * and UI representation of Employee data.
 */

import { Employee as EmployeeSchema } from '@/schema/hr.schema'
import { Employee, EmploymentTerminationReason } from '@/types/employee.types'
import { mapFromDb, mapToDb } from '@/utils/mappers'

/**
 * Type guard to validate employment termination reasons
 */
export const isValidTerminationReason = (value: string | null | undefined): value is EmploymentTerminationReason => {
  if (!value) return false
  const validReasons: EmploymentTerminationReason[] = [
    'Resignation', 'Contract End', 'Termination', 'Retirement', 'Other'
  ]
  return validReasons.includes(value as EmploymentTerminationReason)
}

/**
 * Maps a database employee record to the UI representation
 */
export function mapEmployeeFromDb(dbEmployee: any): Employee {
  const mappedEmployee = mapFromDb(dbEmployee) as Employee
  
  // Ensure proper typing of termination reason
  return {
    ...mappedEmployee,
    end_of_employment_reason: isValidTerminationReason(mappedEmployee.end_of_employment_reason)
      ? mappedEmployee.end_of_employment_reason
      : null
  }
}

/**
 * Maps an array of database employee records to UI representation
 */
export function mapEmployeesFromDb(dbEmployees: any[]): Employee[] {
  if (!dbEmployees || !Array.isArray(dbEmployees)) {
    console.warn('mapEmployeesFromDb received invalid data:', dbEmployees)
    return []
  }

  return dbEmployees
    .map(dbEmployee => mapEmployeeFromDb(dbEmployee))
    .filter(Boolean) // Filter out null values
}

/**
 * Maps a UI employee object to database representation for insert/update
 */
export function mapEmployeeToDb(employee: Partial<Employee>): Partial<EmployeeSchema> {
  // First ensure the end_of_employment_reason is valid
  const validatedEmployee = {
    ...employee,
    end_of_employment_reason: isValidTerminationReason(employee.end_of_employment_reason) 
      ? employee.end_of_employment_reason 
      : null
  }
  
  // Then convert to snake_case and handle date conversions
  return mapToDb(validatedEmployee)
}
