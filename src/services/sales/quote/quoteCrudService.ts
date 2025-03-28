
import { supabase } from '@/integrations/supabase/client';
import { Quote, quoteSchema } from '@/schema/sales/quote.schema';
import { insertTypedRow, updateTypedRow, deleteTypedRow, validateWithSchema } from '@/utils/supabaseInsertHelper';

/**
 * Create a new quote
 * @param quote The quote data
 * @returns The created quote or null if an error occurred
 */
export const createQuote = async (quote: Partial<Quote>): Promise<Quote | null> => {
  try {
    // Validate the quote data using Zod schema
    const validatedQuote = validateWithSchema(
      {
        ...quote,
        created_at: new Date(),
        updated_at: new Date()
      },
      quoteSchema
    );

    // Insert the validated quote data using our helper
    const data = await insertTypedRow(supabase, 'quotes', validatedQuote);

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
    // Update the quote using our helper
    const data = await updateTypedRow(supabase, 'quotes', quoteId, quote);

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
    await deleteTypedRow(supabase, 'quotes', quoteId);
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteQuote:', error);
    return false;
  }
};
