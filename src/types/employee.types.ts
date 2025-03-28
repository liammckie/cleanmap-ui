
import { Employee as EmployeeSchema } from '@/schema/hr.schema';

// Export the Employee type from the schema for use throughout the application
export type Employee = EmployeeSchema;

export interface EmployeeFilters {
  department?: string;
  status?: string;
  employmentType?: string;
}
