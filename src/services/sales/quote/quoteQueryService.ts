import { supabase } from '@/integrations/supabase/client'
import { Quote } from '@/schema/sales/quote.schema'
import { apiClient } from '@/utils/supabase/apiClient'

/**
 * @function fetchQuotes
 * @description Fetch all quotes with optional search
 * @param searchTerm Optional search term to filter quotes
 * @returns Array of quotes
 * @origin {source: "internal", module: "salesService", author: "system"}
 * @field-locked id:uuid, created_at:timestamp, updated_at:timestamp
 */
export const fetchQuotes = async (searchTerm?: string): Promise<Quote[]> => {
  try {
    let options = {
      limit: 100,
    }

    let filters = {}
    let orClause

    // Add search filter if provided
    if (searchTerm && searchTerm.trim()) {
      const term = `%${searchTerm.trim()}%`
      orClause = `quote_number.ilike.${term},service_description.ilike.${term}`
    }

    const data = await apiClient.query(supabase, 'quotes', filters, '*', {
      ...options,
      or: orClause,
    })

    // Convert date strings to Date objects
    return data.map((quote) => ({
      ...quote,
      issue_date: new Date(quote.issue_date),
      valid_until: new Date(quote.valid_until),
      created_at: new Date(quote.created_at),
      updated_at: new Date(quote.updated_at),
    }))
  } catch (error) {
    console.error('Unexpected error in fetchQuotes:', error)
    return []
  }
}

/**
 * Get a quote by ID
 * @field-locked id:uuid, created_at:timestamp
 */
export const getQuote = async (quoteId: string): Promise<Quote | null> => {
  try {
    const data = await apiClient.getById(supabase, 'quotes', quoteId)

    return {
      ...data,
      issue_date: new Date(data.issue_date),
      valid_until: new Date(data.valid_until),
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    }
  } catch (error) {
    console.error('Unexpected error in getQuote:', error)
    return null
  }
}
