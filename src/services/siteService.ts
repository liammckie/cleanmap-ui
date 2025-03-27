
import { supabase } from '@/integrations/supabase/client';
import type { Site } from '@/schema/operations.schema';

export async function fetchSites(
  searchTerm?: string,
  filters?: {
    clientId?: string;
    status?: string;
    region?: string;
    siteType?: string;
  }
) {
  let query = supabase
    .from('sites')
    .select(`
      *,
      client:clients(company_name),
      site_manager:contacts(first_name, last_name)
    `);

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `site_name.ilike.%${searchTerm}%,address_street.ilike.%${searchTerm}%,address_city.ilike.%${searchTerm}%`
    );
  }

  // Apply filters if provided
  if (filters) {
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.region) {
      query = query.eq('region', filters.region);
    }
    if (filters.siteType) {
      query = query.eq('site_type', filters.siteType);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }

  return data;
}

export async function fetchSiteById(id: string) {
  const { data, error } = await supabase
    .from('sites')
    .select(`
      *,
      client:clients(company_name),
      site_manager:contacts(id, first_name, last_name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching site:', error);
    throw error;
  }

  return data;
}

export async function createSite(site: Omit<Site, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('sites')
    .insert(site)
    .select();

  if (error) {
    console.error('Error creating site:', error);
    throw error;
  }

  return data[0];
}

export async function updateSite(id: string, updates: Partial<Site>) {
  const { data, error } = await supabase
    .from('sites')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating site:', error);
    throw error;
  }

  return data[0];
}

export async function deleteSite(id: string) {
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting site:', error);
    throw error;
  }

  return true;
}

// Fetch status options for filters
export async function fetchSiteStatuses() {
  const { data, error } = await supabase
    .rpc('get_site_status_enum');

  if (error) {
    console.error('Error fetching site statuses:', error);
    throw error;
  }

  return data;
}

// Fetch regions for filters
export async function fetchRegions() {
  const { data, error } = await supabase
    .from('sites')
    .select('region')
    .order('region');

  if (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }

  // Extract unique regions (excluding nulls)
  const regions = [...new Set(data.map(site => site.region).filter(Boolean))];
  return regions;
}

// Fetch site types for filters
export async function fetchSiteTypes() {
  const { data, error } = await supabase
    .from('sites')
    .select('site_type')
    .order('site_type');

  if (error) {
    console.error('Error fetching site types:', error);
    throw error;
  }

  // Extract unique site types
  const siteTypes = [...new Set(data.map(site => site.site_type))];
  return siteTypes;
}
