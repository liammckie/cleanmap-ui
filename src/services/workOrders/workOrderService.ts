
import { supabase } from '@/integrations/supabase/client'
import type { WorkOrder } from '@/schema/operations'
import { prepareObjectForDb } from '@/utils/dateFormatters'
import { isWorkOrderStatus, isWorkOrderPriority, isWorkOrderCategory } from '@/schema/operations/workOrder.schema'

/**
 * Create a new work order
 */
export async function createWorkOrder(
  workOrder: Omit<WorkOrder, 'id' | 'created_at' | 'updated_at'>,
) {
  try {
    // Convert Date objects to ISO strings for Supabase
    const dbWorkOrder = prepareObjectForDb(workOrder)

    // Insert into database
    const { data, error } = await supabase
      .from('work_orders')
      .insert(dbWorkOrder as any)
      .select()

    if (error) throw error

    return data[0]
  } catch (error) {
    console.error('Error creating work order:', error)
    throw error
  }
}

/**
 * Update an existing work order
 */
export async function updateWorkOrder(id: string, updates: Partial<WorkOrder>) {
  try {
    // Convert Date objects to ISO strings for Supabase
    const dbUpdates = prepareObjectForDb(updates)

    // Update in database
    const { data, error } = await supabase
      .from('work_orders')
      .update(dbUpdates as any)
      .eq('id', id)
      .select()

    if (error) throw error

    return data[0]
  } catch (error) {
    console.error('Error updating work order:', error)
    throw error
  }
}

/**
 * Delete an existing work order
 */
export async function deleteWorkOrder(id: string) {
  try {
    const { error } = await supabase.from('work_orders').delete().eq('id', id)

    if (error) throw error

    return true
  } catch (error) {
    console.error('Error deleting work order:', error)
    throw error
  }
}

/**
 * Log a note on a work order
 */
export async function logWorkOrderNote(
  workOrderId: string,
  note: string,
  authorId: string,
  visibility: 'Internal' | 'Client Visible' = 'Internal',
) {
  try {
    // Since work_order_notes table doesn't exist, we'll need to
    // update or modify the model, but for now let's implement
    // placeholder functionality to avoid TypeScript errors
    console.log('Logging work order note:', { workOrderId, note, authorId, visibility })

    // Mock return for now
    return {
      id: 'mock-note-id',
      work_order_id: workOrderId,
      note,
      author_id: authorId,
      visibility,
      created_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error logging work order note:', error)
    throw error
  }
}

/**
 * Fetch work order statuses
 */
export async function fetchWorkOrderStatuses() {
  try {
    // Hardcoded statuses for now - in a real implementation, these might come from the database
    return ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue', 'On Hold'] as WorkOrder['status'][]
  } catch (error) {
    console.error('Error fetching work order statuses:', error)
    throw error
  }
}

/**
 * Fetch work order categories
 */
export async function fetchWorkOrderCategories() {
  try {
    // Mock categories for demonstration
    return ['Routine Clean', 'Ad-hoc Request', 'Audit'] as WorkOrder['category'][]
  } catch (error) {
    console.error('Error fetching work order categories:', error)
    throw error
  }
}

/**
 * Fetch work order priorities
 */
export async function fetchWorkOrderPriorities() {
  try {
    // Hardcoded priorities for now
    return ['Low', 'Medium', 'High'] as WorkOrder['priority'][]
  } catch (error) {
    console.error('Error fetching work order priorities:', error)
    throw error
  }
}
