
import { supabase } from '@/integrations/supabase/client';
import type { Quote, QuoteStatus, QuoteLineItem } from '@/schema/sales/quote.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';

/**
 * Fetch all quotes with optional filtering
 */
export async function fetchQuotes(
  searchTerm?: string,
  filters?: {
    status?: QuoteStatus;
    leadId?: string;
    clientId?: string;
    fromDate?: string;
    toDate?: string;
  }
) {
  let query = supabase
    .from('quotes')
    .select('*, client:client_id(*), lead:lead_id(*), quote_line_items(*)');

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `quote_number.ilike.%${searchTerm}%,service_description.ilike.%${searchTerm}%`
    );
  }

  // Apply filters if provided
  if (filters) {
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.leadId) {
      query = query.eq('lead_id', filters.leadId);
    }
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }
    if (filters.fromDate) {
      query = query.gte('issue_date', filters.fromDate);
    }
    if (filters.toDate) {
      query = query.lte('issue_date', filters.toDate);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }

  return data;
}

/**
 * Fetch a quote by ID, including line items and related data
 */
export async function fetchQuoteById(id: string) {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      client:client_id(*),
      lead:lead_id(*),
      quote_line_items(*),
      quote_sites(*, site:site_id(*))
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }

  return data;
}

/**
 * Create a new quote with its line items
 */
export async function createQuote(
  quote: Omit<Quote, 'id' | 'created_at' | 'updated_at'>,
  lineItems: Omit<QuoteLineItem, 'id' | 'quote_id' | 'created_at' | 'updated_at'>[],
  siteIds?: string[]
) {
  // Start a transaction-like operation
  // Convert Date objects to ISO strings for Supabase
  const dbQuote = prepareObjectForDb(quote);
  
  // 1. Insert the quote
  const { data: newQuote, error: quoteError } = await supabase
    .from('quotes')
    .insert(dbQuote as any)
    .select()
    .single();

  if (quoteError) {
    console.error('Error creating quote:', quoteError);
    throw quoteError;
  }

  // 2. Insert line items
  if (lineItems.length > 0) {
    const formattedLineItems = lineItems.map(item => ({
      ...item,
      quote_id: newQuote.id
    }));

    const { error: lineItemsError } = await supabase
      .from('quote_line_items')
      .insert(formattedLineItems as any);

    if (lineItemsError) {
      console.error('Error creating quote line items:', lineItemsError);
      // Consider handling this better - perhaps delete the quote or mark it as problematic
      throw lineItemsError;
    }
  }

  // 3. Link to sites if provided
  if (siteIds && siteIds.length > 0) {
    const siteMappings = siteIds.map(siteId => ({
      quote_id: newQuote.id,
      site_id: siteId
    }));

    const { error: sitesError } = await supabase
      .from('quote_sites')
      .insert(siteMappings);

    if (sitesError) {
      console.error('Error linking quote to sites:', sitesError);
      throw sitesError;
    }
  }

  // If we get here, everything succeeded
  return newQuote;
}

/**
 * Update an existing quote
 */
