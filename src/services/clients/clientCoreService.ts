
import { supabase } from '@/integrations/supabase/client';
import { prepareObjectForDb } from '@/utils/dateFormatters';
import type { Client } from '@/schema/operations/client.schema';

/**
 * Fetch all clients with optional filtering
 */
export async function fetchClients(
  searchTerm: string = '',
  filters: { status: string; industry: string } = { status: '', industry: '' }
): Promise<Client[]> {
  let query = supabase.from('clients').select('*');

  // Apply search filter if provided
  if (searchTerm) {
    query = query.or(
      `company_name.ilike.%${searchTerm}%,contact_name.ilike.%${searchTerm}%,contact_email.ilike.%${searchTerm}%`
    );
  }

  // Apply status filter if provided
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  // Apply industry filter if provided
  if (filters.industry) {
    query = query.eq('industry', filters.industry);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }

  return data as Client[];
}

/**
 * Create a new client
 */
export async function createClient(
  client: Omit<Client, 'id' | 'created_at' | 'updated_at'>
): Promise<Client> {
  // Convert Date objects to ISO strings for Supabase
  const preparedClient = prepareObjectForDb(client);
  
  // Log what we're inserting to debug
  console.log('Inserting client:', preparedClient);
  
  const { data, error } = await supabase
    .from('clients')
    .insert(preparedClient)
    .select();

  if (error) {
    console.error('Error creating client:', error);
    throw error;
  }

  return data[0] as Client;
}

/**
 * Update an existing client
 */
export async function updateClient(
  id: string,
  updates: Partial<Client>
): Promise<Client> {
  // Convert Date objects to ISO strings for Supabase
  const preparedUpdates = prepareObjectForDb(updates);
  
  const { data, error } = await supabase
    .from('clients')
    .update(preparedUpdates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating client:', error);
    throw error;
  }

  return data[0] as Client;
}

/**
 * Delete a client
 */
export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}
