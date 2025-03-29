mport { supabase } from '@/integrations/supabase/client'
import { Quote, quoteDbSchema } from '@/schema/sales/quote.schema'
import { apiClient } from '@/utils/supabase/apiClient'
import { prepareObjectForDb } from '@/utils/dateFormatters'

/**
 * Create a new quote
 */
export const createQuote = async (quote: Partial<Quote>): Promise<Quote | null> => {
  try {
    const prepared = prepareObjectForDb({
      ...quote,
      created_at: new Date(),
      updated_at: new Date()
    })

    const data = await apiClient.create(
      supabase,
      'quotes',
      prepared,
      quoteDbSchema
    )

    return {
      ...data,
      issue_date: new Date(data.issue_date),
      valid_until: new Date(data.valid_until),
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    }
  } catch (error) {
    console.error('Unexpected error in createQuote:', error)
    return null
  }
}

/**
 * Update a quote
 */
export const updateQuote = async (
  quoteId: string,
  updates: Partial<Quote>
): Promise<Quote | null> => {
  try {
    const prepared = prepareObjectForDb({
      ...updates,
      updated_at: new Date()
    })

    const result = await apiClient.update(
      supabase,
      'quotes',
      quoteId,
      prepared
    )

    const data = Array.isArray(result) ? result[0] : result

    return {
      ...data,
      issue_date: new Date(data.issue_date),
      valid_until: new Date(data.valid_until),
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    }
  } catch (error) {
    console.error('Unexpected error in updateQuote:', error)
    return null
  }
}

/**
 * Delete a quote
 */
export const deleteQuote = async (quoteId: string): Promise<boolean> => {
  try {
    await apiClient.delete(supabase, 'quotes', quoteId)
    return true
  } catch (error) {
    console.error('Unexpected error in deleteQuote:', error)
    return false
  }
}
