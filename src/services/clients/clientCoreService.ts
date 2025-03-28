
import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/schema/operations/client.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';

/**
 * Core CRUD operations for clients
 * 
 * @origin module: operations/clients
 * @source internal-user
 * @field-locked id:uuid, company_name:string, status:enum, created_at:timestamp
 */

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

export async function fetchClients(searchTerm = '', filters = { status: '', industry: '' }) {
  let query = supabase
    .from('clients')
    .select('*');
  
  // Apply search term if provided
  if (searchTerm) {
    query = query.or(`company_name.ilike.%${searchTerm}%,contact_email.ilike.%${searchTerm}%,contact_name.ilike.%${searchTerm}%`);
  }
  
  // Apply status filter if provided
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  // Apply industry filter if provided
  if (filters.industry) {
    query = query.eq('industry', filters.industry);
  }
  
  // Execute the query
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
  
  return data;
}
