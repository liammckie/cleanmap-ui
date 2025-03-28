import { supabase } from '@/integrations/supabase/client';
import type { Employee } from '@/schema/hr.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';
import type { TablesInsert } from '@/integrations/supabase/types';
import { Database } from '@/integrations/supabase/types';

// Define types for the filter parameters based on the database enum types
type EmployeeStatus = Database['public']['Enums']['employee_status'];
type EmploymentType = Database['public']['Enums']['employment_type'];

export async function fetchEmployees(
  searchTerm?: string, 
  filters?: { 
    department?: string; 
    status?: string; 
    employmentType?: string 
  }
) {
  let query = supabase
    .from('employees')
    .select('*');

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,contact_email.ilike.%${searchTerm}%,job_title.ilike.%${searchTerm}%`
    );
  }

  // Apply filters if provided
  if (filters) {
    if (filters.department) {
      query = query.eq('department', filters.department);
    }
    if (filters.status) {
      // Cast the status to the correct enum type
      query = query.eq('status', filters.status as EmployeeStatus);
    }
    if (filters.employmentType) {
      // Cast the employment_type to the correct enum type
      query = query.eq('employment_type', filters.employmentType as EmploymentType);
    }
  }

  // Sort employees by status (Onboarding first, then Active, then Terminated)
  // and then by last name
  query = query.order('status', { ascending: false }).order('last_name');

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }

  return data;
}

export async function fetchEmployeeById(id: string) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }

  return data;
}

export async function createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) {
  // Convert Date objects to ISO strings for Supabase
  const dbEmployee = prepareObjectForDb(employee) as TablesInsert<'employees'>;
  
  const { data, error } = await supabase
    .from('employees')
    .insert(dbEmployee)
    .select();

  if (error) {
    console.error('Error creating employee:', error);
    throw error;
  }

  return data[0];
}

export async function updateEmployee(id: string, updates: Partial<Employee>) {
  // Convert Date objects to ISO strings for Supabase
  const dbUpdates = prepareObjectForDb(updates) as TablesInsert<'employees'>;
  
  const { data, error } = await supabase
    .from('employees')
    .update(dbUpdates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating employee:', error);
    throw error;
  }

  return data[0];
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }

  return true;
}

// Fetch department options for filters
export async function fetchDepartments() {
  const { data, error } = await supabase
    .from('employees')
    .select('department')
    .order('department');

  if (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }

  // Extract unique departments
  const departments = [...new Set(data.map(emp => emp.department))];
  return departments.filter(Boolean); // Remove any null/undefined values
}

// Fetch employment types for filters
export async function fetchEmploymentTypes() {
  const { data, error } = await supabase
    .from('employees')
    .select('employment_type')
    .order('employment_type');

  if (error) {
    console.error('Error fetching employment types:', error);
    throw error;
  }

  // Extract unique employment types
  const types = [...new Set(data.map(emp => emp.employment_type))];
  return types.filter(Boolean); // Remove any null/undefined values
}
