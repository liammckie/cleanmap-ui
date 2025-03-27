import { supabase } from '@/lib/supabase';

interface ClientLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ClientMetadata {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: ClientLocation;
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
    const cleanId = clientId.trim();
    if (!cleanId) {
      console.error("Invalid client ID provided");
      return null;
    }

    // Add query limits for safety
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, email, phone, address, city, state, zip_code, country')
      .eq('id', cleanId)
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching client metadata:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Transform for frontend use
    const metadata: ClientMetadata = {
      id: data.id,
      name: data.name,
      email: data.email || '',
      phone: data.phone || '',
      location: {
        address: data.address || '',
        city: data.city || '',
        state: data.state || '', 
        zipCode: data.zip_code || '',
        country: data.country || ''
      }
    };

    return metadata;
  } catch (e) {
    console.error("Unexpected error in getClientMetadata:", e);
    return null;
  }
}

export const updateClientMetadata = async (clientId: string, metadata: Partial<ClientMetadata>): Promise<boolean> => {
  try {
    // Validate input
    if (!clientId || !metadata) {
      return false;
    }

    // Transform to database format
    const updateData: Record<string, any> = {
      phone: metadata.phone,
    };

    // Handle nested location object
    if (metadata.location) {
      if (metadata.location.address) updateData.address = metadata.location.address;
      if (metadata.location.city) updateData.city = metadata.location.city;
      if (metadata.location.state) updateData.state = metadata.location.state;
      if (metadata.location.zipCode) updateData.zip_code = metadata.location.zipCode;
      if (metadata.location.country) updateData.country = metadata.location.country;
    }

    const { error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', clientId);

    if (error) {
      console.error("Error updating client metadata:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Unexpected error in updateClientMetadata:", e);
    return false;
  }
}
