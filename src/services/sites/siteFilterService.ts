
import { supabase } from '@/integrations/supabase/client'
import type { Site } from '@/schema/operations/site.schema'

/**
 * Fetch all available site types for filtering
 */
export async function fetchSiteTypes() {
  try {
    const { data, error } = await supabase.from('sites').select('site_type').order('site_type')

    if (error) {
      console.error('Error fetching site types:', error)
      throw error
    }

    const types = [...new Set(data.map((site) => site.site_type))].filter(Boolean)
    return types
  } catch (error) {
    console.error('Error fetching site types:', error)
    throw error
  }
}

/**
 * Fetch all available site regions for filtering
 */
export async function fetchSiteRegions() {
  try {
    const { data, error } = await supabase.from('sites').select('region').order('region')

    if (error) {
      console.error('Error fetching site regions:', error)
      throw error
    }

    const regions = [...new Set(data.map((site) => site.region))].filter(Boolean)
    return regions
  } catch (error) {
    console.error('Error fetching site regions:', error)
    throw error
  }
}

/**
 * Fetch all available site statuses for filtering
 */
export async function fetchSiteStatuses() {
  try {
    const { data, error } = await supabase.from('sites').select('status')

    if (error) {
      console.error('Error fetching site statuses:', error)
      throw error
    }

    const statuses = [...new Set(data.map((site) => site.status))].filter(Boolean)
    return statuses as Site['status'][]
  } catch (error) {
    console.error('Error fetching site statuses:', error)
    throw error
  }
}

/**
 * Filter sites by specific criteria
 */
export async function filterSites(filters: {
  clientId?: string
  status?: string
  region?: string
  siteType?: string
  search?: string
}): Promise<Site[]> {
  try {
    let query = supabase.from('sites').select(`
      *,
      client:client_id (
        company_name
      )
    `)

    // Apply filters
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.region) {
      query = query.eq('region', filters.region)
    }

    if (filters.siteType) {
      query = query.eq('site_type', filters.siteType)
    }

    if (filters.search) {
      const searchPattern = `%${filters.search}%`
      query = query.or(
        `site_name.ilike.${searchPattern},` +
        `address_street.ilike.${searchPattern},` +
        `address_city.ilike.${searchPattern},` +
        `address_state.ilike.${searchPattern}`
      )
    }

    const { data, error } = await query

    if (error) throw error

    return data as unknown as Site[]
  } catch (error) {
    console.error('Error filtering sites:', error)
    throw error
  }
}
