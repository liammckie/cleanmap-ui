
import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/schema/operations';
import { prepareObjectForDb } from '@/utils/dateFormatters';

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
      // Use type assertion to match the enum
      query = query.eq('status', filters.status as 'Active' | 'On Hold');
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
    .insert(dbClient)
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
  // Use a direct query instead of rpc to get enum values
  const { data, error } = await supabase
    .from('clients')
    .select('status')
    .distinct();

  if (error) {
    console.error('Error fetching client statuses:', error);
    throw error;
  }

  return data.map(item => item.status);
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
