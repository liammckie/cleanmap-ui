
import { supabase } from '@/integrations/supabase/client'

/**
 * Fetch all clients with optional filtering
 * @param options Search and filter options
 */
export async function fetchClients(options: {
  search?: string;
  filters?: {
    status?: string;
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
export async function createClient(clientData: any) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
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
export async function updateClient(id: string, clientData: any) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
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
