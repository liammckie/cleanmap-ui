
import { supabase } from '@/integrations/supabase/client'
import { Database } from '@/integrations/supabase/types'
import { mapEmployeesFromDb } from '@/mappers/employeeMappers'
import { EmployeeFilters } from '@/types/employee.types'

// Define types for the filter parameters based on the database enum types
type EmployeeStatus = Database['public']['Enums']['employee_status']
type EmploymentType = Database['public']['Enums']['employment_type']

/**
 * Fetch all employees with optional filtering
 */
export async function fetchEmployees(
  searchTerm?: string,
  filters?: EmployeeFilters,
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

  // Transform data using our mapper
  return mapEmployeesFromDb(data)
}
