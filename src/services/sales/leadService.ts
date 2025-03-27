import { supabase } from '@/integrations/supabase/client';
import type { Lead, LeadStage, LeadStatus } from '@/schema/sales/lead.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';

/**
 * Fetch all leads with optional filtering
 */
export async function fetchLeads(
  searchTerm?: string,
  filters?: {
    stage?: LeadStage;
    status?: LeadStatus;
    fromDate?: string;
    toDate?: string;
    source?: string;
  }
) {
  let query = supabase
    .from('leads')
    .select('*');

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `lead_name.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%,contact_name.ilike.%${searchTerm}%`
    );
  }

  // Apply filters if provided
  if (filters) {
    if (filters.stage) {
      query = query.eq('stage', filters.stage);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.source) {
      query = query.eq('source', filters.source);
    }
    if (filters.fromDate) {
      query = query.gte('created_at', filters.fromDate);
    }
    if (filters.toDate) {
      query = query.lte('created_at', filters.toDate);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }

  return data;
}

/**
 * Fetch a lead by ID
 */
export async function fetchLeadById(id: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching lead:', error);
    throw error;
  }

  return data;
}

/**
 * Create a new lead
 */
export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  // Convert Date objects to ISO strings for Supabase
  const dbLead = prepareObjectForDb(lead);
  
  const { data, error } = await supabase
    .from('leads')
    .insert(dbLead as any)
    .select();

  if (error) {
    console.error('Error creating lead:', error);
    throw error;
  }

  return data[0];
}

/**
 * Update an existing lead
 */
export async function updateLead(id: string, updates: Partial<Lead>) {
  // Convert Date objects to ISO strings for Supabase
  const dbUpdates = prepareObjectForDb(updates);
  
  const { data, error } = await supabase
    .from('leads')
    .update(dbUpdates as any)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating lead:', error);
    throw error;
  }

  return data[0];
}

/**
 * Delete a lead
 */
export async function deleteLead(id: string) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }

  return true;
}

/**
 * Convert a lead to a client
 * This creates a new client record and updates the lead with the client ID
 */
export async function convertLeadToClient(leadId: string, clientData: any) {
  // Start a transaction (sort of - Supabase doesn't have true transactions yet)
  
  // 1. Create the client record
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert(clientData)
    .select()
    .single();

  if (clientError) {
    console.error('Error creating client from lead:', clientError);
    throw clientError;
  }

  // 2. Update the lead with the new client ID and status
  const { data: updatedLead, error: leadError } = await supabase
    .from('leads')
    .update({
      status: 'Closed-Won',
      converted_client_id: client.id,
      stage: 'Won'
    })
    .eq('id', leadId)
    .select();

  if (leadError) {
    console.error('Error updating lead after conversion:', leadError);
    throw leadError;
  }

  return {
    client,
    lead: updatedLead[0]
  };
}

/**
 * Fetch lead stages for filters
 */
export async function fetchLeadStages() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('stage')
      .order('stage');

    if (error) {
      console.error('Error fetching lead stages:', error);
      throw error;
    }

    // Extract unique stages
    const stages = [...new Set(data.map(lead => lead.stage))].filter(Boolean);
    return stages as Lead['stage'][];
  } catch (error) {
    console.error('Error fetching lead stages:', error);
    throw error;
  }
}

/**
 * Fetch lead sources for filters
 */
export async function fetchLeadSources() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('source')
      .order('source');

    if (error) {
      console.error('Error fetching lead sources:', error);
      throw error;
    }

    // Extract unique sources
    const sources = [...new Set(data.map(lead => lead.source))].filter(Boolean);
    return sources as Lead['source'][];
  } catch (error) {
    console.error('Error fetching lead sources:', error);
    throw error;
  }
}
