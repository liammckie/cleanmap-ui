import { supabase } from '@/integrations/supabase/client'

interface ClientLocation {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface ClientMetadata {
  id: string
  name: string
  email: string
  phone: string
  location: ClientLocation
}

/**
 * @function getClientMetadata
 * @description Fetches metadata for a client from the database
 * @origin {source: "internal", module: "clientService", author: "system"}
 * @field-locked id:uuid, name:string, email:string
 */
export const getClientMetadata = async (clientId: string): Promise<ClientMetadata | null> => {
  try {
    // Clean and validate input
    const cleanId = clientId.trim()
    if (!cleanId) {
      console.error('Invalid client ID provided')
      return null
    }

    // Add query limits for safety
    const { data, error } = await supabase
      .from('clients')
      .select(
        'id, company_name, contact_email, contact_phone, billing_address_street, billing_address_city, billing_address_state, billing_address_postcode, business_number',
      )
      .eq('id', cleanId)
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching client metadata:', error)
      return null
    }

    if (!data) {
      return null
    }

    // Transform for frontend use
    const metadata: ClientMetadata = {
      id: data.id,
      name: data.company_name,
      email: data.contact_email || '',
      phone: data.contact_phone || '',
      location: {
        address: data.billing_address_street || '',
        city: data.billing_address_city || '',
        state: data.billing_address_state || '',
        zipCode: data.billing_address_postcode || '',
        country: data.business_number || '', // Using business_number as country since country field doesn't exist
      },
    }

    return metadata
  } catch (e) {
    console.error('Unexpected error in getClientMetadata:', e)
    return null
  }
}

export const updateClientMetadata = async (
  clientId: string,
  metadata: Partial<ClientMetadata>,
): Promise<boolean> => {
  try {
    // Validate input
    if (!clientId || !metadata) {
      return false
    }

    // Transform to database format
    const updateData: Record<string, any> = {
      contact_phone: metadata.phone,
    }

    // Handle nested location object
    if (metadata.location) {
      if (metadata.location.address) updateData.billing_address_street = metadata.location.address
      if (metadata.location.city) updateData.billing_address_city = metadata.location.city
      if (metadata.location.state) updateData.billing_address_state = metadata.location.state
      if (metadata.location.zipCode) updateData.billing_address_postcode = metadata.location.zipCode
      if (metadata.location.country) updateData.business_number = metadata.location.country // Using business_number as country
    }

    const { error } = await supabase.from('clients').update(updateData).eq('id', clientId)

    if (error) {
      console.error('Error updating client metadata:', error)
      return false
    }

    return true
  } catch (e) {
    console.error('Unexpected error in updateClientMetadata:', e)
    return false
  }
}
