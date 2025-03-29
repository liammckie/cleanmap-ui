
import { supabase } from '@/integrations/supabase/client'
import type { AuditChecklistItem, AuditChecklistItemInsert } from '@/schema/operations/audit.schema'

/**
 * Fetch checklist items for a specific work order
 */
export async function fetchWorkOrderChecklistItems(workOrderId: string) {
  const { data, error } = await supabase
    .from('audit_checklist_items')
    .select('*')
    .eq('work_order_id', workOrderId)

  if (error) {
    console.error('Error fetching audit checklist items:', error)
    throw error
  }

  return data as AuditChecklistItem[]
}

/**
 * Create checklist items for a work order
 */
export async function createWorkOrderChecklistItems(
  workOrderId: string,
  checklistItems: Omit<AuditChecklistItemInsert, 'work_order_id'>[],
) {
  const checklistWithWorkOrderId = checklistItems.map((item) => ({
    ...item,
    work_order_id: workOrderId,
  }))

  const { data, error } = await supabase
    .from('audit_checklist_items')
    .insert(checklistWithWorkOrderId)
    .select()

  if (error) {
    console.error('Error creating audit checklist items:', error)
    throw error
  }

  return data as AuditChecklistItem[]
}

/**
 * Delete all checklist items for a work order
 */
export async function deleteWorkOrderChecklistItems(workOrderId: string) {
  const { error } = await supabase
    .from('audit_checklist_items')
    .delete()
    .eq('work_order_id', workOrderId)

  if (error) {
    console.error('Error deleting audit checklist items:', error)
    throw error
  }

  return true
}
