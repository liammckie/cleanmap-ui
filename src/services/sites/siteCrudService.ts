import { supabase } from '@/integrations/supabase/client'
import type { Site, SiteInsert, SiteUpdate } from '@/schema/operations/site.schema'
import { mapSiteToDb, mapSiteFromDb } from '@/mappers/siteMappers'

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
    
    // Prepare data for insertion using our mapper
    // This ensures dates are properly formatted as strings for the database
    const siteInsertData = mapSiteToDb(siteData)

    const { data, error } = await supabase
      .from('sites')
      .insert(siteInsertData)
      .select()
      .single()

    if (error) throw error

    return mapSiteFromDb(data)
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
    // Prepare data for update using our mapper
    const updateData = mapSiteToDb({
      ...siteData,
      // Remove created_at to avoid type conflicts
      created_at: undefined 
    })

    const { data, error } = await supabase
      .from('sites')
      .update(updateData)
      .eq('id', siteId)
      .select()
      .single()

    if (error) throw error

    return mapSiteFromDb(data)
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

/**
 * Bulk update sites status
 * @param siteIds Array of site IDs to update
 * @param status New status value
 * @returns Success status
 */
export async function bulkUpdateSitesStatus(siteIds: string[], status: Site['status']) {
  try {
    const { error } = await supabase
      .from('sites')
      .update({ status })
      .in('id', siteIds)

    if (error) throw error

    return true
  } catch (error) {
    console.error('Error bulk updating sites status:', error)
    throw error
  }
}
