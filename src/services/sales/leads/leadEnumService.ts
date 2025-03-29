import { supabase } from '@/integrations/supabase/client'
import { LeadSource, LeadStage, LeadStatus } from '@/schema/sales/lead.schema'

/**
 * Get all possible lead stages
 */
export const getLeadStages = async (): Promise<LeadStage[]> => {
  try {
    const { data, error } = await supabase.rpc('get_lead_stage_enum')

    if (error) {
      console.error('Error fetching lead stages:', error)
      return []
    }

    return data as LeadStage[]
  } catch (error) {
    console.error('Unexpected error in getLeadStages:', error)
    return []
  }
}

/**
 * Get all possible lead sources
 */
export const getLeadSources = async (): Promise<LeadSource[]> => {
  try {
    const { data, error } = await supabase.rpc('get_lead_source_enum')

    if (error) {
      console.error('Error fetching lead sources:', error)
      return []
    }

    return data as LeadSource[]
  } catch (error) {
    console.error('Unexpected error in getLeadSources:', error)
    return []
  }
}

/**
 * Get all possible lead statuses
 */
export const getLeadStatuses = async (): Promise<LeadStatus[]> => {
  try {
    const { data, error } = await supabase.rpc('get_lead_status_enum')

    if (error) {
      console.error('Error fetching lead statuses:', error)
      return []
    }

    return data as LeadStatus[]
  } catch (error) {
    console.error('Unexpected error in getLeadStatuses:', error)
    return []
  }
}
