
import { supabase } from '@/integrations/supabase/client'
import { Lead, leadDbSchema } from '@/schema/sales/lead.schema'
import { apiClient } from '@/utils/supabase/apiClient'
import { prepareObjectForDb } from '@/utils/dateFormatters'

/**
 * Create a new lead
 */
export const createLead = async (lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    const preparedData = prepareObjectForDb({
      ...lead,
      created_at: new Date(),
      updated_at: new Date()
    })

    const data = await apiClient.create(
      supabase,
      'leads',
      preparedData,
      leadDbSchema
    )

    return {
      ...data,
      next_action_date: data.next_action_date ? new Date(data.next_action_date) : null,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    }
  } catch (error) {
    console.error('Unexpected error in createLead:', error)
    return null
  }
}

/**
 * Update a lead
 */
export const updateLead = async (leadId: string, lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    // Prepare all data for DB including the updated_at timestamp
    const prepared = prepareObjectForDb({
      ...lead,
      updated_at: new Date()
    })

    const data = await apiClient.update(supabase, 'leads', leadId, prepared)

    return {
      ...data,
      next_action_date: data.next_action_date ? new Date(data.next_action_date) : null,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    }
  } catch (error) {
    console.error('Unexpected error in updateLead:', error)
    return null
  }
}

/**
 * Delete a lead
 */
export const deleteLead = async (leadId: string): Promise<boolean> => {
  try {
    await apiClient.delete(supabase, 'leads', leadId)
    return true
  } catch (error) {
    console.error('Unexpected error in deleteLead:', error)
    return false
  }
}
