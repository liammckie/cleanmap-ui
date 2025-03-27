import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/schema/operations/client.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';
import { isClientStatus } from '@/schema/operations/client.schema';

export async function fetchClients(
  searchTerm?: string, 
  filters?: { 
    status?: Client['status'];
    region?: string;
    industry?: string;
  }
) {
  let query = supabase
    .from('clients')
    .select('*');

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `company_name.ilike.%${searchTerm}%,contact_name.ilike.%${searchTerm}%,contact_email.ilike.%${searchTerm}%`
    );
  }

  // Apply filters if provided
  if (filters) {
    if (filters.status && isClientStatus(filters.status)) {
      query = query.eq('status', filters.status);
    }
    if (filters.region) {
      query = query.eq('region', filters.region);
    }
    if (filters.industry) {
      query = query.eq('industry', filters.industry);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }

  return data;
}

export async function fetchClientById(id: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching client:', error);
    throw error;
  }

  return data;
}

export async function createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
  // Convert Date objects to ISO strings for Supabase
  const dbClient = prepareObjectForDb(client);
  
  const { data, error } = await supabase
    .from('clients')
    .insert(dbClient as any)
    .select();

  if (error) {
    console.error('Error creating client:', error);
    throw error;
  }

  return data[0];
}

export async function updateClient(id: string, updates: Partial<Client>) {
  // Convert Date objects to ISO strings for Supabase
  const dbUpdates = prepareObjectForDb(updates);
  
  const { data, error } = await supabase
    .from('clients')
    .update(dbUpdates as any)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating client:', error);
    throw error;
  }

  return data[0];
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    throw error;
  }

  return true;
}

// Fetch industry options for filters
export async function fetchIndustries() {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('industry')
      .order('industry');

    if (error) {
      console.error('Error fetching industries:', error);
      throw error;
    }

    // Extract unique industries
    const industries = [...new Set(data.map(client => client.industry))].filter(Boolean);
    return industries;
  } catch (error) {
    console.error('Error fetching industries:', error);
    throw error;
  }
}

// Fetch regions for filters
export async function fetchRegions() {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('region')
      .order('region');

    if (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }

    // Extract unique regions
    const regions = [...new Set(data.map(client => client.region))].filter(Boolean);
    return regions;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
}

// Fetch client statuses for filters
export async function fetchClientStatuses() {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('status');

    if (error) {
      console.error('Error fetching client statuses:', error);
      throw error;
    }

    // Extract unique statuses
    const statuses = [...new Set(data.map(client => client.status))].filter(Boolean);
    return statuses as Client['status'][];
  } catch (error) {
    console.error('Error fetching client statuses:', error);
    throw error;
  }
}
