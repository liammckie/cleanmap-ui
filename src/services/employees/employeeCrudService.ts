
import { supabase } from '@/integrations/supabase/client'
import type { Employee } from '@/types/employee.types'
import type { TablesInsert } from '@/integrations/supabase/types'
import { mapEmployeeFromDb, mapEmployeeToDb } from '@/mappers/employeeMappers'
import { prepareObjectForDb } from '@/utils/dateFormatters'

/**
 * Fetch a single employee by ID
 */
export async function fetchEmployeeById(id: string) {
  const { data, error } = await supabase.from('employees').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching employee:', error)
    throw error
  }

  return mapEmployeeFromDb(data)
}

/**
 * Create a new employee
 */
export async function createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // First convert the employee object to DB format
    const dbEmployee = mapEmployeeToDb(employee)
    
    // Then prepare Date objects for Supabase (convert to ISO strings)
    const preparedEmployee = prepareObjectForDb(dbEmployee) as TablesInsert<'employees'>

    const { data, error } = await supabase.from('employees').insert(preparedEmployee).select()

    if (error) {
      console.error('Error creating employee:', error)
      throw error
    }

    return mapEmployeeFromDb(data[0])
  } catch (err) {
    console.error('Failed to create employee:', err)
    throw err
  }
}

/**
 * Update an existing employee
 */
export async function updateEmployee(id: string, updates: Partial<Employee>) {
  // First convert the employee object to DB format using our mapper
  const dbUpdates = mapEmployeeToDb(updates)
  
  // Then ensure dates are properly formatted as strings
  const preparedUpdates = prepareObjectForDb(dbUpdates)

  const { data, error } = await supabase.from('employees').update(preparedUpdates).eq('id', id).select()

  if (error) {
    console.error('Error updating employee:', error)
    throw error
  }

  return mapEmployeeFromDb(data[0])
}

/**
 * Delete an employee by ID
 */
export async function deleteEmployee(id: string) {
  const { error } = await supabase.from('employees').delete().eq('id', id)

  if (error) {
    console.error('Error deleting employee:', error)
    throw error
  }

  return true
}
