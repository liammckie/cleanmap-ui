
import { supabase } from '@/integrations/supabase/client'
import type { Site } from '@/schema/operations/site.schema'
import { mapSiteFromDb, mapSitesFromDb } from '@/mappers/siteMappers'

/**
 * Fetch a single site by ID
 */
export async function fetchSiteById(siteId: string): Promise<Site | null> {
  if (!siteId) return null

  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*, client:clients(company_name)')
      .eq('id', siteId)
      .single()

    if (error) {
      // If the error is "No rows found", return null instead of throwing
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching site by ID:', error)
      throw error
    }

    return mapSiteFromDb(data)
  } catch (error) {
    console.error('Error in fetchSiteById:', error)
    throw error
  }
}

/**
 * Fetch sites by client ID
 */
export async function querySitesByClientId(clientId: string): Promise<Site[]> {
  if (!clientId) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*, client:clients(company_name)')
      .eq('client_id', clientId)
      .order('site_name')

    if (error) {
      console.error('Error fetching sites by client ID:', error)
      throw error
    }

    return mapSitesFromDb(data)
  } catch (error) {
    console.error('Error in querySitesByClientId:', error)
    throw error
  }
}
