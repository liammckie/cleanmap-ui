
import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/schema/operations/client.schema';

/**
 * Services for fetching client-related metadata (industries, regions, statuses)
 * 
 * @origin module: operations/clients
 * @source internal-user
 */

// Fetch industry options for filters
export async function fetchIndustries() {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('industry')
      .limit(500) // Enforce environment-safe query with limit
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
    // First check if the region column exists
    const { data: columnInfo, error: columnError } = await supabase
      .rpc('get_column_names', { table_name: 'clients' });
    
    // If we can't check columns through RPC or region doesn't exist, return empty array
    if (columnError || !columnInfo || !Array.isArray(columnInfo) || !columnInfo.includes('region')) {
      console.warn("Region column doesn't exist in clients table");
      return [];
    }
    
    // Region column exists, fetch distinct regions
    const { data: regionsData, error: regionsError } = await supabase
      .from('clients')
      .select('region')
      .limit(500) // Enforce environment-safe query with limit
      .order('region');
      
    if (regionsError) {
      console.error('Error fetching regions:', regionsError);
      return [];
    }
    
    // Process the regions data safely
    const uniqueRegions = [...new Set(
      regionsData
        .map(client => client.region)
        .filter(Boolean) // Filter out null/undefined/empty values
    )];
    
    return uniqueRegions;
  } catch (error) {
    console.error('Error in fetchRegions:', error);
    return [];
  }
}

// Fetch client statuses for filters
export async function fetchClientStatuses() {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('status')
      .limit(500); // Enforce environment-safe query with limit

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
