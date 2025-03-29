
import { supabase } from '@/integrations/supabase/client';
import { Quote, quoteSchema, quoteDbSchema } from '@/schema/sales/quote.schema';
import { apiClient } from '@/utils/supabaseInsertHelper';
import { prepareObjectForDb } from '@/utils/dateFormatters';

/**
 * Create a new quote
 * @param quote The quote data
 * @returns The created quote or null if an error occurred
 */
export const createQuote = async (quote: Partial<Quote>): Promise<Quote | null> => {
  try {
    // Create quote using the improved apiClient with DB schema
    const data = await apiClient.create(
      supabase,
      'quotes',
      prepareObjectForDb({
        ...quote,
        created_at: new Date(),
        updated_at: new Date()
      }),
      quoteDbSchema
    );

    // Convert string dates back to Date objects
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
    // Prepare data for DB - convert Dates to strings
    const preparedData = prepareObjectForDb({
      ...quote,
      updated_at: new Date()
    });

    // Update the quote using our improved helper
    const data = await apiClient.update(
      supabase,
      'quotes',
      quoteId,
      preparedData
    );

    // Convert string dates back to Date objects
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
    await apiClient.delete(supabase, 'quotes', quoteId);
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteQuote:', error);
    return false;
  }
};
