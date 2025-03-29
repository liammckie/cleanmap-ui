import { supabase } from '@/integrations/supabase/client'
import {
  QuoteLineItem,
  quoteLineItemSchema,
  quoteLineItemDbSchema,
} from '@/schema/sales/quote.schema'
import { apiClient } from '@/utils/supabaseInsertHelper'
import { prepareObjectForDb } from '@/utils/dateFormatters'

/**
 * Get all line items for a quote
 * @param quoteId ID of the quote
 * @returns Array of line items
 */
export const getQuoteLineItems = async (quoteId: string): Promise<QuoteLineItem[]> => {
  try {
    const data = await apiClient.query(supabase, 'quote_line_items', { quote_id: quoteId }, '*', {
      limit: 100,
    })

    // Convert string dates back to Date objects
    return data.map((item) => ({
      ...item,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
    }))
  } catch (error) {
    console.error('Unexpected error in getQuoteLineItems:', error)
    return []
  }
}

/**
 * Add a line item to a quote
 * @param lineItem The line item data
 * @returns The created line item or null if an error occurred
 */
export const addQuoteLineItem = async (
  lineItem: Partial<QuoteLineItem>,
): Promise<QuoteLineItem | null> => {
  try {
    // Validate required fields
    if (!lineItem.quote_id) {
      throw new Error('Quote ID is required for line item')
    }
    if (!lineItem.description) {
      throw new Error('Description is required for line item')
    }

    // Create line item using DB schema
    const data = await apiClient.create(
      supabase,
      'quote_line_items',
      prepareObjectForDb({
        ...lineItem,
        created_at: new Date(),
        updated_at: new Date()
      }),
      quoteLineItemDbSchema
    );

    // Convert string dates back to Date objects
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    }
  } catch (error) {
    console.error('Unexpected error in addQuoteLineItem:', error)
    return null
  }
}

/**
 * Update a quote line item
 * @param lineItemId ID of the line item to update
 * @param lineItem Updated line item data
 * @returns The updated line item or null if an error occurred
 */
export const updateQuoteLineItem = async (
  lineItemId: string,
  lineItem: Partial<QuoteLineItem>,
): Promise<QuoteLineItem | null> => {
  try {
    // Prepare data for DB - convert Dates to ISO strings
    const preparedData = prepareObjectForDb({
      ...lineItem,
      created_at: lineItem.created_at ? lineItem.created_at.toISOString() : undefined, // Convert to string if present
      updated_at: new Date().toISOString(), // Ensure updated_at is a string
    });

    // Update the line item using the helper
    const data = await apiClient.update(supabase, 'quote_line_items', lineItemId, preparedData);

    // Convert string dates back to Date objects
    return {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
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
    await apiClient.delete(supabase, 'quote_line_items', lineItemId)
    return true
  } catch (error) {
    console.error('Unexpected error in deleteQuoteLineItem:', error)
    return false
  }
}
