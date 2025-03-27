
import { supabase } from '@/integrations/supabase/client';
import { Quote, QuoteLineItem, QuoteStatus } from '@/schema/sales/quote.schema';

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

/**
 * Create a new quote
 * @param quote The quote data
 * @returns The created quote or null if an error occurred
 */
export const createQuote = async (quote: Partial<Quote>): Promise<Quote | null> => {
  try {
    // Ensure dates are strings before sending to Supabase
    const quoteData = {
      ...quote,
      issue_date: quote.issue_date instanceof Date ? quote.issue_date.toISOString() : quote.issue_date,
      valid_until: quote.valid_until instanceof Date ? quote.valid_until.toISOString() : quote.valid_until,
      // Remove created_at and updated_at as they're managed by the database
      created_at: undefined,
      updated_at: undefined
    };

    const { data, error } = await supabase
      .from('quotes')
      .insert(quoteData)
      .select()
      .single();

    if (error) {
      console.error('Error creating quote:', error);
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
    console.error('Unexpected error in createQuote:', error);
    return null;
  }
};

/**
 * Update a quote
 * @param quoteId ID of the quote to update
 * @param quote Updated quote data
 * @returns The updated quote or null if an error occurred
 */
export const updateQuote = async (quoteId: string, quote: Partial<Quote>): Promise<Quote | null> => {
  try {
    // Ensure dates are strings before sending to Supabase
    const quoteData = {
      ...quote,
      issue_date: quote.issue_date instanceof Date ? quote.issue_date.toISOString() : quote.issue_date,
      valid_until: quote.valid_until instanceof Date ? quote.valid_until.toISOString() : quote.valid_until,
      // Remove created_at and updated_at as they're managed by the database
      created_at: undefined, 
      updated_at: undefined
    };

    const { data, error } = await supabase
      .from('quotes')
      .update(quoteData)
      .eq('id', quoteId)
      .select()
      .single();

    if (error) {
      console.error('Error updating quote:', error);
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
    console.error('Unexpected error in updateQuote:', error);
    return null;
  }
};

/**
 * Delete a quote
 * @param quoteId ID of the quote to delete
 * @returns True if the quote was deleted successfully, false otherwise
 */
export const deleteQuote = async (quoteId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', quoteId);

    if (error) {
      console.error('Error deleting quote:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in deleteQuote:', error);
    return false;
  }
};

/**
 * Get all possible quote statuses
 */
export const getQuoteStatuses = async (): Promise<QuoteStatus[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_quote_status_enum');

    if (error) {
      console.error('Error fetching quote statuses:', error);
      return [];
    }

    return data as QuoteStatus[];
  } catch (error) {
    console.error('Unexpected error in getQuoteStatuses:', error);
    return [];
  }
};

/**
 * Get all line items for a quote
 * @param quoteId ID of the quote
 * @returns Array of line items
 */
export const getQuoteLineItems = async (quoteId: string): Promise<QuoteLineItem[]> => {
  try {
    const { data, error } = await supabase
      .from('quote_line_items')
      .select('*')
      .eq('quote_id', quoteId)
      .limit(100);

    if (error) {
      console.error('Error fetching quote line items:', error);
      return [];
    }

    return data.map(item => ({
      ...item,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error('Unexpected error in getQuoteLineItems:', error);
    return [];
  }
};

/**
 * Add a line item to a quote
 * @param lineItem The line item data
 * @returns The created line item or null if an error occurred
 */
export const addQuoteLineItem = async (lineItem: Partial<QuoteLineItem>): Promise<QuoteLineItem | null> => {
  try {
    const lineItemData = {
      ...lineItem,
      // Remove created_at and updated_at as they're managed by the database
      created_at: undefined,
      updated_at: undefined
    };

    const { data, error } = await supabase
      .from('quote_line_items')
      .insert(lineItemData)
      .select()
      .single();

    if (error) {
      console.error('Error adding quote line item:', error);
      return null;
    }

    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Unexpected error in addQuoteLineItem:', error);
    return null;
  }
};

/**
 * Update a quote line item
 * @param lineItemId ID of the line item to update
 * @param lineItem Updated line item data
 * @returns The updated line item or null if an error occurred
 */
export const updateQuoteLineItem = async (lineItemId: string, lineItem: Partial<QuoteLineItem>): Promise<QuoteLineItem | null> => {
  try {
    const lineItemData = {
      ...lineItem,
      // Remove created_at and updated_at as they're managed by the database
      created_at: undefined,
      updated_at: undefined
    };

    const { data, error } = await supabase
      .from('quote_line_items')
      .update(lineItemData)
      .eq('id', lineItemId)
      .select()
      .single();

    if (error) {
      console.error('Error updating quote line item:', error);
      return null;
    }

    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Unexpected error in updateQuoteLineItem:', error);
    return null;
  }
};

/**
 * Delete a quote line item
 * @param lineItemId ID of the line item to delete
 * @returns True if the line item was deleted successfully, false otherwise
 */
export const deleteQuoteLineItem = async (lineItemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quote_line_items')
      .delete()
      .eq('id', lineItemId);

    if (error) {
      console.error('Error deleting quote line item:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in deleteQuoteLineItem:', error);
    return false;
  }
};
