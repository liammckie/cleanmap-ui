import { supabase } from '@/integrations/supabase/client'
import { QuoteStatus } from '@/schema/sales/quote.schema'

/**
 * Get all possible quote statuses
 */
export const getQuoteStatuses = async (): Promise<QuoteStatus[]> => {
  try {
    const { data, error } = await supabase.rpc('get_quote_status_enum')

    if (error) {
      console.error('Error fetching quote statuses:', error)
      return []
    }

    return data as QuoteStatus[]
  } catch (error) {
    console.error('Unexpected error in getQuoteStatuses:', error)
    return []
  }
}
