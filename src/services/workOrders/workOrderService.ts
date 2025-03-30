
import { supabase } from '@/integrations/supabase/client'
import { WorkOrderFormValues } from '@/schema/operations/workOrder.schema'
import { formatDateForDb } from '@/utils/dateUtils'
import { WORK_ORDER_CATEGORIES } from '@/constants/workOrders'

/**
 * Fetches all work orders with related site information
 */
export async function fetchWorkOrders() {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      site:site_id(id, site_name, client_id, client:client_id(company_name))
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Error fetching work orders: ${error.message}`)
  return data || []
}

/**
 * Fetches a specific work order by ID
 */
export async function fetchWorkOrderById(id: string) {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      site:site_id(id, site_name, client_id, client:client_id(company_name))
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(`Error fetching work order: ${error.message}`)
  return data
}

/**
 * Creates a new work order
 */
export async function createWorkOrder(workOrder: WorkOrderFormValues) {
  // Transform dates to ISO strings for database storage
  const preparedData = {
    ...workOrder,
    scheduled_start: formatDateForDb(workOrder.scheduled_start),
    due_date: formatDateForDb(workOrder.due_date),
    category: workOrder.category || WORK_ORDER_CATEGORIES[0] // Ensure category is always set
  }

  const { data, error } = await supabase
    .from('work_orders')
    .insert(preparedData) // Fixed: removed array brackets
    .select()
    .single()

  if (error) throw new Error(`Error creating work order: ${error.message}`)
  return data
}

/**
 * Updates an existing work order
 */
export async function updateWorkOrder(
  id: string, 
  workOrder: Partial<WorkOrderFormValues>
) {
  // Transform dates to ISO strings if present
  const preparedData: Record<string, any> = { ...workOrder }
  
  if (workOrder.scheduled_start) {
    preparedData.scheduled_start = formatDateForDb(workOrder.scheduled_start)
  }
  
  if (workOrder.due_date) {
    preparedData.due_date = formatDateForDb(workOrder.due_date)
  }
  
  // Ensure category is included if provided
  if (workOrder.category) {
    preparedData.category = workOrder.category
  }

  const { data, error } = await supabase
    .from('work_orders')
    .update(preparedData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Error updating work order: ${error.message}`)
  return data
}

/**
 * Deletes a work order
 */
export async function deleteWorkOrder(id: string) {
  const { error } = await supabase
    .from('work_orders')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Error deleting work order: ${error.message}`)
}
