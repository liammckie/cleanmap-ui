
import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/schema/operations/client.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';
import { isClientStatus } from '@/schema/operations/client.schema';

export async function fetchClients(
  searchTerm?: string, 
  filters?: { 
    status?: string;
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
    if (filters.status && typeof filters.status === 'string') {
      // Validate the status if it's a string
      if (isClientStatus(filters.status)) {
        query = query.eq('status', filters.status);
      }
    }
    if (filters.industry) {
      query = query.eq('industry', filters.industry);
    }
    if (filters.region) {
      query = query.eq('region', filters.region);
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
  
  // Use type assertion to match Supabase's expected type for the clients table
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
    // Check if the region column exists in the clients table first
    // If not, we'll just return an empty array
    const { data, error } = await supabase
      .from('clients')
      .select('region')
      .limit(1);

    if (error) {
      // If column doesn't exist, return empty array
      if (error.message && error.message.includes("column 'region' does not exist")) {
        console.warn('Region column does not exist in clients table');
        return [];
      }
      console.error('Error fetching regions:', error);
      throw error;
    }

    // If we get here, the column exists, so fetch all regions
    const { data: regionsData, error: regionsError } = await supabase
      .from('clients')
      .select('region')
      .order('region');

    if (regionsError) {
      console.error('Error fetching regions:', regionsError);
      throw regionsError;
    }

    // Extract unique regions, handle potential null values and type issues
    const regions = regionsData
      .map(client => client.region)
      .filter((region): region is string => typeof region === 'string' && region.trim() !== '');
    
    return [...new Set(regions)];
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
