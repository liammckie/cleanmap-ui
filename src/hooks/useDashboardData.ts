
import { useQuery } from '@tanstack/react-query'
import { 
  getTotalClients,
  getActiveClients,
  getSitesAwaitingContracts,
  getNewWorkOrders,
  getSiteLocations,
  getUpcomingContracts,
  getPendingTasks,
  getMonthlyRevenue,
  getRevenueTrend,
  getKpiMetrics
} from '@/services/dashboard/dashboardService'

export interface DashboardStats {
  totalClients: number
  activeClients: number
  sitesAwaitingContracts: number
  newWorkOrders: number
  cleaningLocations: number
  monthlyRevenue: number
  revenueChange: number
}

export const useDashboardData = () => {
  // Fetch total clients
  const { 
    data: totalClients, 
    isLoading: totalClientsLoading, 
    error: totalClientsError 
  } = useQuery({
    queryKey: ['dashboard-total-clients'],
    queryFn: getTotalClients,
  })

  // Fetch active clients
  const { 
    data: activeClients, 
    isLoading: activeClientsLoading, 
    error: activeClientsError 
  } = useQuery({
    queryKey: ['dashboard-active-clients'],
    queryFn: getActiveClients,
  })

  // Fetch sites awaiting contracts
  const { 
    data: sitesAwaitingContracts, 
    isLoading: sitesAwaitingContractsLoading, 
    error: sitesAwaitingContractsError 
  } = useQuery({
    queryKey: ['dashboard-sites-awaiting-contracts'],
    queryFn: getSitesAwaitingContracts,
  })

  // Fetch new work orders
  const { 
    data: newWorkOrders, 
    isLoading: newWorkOrdersLoading, 
    error: newWorkOrdersError 
  } = useQuery({
    queryKey: ['dashboard-new-work-orders'],
    queryFn: getNewWorkOrders,
  })

  // Fetch map locations
  const { 
    data: mapLocations, 
    isLoading: locationsLoading, 
    error: locationsError 
  } = useQuery({
    queryKey: ['map-locations'],
    queryFn: getSiteLocations,
  })

  // Fetch upcoming contracts
  const {
    data: upcomingContracts,
    isLoading: upcomingContractsLoading,
    error: upcomingContractsError
  } = useQuery({
    queryKey: ['upcoming-contracts'],
    queryFn: getUpcomingContracts,
  })

  // Fetch pending tasks
  const {
    data: pendingTasks,
    isLoading: pendingTasksLoading,
    error: pendingTasksError
  } = useQuery({
    queryKey: ['pending-tasks'],
    queryFn: getPendingTasks,
  })

  // Fetch monthly revenue
  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError
  } = useQuery({
    queryKey: ['monthly-revenue'],
    queryFn: getMonthlyRevenue,
  })

  // Fetch revenue trend data
  const {
    data: revenueTrend,
    isLoading: revenueTrendLoading,
    error: revenueTrendError
  } = useQuery({
    queryKey: ['revenue-trend'],
    queryFn: () => getRevenueTrend(6), // Get 6 months of data
  })

  // Fetch KPI metrics
  const {
    data: kpiMetrics,
    isLoading: kpiMetricsLoading,
    error: kpiMetricsError
  } = useQuery({
    queryKey: ['kpi-metrics'],
    queryFn: getKpiMetrics,
  })

  return {
    stats: {
      totalClients: totalClients || 0,
      activeClients: activeClients || 0,
      sitesAwaitingContracts: sitesAwaitingContracts || 0,
      newWorkOrders: newWorkOrders || 0,
      cleaningLocations: mapLocations?.length || 0,
      monthlyRevenue: revenueData?.currentRevenue || 0,
      revenueChange: revenueData?.change || 0
    },
    upcomingContracts: upcomingContracts || [],
    pendingTasks: pendingTasks || [],
    mapLocations: mapLocations || [],
    revenueTrend: revenueTrend || [],
    kpiMetrics: kpiMetrics || {
      taskCompletionRate: 0,
      clientRetentionRate: 0,
      staffUtilization: 0,
      customerSatisfaction: 0
    },
    isLoading: totalClientsLoading || activeClientsLoading || sitesAwaitingContractsLoading || 
               newWorkOrdersLoading || locationsLoading || upcomingContractsLoading || 
               pendingTasksLoading || revenueLoading || revenueTrendLoading || kpiMetricsLoading,
    hasError: !!totalClientsError || !!activeClientsError || !!sitesAwaitingContractsError || 
              !!newWorkOrdersError || !!locationsError || !!upcomingContractsError || 
              !!pendingTasksError || !!revenueError || !!revenueTrendError || !!kpiMetricsError
  }
}
