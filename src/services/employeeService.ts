
import { supabase } from '@/integrations/supabase/client';
import type { Employee } from '@/schema/hr.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';

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
      // Type safe casting
      query = query.eq('status', filters.status as any);
    }
    if (filters.employmentType) {
      query = query.eq('employment_type', filters.employmentType as any);
    }
  }

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
  const dbEmployee = prepareObjectForDb(employee);
  
  const { data, error } = await supabase
    .from('employees')
    .insert(dbEmployee as any)
    .select();

  if (error) {
    console.error('Error creating employee:', error);
    throw error;
  }

  return data[0];
}

export async function updateEmployee(id: string, updates: Partial<Employee>) {
  // Convert Date objects to ISO strings for Supabase
  const dbUpdates = prepareObjectForDb(updates);
  
  const { data, error } = await supabase
    .from('employees')
    .update(dbUpdates as any)
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
  return departments;
}
