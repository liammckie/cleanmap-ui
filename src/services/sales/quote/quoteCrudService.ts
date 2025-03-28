
import { supabase } from '@/integrations/supabase/client';
import { Quote, quoteSchema } from '@/schema/sales/quote.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';
import type { TablesInsert } from '@/integrations/supabase/types';

/**
 * Create a new quote
 * @param quote The quote data
 * @returns The created quote or null if an error occurred
 */
export const createQuote = async (quote: Partial<Quote>): Promise<Quote | null> => {
  try {
    // Validate the quote data using Zod schema
    const validatedQuote = quoteSchema.parse({
      ...quote,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Prepare data for Supabase by converting Date objects to ISO strings
    // Use type assertion with unknown as intermediate step for type safety
    const quoteData = prepareObjectForDb(validatedQuote) as unknown as TablesInsert<'quotes'>;

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
    // Prepare data for Supabase by converting Date objects to ISO strings
    // Use type assertion with unknown as intermediate step for type safety
    const quoteData = prepareObjectForDb(quote) as unknown as TablesInsert<'quotes'>;

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