export async function updateQuote(
  id: string, 
  updates: Partial<Quote>,
  lineItemChanges?: {
    add?: Omit<QuoteLineItem, 'id' | 'quote_id' | 'created_at' | 'updated_at'>[],
    update?: (Partial<QuoteLineItem> & { id: string })[],
    delete?: string[]
  },
  siteChanges?: {
    add?: string[],
    delete?: string[]
  }
) {
  // Convert Date objects to ISO strings for Supabase
  const dbUpdates = prepareObjectForDb(updates);
  
  // 1. Update the quote
  const { data: updatedQuote, error: quoteError } = await supabase
    .from('quotes')
    .update(dbUpdates as any)
    .eq('id', id)
    .select();

  if (quoteError) {
    console.error('Error updating quote:', quoteError);
    throw quoteError;
  }

  // 2. Handle line item changes if provided
  if (lineItemChanges) {
    // Add new line items
    if (lineItemChanges.add && lineItemChanges.add.length > 0) {
      const formattedLineItems = lineItemChanges.add.map(item => ({
        ...item,
        quote_id: id
      }));

      const { error: addError } = await supabase
        .from('quote_line_items')
        .insert(formattedLineItems as any);

      if (addError) {
        console.error('Error adding quote line items:', addError);
        throw addError;
      }
    }

    // Update existing line items
    if (lineItemChanges.update && lineItemChanges.update.length > 0) {
      // Process each update individually to avoid issues
      for (const item of lineItemChanges.update) {
        const { id: itemId, ...updates } = item;
        const { error: updateError } = await supabase
          .from('quote_line_items')
          .update(updates)
          .eq('id', itemId)
          .eq('quote_id', id); // Extra safety check

        if (updateError) {
          console.error(`Error updating line item ${itemId}:`, updateError);
          throw updateError;
        }
      }
    }

    // Delete line items
    if (lineItemChanges.delete && lineItemChanges.delete.length > 0) {
      const { error: deleteError } = await supabase
        .from('quote_line_items')
        .delete()
        .in('id', lineItemChanges.delete)
        .eq('quote_id', id); // Extra safety check

      if (deleteError) {
        console.error('Error deleting quote line items:', deleteError);
        throw deleteError;
      }
    }
  }

  // 3. Handle site changes if provided
  if (siteChanges) {
    // Add new site links
    if (siteChanges.add && siteChanges.add.length > 0) {
      const siteMappings = siteChanges.add.map(siteId => ({
        quote_id: id,
        site_id: siteId
      }));

      const { error: addError } = await supabase
        .from('quote_sites')
        .insert(siteMappings);

      if (addError) {
        console.error('Error linking quote to new sites:', addError);
        throw addError;
      }
    }

    // Remove site links
    if (siteChanges.delete && siteChanges.delete.length > 0) {
      const { error: deleteError } = await supabase
        .from('quote_sites')
        .delete()
        .eq('quote_id', id)
        .in('site_id', siteChanges.delete);

      if (deleteError) {
        console.error('Error unlinking quote from sites:', deleteError);
        throw deleteError;
      }
    }
  }

  // If we get here, everything succeeded
  return updatedQuote[0];
}

/**
 * Delete a quote and its related data (line items, site links)
 * This is cascading thanks to the database constraints
 */
export async function deleteQuote(id: string) {
  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }

  return true;
}

/**
 * Convert a quote to a contract or work order
 */
export async function convertQuoteToContract(quoteId: string, contractData: any) {
  // Start a transaction-like operation
  
  // 1. Create the contract record
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert(contractData)
    .select();

  if (contractError) {
    console.error('Error creating contract from quote:', contractError);
    throw contractError;
  }

  // 2. Update the quote with the new contract ID and status
  const { data: updatedQuote, error: quoteError } = await supabase
    .from('quotes')
    .update({
      status: 'Accepted',
      converted_contract_id: contract[0].id
    })
    .eq('id', quoteId)
    .select();

  if (quoteError) {
    console.error('Error updating quote after conversion:', quoteError);
    throw quoteError;
  }

  // 3. If this quote was for a lead, update the lead status
  const { data: quote } = await supabase
    .from('quotes')
    .select('lead_id')
    .eq('id', quoteId)
    .single();

  if (quote && quote.lead_id) {
    const { error: leadError } = await supabase
      .from('leads')
      .update({
        status: 'Closed-Won',
        stage: 'Won'
      })
      .eq('id', quote.lead_id);

    if (leadError) {
      console.error('Error updating lead after quote conversion:', leadError);
      // Continue anyway, this is not critical
    }
  }

  return {
    contract: contract[0],
    quote: updatedQuote[0]
  };
}

/**
 * Fetch available quote statuses for filtering
 */
export async function fetchQuoteStatuses() {
  try {
    const { data, error } = await supabase.rpc('get_quote_status_enum');

    if (error) {
      console.error('Error fetching quote statuses:', error);
      throw error;
    }

    return data as QuoteStatus[];
  } catch (error) {
    console.error('Error fetching quote statuses:', error);
    throw error;
  }
}

/**
 * Generate a new quote number based on a pattern
 */
export async function generateQuoteNumber() {
  const today = new Date();
  const year = today.getFullYear().toString().substring(2); // Get last 2 digits of year
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  
  // Get count of quotes for this month to generate sequential number
  const { count, error } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${today.getFullYear()}-${month}-01`);
  
  if (error) {
    console.error('Error generating quote number:', error);
    throw error;
  }
  
  // Format: QT-YY-MM-XXXX where XXXX is sequential
  const sequential = ((count || 0) + 1).toString().padStart(4, '0');
  return `QT-${year}-${month}-${sequential}`;
}
