
import { supabase } from '@/integrations/supabase/client'
import type { Client, ClientInsert, ClientUpdate } from '@/schema/operations/client.schema'
import { clientSchema } from '@/schema/operations/client.schema'
import { validateForDb } from '@/utils/supabase/validation'

/**
 * Fetch all clients with optional filtering
 * @param options Search and filter options
 */
export async function fetchClients(options: {
  search?: string;
  filters?: {
    status?: 'Active' | 'On Hold';
    industry?: string;
  };
} = {}) {
  try {
    const { search = '', filters = {} } = options;
    
    let query = supabase.from('clients').select('*')

    // Apply search if provided
    if (search) {
      query = query.or(
        `company_name.ilike.%${search}%,contact_name.ilike.%${search}%,contact_email.ilike.%${search}%`
      )
    }

    // Apply status filter if provided
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    // Apply industry filter if provided
    if (filters.industry) {
      query = query.eq('industry', filters.industry)
    }

    // Order by company name
    query = query.order('company_name')

    const { data, error } = await query

    if (error) {
      console.error('Error fetching clients:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching clients:', error)
    throw error
  }
}

/**
 * Fetch a client by ID
 * @param id Client ID
 */
export async function fetchClientById(id: string) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching client:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching client:', error)
    throw error
  }
}

/**
 * Create a new client
 * @param clientData Client data to insert
 */
export async function createClient(clientData: ClientInsert) {
  try {
    // Validate and prepare client data
    const validatedData = validateForDb(clientData, clientSchema) as ClientInsert
    
    console.log('Validated client data for insert:', validatedData)
    
    // Ensure we're sending the correct data shape required by Supabase
    const dataToInsert = {
      company_name: validatedData.company_name,
      contact_name: validatedData.contact_name,
      contact_email: validatedData.contact_email,
      contact_phone: validatedData.contact_phone,
      billing_address_street: validatedData.billing_address_street,
      billing_address_city: validatedData.billing_address_city,
      billing_address_state: validatedData.billing_address_state,
      billing_address_postcode: validatedData.billing_address_postcode,
      payment_terms: validatedData.payment_terms,
      industry: validatedData.industry,
      status: validatedData.status,
      business_number: validatedData.business_number,
      region: validatedData.region,
      notes: validatedData.notes,
      on_hold_reason: validatedData.on_hold_reason
    }
    
    const { data, error } = await supabase
      .from('clients')
      .insert(dataToInsert)
      .select()
      .single()

    if (error) {
      console.error('Error creating client:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error creating client:', error)
    throw error
  }
}

/**
 * Update an existing client
 * @param id Client ID
 * @param clientData Client data to update
 */
export async function updateClient(id: string, clientData: ClientUpdate) {
  try {
    // Validate and prepare client data
    const validatedData = validateForDb(clientData, clientSchema) as ClientUpdate
    
    // Ensure we're sending only string values for dates
    const dataToUpdate: Record<string, any> = { ...validatedData }
    
    // Remove any Date objects that might cause type issues
    if (dataToUpdate.created_at instanceof Date) {
      dataToUpdate.created_at = dataToUpdate.created_at.toISOString()
    }
    
    if (dataToUpdate.updated_at instanceof Date) {
      dataToUpdate.updated_at = dataToUpdate.updated_at.toISOString()
    }
    
    const { data, error } = await supabase
      .from('clients')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating client:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating client:', error)
    throw error
  }
}

/**
 * Delete a client
 * @param id Client ID
 */
export async function deleteClient(id: string) {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  } catch (error) {
    console.error('Error deleting client:', error)
    throw error
  }
}
