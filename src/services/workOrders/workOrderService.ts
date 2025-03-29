
import { supabase } from '@/integrations/supabase/client'
import type { WorkOrder } from '@/schema/operations'
import { prepareObjectForDb } from '@/utils/dateFormatters'
import { isWorkOrderStatus, isWorkOrderPriority, isWorkOrderCategory } from '@/schema/operations/workOrder.schema'
import { fetchWorkOrderStatusesFromDb, fetchWorkOrderCategoriesFromDb, fetchWorkOrderPrioritiesFromDb } from './workOrderQueryService'

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
    // Insert note into work_order_notes table
    const { data, error } = await supabase
      .from('work_order_notes')
      .insert({
        work_order_id: workOrderId,
        note,
        author_id: authorId,
        visibility
      })
      .select()

    if (error) throw error

    return data[0]
  } catch (error) {
    console.error('Error logging work order note:', error)
    throw error
  }
}

/**
 * Fetch work order notes for a specific work order
 */
export async function fetchWorkOrderNotes(workOrderId: string) {
  try {
    const { data, error } = await supabase
      .from('work_order_notes')
      .select('*')
      .eq('work_order_id', workOrderId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error fetching work order notes:', error)
    throw error
  }
}

/**
 * Fetch work order statuses
 */
export async function fetchWorkOrderStatuses() {
  try {
    // Try to get statuses from the database first
    const dbStatuses = await fetchWorkOrderStatusesFromDb()
    
    if (dbStatuses && dbStatuses.length > 0) {
      return dbStatuses
    }
    
    // Fallback to hardcoded statuses if database function is unavailable
    return ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue', 'On Hold'] as WorkOrder['status'][]
  } catch (error) {
    console.error('Error fetching work order statuses:', error)
    // Fallback to hardcoded statuses on error
    return ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue', 'On Hold'] as WorkOrder['status'][]
  }
}

/**
 * Fetch work order categories
 */
export async function fetchWorkOrderCategories() {
  try {
    // Try to get categories from the database first
    const dbCategories = await fetchWorkOrderCategoriesFromDb()
    
    if (dbCategories && dbCategories.length > 0) {
      return dbCategories
    }
    
    // Fallback to hardcoded categories if database function is unavailable
    return ['Routine Clean', 'Ad-hoc Request', 'Audit'] as WorkOrder['category'][]
  } catch (error) {
    console.error('Error fetching work order categories:', error)
    // Fallback to hardcoded categories on error
    return ['Routine Clean', 'Ad-hoc Request', 'Audit'] as WorkOrder['category'][]
  }
}

/**
 * Fetch work order priorities
 */
export async function fetchWorkOrderPriorities() {
  try {
    // Try to get priorities from the database first
    const dbPriorities = await fetchWorkOrderPrioritiesFromDb()
    
    if (dbPriorities && dbPriorities.length > 0) {
      return dbPriorities
    }
    
    // Fallback to hardcoded priorities if database function is unavailable
    return ['Low', 'Medium', 'High'] as WorkOrder['priority'][]
  } catch (error) {
    console.error('Error fetching work order priorities:', error)
    // Fallback to hardcoded priorities on error
    return ['Low', 'Medium', 'High'] as WorkOrder['priority'][]
  }
}
