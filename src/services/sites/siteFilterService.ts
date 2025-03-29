
import { supabase } from '@/integrations/supabase/client'

/**
 * Fetch distinct site types for filtering
 * @returns Array of unique site types
 */
export async function fetchSiteTypes(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('site_type')
      .is('site_type', 'not.null')
      .order('site_type')

    if (error) throw error

    // Extract unique site types
    const siteTypes = data.map(site => site.site_type)
    return [...new Set(siteTypes)].filter(Boolean)
  } catch (error) {
    console.error('Error fetching site types:', error)
    return []
  }
}

/**
 * Fetch distinct regions for filtering
 * @returns Array of unique regions
 */
export async function fetchSiteRegions(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('region')
      .is('region', 'not.null')
      .order('region')

    if (error) throw error

    // Extract unique regions
    const regions = data.map(site => site.region)
    return [...new Set(regions)].filter(Boolean)
  } catch (error) {
    console.error('Error fetching site regions:', error)
    return []
  }
}

/**
 * Fetch distinct site statuses for filtering
 * @returns Array of unique site statuses
 */
export async function fetchSiteStatuses(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('status')
      .is('status', 'not.null')
      .order('status')

    if (error) throw error

    // Extract unique statuses
    const statuses = data.map(site => site.status)
    return [...new Set(statuses)].filter(Boolean)
  } catch (error) {
    console.error('Error fetching site statuses:', error)
    return []
  }
}
