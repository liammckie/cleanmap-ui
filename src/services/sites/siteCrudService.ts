
import { supabase } from '@/integrations/supabase/client'
import type { Site, SiteInsert } from '@/schema/operations/site.schema'

/**
 * Format date values properly for database storage
 */
const formatDateValues = (site: Partial<Site>) => {
  const formattedStartDate = site.service_start_date instanceof Date 
    ? site.service_start_date.toISOString()
    : site.service_start_date;
    
  const formattedEndDate = site.service_end_date instanceof Date
    ? site.service_end_date.toISOString()
    : site.service_end_date;
  
  return { formattedStartDate, formattedEndDate };
};

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
    
    const { formattedStartDate, formattedEndDate } = formatDateValues(siteData);
    
    // Prepare data for insertion
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
      price_per_week: siteData.price_per_week,
      price_frequency: siteData.price_frequency,
      coordinates: siteData.coordinates,
      service_items: siteData.service_items?.map(item => ({
        id: item.id,
        description: item.description,
        amount: Number(item.amount),
        frequency: item.frequency || 'weekly',
        provider: item.provider || 'Internal'
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
 * Update an existing site
 * @param siteId ID of the site to update
 * @param siteData Updated site data
 * @returns The updated site
 */
export async function updateSite(siteId: string, siteData: Partial<Site>) {
  try {
    const { formattedStartDate, formattedEndDate } = formatDateValues(siteData);
    
    // Prepare data for update
    const updateData = {
      ...siteData,
      service_start_date: formattedStartDate,
      service_end_date: formattedEndDate,
      updated_at: new Date().toISOString(),
      created_at: undefined // Remove created_at to avoid type conflicts
    }

    const { data, error } = await supabase
      .from('sites')
      .update(updateData)
      .eq('id', siteId)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error updating site:', error)
    throw error
  }
}

/**
 * Delete a site
 * @param siteId ID of the site to delete
 * @returns Success status
 */
export async function deleteSite(siteId: string) {
  try {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', siteId)

    if (error) throw error

    return true
  } catch (error) {
    console.error('Error deleting site:', error)
    throw error
  }
}
