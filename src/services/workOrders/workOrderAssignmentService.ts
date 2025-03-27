
import { supabase } from '@/integrations/supabase/client';
import type { WorkOrderAssignment } from '@/schema/operations';

/**
 * Fetch assignments for a specific work order
 */
export async function fetchWorkOrderAssignments(workOrderId: string) {
  const { data, error } = await supabase
    .from('work_order_assignments')
    .select(`
      *,
      employee:employees(id, first_name, last_name)
    `)
    .eq('work_order_id', workOrderId);

  if (error) {
    console.error('Error fetching work order assignments:', error);
    throw error;
  }

  return data;
}

/**
 * Create assignments for a work order
 */
export async function createWorkOrderAssignments(
  workOrderId: string,
  assignments: Omit<WorkOrderAssignment, 'id' | 'work_order_id' | 'created_at' | 'updated_at'>[]
) {
  const assignmentsWithWorkOrderId = assignments.map(assignment => ({
    ...assignment,
    work_order_id: workOrderId
  }));

  const { data, error } = await supabase
    .from('work_order_assignments')
    .insert(assignmentsWithWorkOrderId)
    .select();

  if (error) {
    console.error('Error creating work order assignments:', error);
    throw error;
  }

  return data;
}

/**
 * Delete all assignments for a work order
 */
export async function deleteWorkOrderAssignments(workOrderId: string) {
  const { error } = await supabase
    .from('work_order_assignments')
    .delete()
    .eq('work_order_id', workOrderId);

  if (error) {
    console.error('Error deleting work order assignments:', error);
    throw error;
  }

  return true;
}
