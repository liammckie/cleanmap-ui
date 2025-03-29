
import { supabase } from '@/integrations/supabase/client'
import type { Site } from '@/schema/operations/site.schema'

/**
 * Fetch all sites
 */
export async function fetchSites(): Promise<Site[]> {
  const { data, error } = await supabase
    .from('sites')
    .select('*, client:clients(company_name)')
    .order('site_name')

  if (error) {
    console.error('Error fetching sites:', error)
    throw error
  }

  return data as Site[]
}

/**
 * Fetch a single site by ID
 */
export async function fetchSiteById(siteId: string): Promise<Site | null> {
  if (!siteId) return null

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

  return data as Site
}

/**
 * Fetch sites by client ID from the query service
 * This is renamed to avoid conflict with sitesByClientService
 */
export async function querySitesByClientId(clientId: string): Promise<Site[]> {
  if (!clientId) {
    return []
  }

  const { data, error } = await supabase
    .from('sites')
    .select('*, client:clients(company_name)')
    .eq('client_id', clientId)
    .order('site_name')

  if (error) {
    console.error('Error fetching sites by client ID:', error)
    throw error
  }

  return data as Site[]
}
