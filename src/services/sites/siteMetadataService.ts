
import { supabase } from '@/integrations/supabase/client'

interface SiteLocation {
  addressStreet: string
  addressCity: string
  addressState: string
  addressPostcode: string
  region?: string
}

export interface SiteMetadata {
  id: string
  name: string
  type: string
  location: SiteLocation
  status: string
  clientId: string
  clientName?: string
}

/**
 * @function getSiteMetadata
 * @description Fetches metadata for a site from the database
 */
export const getSiteMetadata = async (siteId: string): Promise<SiteMetadata | null> => {
  try {
    // Clean and validate input
    const cleanId = siteId.trim()
    if (!cleanId) {
      console.error('Invalid site ID provided')
      return null
    }

    // Add query limits for safety
    const { data, error } = await supabase
      .from('sites')
      .select(`
        id, 
        site_name, 
        site_type, 
        address_street, 
        address_city, 
        address_state, 
        address_postcode, 
        region,
        status,
        client_id,
        client:clients(company_name)
      `)
      .eq('id', cleanId)
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching site metadata:', error)
      return null
    }

    if (!data) {
      return null
    }

    // Transform for frontend use
    const metadata: SiteMetadata = {
      id: data.id,
      name: data.site_name,
      type: data.site_type,
      location: {
        addressStreet: data.address_street,
        addressCity: data.address_city,
        addressState: data.address_state,
        addressPostcode: data.address_postcode,
        region: data.region,
      },
      status: data.status,
      clientId: data.client_id,
      clientName: data.client?.company_name,
    }

    return metadata
  } catch (e) {
    console.error('Unexpected error in getSiteMetadata:', e)
    return null
  }
}

/**
 * Update site metadata
 */
export const updateSiteMetadata = async (
  siteId: string,
  metadata: Partial<SiteMetadata>,
): Promise<boolean> => {
  try {
    // Validate input
    if (!siteId || !metadata) {
      return false
    }

    // Transform to database format
    const updateData: Record<string, any> = {}

    // Handle properties
    if (metadata.name) updateData.site_name = metadata.name
    if (metadata.type) updateData.site_type = metadata.type
    if (metadata.status) updateData.status = metadata.status

    // Handle nested location object
    if (metadata.location) {
      if (metadata.location.addressStreet) updateData.address_street = metadata.location.addressStreet
      if (metadata.location.addressCity) updateData.address_city = metadata.location.addressCity
      if (metadata.location.addressState) updateData.address_state = metadata.location.addressState
      if (metadata.location.addressPostcode) updateData.address_postcode = metadata.location.addressPostcode
      if (metadata.location.region) updateData.region = metadata.location.region
    }

    const { error } = await supabase.from('sites').update(updateData).eq('id', siteId)

    if (error) {
      console.error('Error updating site metadata:', error)
      return false
    }

    return true
  } catch (e) {
    console.error('Unexpected error in updateSiteMetadata:', e)
    return false
  }
}
