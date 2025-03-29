import { supabase } from '@/integrations/supabase/client'

/**
 * Get key dashboard statistics
 * @returns Object containing count statistics and revenue data
 */
export async function fetchDashboardStats() {
  try {
    // Fetch active contracts count
    const { count: activeContractsCount, error: contractsError } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Active')

    if (contractsError) throw contractsError

    // Fetch total clients count
    const { count: totalClientsCount, error: clientsError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })

    if (clientsError) throw clientsError

    // Fetch total sites (cleaning locations) count
    const { count: totalSitesCount, error: sitesError } = await supabase
      .from('sites')
      .select('*', { count: 'exact', head: true })

    if (sitesError) throw sitesError

    // Calculate monthly revenue - sum the base_fee from active contracts with a monthly billing frequency
    // For other frequencies, we convert to monthly equivalent
    const { data: contracts, error: revenueError } = await supabase
      .from('contracts')
      .select('base_fee, billing_frequency')
      .eq('status', 'Active')

    if (revenueError) throw revenueError

    let monthlyRevenue = 0
    contracts.forEach(contract => {
      const { base_fee, billing_frequency } = contract
      
      // Convert to monthly equivalent based on billing frequency
      switch(billing_frequency?.toLowerCase()) {
        case 'weekly':
          monthlyRevenue += base_fee * 4.33 // Average weeks in a month
          break
        case 'fortnightly':
        case 'biweekly':
          monthlyRevenue += base_fee * 2.17 // Biweekly (every two weeks)
          break
        case 'monthly':
          monthlyRevenue += base_fee // Already monthly
          break
        case 'quarterly':
          monthlyRevenue += base_fee / 3 // Quarterly to monthly
          break
        case 'annually':
        case 'yearly':
          monthlyRevenue += base_fee / 12 // Annual to monthly
          break
        default:
          monthlyRevenue += base_fee // Default assumes monthly
      }
    })

    // For demonstration, calculate a fake percentage change
    // In a real implementation, you would compare current month to previous month
    const prevMonthRevenue = monthlyRevenue * 0.95 // Fake previous month revenue (5% less)
    const revenueChange = monthlyRevenue > 0 
      ? ((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
      : 0

    return {
      activeContracts: activeContractsCount || 0,
      totalClients: totalClientsCount || 0,
      cleaningLocations: totalSitesCount || 0,
      monthlyRevenue: monthlyRevenue || 0,
      revenueChange: revenueChange || 0
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    // Return fallback values if there's an error
    return {
      activeContracts: 0,
      totalClients: 0,
      cleaningLocations: 0,
      monthlyRevenue: 0,
      revenueChange: 0
    }
  }
}

/**
 * Get upcoming/expiring contracts for dashboard
 * @param limit Number of contracts to return
 * @returns Array of contracts expiring in the next 30 days
 */
export async function fetchUpcomingExpiringContracts(limit = 5) {
  try {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    
    const today = new Date().toISOString().split('T')[0]
    const futureDate = thirtyDaysFromNow.toISOString().split('T')[0]

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
      .lte('end_date', futureDate)
      .gte('end_date', today)
      .order('end_date', { ascending: true })
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching upcoming expiring contracts:', error)
    return []
  }
}

/**
 * Get pending work orders for dashboard tasks list
 * @param limit Number of tasks to return
 * @returns Array of pending/scheduled work orders
 */
export async function fetchPendingTasks(limit = 5) {
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
        site_id,
        sites (
          site_name,
          client_id,
          clients (
            company_name
          )
        )
      `)
      .in('status', ['Scheduled', 'In Progress']) // Only show scheduled or in-progress tasks
      .order('due_date', { ascending: true })
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching pending tasks:', error)
    return []
  }
}

/**
 * Get site locations with coordinates for map
 * Uses actual coordinates from the database when available
 * @returns Array of map locations with coordinates
 */
export async function fetchMapLocations() {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select(`
        id,
        site_name,
        address_street,
        address_city,
        address_state,
        address_postcode,
        coordinates,
        client_id,
        clients (
          company_name
        )
      `)
      .eq('status', 'Active')
      .limit(100)

    if (error) throw error

    // Parse coordinates or generate them if not available
    return data?.map(site => {
      // Default coordinates (approximately Australia)
      let lat = -25.2744 + (Math.random() * 10 - 5);
      let lng = 133.7751 + (Math.random() * 10 - 5);
      
      // Parse coordinates if they exist
      if (site.coordinates) {
        const [latStr, lngStr] = site.coordinates.split(',');
        const parsedLat = parseFloat(latStr);
        const parsedLng = parseFloat(lngStr);
        
        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
          lat = parsedLat;
          lng = parsedLng;
        }
      }
      
      return {
        id: site.id,
        name: site.site_name,
        lat,
        lng,
        count: 1, // Could represent number of services at this site
        address: site.address_street,
        city: site.address_city,
        clientName: site.clients?.company_name
      }
    }) || []
  } catch (error) {
    console.error('Error fetching map locations:', error)
    return []
  }
}
