
import { supabase } from '@/integrations/supabase/client';
import { isClientStatus } from '@/schema/operations/client.schema';

/**
 * Client filtering and search functionality
 * 
 * @origin module: operations/clients
 * @source internal-user
 */
export async function fetchClients(
  searchTerm?: string, 
  filters?: { 
    status?: string;
    region?: string;
    industry?: string;
  }
) {
  // Start with a base query that includes pagination for safety
  let query = supabase
    .from('clients')
    .select('*')
    .limit(100); // Enforce environment-safe query with limit

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
    
    // Handle region filter - use a safer approach that doesn't cause deep instantiation
    if (filters.region) {
      try {
        query = query.eq('region', filters.region);
      } catch (error) {
        console.warn('Region filter not applied - column may not exist');
      }
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }

  return data;
}
