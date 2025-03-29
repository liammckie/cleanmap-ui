
import { supabase } from '@/integrations/supabase/client'
import type { Site } from '@/schema/operations/site.schema'

const VALID_SITE_STATUSES = ['Active', 'Inactive', 'Pending Launch', 'Suspended'] as const
type SiteStatus = typeof VALID_SITE_STATUSES[number]

/**
 * Transform raw Supabase response to Site object with proper typing
 */
const transformSiteResponse = (data: any): Site => {
  // Extract client data from the response
  const { clients, ...siteData } = data;
  
  // Transform the response to match the Site interface
  return {
    ...siteData,
    client: clients ? {
      company_name: clients.company_name
    } : undefined,
    // Ensure all required properties from the Site interface have values
    service_end_date: data.service_end_date || null,
    primary_contact: data.primary_contact || null,
    contact_phone: data.contact_phone || null,
    contact_email: data.contact_email || null,
    service_frequency: data.service_frequency || null,
    custom_frequency: data.custom_frequency || null,
    service_type: data.service_type || 'Internal',
    price_per_week: data.price_per_week || null,
    price_frequency: data.price_frequency || null,
    service_items: data.service_items || null
  }
}

/**
 * Fetch a list of sites with filtering
 * @param search Search term for site name or address
 * @param filters Filter parameters
 * @returns List of sites matching filters
 */
export async function fetchSites(search = '', filters: any = {}) {
  try {
    let query = supabase
      .from('sites')
      .select(`
        *,
        clients (
          company_name
        )
      `)

    // Apply search term if provided
    if (search) {
      query = query.or(
        `site_name.ilike.%${search}%,address_street.ilike.%${search}%,address_city.ilike.%${search}%`
      )
    }

    // Apply filters if provided
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId)
    }

    if (filters.status) {
      // Handle status as a proper site status enum value
      const status = String(filters.status)
      
      // Validate status before applying filter
      if (VALID_SITE_STATUSES.includes(status as SiteStatus)) {
        query = query.eq('status', status as SiteStatus)
      }
    }

    if (filters.region) {
      query = query.eq('region', filters.region)
    }

    // Execute the query
    const { data, error } = await query

    if (error) throw error

    // Transform each site in the response
    return data?.map(item => transformSiteResponse(item)) || []
  } catch (error) {
    console.error('Error fetching sites:', error)
    throw error
  }
}

/**
 * Fetch a single site by ID
 * @param siteId ID of the site to fetch
 * @returns Site details
 */
export async function fetchSiteById(siteId: string): Promise<Site> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select(`
        *,
        clients (
          id,
          company_name
        )
      `)
      .eq('id', siteId)
      .single()

    if (error) throw error

    return transformSiteResponse(data)
  } catch (error) {
    console.error('Error fetching site by ID:', error)
    throw error
  }
}
