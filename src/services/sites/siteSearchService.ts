
import { supabase } from '@/integrations/supabase/client'
import type { Site } from '@/schema/operations/site.schema'
import { mapSitesFromDb } from '@/mappers/siteMappers'
import { isSiteStatus } from '@/schema/operations/site.schema'

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
    
    if (options?.status && options.status !== 'all') {
      // Verify status is a valid site status
      if (isSiteStatus(options.status)) {
        query = query.eq('status', options.status)
      }
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
    
    if (options?.status && options.status !== 'all') {
      // Verify status is a valid site status
      if (isSiteStatus(options.status)) {
        query = query.eq('status', options.status)
      }
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
