import { supabase } from '@/integrations/supabase/client';
import type { WorkOrder } from '@/schema/operations';
import { prepareObjectForDb } from '@/utils/dateFormatters';
import { generateWorkOrderNumber } from '@/utils/identifierGenerators';

/**
 * Create a new work order
 */
export async function createWorkOrder(
  workOrder: Omit<WorkOrder, 'id' | 'created_at' | 'updated_at' | 'work_order_number'>
) {
  try {
    // Generate work order number
    const workOrderNumber = await generateWorkOrderNumber();
    
    // Prepare the work order data with the generated number
    const fullWorkOrder = {
      ...workOrder,
      work_order_number: workOrderNumber
    };

    // Convert Date objects to ISO strings for Supabase
    const dbWorkOrder = prepareObjectForDb(fullWorkOrder);
    
    // Insert into database
    const { data, error } = await supabase
      .from('work_orders')
      .insert(dbWorkOrder as any)
      .select();

    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error creating work order:', error);
    throw error;
  }
}

/**
 * Update an existing work order
 */
export async function updateWorkOrder(
  id: string,
  updates: Partial<WorkOrder>
) {
  try {
    // Convert Date objects to ISO strings for Supabase
    const dbUpdates = prepareObjectForDb(updates);
    
    // Update in database
    const { data, error } = await supabase
      .from('work_orders')
      .update(dbUpdates as any)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error updating work order:', error);
    throw error;
  }
}

/**
 * Delete an existing work order
 */
export async function deleteWorkOrder(id: string) {
  try {
    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting work order:', error);
    throw error;
  }
}

/**
 * Log a note on a work order
 */
export async function logWorkOrderNote(
  workOrderId: string,
  note: string,
  authorId: string,
  visibility: 'Internal' | 'Client Visible' = 'Internal'
) {
  try {
    const { data, error } = await supabase
      .from('work_order_notes')
      .insert({
        work_order_id: workOrderId,
        note,
        author_id: authorId,
        visibility
      })
      .select();
      
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error logging work order note:', error);
    throw error;
  }
}

/**
 * Fetch work order statuses
 */
export async function fetchWorkOrderStatuses() {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select('status')
      .distinct();
      
    if (error) throw error;
    
    // Extract unique statuses
    const statuses = [...new Set(data.map(wo => wo.status))];
    return statuses;
  } catch (error) {
    console.error('Error fetching work order statuses:', error);
    throw error;
  }
}

/**
 * Fetch work order categories
 */
export async function fetchWorkOrderCategories() {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select('category')
      .distinct();
      
    if (error) throw error;
    
    // Extract unique categories
    const categories = [...new Set(data.map(wo => wo.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching work order categories:', error);
    throw error;
  }
}

/**
 * Fetch work order priorities
 */
export async function fetchWorkOrderPriorities() {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select('priority')
      .distinct();
      
    if (error) throw error;
    
    // Extract unique priorities
    const priorities = [...new Set(data.map(wo => wo.priority))];
    return priorities;
  } catch (error) {
    console.error('Error fetching work order priorities:', error);
    throw error;
  }
}
