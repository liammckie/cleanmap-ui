
import { Employee as EmployeeSchema } from '@/schema/hr.schema'

// Define the employment termination reason type based on the Supabase enum
export type EmploymentTerminationReason = 'Resignation' | 'Contract End' | 'Termination' | 'Retirement' | 'Other'

// Modify the Employee type to handle string dates from the API
export type Employee = Omit<
  EmployeeSchema,
  'date_of_birth' | 'start_date' | 'end_of_employment_date' | 'created_at' | 'updated_at' | 'end_of_employment_reason'
> & {
  // API returns dates as strings, but we want to use them as Date objects in the UI
  date_of_birth: string | Date
  start_date: string | Date
  end_of_employment_date?: string | Date | null
  end_of_employment_reason?: EmploymentTerminationReason | null
  created_at: string | Date
  updated_at: string | Date
}

export interface EmployeeFilters {
  department?: string
  status?: string
  employmentType?: string
}
