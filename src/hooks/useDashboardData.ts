
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { format, subDays } from 'date-fns'

/**
 * Hook to fetch dashboard data for the main dashboard
 */
export function useDashboardData() {
  // Fetch total clients
  const {
    data: totalClientsData,
    isLoading: isLoadingTotalClients,
    error: totalClientsError,
  } = useQuery({
    queryKey: ['dashboard', 'totalClients'],
    queryFn: async () => {
      const { count, error } = await supabase.from('clients').select('*', { count: 'exact', head: true })
      
      if (error) throw new Error(error.message)
      return count || 0
    },
  })

  // Fetch active clients
  const {
    data: activeClientsData,
    isLoading: isLoadingActiveClients,
    error: activeClientsError,
  } = useQuery({
    queryKey: ['dashboard', 'activeClients'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Active')
      
      if (error) throw new Error(error.message)
      return count || 0
    },
  })

  // Fetch total cleaning locations (sites)
  const {
    data: totalSitesData,
    isLoading: isLoadingSites,
    error: sitesError,
  } = useQuery({
    queryKey: ['dashboard', 'totalSites'],
    queryFn: async () => {
      const { count, error } = await supabase.from('sites').select('*', { count: 'exact', head: true })
      
      if (error) throw new Error(error.message)
      return count || 0
    },
  })

  // Fetch sites awaiting contracts (sites without contracts)
  const {
    data: sitesAwaitingContractsData,
    isLoading: isLoadingSitesAwaitingContracts,
    error: sitesAwaitingContractsError,
  } = useQuery({
    queryKey: ['dashboard', 'sitesAwaitingContracts'],
    queryFn: async () => {
      // Get sites not linked to any contract in the contract_sites table
      const { data: siteIds, error: siteIdsError } = await supabase
        .from('contract_sites')
        .select('site_id')
      
      if (siteIdsError) throw new Error(siteIdsError.message)
      
      const siteIdsArray = siteIds.map(site => site.site_id)
      
      // If no sites are linked to contracts, all sites are awaiting contracts
      if (siteIdsArray.length === 0) {
        const { count, error } = await supabase
          .from('sites')
          .select('*', { count: 'exact', head: true })
        
        if (error) throw new Error(error.message)
        return count || 0
      }
      
      // Count sites that are not in the siteIdsArray
      const { count, error } = await supabase
        .from('sites')
        .select('*', { count: 'exact', head: true })
        .not('id', 'in', `(${siteIdsArray.join(',')})`)
      
      if (error) throw new Error(error.message)
      return count || 0
    },
  })

  // Fetch upcoming contracts (expiring soon)
  const {
    data: upcomingContractsData,
    isLoading: isLoadingUpcomingContracts,
    error: upcomingContractsError,
  } = useQuery({
    queryKey: ['dashboard', 'upcomingContracts'],
    queryFn: async () => {
      const today = new Date()
      const thirtyDaysAhead = format(subDays(today, -30), 'yyyy-MM-dd')
      
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
        .lte('end_date', thirtyDaysAhead)
        .gte('end_date', format(today, 'yyyy-MM-dd'))
        .eq('status', 'Active')
        .order('end_date', { ascending: true })
        .limit(5)
      
      if (error) throw new Error(error.message)
      return data || []
    },
  })

  // Fetch work orders
  const {
    data: newWorkOrdersData,
    isLoading: isLoadingNewWorkOrders,
    error: newWorkOrdersError,
  } = useQuery({
    queryKey: ['dashboard', 'newWorkOrders'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('work_orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Scheduled')
      
      if (error) throw new Error(error.message)
      return count || 0
    },
  })

  // Fetch revenue data for the chart
  const {
    data: revenueChartData,
    isLoading: isLoadingRevenueChart,
    error: revenueChartError,
  } = useQuery({
    queryKey: ['dashboard', 'revenueChart'],
    queryFn: async () => {
      // In a real app, this would fetch actual revenue data from your database
      // For now, we'll generate sample data
      const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        return {
          name: format(date, 'MMM'),
          revenue: Math.floor(70000 + Math.random() * 30000)
        }
      }).reverse()
      
      return lastSixMonths
    },
  })

  // Calculate monthly revenue from contracts
  const {
    data: monthlyRevenueData,
    isLoading: isLoadingMonthlyRevenue,
    error: monthlyRevenueError,
  } = useQuery({
    queryKey: ['dashboard', 'monthlyRevenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select('base_fee, billing_frequency')
        .eq('status', 'Active')
      
      if (error) throw new Error(error.message)
      
      if (!data || data.length === 0) return 0
      
      // Calculate monthly equivalent based on billing frequency
      return data.reduce((total, contract) => {
        const { base_fee, billing_frequency } = contract
        
        if (!base_fee) return total
        
        // Convert all fees to monthly equivalent
        switch(billing_frequency) {
          case 'weekly':
            return total + (base_fee * 4.33) // Average weeks in a month
          case 'fortnightly':
            return total + (base_fee * 2.17) // Average fortnights in a month
          case 'monthly':
            return total + base_fee
          case 'quarterly':
            return total + (base_fee / 3)
          case 'annually':
            return total + (base_fee / 12)
          default:
            return total + base_fee
        }
      }, 0)
    },
  })

  // For the revenue change percentage, we'd ideally compare to previous period
  // For now, we'll use a mock value
  const revenueChange = 5.2 // 5.2% increase

  // Pending tasks (work orders that need attention)
  const {
    data: pendingTasksData,
    isLoading: isLoadingPendingTasks,
    error: pendingTasksError,
  } = useQuery({
    queryKey: ['dashboard', 'pendingTasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          id, 
          title, 
          due_date, 
          priority,
          status,
          site_id,
          sites(site_name)
        `)
        .in('status', ['Scheduled', 'In Progress'])
        .order('due_date', { ascending: true })
        .limit(5)
      
      if (error) throw new Error(error.message)
      return data || []
    },
  })

  // KPI data for the dashboard
  const {
    data: kpiData,
    isLoading: isLoadingKpi,
    error: kpiError,
  } = useQuery({
    queryKey: ['dashboard', 'kpi'],
    queryFn: async () => {
      // In a real app, fetch these metrics from your database
      // For now, we'll use sample data
      return {
        taskCompletionRate: 87, // 87% of tasks completed on time
        clientRetentionRate: 92, // 92% client retention rate
        employeeProductivity: 78, // 78% productivity rate
        sitesSatisfactionRate: 84, // 84% site satisfaction
      }
    },
  })

  const isLoading = 
    isLoadingTotalClients || 
    isLoadingActiveClients || 
    isLoadingSites || 
    isLoadingSitesAwaitingContracts ||
    isLoadingNewWorkOrders || 
    isLoadingUpcomingContracts ||
    isLoadingMonthlyRevenue ||
    isLoadingRevenueChart ||
    isLoadingPendingTasks ||
    isLoadingKpi

  const error = 
    totalClientsError || 
    activeClientsError || 
    sitesError || 
    sitesAwaitingContractsError ||
    newWorkOrdersError || 
    upcomingContractsError ||
    monthlyRevenueError ||
    revenueChartError ||
    pendingTasksError ||
    kpiError

  return {
    data: {
      totalClients: totalClientsData || 0,
      activeClients: activeClientsData || 0,
      sitesAwaitingContracts: sitesAwaitingContractsData || 0,
      newWorkOrders: newWorkOrdersData || 0,
      cleaningLocations: totalSitesData || 0,
      monthlyRevenue: monthlyRevenueData || 0,
      revenueChange: revenueChange,
      revenueChartData: revenueChartData || [],
      upcomingContracts: upcomingContractsData || [],
      pendingTasks: pendingTasksData || [],
      kpi: kpiData || {
        taskCompletionRate: 0,
        clientRetentionRate: 0,
        employeeProductivity: 0,
        sitesSatisfactionRate: 0
      }
    },
    isLoading,
    error,
  }
}
