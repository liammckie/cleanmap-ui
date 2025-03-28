
import { supabase } from '@/integrations/supabase/client';
import { QuoteLineItem } from '@/schema/sales/quote.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';
import type { TablesInsert } from '@/integrations/supabase/types';

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

    // Prepare data for Supabase
    const lineItemData = prepareObjectForDb(lineItem) as {
      quote_id: string;
      description: string;
      [key: string]: any;
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
    // Prepare data for Supabase
    // Use type assertion with unknown as intermediate step for type safety
    const lineItemData = prepareObjectForDb(lineItem) as unknown as TablesInsert<'quote_line_items'>;

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
