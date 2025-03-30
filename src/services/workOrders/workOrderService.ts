
import { supabase } from '@/integrations/supabase/client'
import type { WorkOrder, WorkOrderFormValues } from '@/schema/operations'
import { prepareObjectForDb } from '@/utils/dateFormatters'
import { validateForDb } from '@/utils/supabase/validation'
import { workOrderDbSchema } from '@/schema/operations/workOrder.schema'
import { 
  fetchWorkOrderStatusesFromDb, 
  fetchWorkOrderCategoriesFromDb, 
  fetchWorkOrderPrioritiesFromDb 
} from './workOrderQueryService'

/**
 * Create a new work order
 */
export async function createWorkOrder(
  workOrder: WorkOrderFormValues
) {
  try {
    // Convert Date objects to ISO strings for Supabase and validate
    const dbWorkOrder = prepareObjectForDb(workOrder)
    
    // Make sure category is set (required by the database)
    if (!dbWorkOrder.category) {
      dbWorkOrder.category = 'Routine Clean'
    }
    
    // Validate against the DB schema
    // (This step is optional but adds extra safety)
    validateForDb(dbWorkOrder, workOrderDbSchema)

    // Insert into database
    const { data, error } = await supabase
      .from('work_orders')
      .insert(dbWorkOrder)
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
export async function updateWorkOrder(id: string, updates: Partial<WorkOrderFormValues>) {
  try {
    // Convert Date objects to ISO strings for Supabase
    const dbUpdates = prepareObjectForDb(updates)
    
    // Convert any Date objects in the updates to ISO strings
    if (dbUpdates.due_date instanceof Date) {
      dbUpdates.due_date = dbUpdates.due_date.toISOString()
    }
    
    if (dbUpdates.scheduled_start instanceof Date) {
      dbUpdates.scheduled_start = dbUpdates.scheduled_start.toISOString()
    }

    // Update in database
    const { data, error } = await supabase
      .from('work_orders')
      .update(dbUpdates)
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
export async function fetchWorkOrderStatuses(): Promise<WorkOrder['status'][]> {
  try {
    // Try to get statuses from the database first
    const dbStatuses = await fetchWorkOrderStatusesFromDb()
    
    if (dbStatuses && dbStatuses.length > 0) {
      return dbStatuses as WorkOrder['status'][]
    }
    
    // Fallback to hardcoded statuses from the schema constants
    return ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue', 'On Hold']
  } catch (error) {
    console.error('Error fetching work order statuses:', error)
    // Fallback to hardcoded statuses on error
    return ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue', 'On Hold']
  }
}

/**
 * Fetch work order categories
 */
export async function fetchWorkOrderCategories(): Promise<WorkOrder['category'][]> {
  try {
    // Try to get categories from the database first
    const dbCategories = await fetchWorkOrderCategoriesFromDb()
    
    if (dbCategories && dbCategories.length > 0) {
      return dbCategories as WorkOrder['category'][]
    }
    
    // Fallback to hardcoded categories from the schema constants
    return ['Routine Clean', 'Ad-hoc Request', 'Audit']
  } catch (error) {
    console.error('Error fetching work order categories:', error)
    // Fallback to hardcoded categories on error
    return ['Routine Clean', 'Ad-hoc Request', 'Audit']
  }
}

/**
 * Fetch work order priorities
 */
export async function fetchWorkOrderPriorities(): Promise<WorkOrder['priority'][]> {
  try {
    // Try to get priorities from the database first
    const dbPriorities = await fetchWorkOrderPrioritiesFromDb()
    
    if (dbPriorities && dbPriorities.length > 0) {
      return dbPriorities as WorkOrder['priority'][]
    }
    
    // Fallback to hardcoded priorities from the schema constants
    return ['Low', 'Medium', 'High']
  } catch (error) {
    console.error('Error fetching work order priorities:', error)
    // Fallback to hardcoded priorities on error
    return ['Low', 'Medium', 'High']
  }
}
