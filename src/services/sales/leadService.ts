
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadSource, LeadStage, LeadStatus } from '@/schema/sales/lead.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';

/**
 * Fetch all leads with optional search
 * @origin {source: "internal", module: "salesService", author: "system"}
 * @field-locked id:uuid, lead_name:string, company_name:string
 */
export const fetchLeads = async (searchTerm?: string): Promise<Lead[]> => {
  try {
    let query = supabase.from('leads').select('*');

    // Add search filter if provided
    if (searchTerm && searchTerm.trim()) {
      const term = `%${searchTerm.trim()}%`;
      query = query.or(`lead_name.ilike.${term},company_name.ilike.${term},contact_name.ilike.${term}`);
    }

    // Add query limit for safety
    query = query.limit(100);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }

    // Convert date strings to Date objects
    return data.map(lead => ({
      ...lead,
      next_action_date: lead.next_action_date ? new Date(lead.next_action_date) : null,
      created_at: new Date(lead.created_at),
      updated_at: new Date(lead.updated_at),
      // Ensure source is properly typed
      source: lead.source as LeadSource | null
    }));
  } catch (error) {
    console.error('Unexpected error in fetchLeads:', error);
    return [];
  }
};

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
    const leadData = prepareObjectForDb(lead);

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
 * Get a lead by ID
 * @field-locked id:uuid, created_at:timestamp
 */
export const getLead = async (leadId: string): Promise<Lead | null> => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error) {
      console.error('Error fetching lead:', error);
      return null;
    }

    return {
      ...data,
      next_action_date: data.next_action_date ? new Date(data.next_action_date) : null,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Unexpected error in getLead:', error);
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

/**
 * Get all possible lead stages
 */
export const getLeadStages = async (): Promise<LeadStage[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_lead_stage_enum');

    if (error) {
      console.error('Error fetching lead stages:', error);
      return [];
    }

    return data as LeadStage[];
  } catch (error) {
    console.error('Unexpected error in getLeadStages:', error);
    return [];
  }
};

/**
 * Get all possible lead sources
 */
export const getLeadSources = async (): Promise<LeadSource[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_lead_source_enum');

    if (error) {
      console.error('Error fetching lead sources:', error);
      return [];
    }

    return data as LeadSource[];
  } catch (error) {
    console.error('Unexpected error in getLeadSources:', error);
    return [];
  }
};

/**
 * Get all possible lead statuses
 */
export const getLeadStatuses = async (): Promise<LeadStatus[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_lead_status_enum');

    if (error) {
      console.error('Error fetching lead statuses:', error);
      return [];
    }

    return data as LeadStatus[];
  } catch (error) {
    console.error('Unexpected error in getLeadStatuses:', error);
    return [];
  }
};
