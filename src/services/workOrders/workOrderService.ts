
import { supabase } from '@/integrations/supabase/client';
import type { WorkOrder } from '@/schema/operations.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';
import { fetchWorkOrderAssignments, createWorkOrderAssignments, deleteWorkOrderAssignments } from './workOrderAssignmentService';
import { fetchWorkOrderChecklistItems, createWorkOrderChecklistItems, deleteWorkOrderChecklistItems } from './workOrderChecklistService';

/**
 * Fetch a work order by ID with all related data
 */
export async function fetchWorkOrderById(id: string) {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      site:sites(id, site_name, client_id, client:clients(company_name)),
      contract:contracts(id, contract_number),
      completed_by_employee:employees(id, first_name, last_name),
      assignments:work_order_assignments(
        id, 
        employee_id, 
        assignment_type,
        employee:employees(id, first_name, last_name)
      ),
      checklist_items:audit_checklist_items(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching work order:', error);
    throw error;
  }

  return data;
}

/**
 * Create a new work order with optional assignments and checklist items
 */
export async function createWorkOrder(
  workOrder: Omit<WorkOrder, 'id' | 'created_at' | 'updated_at'>,
  assignments = [],
  checklistItems = []
) {
  // Convert Date objects to ISO strings for Supabase
  const dbWorkOrder = prepareObjectForDb(workOrder);
  
  // Create the work order
  const { data, error } = await supabase
    .from('work_orders')
    .insert(dbWorkOrder)
    .select();

  if (error) {
    console.error('Error creating work order:', error);
    throw error;
  }

  const workOrderId = data[0].id;

  // Create assignments if provided
  if (assignments.length > 0) {
    await createWorkOrderAssignments(workOrderId, assignments);
  }

  // Create checklist items if provided
  if (checklistItems.length > 0) {
    await createWorkOrderChecklistItems(workOrderId, checklistItems);
  }

  return data[0];
}

/**
 * Update an existing work order with optional assignments and checklist items
 */
export async function updateWorkOrder(
  id: string,
  updates: Partial<WorkOrder>,
  assignments?,
  checklistItems?
) {
  // Convert Date objects to ISO strings for Supabase
  const dbUpdates = prepareObjectForDb(updates);
  
  // Update the work order
  const { data, error } = await supabase
    .from('work_orders')
    .update(dbUpdates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating work order:', error);
    throw error;
  }

  // Update assignments if provided
  if (assignments !== undefined) {
    // First delete existing assignments
    await deleteWorkOrderAssignments(id);
    
    // Then create new assignments
    if (assignments.length > 0) {
      await createWorkOrderAssignments(id, assignments);
    }
  }

  // Update checklist items if provided
  if (checklistItems !== undefined) {
    // First delete existing checklist items
    await deleteWorkOrderChecklistItems(id);
    
    // Then create new checklist items
    if (checklistItems.length > 0) {
      await createWorkOrderChecklistItems(id, checklistItems);
    }
  }

  return data[0];
}

/**
 * Delete a work order by ID
 */
export async function deleteWorkOrder(id: string) {
  const { error } = await supabase
    .from('work_orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting work order:', error);
    throw error;
  }

  return true;
}
