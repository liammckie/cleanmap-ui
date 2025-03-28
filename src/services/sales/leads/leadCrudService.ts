
import { supabase } from '@/integrations/supabase/client';
import { Lead, leadSchema } from '@/schema/sales/lead.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';
import type { TablesInsert } from '@/integrations/supabase/types';

/**
 * Create a new lead
 * @param lead The lead data
 * @returns The created lead or null if an error occurred
 * @origin {source: "internal", module: "salesService", author: "system"}
 */
export const createLead = async (lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    // Validate the lead data using Zod schema
    const validatedLead = leadSchema.parse({
      ...lead,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Prepare data for Supabase by converting Date objects to ISO strings
    // First convert to unknown, then to TablesInsert to ensure type compatibility with Supabase
    const leadData = prepareObjectForDb(validatedLead) as unknown as TablesInsert<'leads'>;

    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return null;
    }

    return {
      ...data,
      next_action_date: data.next_action_date ? new Date(data.next_action_date) : null,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Unexpected error in createLead:', error);
    return null;
  }
};

/**
 * Update a lead
 * @param leadId ID of the lead to update
 * @param lead Updated lead data
 * @returns The updated lead or null if an error occurred
 */
export const updateLead = async (leadId: string, lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    // Prepare data for Supabase using the utility function
    // Use type assertion with unknown as intermediate step for type safety
    const leadData = prepareObjectForDb(lead) as unknown as TablesInsert<'leads'>;

    const { data, error } = await supabase
      .from('leads')
      .update(leadData)
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      return null;
    }

    return {
      ...data,
      next_action_date: data.next_action_date ? new Date(data.next_action_date) : null,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Unexpected error in updateLead:', error);
    return null;
  }
};

/**
 * Delete a lead
 * @param leadId ID of the lead to delete
 * @returns True if the lead was deleted successfully, false otherwise
 */
export const deleteLead = async (leadId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (error) {
      console.error('Error deleting lead:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in deleteLead:', error);
    return false;
  }
};
