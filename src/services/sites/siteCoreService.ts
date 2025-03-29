import { supabase } from '@/integrations/supabase/client'
import type { Site, SiteInsert, SiteUpdate } from '@/schema/operations/site.schema'
import { isSiteStatus } from '@/schema/operations/site.schema'
import { mapToDb } from '@/utils/mappers'

/**
 * Fetch sites with optional filtering
 */
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

  if (searchTerm) {
    query = query.or(
      `site_name.ilike.%${searchTerm}%,address_street.ilike.%${searchTerm}%,address_city.ilike.%${searchTerm}%,address_state.ilike.%${searchTerm}%`,
    )
  }

  if (filters) {
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId)
    }
    if (filters.status && typeof filters.status === 'string') {
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

/**
 * Fetch a site by its ID
 */
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

/**
 * Create a new site
 */
export async function createSite(site: Partial<Site>): Promise<Site> {
  const mappedSite = mapToDb({
    client_id: site.client_id,
    site_name: site.site_name,
    site_type: site.site_type,
    status: site.status || 'Active',
    
    // Address fields
    address_street: site.address_street || site.street_address,
    address_city: site.address_city || site.city,
    address_state: site.address_state || site.state,
    address_postcode: site.address_postcode || site.zip_code,
    region: site.region,
    
    // Contact information
    primary_contact: site.primary_contact,
    contact_phone: site.contact_phone,
    contact_email: site.contact_email,
    
    // Service details
    service_start_date: site.service_start_date,
    service_end_date: site.service_end_date,
    service_frequency: site.service_frequency,
    custom_frequency: site.custom_frequency,
    service_type: site.service_type,
    
    // Pricing information
    price_per_service: site.price_per_service,
    price_frequency: site.price_frequency,
    service_items: site.service_items ? JSON.stringify(site.service_items) : null,
    
    // Other fields
    site_manager_id: site.site_manager_id,
    special_instructions: site.special_instructions,
  })

  console.log('Inserting site with prepared data:', mappedSite);

  const { data, error } = await supabase
    .from('sites')
    .insert(mappedSite as any)
    .select()

  if (error) {
    console.error('Error creating site:', error)
    throw error
  }

  return data[0] as unknown as Site
}

/**
 * Update an existing site
 */
export async function updateSite(id: string, updates: Partial<Site>): Promise<Site> {
  // Prepare service_items for DB storage if present
  let preparedUpdates = { ...updates };
  if (updates.service_items) {
    preparedUpdates.service_items = JSON.stringify(updates.service_items);
  }
  
  const mappedUpdates = mapToDb(preparedUpdates)

  const { data, error } = await supabase
    .from('sites')
    .update(mappedUpdates as any)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating site:', error)
    throw error
  }

  return data[0] as unknown as Site
}

/**
 * Delete a site by ID
 */
export async function deleteSite(id: string) {
  const { error } = await supabase.from('sites').delete().eq('id', id)

  if (error) {
    console.error('Error deleting site:', error)
    throw error
  }

  return true
}
