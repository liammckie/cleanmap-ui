
import { supabase } from '@/integrations/supabase/client'
import { WorkOrderFormValues } from '@/schema/operations/workOrder.schema'
import { formatDateForDb } from '@/utils/dateUtils'
import { WORK_ORDER_CATEGORIES } from '@/constants/workOrders'
import { logAndDocumentError } from '@/utils/errorCapture'

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
  // Validate required fields
  if (!workOrder.description) {
    throw new Error('Work order description is required')
  }
  
  if (!workOrder.site_id) {
    throw new Error('Site ID is required for work orders')
  }

  // Transform dates to ISO strings for database storage
  const preparedData = {
    ...workOrder,
    site_id: workOrder.site_id, // Explicitly include site_id
    scheduled_start: formatDateForDb(workOrder.scheduled_start),
    due_date: formatDateForDb(workOrder.due_date),
    category: workOrder.category || WORK_ORDER_CATEGORIES[0], // Ensure category is always set
    description: workOrder.description // Explicitly include the required field
  }

  try {
    const { data, error } = await supabase
      .from('work_orders')
      .insert(preparedData)
      .select()
      .single()

    if (error) throw new Error(`Error creating work order: ${error.message}`)
    return data
  } catch (error) {
    // Log the error and document it for future reference
    logAndDocumentError(error instanceof Error ? error : new Error('Unknown error'), {
      component: 'workOrderService',
      operation: 'createWorkOrder',
      additionalInfo: { workOrderData: preparedData }
    });
    throw error;
  }
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

  try {
    const { data, error } = await supabase
      .from('work_orders')
      .update(preparedData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Error updating work order: ${error.message}`)
    return data
  } catch (error) {
    // Log the error and document it
    logAndDocumentError(error instanceof Error ? error : new Error('Unknown error'), {
      component: 'workOrderService',
      operation: 'updateWorkOrder',
      additionalInfo: { workOrderId: id, updates: preparedData }
    });
    throw error;
  }
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
