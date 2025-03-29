import { supabase } from '@/integrations/supabase/client'
import type { Employee as EmployeeSchema } from '@/schema/hr.schema'
import { prepareObjectForDb } from '@/utils/dateFormatters'
import type { TablesInsert } from '@/integrations/supabase/types'
import { Database } from '@/integrations/supabase/types'
import { Employee } from '@/types/employee.types'

// Define types for the filter parameters based on the database enum types
type EmployeeStatus = Database['public']['Enums']['employee_status']
type EmploymentType = Database['public']['Enums']['employment_type']
type EmploymentTerminationReason = Database['public']['Enums']['employment_termination_reason']

export async function fetchEmployees(
  searchTerm?: string,
  filters?: {
    department?: string
    status?: string
    employmentType?: string
  },
) {
  let query = supabase.from('employees').select('*')

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,contact_email.ilike.%${searchTerm}%,job_title.ilike.%${searchTerm}%`,
    )
  }

  // Apply filters if provided
  if (filters) {
    if (filters.department && filters.department !== 'all-departments') {
      query = query.eq('department', filters.department)
    }
    if (filters.status && filters.status !== 'all-statuses') {
      // Cast the status to the correct enum type
      query = query.eq('status', filters.status as EmployeeStatus)
    }
    if (filters.employmentType && filters.employmentType !== 'all-types') {
      // Cast the employment_type to the correct enum type
      query = query.eq('employment_type', filters.employmentType as EmploymentType)
    }
  }

  // Sort employees by status (Onboarding first, then Active, then Terminated)
  // and then by last name
  query = query.order('status', { ascending: false }).order('last_name')

  const { data, error } = await query

  if (error) {
    console.error('Error fetching employees:', error)
    throw error
  }

  return data
}

export async function fetchEmployeeById(id: string) {
  const { data, error } = await supabase.from('employees').select('*').eq('id', id).single()

  if (error) {
    console.error('Error fetching employee:', error)
    throw error
  }

  return data
}

// Update the parameter type to accept our modified Employee type that has string | Date
export async function createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // Convert Date objects to ISO strings for Supabase
    const dbEmployee = prepareObjectForDb(employee) as TablesInsert<'employees'>

    const { data, error } = await supabase.from('employees').insert(dbEmployee).select()

    if (error) {
      console.error('Error creating employee:', error)
      throw error
    }

    return data[0]
  } catch (err) {
    console.error('Failed to create employee:', err)
    throw err
  }
}

export async function updateEmployee(id: string, updates: Partial<Employee>) {
  // Convert Date objects to ISO strings for Supabase
  const dbUpdates = prepareObjectForDb(updates) as TablesInsert<'employees'>

  const { data, error } = await supabase.from('employees').update(dbUpdates).eq('id', id).select()

  if (error) {
    console.error('Error updating employee:', error)
    throw error
  }

  return data[0]
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase.from('employees').delete().eq('id', id)

  if (error) {
    console.error('Error deleting employee:', error)
    throw error
  }

  return true
}

// Fetch department options for filters
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

// Fetch employment types from the database enum
export async function fetchEmploymentTypes() {
  const { data, error } = await supabase.rpc('get_employment_type_enum')

  if (error) {
    console.error('Error fetching employment types:', error)
    throw error
  }

  return data
}

// Fetch employee status options from the database enum
export async function fetchEmployeeStatuses() {
  const { data, error } = await supabase.rpc('get_employee_status_enum')

  if (error) {
    console.error('Error fetching employee statuses:', error)
    throw error
  }

  return data
}

// Fetch employment termination reasons from database enum
export async function fetchEmploymentTerminationReasons() {
  const { data, error } = await supabase.rpc('get_employment_termination_reason_enum')

  if (error) {
    console.error('Error fetching employment termination reasons:', error)
    throw error
  }

  return data
}
