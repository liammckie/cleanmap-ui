
import { supabase } from '@/integrations/supabase/client';
import { QuoteLineItem, quoteLineItemSchema } from '@/schema/sales/quote.schema';
import { insertTypedRow, updateTypedRow, deleteTypedRow, validateWithSchema } from '@/utils/supabaseInsertHelper';

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
    // Validate required fields
    if (!lineItem.quote_id) {
      throw new Error('Quote ID is required for line item');
    }
    if (!lineItem.description) {
      throw new Error('Description is required for line item');
    }

    const validatedLineItem = validateWithSchema(
      {
        ...lineItem,
        created_at: new Date(),
        updated_at: new Date()
      },
      quoteLineItemSchema
    );

    // Insert the line item using our helper
    const data = await insertTypedRow(supabase, 'quote_line_items', validatedLineItem);

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
    // Update the line item using our helper
    const data = await updateTypedRow(supabase, 'quote_line_items', lineItemId, lineItem);

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
    await deleteTypedRow(supabase, 'quote_line_items', lineItemId);
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteQuoteLineItem:', error);
    return false;
  }
};
