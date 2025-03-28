
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadSource } from '@/schema/sales/lead.schema';

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
      updated_at: new Date(data.updated_at),
      source: data.source as LeadSource | null
    };
  } catch (error) {
    console.error('Unexpected error in getLead:', error);
    return null;
  }
};
