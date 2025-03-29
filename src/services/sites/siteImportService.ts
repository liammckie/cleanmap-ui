
import { supabase } from '@/integrations/supabase/client'
import type { Site } from '@/schema/operations/site.schema'

/**
 * Bulk import sites
 * @param sites Array of site data to import
 * @returns The imported sites
 */
export async function bulkImportSites(sites: Partial<Site>[]) {
  try {
    // Format sites for database - ensure we have all required fields and proper data types
    const formattedSites = sites.map(site => {
      // Ensure all required fields exist
      if (!site.client_id || !site.site_name || !site.site_type || 
          !site.address_street || !site.address_city || 
          !site.address_state || !site.address_postcode) {
        throw new Error('Missing required site fields in bulk import')
      }
      
      const formattedStartDate = site.service_start_date instanceof Date 
        ? site.service_start_date.toISOString()
        : site.service_start_date;
        
      const formattedEndDate = site.service_end_date instanceof Date
        ? site.service_end_date.toISOString()
        : site.service_end_date;
      
      return {
        client_id: site.client_id,
        site_name: site.site_name,
        site_type: site.site_type,
        address_street: site.address_street,
        address_city: site.address_city,
        address_state: site.address_state,
        address_postcode: site.address_postcode,
        region: site.region,
        service_start_date: formattedStartDate,
        service_end_date: formattedEndDate,
        special_instructions: site.special_instructions,
        status: site.status || 'Active',
        service_type: site.service_type || 'Internal',
        // Include created_at and updated_at as strings
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

    const { data, error } = await supabase
      .from('sites')
      .insert(formattedSites)
      .select()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error bulk importing sites:', error)
    throw error
  }
}
