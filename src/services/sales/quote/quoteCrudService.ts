
import { supabase } from '@/integrations/supabase/client'
import { Quote, quoteDbSchema } from '@/schema/sales/quote.schema'
import { apiClient } from '@/utils/supabase/apiClient'
import { mapToDb } from '@/utils/mappers'

/**
 * Create a new quote
 * @param quote The quote data
 * @returns The created quote or null if an error occurred
 */
export const createQuote = async (quote: Partial<Quote>): Promise<Quote | null> => {
  try {
    // Use our mapper utility with date preparation
    const prepared = mapToDb({
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
 * @param quoteId ID of the quote to update
 * @param updates Updated quote data
 * @returns The updated quote or null if an error occurred
 */
export const updateQuote = async (
  quoteId: string,
  updates: Partial<Quote>
): Promise<Quote | null> => {
  try {
    // Use our mapper utility with date preparation
    const prepared = mapToDb({
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
 * @param quoteId ID of the quote to delete
 * @returns True if the quote was deleted successfully, false otherwise
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
