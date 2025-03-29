
import { supabase } from '@/integrations/supabase/client'
import type { Site, SiteInsert } from '@/schema/operations/site.schema'

/**
 * Create a new site
 * @param siteData Site data to create
 * @returns The newly created site
 */
export async function createSite(siteData: Partial<Site>) {
  try {
    // Ensure required fields are present
    if (!siteData.client_id || !siteData.site_name || !siteData.site_type || 
        !siteData.address_street || !siteData.address_city || 
        !siteData.address_state || !siteData.address_postcode) {
      throw new Error('Missing required site fields')
    }
    
    // Convert Date objects to ISO strings for database compatibility
    const formattedStartDate = siteData.service_start_date instanceof Date 
      ? siteData.service_start_date.toISOString()
      : siteData.service_start_date;
      
    const formattedEndDate = siteData.service_end_date instanceof Date
      ? siteData.service_end_date.toISOString()
      : siteData.service_end_date;
    
    // Ensure service_items are properly formatted
    const siteInsertData = {
      client_id: siteData.client_id,
      site_name: siteData.site_name,
      site_type: siteData.site_type,
      address_street: siteData.address_street,
      address_city: siteData.address_city,
      address_state: siteData.address_state,
      address_postcode: siteData.address_postcode,
      region: siteData.region,
      service_start_date: formattedStartDate,
      service_end_date: formattedEndDate,
      special_instructions: siteData.special_instructions,
      status: siteData.status || 'Active',
      site_manager_id: siteData.site_manager_id,
      primary_contact: siteData.primary_contact,
      contact_phone: siteData.contact_phone,
      contact_email: siteData.contact_email,
      service_frequency: siteData.service_frequency,
      custom_frequency: siteData.custom_frequency,
      service_type: siteData.service_type || 'Internal',
      price_per_service: siteData.price_per_service,
      price_frequency: siteData.price_frequency,
      service_items: siteData.service_items?.map(item => ({
        id: item.id,
        description: item.description,
        amount: Number(item.amount)
      }))
    }

    const { data, error } = await supabase
      .from('sites')
      .insert(siteInsertData)
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
      // Handle status as a string and ensure it's a valid site status
      const validStatuses = ['Active', 'Inactive', 'Pending Launch', 'Suspended']
      const status = String(filters.status)
      if (validStatuses.includes(status)) {
        query = query.eq('status', status)
      }
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
