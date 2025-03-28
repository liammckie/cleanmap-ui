
import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/schema/operations/client.schema';
import { isClientStatus } from '@/schema/operations/client.schema';

/**
 * Get all available client statuses for filtering
 */
export async function getClientStatuses(): Promise<string[]> {
  try {
    // Since we're storing the status values as a predefined set, we can return them directly
    return ['Active', 'On Hold'];
  } catch (error) {
    console.error('Error fetching client statuses:', error);
    return ['Active', 'On Hold']; // Return default values even on error
  }
}

/**
 * Get all industries that clients belong to for filtering
 */
export async function getClientIndustries(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('industry')
      .not('industry', 'is', null);
    
    if (error) throw error;
    
    // Extract unique industries
    const industries = [...new Set(data.map(client => client.industry))];
    return industries.filter(Boolean) as string[];
  } catch (error) {
    console.error('Error fetching client industries:', error);
    return [];
  }
}

/**
 * Filter clients by specified criteria
 */
export async function filterClients(filters: {
  status?: string;
  industry?: string;
  search?: string;
  region?: string;
}): Promise<Client[]> {
  try {
    let query = supabase
      .from('clients')
      .select('*');
    
    // Apply filters
    if (filters.status && isClientStatus(filters.status)) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.industry) {
      query = query.eq('industry', filters.industry);
    }
    
    if (filters.region) {
      query = query.eq('region', filters.region);
    }
    
    if (filters.search) {
      // Using separate or conditions instead of a single combined one to avoid infinite recursion
      query = query.or(
        `company_name.ilike.%${filters.search}%,` +
        `contact_name.ilike.%${filters.search}%,` +
        `contact_email.ilike.%${filters.search}%,` +
        `billing_address_city.ilike.%${filters.search}%`
      );
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Cast to unknown first, then to Client[]
    return data as unknown as Client[];
  } catch (error) {
    console.error('Error filtering clients:', error);
    throw error;
  }
}

