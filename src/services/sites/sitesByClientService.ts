
import { supabase } from '@/integrations/supabase/client'
import type { Site } from '@/schema/operations/site.schema'

/**
 * Fetch sites for a specific client
 * @param clientId - The ID of the client to fetch sites for
 * @returns Array of site objects associated with the client
 */
export async function fetchSitesByClientId(clientId: string): Promise<Site[]> {
  if (!clientId) {
    return []
  }

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('client_id', clientId)
    .order('site_name')

  if (error) {
    console.error('Error fetching sites by client ID:', error)
    throw error
  }

  return data as Site[]
}
