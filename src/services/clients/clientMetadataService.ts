
import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/schema/operations/client.schema';

/**
 * Services for fetching client-related metadata (industries, regions, statuses)
 */

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
    // Handle region column check and fetching in a safer way to avoid TypeScript errors
    let regionData: string[] = [];

    // First check if the column exists using a simplified approach
    try {
      const { data, error } = await supabase.rpc('get_column_names', {
        table_name: 'clients'
      });

      // If we can't check columns through RPC, default to safer approach
      if (error || !data || !Array.isArray(data)) {
        // Try a direct query but handle the error gracefully
        const { error: queryError } = await supabase
          .from('clients')
          .select('region')
          .limit(1);
        
        // If there's an error, likely the column doesn't exist
        if (queryError && queryError.message && queryError.message.includes("column 'region' does not exist")) {
          console.warn("Region column doesn't exist in clients table");
          return [];
        }
      } else {
        // If the column doesn't exist in the returned columns, return empty array
        if (!data.includes('region')) {
          console.warn("Region column doesn't exist in clients table");
          return [];
        }
      }

      // If we get here, column likely exists, so fetch regions
      const { data: regionsData, error: regionsError } = await supabase
        .from('clients')
        .select('region')
        .order('region');

      if (regionsError) {
        // If there's still an error, return empty array
        console.error('Error fetching regions:', regionsError);
        return [];
      }

      // Process the regions data safely
      if (regionsData && Array.isArray(regionsData)) {
        regionData = regionsData
          .map(client => client.region)
          .filter((region): region is string => typeof region === 'string' && region.trim() !== '');
        
        return [...new Set(regionData)];
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error('Error checking/fetching regions:', error);
      return [];
    }

    return regionData;
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
