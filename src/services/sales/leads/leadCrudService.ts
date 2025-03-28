
import { supabase } from '@/integrations/supabase/client';
import { Lead, leadSchema, leadDbSchema } from '@/schema/sales/lead.schema';
import { apiClient } from '@/utils/supabaseInsertHelper';
import { prepareObjectForDb } from '@/utils/dateFormatters';

/**
 * Create a new lead
 * @param lead The lead data
 * @returns The created lead or null if an error occurred
 * @origin {source: "internal", module: "salesService", author: "system"}
 */
export const createLead = async (lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    // Create lead using the improved apiClient with DB schema
    const data = await apiClient.create(
      supabase,
      'leads',
      {
        ...lead,
        created_at: new Date(),
        updated_at: new Date()
      },
      leadDbSchema
    );

    // Convert string dates back to Date objects
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
    // Prepare data for DB - convert Dates to strings
    const preparedData = prepareObjectForDb({
      ...lead,
      updated_at: new Date()
    });

    // Update the lead using our improved helper
    const data = await apiClient.update(
      supabase,
      'leads',
      leadId,
      preparedData
    );

    // Convert string dates back to Date objects
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
    await apiClient.delete(supabase, 'leads', leadId);
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteLead:', error);
    return false;
  }
};
