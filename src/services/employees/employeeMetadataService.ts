
import { supabase } from '@/integrations/supabase/client'

/**
 * Fetch department options for filters
 */
export async function fetchDepartments() {
  const { data, error } = await supabase.from('employees').select('department').order('department')

  if (error) {
    console.error('Error fetching departments:', error)
    throw error
  }

  // Extract unique departments
  const departments = [...new Set(data.map((emp) => emp.department))]
  return departments.filter(Boolean) // Remove any null/undefined values
}

/**
 * Fetch employment types from the database enum
 */
export async function fetchEmploymentTypes() {
  const { data, error } = await supabase.rpc('get_employment_type_enum')

  if (error) {
    console.error('Error fetching employment types:', error)
    throw error
  }

  return data
}

/**
 * Fetch employee status options from the database enum
 */
export async function fetchEmployeeStatuses() {
  const { data, error } = await supabase.rpc('get_employee_status_enum')

  if (error) {
    console.error('Error fetching employee statuses:', error)
    throw error
  }

  return data
}

/**
 * Fetch employment termination reasons from database enum
 */
export async function fetchEmploymentTerminationReasons() {
  const { data, error } = await supabase.rpc('get_employment_termination_reason_enum')

  if (error) {
    console.error('Error fetching employment termination reasons:', error)
    throw error
  }

  return data
}
