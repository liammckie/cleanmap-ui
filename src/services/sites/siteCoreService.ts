
import { supabase } from '@/integrations/supabase/client'
import type { Site } from '@/schema/operations/site.schema'

/**
 * Create a new site
 * @param siteData Site data to create
 * @returns The newly created site
 */
export async function createSite(siteData: Partial<Site>) {
  try {
    // Ensure service_items are properly formatted
    const formattedSiteData = {
      ...siteData,
      service_items: siteData.service_items?.map(item => ({
        id: item.id,
        description: item.description,
        amount: Number(item.amount)
      }))
    }

    const { data, error } = await supabase
      .from('sites')
      .insert(formattedSiteData)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error creating site:', error)
    throw error
  }
}

/**
 * Fetch a list of sites with filtering
 * @param params Search and filter parameters
 * @returns List of sites matching filters
 */
export async function fetchSites(params: {
  search?: string
  filters?: {
    clientId?: string
    status?: string
    region?: string
  }
}) {
  try {
    const { search = '', filters = {} } = params
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
      query = query.eq('status', filters.status)
    }

    if (filters.region) {
      query = query.eq('region', filters.region)
    }

    // Execute the query
    const { data, error } = await query

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching sites:', error)
    throw error
  }
}
