
import { supabase } from '@/integrations/supabase/client';
import type { Quote, QuoteLineItem, QuoteStatus } from '@/schema/sales/quote.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';

/**
 * Fetch all quotes with optional filtering
 */
export async function fetchQuotes(
  searchTerm?: string,
  filters?: {
    clientId?: string;
    leadId?: string;
    status?: QuoteStatus;
    fromDate?: string;
    toDate?: string;
  }
) {
  let query = supabase
    .from('quotes')
    .select(`
      *,
      client:client_id (
        company_name
      ),
      lead:lead_id (
        lead_name,
        company_name
      )
    `);

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `quote_number.ilike.%${searchTerm}%,service_description.ilike.%${searchTerm}%`
    );
  }

  // Apply filters if provided
  if (filters) {
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }
    if (filters.leadId) {
      query = query.eq('lead_id', filters.leadId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
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
 * Fetch a quote by ID including its line items
 */
export async function fetchQuoteById(id: string) {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      client:client_id (id, company_name),
      lead:lead_id (id, lead_name, company_name),
      sites:quote_sites(
        id,
        site:site_id(id, site_name)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }

  // Fetch quote line items
  const { data: lineItems, error: lineItemsError } = await supabase
    .from('quote_line_items')
    .select('*')
    .eq('quote_id', id);

  if (lineItemsError) {
    console.error('Error fetching quote line items:', lineItemsError);
    throw lineItemsError;
  }

  return { ...data, lineItems };
}

/**
 * Create a new quote with line items
 */
export async function createQuote(
  quote: Omit<Quote, 'id' | 'created_at' | 'updated_at'>, 
  lineItems: Omit<QuoteLineItem, 'id' | 'quote_id' | 'created_at' | 'updated_at'>[],
  siteIds?: string[]
) {
  // Convert Date objects to ISO strings for Supabase
  const dbQuote = prepareObjectForDb(quote);
  
  // Start a transaction (sort of - Supabase doesn't have true transactions yet)
  const { data, error } = await supabase
    .from('quotes')
    .insert(dbQuote as any)
    .select();

  if (error) {
    console.error('Error creating quote:', error);
    throw error;
  }

  const quoteId = data[0].id;

  // Create quote line items
  if (lineItems.length > 0) {
    const dbLineItems = lineItems.map(item => ({
      ...prepareObjectForDb(item),
      quote_id: quoteId
    }));

    const { error: lineItemsError } = await supabase
      .from('quote_line_items')
      .insert(dbLineItems as any);

    if (lineItemsError) {
      console.error('Error creating quote line items:', lineItemsError);
      throw lineItemsError;
    }
  }

  // Create quote-site relationships if siteIds provided
  if (siteIds && siteIds.length > 0) {
    const quoteSites = siteIds.map(siteId => ({
      quote_id: quoteId,
      site_id: siteId
    }));

    const { error: sitesError } = await supabase
      .from('quote_sites')
      .insert(quoteSites);

    if (sitesError) {
      console.error('Error creating quote-site relationships:', sitesError);
      throw sitesError;
    }
  }

  return data[0];
}

/**
 * Update an existing quote and its line items
 */
export async function updateQuote(
  id: string, 
  updates: Partial<Quote>, 
  lineItems?: Omit<QuoteLineItem, 'id' | 'quote_id' | 'created_at' | 'updated_at'>[],
  siteIds?: string[]
) {
  // Convert Date objects to ISO strings for Supabase
  const dbUpdates = prepareObjectForDb(updates);
  
  const { data, error } = await supabase
    .from('quotes')
    .update(dbUpdates as any)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating quote:', error);
    throw error;
  }

  // Update line items if provided
  if (lineItems) {
    // First delete existing line items
    const { error: deleteError } = await supabase
      .from('quote_line_items')
      .delete()
      .eq('quote_id', id);

    if (deleteError) {
      console.error('Error deleting existing quote line items:', deleteError);
      throw deleteError;
    }

    // Then create new line items
    if (lineItems.length > 0) {
      const dbLineItems = lineItems.map(item => ({
        ...prepareObjectForDb(item),
        quote_id: id
      }));

      const { error: lineItemsError } = await supabase
        .from('quote_line_items')
        .insert(dbLineItems as any);

      if (lineItemsError) {
        console.error('Error creating new quote line items:', lineItemsError);
        throw lineItemsError;
      }
    }
  }

  // Update site relationships if provided
  if (siteIds) {
    // First delete existing relationships
    const { error: deleteError } = await supabase
      .from('quote_sites')
      .delete()
      .eq('quote_id', id);

    if (deleteError) {
      console.error('Error deleting existing quote-site relationships:', deleteError);
      throw deleteError;
    }

    // Then create new relationships
    if (siteIds.length > 0) {
      const quoteSites = siteIds.map(siteId => ({
        quote_id: id,
        site_id: siteId
      }));

      const { error: sitesError } = await supabase
        .from('quote_sites')
        .insert(quoteSites);

      if (sitesError) {
        console.error('Error creating new quote-site relationships:', sitesError);
        throw sitesError;
      }
    }
  }

  return data[0];
}

/**
 * Delete a quote and all its line items
 */
export async function deleteQuote(id: string) {
  // First delete line items (cascading not guaranteed in Supabase)
  const { error: lineItemsError } = await supabase
    .from('quote_line_items')
    .delete()
    .eq('quote_id', id);

  if (lineItemsError) {
    console.error('Error deleting quote line items:', lineItemsError);
    throw lineItemsError;
  }

  // Delete site relationships
  const { error: sitesError } = await supabase
    .from('quote_sites')
    .delete()
    .eq('quote_id', id);

  if (sitesError) {
    console.error('Error deleting quote-site relationships:', sitesError);
    throw sitesError;
  }

  // Delete the quote
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
 * Convert an accepted quote to a contract
 */
export async function convertQuoteToContract(quoteId: string, contractData: any) {
  // Create the contract
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert(contractData)
    .select()
    .single();

  if (contractError) {
    console.error('Error creating contract from quote:', contractError);
    throw contractError;
  }

  // Update the quote with the contract ID and status
  const { data: updatedQuote, error: quoteError } = await supabase
    .from('quotes')
    .update({
      status: 'Accepted',
      converted_contract_id: contract.id
    })
    .eq('id', quoteId)
    .select();

  if (quoteError) {
    console.error('Error updating quote after conversion:', quoteError);
    throw quoteError;
  }

  // Copy the quote sites to contract sites
  const { data: quoteSites, error: getSitesError } = await supabase
    .from('quote_sites')
    .select('site_id')
    .eq('quote_id', quoteId);

  if (getSitesError) {
    console.error('Error getting quote sites:', getSitesError);
    throw getSitesError;
  }

  if (quoteSites.length > 0) {
    const contractSites = quoteSites.map(qs => ({
      contract_id: contract.id,
      site_id: qs.site_id
    }));

    const { error: sitesError } = await supabase
      .from('contract_sites')
      .insert(contractSites);

    if (sitesError) {
      console.error('Error creating contract-site relationships:', sitesError);
      throw sitesError;
    }
  }

  return {
    contract,
    quote: updatedQuote[0]
  };
}

/**
 * Convert a quote to a work order for one-off jobs
 */
export async function convertQuoteToWorkOrder(quoteId: string, workOrderData: any) {
  // Create the work order
  const { data: workOrder, error: workOrderError } = await supabase
    .from('work_orders')
    .insert(workOrderData)
    .select()
    .single();

  if (workOrderError) {
    console.error('Error creating work order from quote:', workOrderError);
    throw workOrderError;
  }

  // Update the quote
  const { data: updatedQuote, error: quoteError } = await supabase
    .from('quotes')
    .update({
      status: 'Accepted',
      converted_work_order_id: workOrder.id
    })
    .eq('id', quoteId)
    .select();

  if (quoteError) {
    console.error('Error updating quote after conversion:', quoteError);
    throw quoteError;
  }

  return {
    workOrder,
    quote: updatedQuote[0]
  };
}

/**
 * Fetch quote statuses for filters
 */
export async function fetchQuoteStatuses() {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('status');

    if (error) {
      console.error('Error fetching quote statuses:', error);
      throw error;
    }

    // Extract unique statuses
    const statuses = [...new Set(data.map(quote => quote.status))].filter(Boolean);
    return statuses as Quote['status'][];
  } catch (error) {
    console.error('Error fetching quote statuses:', error);
    throw error;
  }
}
