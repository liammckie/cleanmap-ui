
import { supabase } from '@/integrations/supabase/client';
import { isClientStatus } from '@/schema/operations/client.schema';

/**
 * Client filtering and search functionality
 */
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
    
    // Handle region filter separately to avoid TypeScript deep instantiation error
    if (filters.region) {
      // We'll apply the filter within a try-catch to handle missing column cases
      try {
        // Create a new query with the region filter
        const regionFilter = supabase
          .from('clients')
          .select('id')
          .eq('region', filters.region);

        // Get the IDs that match the region filter
        const { data: regionFilteredIds, error: regionError } = await regionFilter;
        
        if (!regionError && regionFilteredIds && regionFilteredIds.length > 0) {
          // Apply the region filter by matching IDs
          const ids = regionFilteredIds.map(item => item.id);
          query = query.in('id', ids);
        } else {
          // If region filter fails or returns no results, log warning
          console.warn('Region filter not applied or returned no results');
        }
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
