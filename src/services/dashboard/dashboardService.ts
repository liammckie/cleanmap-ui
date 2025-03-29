
import { supabase } from '@/integrations/supabase/client'
import { parseCoordinatesFromStorage } from '@/utils/googleMaps'
import { format, addDays } from 'date-fns'

/**
 * Fetch counts of total clients
 */
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

/**
 * Fetch counts of active clients
 */
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

/**
 * Fetch counts of sites awaiting contracts
 */
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

/**
 * Fetch counts of new work orders
 */
export async function getNewWorkOrders() {
  try {
    const { count, error } = await supabase
      .from('work_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Scheduled')

    if (error) {
      throw error
    }

    return count || 0
  } catch (error) {
    console.error('Error fetching new work orders:', error)
    return 0
  }
}

/**
 * Fetch site locations with coordinates
 */
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
        count: 1, // This would normally be something like staff assigned to this site
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

/**
 * Fetch upcoming contracts expiring soon
 */
export async function getUpcomingContracts(daysThreshold = 30) {
  try {
    // Calculate the date range (today to X days in future)
    const today = new Date()
    const futureDate = addDays(today, daysThreshold)
    
    // Format dates for Supabase query
    const formattedToday = format(today, 'yyyy-MM-dd')
    const formattedFuture = format(futureDate, 'yyyy-MM-dd')
    
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        id, 
        contract_number, 
        client_id,
        start_date,
        end_date,
        status,
        base_fee,
        clients (
          company_name
        )
      `)
      .eq('status', 'Active')
      .gte('end_date', formattedToday)
      .lte('end_date', formattedFuture)
      .order('end_date', { ascending: true })
      .limit(5)

    if (error) throw error
    
    return data || []
  } catch (error) {
    console.error('Error fetching upcoming contracts:', error)
    return []
  }
}

/**
 * Fetch pending tasks (work orders)
 */
export async function getPendingTasks() {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        id,
        title,
        description,
        status,
        priority,
        due_date,
        scheduled_start,
        sites (
          site_name,
          client_id,
          clients (
            company_name
          )
        )
      `)
      .in('status', ['Scheduled', 'In Progress'])
      .order('due_date', { ascending: true })
      .limit(5)

    if (error) throw error
    
    return data || []
  } catch (error) {
    console.error('Error fetching pending tasks:', error)
    return []
  }
}

/**
 * Fetch monthly revenue data
 */
export async function getMonthlyRevenue() {
  try {
    // This would normally fetch from an invoices or payments table
    // Since we don't have that data, we'll return a mock value for now
    return {
      currentRevenue: 84521, // Example value
      previousRevenue: 81900, // Example value for calculating change
      change: 3.2 // Calculated as percentage
    }
  } catch (error) {
    console.error('Error fetching monthly revenue:', error)
    return {
      currentRevenue: 0,
      previousRevenue: 0,
      change: 0
    }
  }
}

/**
 * Fetch revenue trend data for the chart
 */
export async function getRevenueTrend(months = 6) {
  try {
    // This would normally fetch from an invoices or payments table
    // For now, we'll generate mock data
    const today = new Date()
    const data = []

    for (let i = 0; i < months; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = format(month, 'MMM')
      
      // Generate a somewhat realistic revenue pattern
      const baseValue = 80000
      const variation = Math.random() * 15000 - 5000 // -5000 to +10000
      const revenue = Math.round(baseValue + variation)
      
      data.unshift({ name: monthName, revenue }) // Add to beginning to maintain chronological order
    }
    
    return data
  } catch (error) {
    console.error('Error fetching revenue trend:', error)
    return []
  }
}

/**
 * Fetch KPI metrics for the dashboard
 */
export async function getKpiMetrics() {
  try {
    // This would normally calculate from actual data
    // For now, we'll return mock data for these KPIs
    return {
      taskCompletionRate: 85, // Percentage
      clientRetentionRate: 92, // Percentage
      staffUtilization: 78, // Percentage
      customerSatisfaction: 4.2 // Out of 5
    }
  } catch (error) {
    console.error('Error fetching KPI metrics:', error)
    return {
      taskCompletionRate: 0,
      clientRetentionRate: 0,
      staffUtilization: 0,
      customerSatisfaction: 0
    }
  }
}
