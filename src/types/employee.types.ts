
import { Employee as EmployeeSchema } from '@/schema/hr.schema';

// Modify the Employee type to handle string dates from the API
export type Employee = Omit<EmployeeSchema, 'date_of_birth' | 'start_date' | 'created_at' | 'updated_at'> & {
  // API returns dates as strings, but we want to use them as Date objects in the UI
  date_of_birth: string | Date;
  start_date: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
};

export interface EmployeeFilters {
  department?: string;
  status?: string;
  employmentType?: string;
}
