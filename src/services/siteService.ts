import { supabase } from '@/integrations/supabase/client'
import type { Site } from '@/schema/operations/site.schema'
import { prepareObjectForDb } from '@/utils/dateFormatters'
import { isSiteStatus } from '@/schema/operations/site.schema'

export async function fetchSites(
  searchTerm?: string,
  filters?: {
    clientId?: string
    status?: Site['status'] | string
    region?: string
    siteType?: string
  },
) {
  let query = supabase.from('sites').select(`
      *,
      client:client_id (
        company_name
      )
    `)

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `site_name.ilike.%${searchTerm}%,address_street.ilike.%${searchTerm}%,address_city.ilike.%${searchTerm}%,address_state.ilike.%${searchTerm}%`,
    )
  }

  // Apply filters if provided
  if (filters) {
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId)
    }
    if (filters.status && typeof filters.status === 'string') {
      // Validate the status if it's a string
      if (isSiteStatus(filters.status)) {
        query = query.eq('status', filters.status)
      }
    }
    if (filters.region) {
      query = query.eq('region', filters.region)
    }
    if (filters.siteType) {
      query = query.eq('site_type', filters.siteType)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching sites:', error)
    throw error
  }

  return data as unknown as Site[]
}

export async function fetchSiteById(id: string) {
  const { data, error } = await supabase
    .from('sites')
    .select(
      `
      *,
      client:clients(id, company_name),
      site_manager:contacts(id, first_name, last_name)
    `,
    )
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching site:', error)
    throw error
  }

  return data
}

export async function createSite(site: Partial<Site>) {
  // Map the site fields to match the database schema
  const mappedSite = {
    client_id: site.client_id,
    site_name: site.site_name,
    site_type: site.site_type,
    status: site.status || 'Active',
    // Map address fields correctly
    address_street: site.address_street || site.street_address,
    address_city: site.address_city || site.city,
    address_state: site.address_state || site.state,
    address_postcode: site.address_postcode || site.zip_code,
    // Other fields
    region: site.region,
    service_start_date: site.service_start_date,
    site_manager_id: site.site_manager_id,
    special_instructions: site.special_instructions,
    service_type: site.service_type,
    price_per_service: site.price_per_service,
    price_frequency: site.price_frequency,
  };

  // Convert Date objects to ISO strings for Supabase
  const dbSite = prepareObjectForDb(mappedSite)
  console.log('Inserting site with prepared data:', dbSite);

  const { data, error } = await supabase
    .from('sites')
    .insert(dbSite as any)
    .select()

  if (error) {
    console.error('Error creating site:', error)
    throw error
  }

  return data[0] as unknown as Site
}

export async function updateSite(id: string, updates: Partial<Site>) {
  // Convert Date objects to ISO strings for Supabase
  const dbUpdates = prepareObjectForDb(updates)

  const { data, error } = await supabase
    .from('sites')
    .update(dbUpdates as any)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating site:', error)
    throw error
  }

  return data[0] as unknown as Site
}

export async function deleteSite(id: string) {
  const { error } = await supabase.from('sites').delete().eq('id', id)

  if (error) {
    console.error('Error deleting site:', error)
    throw error
  }

  return true
}

// Fetch site types for filters
export async function fetchSiteTypes() {
  try {
    const { data, error } = await supabase.from('sites').select('site_type').order('site_type')

    if (error) {
      console.error('Error fetching site types:', error)
      throw error
    }

    // Extract unique site types
    const types = [...new Set(data.map((site) => site.site_type))].filter(Boolean)
    return types
  } catch (error) {
    console.error('Error fetching site types:', error)
    throw error
  }
}

// Fetch site regions for filters
export async function fetchSiteRegions() {
  try {
    const { data, error } = await supabase.from('sites').select('region').order('region')

    if (error) {
      console.error('Error fetching site regions:', error)
      throw error
    }

    // Extract unique regions
    const regions = [...new Set(data.map((site) => site.region))].filter(Boolean)
    return regions
  } catch (error) {
    console.error('Error fetching site regions:', error)
    throw error
  }
}

// Fetch site statuses for filters
export async function fetchSiteStatuses() {
  try {
    const { data, error } = await supabase.from('sites').select('status')

    if (error) {
      console.error('Error fetching site statuses:', error)
      throw error
    }

    // Extract unique statuses
    const statuses = [...new Set(data.map((site) => site.status))].filter(Boolean)
    return statuses as Site['status'][]
  } catch (error) {
    console.error('Error fetching site statuses:', error)
    throw error
  }
}
