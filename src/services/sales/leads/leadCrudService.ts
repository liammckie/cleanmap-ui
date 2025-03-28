
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadSource, LeadStage, LeadStatus } from '@/schema/sales/lead.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';

/**
 * Create a new lead
 * @param lead The lead data
 * @returns The created lead or null if an error occurred
 * @origin {source: "internal", module: "salesService", author: "system"}
 */
export const createLead = async (lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    // Validate required fields
    if (!lead.lead_name) {
      throw new Error('Lead name is required');
    }
    if (!lead.company_name) {
      throw new Error('Company name is required');
    }
    if (!lead.created_by) {
      throw new Error('Created by is required');
    }
    if (lead.stage === undefined) {
      lead.stage = 'Discovery';
    }
    if (lead.status === undefined) {
      lead.status = 'Open';
    }

    // Prepare data for Supabase using the utility function
    const leadData = prepareObjectForDb(lead) as {
      lead_name: string;
      company_name: string;
      created_by: string;
      stage: LeadStage;
      status: LeadStatus;
      [key: string]: any;
    };

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
      updated_at: new Date(data.updated_at),
      source: data.source as LeadSource | null
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
    const leadData = prepareObjectForDb(lead);

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
      updated_at: new Date(data.updated_at),
      source: data.source as LeadSource | null
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
