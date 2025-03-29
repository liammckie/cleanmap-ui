
import { supabase } from '@/integrations/supabase/client'
import { mapFromDb } from '@/utils/mappers'
import type { ClientInsert, ClientUpdate } from '@/schema/operations/client.schema'

/**
 * Fetch all clients
 */
export async function fetchClients() {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('company_name')

    if (error) {
      console.error('Error fetching clients:', error)
      throw error
    }

    return data.map(client => mapFromDb(client))
  } catch (error) {
    console.error('Error fetching clients:', error)
    throw error
  }
}

/**
 * Fetch a single client by ID
 */
export async function fetchClient(id: string) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching client ${id}:`, error)
      throw error
    }

    return mapFromDb(data)
  } catch (error) {
    console.error(`Error fetching client ${id}:`, error)
    throw error
  }
}

/**
 * Create a new client
 */
export async function createClient(clientData: ClientInsert) {
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

    return mapFromDb(data)
  } catch (error) {
    console.error('Error creating client:', error)
    throw error
  }
}

/**
 * Update an existing client
 */
export async function updateClient(id: string, clientData: ClientUpdate) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating client ${id}:`, error)
      throw error
    }

    return mapFromDb(data)
  } catch (error) {
    console.error(`Error updating client ${id}:`, error)
    throw error
  }
}

/**
 * Delete a client
 */
export async function deleteClient(id: string) {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting client ${id}:`, error)
      throw error
    }

    return true
  } catch (error) {
    console.error(`Error deleting client ${id}:`, error)
    throw error
  }
}
