import { supabase } from '@/integrations/supabase/client'
import { parseCoordinatesFromStorage } from '@/utils/googleMaps'

export async function getTotalClients() {
  try {
    const { count, error } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })

    if (error) {
      throw error
    }

    return count || 0
  } catch (error) {
    console.error('Error fetching total clients:', error)
    return 0
  }
}

export async function getActiveClients() {
  try {
    const { count, error } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Active')

    if (error) {
      throw error
    }

    return count || 0
  } catch (error) {
    console.error('Error fetching active clients:', error)
    return 0
  }
}

export async function getSitesAwaitingContracts() {
  try {
    const { count, error } = await supabase
      .from('sites')
      .select('*', { count: 'exact', head: true })
      .is('contract_id', null)

    if (error) {
      throw error
    }

    return count || 0
  } catch (error) {
    console.error('Error fetching sites awaiting contracts:', error)
    return 0
  }
}

export async function getNewWorkOrders() {
  try {
    const { count, error } = await supabase
      .from('work_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'New')

    if (error) {
      throw error
    }

    return count || 0
  } catch (error) {
    console.error('Error fetching new work orders:', error)
    return 0
  }
}

export async function getSiteLocations() {
  try {
    const { data: sites, error } = await supabase
      .from('sites')
      .select(`
        id, 
        site_name, 
        address_street, 
        address_city, 
        coordinates,
        clients(company_name)
      `)

    if (error) throw error

    const siteLocations = (sites || []).map((site: any) => {
      // Default coordinates (around Sydney)
      let lat = -33.8688 + (Math.random() - 0.5) * 0.1
      let lng = 151.2093 + (Math.random() - 0.5) * 0.1
      
      // Parse coordinates if they exist
      if (site.coordinates) {
        const parsedCoords = parseCoordinatesFromStorage(site.coordinates)
        if (parsedCoords) {
          lat = parsedCoords.lat
          lng = parsedCoords.lng
        }
      }
      
      return {
        id: site.id,
        name: site.site_name,
        lat,
        lng,
        address: site.address_street,
        city: site.address_city,
        clientName: site.clients?.company_name,
      }
    })

    return siteLocations
  } catch (error) {
    console.error('Error fetching site locations:', error)
    return []
  }
}
