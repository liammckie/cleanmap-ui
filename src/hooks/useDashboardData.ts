
import { useQuery } from '@tanstack/react-query'
import { 
  fetchDashboardStats, 
  fetchUpcomingExpiringContracts,
  fetchPendingTasks,
  fetchMapLocations
} from '@/services/dashboard/dashboardStats'

export const useDashboardData = () => {
  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  })

  // Fetch upcoming/expiring contracts
  const { 
    data: upcomingContracts, 
    isLoading: contractsLoading, 
    error: contractsError 
  } = useQuery({
    queryKey: ['upcoming-contracts'],
    queryFn: () => fetchUpcomingExpiringContracts(5),
  })

  // Fetch pending tasks/work orders
  const { 
    data: pendingTasks, 
    isLoading: tasksLoading, 
    error: tasksError 
  } = useQuery({
    queryKey: ['pending-tasks'],
    queryFn: () => fetchPendingTasks(5),
  })

  // Fetch map locations
  const { 
    data: mapLocations, 
    isLoading: locationsLoading, 
    error: locationsError 
  } = useQuery({
    queryKey: ['map-locations'],
    queryFn: fetchMapLocations,
  })

  return {
    stats: stats || {
      activeContracts: 0,
      totalClients: 0,
      cleaningLocations: 0,
      monthlyRevenue: 0,
      revenueChange: 0
    },
    upcomingContracts: upcomingContracts || [],
    pendingTasks: pendingTasks || [],
    mapLocations: mapLocations || [],
    isLoading: statsLoading || contractsLoading || tasksLoading || locationsLoading,
    hasError: !!statsError || !!contractsError || !!tasksError || !!locationsError
  }
}
