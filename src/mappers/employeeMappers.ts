
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
  if (!dbEmployee) {
    console.warn('Received null or undefined employee data in mapEmployeeFromDb')
    throw new Error('Invalid employee data received from database')
  }

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
    .map(dbEmployee => {
      try {
        return mapEmployeeFromDb(dbEmployee)
      } catch (error) {
        console.error('Error mapping employee from DB:', error, dbEmployee)
        return null
      }
    })
    .filter(Boolean) as Employee[] // Filter out null values
}

/**
 * Maps a UI employee object to database representation for insert/update
 * Ensures all fields are properly formatted and validated
 */
export function mapEmployeeToDb(employee: Partial<Employee>): Record<string, any> {
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
