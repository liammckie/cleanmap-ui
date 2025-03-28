
import { supabase } from '@/integrations/supabase/client';
import { Quote } from '@/schema/sales/quote.schema';

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
    let query = supabase.from('quotes').select('*');

    // Add search filter if provided
    if (searchTerm && searchTerm.trim()) {
      const term = `%${searchTerm.trim()}%`;
      query = query.or(`quote_number.ilike.${term},service_description.ilike.${term}`);
    }

    // Add query limit for safety
    query = query.limit(100);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching quotes:', error);
      return [];
    }

    // Convert date strings to Date objects
    return data.map(quote => ({
      ...quote,
      issue_date: new Date(quote.issue_date),
      valid_until: new Date(quote.valid_until),
      created_at: new Date(quote.created_at),
      updated_at: new Date(quote.updated_at)
    }));
  } catch (error) {
    console.error('Unexpected error in fetchQuotes:', error);
    return [];
  }
};

/**
 * Get a quote by ID
 * @field-locked id:uuid, created_at:timestamp
 */
export const getQuote = async (quoteId: string): Promise<Quote | null> => {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (error) {
      console.error('Error fetching quote:', error);
      return null;
    }

    return {
      ...data,
      issue_date: new Date(data.issue_date),
      valid_until: new Date(data.valid_until),
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Unexpected error in getQuote:', error);
    return null;
  }
};
