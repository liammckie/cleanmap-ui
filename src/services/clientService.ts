
import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/schema/operations.schema';

export async function fetchClients(
  searchTerm?: string,
  filters?: {
    status?: string;
    industry?: string;
  }
) {
  let query = supabase
    .from('clients')
    .select('*');

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `company_name.ilike.%${searchTerm}%,contact_email.ilike.%${searchTerm}%,business_number.ilike.%${searchTerm}%`
    );
  }

  // Apply filters if provided
  if (filters) {
    if (filters.status) {
      query = query.eq('status', filters.status);
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
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select();

  if (error) {
    console.error('Error creating client:', error);
    throw error;
  }

  return data[0];
}

export async function updateClient(id: string, updates: Partial<Client>) {
  // Ensure we're only sending database-compatible values
  const dbUpdates = {
    ...updates,
    // Remove these fields if they exist to prevent format conflicts
    created_at: undefined,
    updated_at: undefined,
  };
  
  const { data, error } = await supabase
    .from('clients')
    .update(dbUpdates)
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

// Fetch status options for filters
export async function fetchClientStatuses() {
  const { data, error } = await supabase
    .rpc('get_client_status_enum');

  if (error) {
    console.error('Error fetching client statuses:', error);
    throw error;
  }

  return data;
}

// Fetch industries for filters
export async function fetchIndustries() {
  const { data, error } = await supabase
    .from('clients')
    .select('industry')
    .order('industry');

  if (error) {
    console.error('Error fetching industries:', error);
    throw error;
  }

  // Extract unique industries (excluding nulls)
  const industries = [...new Set(data.map(client => client.industry).filter(Boolean))];
  return industries;
}
