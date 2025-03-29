
import { supabase } from '@/integrations/supabase/client'
import type { Site } from '@/schema/operations/site.schema'
import { mapSitesFromDb, mapSiteFromDb } from '@/mappers/siteMappers'

/**
 * Fetch all sites with optional filtering and pagination
 * @param options Filter and pagination options
 */
export async function fetchSites(options?: {
  search?: string;
  status?: string;
  clientId?: string;
  region?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<Site[]> {
  try {
    let query = supabase
      .from('sites')
      .select('*, client:clients(company_name)')
    
    // Apply filters if provided
    if (options?.search) {
      query = query.or(`site_name.ilike.%${options.search}%,address_street.ilike.%${options.search}%,address_city.ilike.%${options.search}%`)
    }
    
    if (options?.status) {
      // No need for type casting here since we're using a string
      query = query.eq('status', options.status)
    }
    
    if (options?.clientId) {
      query = query.eq('client_id', options.clientId)
    }
    
    if (options?.region) {
      query = query.eq('region', options.region)
    }
    
    // Apply sorting
    if (options?.sortBy) {
      query = query.order(options.sortBy, { ascending: options.sortOrder === 'asc' })
    } else {
      query = query.order('site_name')
    }
    
    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching sites:', error)
      throw error
    }
    
    return mapSitesFromDb(data)
  } catch (error) {
    console.error('Error in fetchSites:', error)
    throw error
  }
}

/**
 * Fetch a single site by ID
 */
export async function fetchSiteById(siteId: string): Promise<Site | null> {
  if (!siteId) return null

  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*, client:clients(company_name)')
      .eq('id', siteId)
      .single()

    if (error) {
      // If the error is "No rows found", return null instead of throwing
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching site by ID:', error)
      throw error
    }

    return mapSiteFromDb(data)
  } catch (error) {
    console.error('Error in fetchSiteById:', error)
    throw error
  }
}

/**
 * Fetch sites by client ID
 */
export async function querySitesByClientId(clientId: string): Promise<Site[]> {
  if (!clientId) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*, client:clients(company_name)')
      .eq('client_id', clientId)
      .order('site_name')

    if (error) {
      console.error('Error fetching sites by client ID:', error)
      throw error
    }

    return mapSitesFromDb(data)
  } catch (error) {
    console.error('Error in querySitesByClientId:', error)
    throw error
  }
}

/**
 * Get site counts by region or status for reporting
 */
export async function getSiteCounts(groupBy: 'region' | 'status'): Promise<{ label: string; count: number }[]> {
  try {
    // Use a direct SQL query instead of RPC since the function doesn't exist
    const { data, error } = await supabase
      .from('sites')
      .select(`${groupBy}, count`)
      .select(`${groupBy}, count(*)`)
      .group(groupBy)
      
    if (error) {
      console.error(`Error getting site counts by ${groupBy}:`, error)
      throw error
    }

    // Transform the data to match the expected return type
    return (data || []).map(item => ({
      label: item[groupBy] || 'Unknown',
      count: parseInt(item.count, 10)
    }))
  } catch (error) {
    console.error(`Error in getSiteCounts by ${groupBy}:`, error)
    return []
  }
}

/**
 * Fetch total site count (for pagination)
 */
export async function fetchSitesCount(options?: {
  search?: string;
  status?: string;
  clientId?: string;
  region?: string;
}): Promise<number> {
  try {
    let query = supabase
      .from('sites')
      .select('id', { count: 'exact', head: true })
    
    // Apply filters if provided
    if (options?.search) {
      query = query.or(`site_name.ilike.%${options.search}%,address_street.ilike.%${options.search}%,address_city.ilike.%${options.search}%`)
    }
    
    if (options?.status) {
      // No need for type casting here
      query = query.eq('status', options.status)
    }
    
    if (options?.clientId) {
      query = query.eq('client_id', options.clientId)
    }
    
    if (options?.region) {
      query = query.eq('region', options.region)
    }
    
    const { count, error } = await query
    
    if (error) {
      console.error('Error fetching sites count:', error)
      throw error
    }
    
    return count || 0
  } catch (error) {
    console.error('Error in fetchSitesCount:', error)
    return 0
  }
}
