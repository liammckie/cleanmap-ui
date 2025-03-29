
import { useQuery } from '@tanstack/react-query'
import { 
  getTotalClients,
  getActiveClients,
  getSitesAwaitingContracts,
  getNewWorkOrders,
  getSiteLocations 
} from '@/services/dashboard/dashboardStats'

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

  // Sample data for demonstration (would come from API in real application)
  const mockStats = {
    monthlyRevenue: 128750,
    revenueChange: 3.2
  }

  return {
    stats: {
      totalClients: totalClients || 0,
      activeClients: activeClients || 0,
      sitesAwaitingContracts: sitesAwaitingContracts || 0,
      newWorkOrders: newWorkOrders || 0,
      cleaningLocations: mapLocations?.length || 0,
      monthlyRevenue: mockStats.monthlyRevenue,
      revenueChange: mockStats.revenueChange
    },
    upcomingContracts: [
      {
        id: '1',
        contract_number: 'C-2023-001',
        client_id: '123',
        start_date: '2023-01-01',
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Active',
        base_fee: 12500,
        clients: {
          company_name: 'ABC Corporation'
        }
      },
      {
        id: '2',
        contract_number: 'C-2023-002',
        client_id: '456',
        start_date: '2023-02-15',
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Active',
        base_fee: 8750,
        clients: {
          company_name: 'XYZ Industries'
        }
      }
    ],
    pendingTasks: [
      {
        id: '1',
        title: 'Monthly Deep Clean',
        description: 'Perform monthly deep cleaning of all office spaces',
        status: 'Scheduled',
        priority: 'High',
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        sites: {
          site_name: 'CBD Office Tower',
          client_id: '123',
          clients: {
            company_name: 'ABC Corporation'
          }
        }
      },
      {
        id: '2',
        title: 'Window Cleaning',
        description: 'Clean all exterior windows',
        status: 'Scheduled',
        priority: 'Medium',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        sites: {
          site_name: 'North Shore Campus',
          client_id: '456',
          clients: {
            company_name: 'XYZ Industries'
          }
        }
      }
    ],
    mapLocations: mapLocations || [],
    isLoading: totalClientsLoading || activeClientsLoading || sitesAwaitingContractsLoading || 
               newWorkOrdersLoading || locationsLoading,
    hasError: !!totalClientsError || !!activeClientsError || !!sitesAwaitingContractsError || 
              !!newWorkOrdersError || !!locationsError
  }
}
