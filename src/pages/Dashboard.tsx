
import React from 'react'
import { Activity, Users, Building2, DollarSign } from 'lucide-react'
import StatCard from '@/components/Dashboard/StatCard'
import TasksList from '@/components/Dashboard/TasksList'
import UpcomingContracts from '@/components/Dashboard/UpcomingContracts'
import DashboardMap from '@/components/Dashboard/DashboardMap'
import { useDashboardData } from '@/hooks/useDashboardData'
import { Skeleton } from '@/components/ui/skeleton'

const Dashboard = () => {
  const { 
    stats, 
    upcomingContracts, 
    pendingTasks, 
    mapLocations, 
    isLoading, 
    hasError 
  } = useDashboardData()

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    })
  }

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-white rounded-lg shadow-sm border">
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-10 w-24 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  // Show error state if data fetch failed
  if (hasError) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-8">
          <p className="font-medium">Error loading dashboard data</p>
          <p className="text-sm">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Contracts"
          value={stats.activeContracts}
          icon={<Activity className="h-8 w-8 text-blue-500" />}
          change={2.5}
          changeLabel="from last month"
        />
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={<Users className="h-8 w-8 text-green-500" />}
          change={4.1}
          changeLabel="new this month"
        />
        <StatCard
          title="Cleaning Locations"
          value={stats.cleaningLocations}
          icon={<Building2 className="h-8 w-8 text-purple-500" />}
          change={1.8}
          changeLabel="from last month"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={<DollarSign className="h-8 w-8 text-amber-500" />}
          change={stats.revenueChange}
          changeLabel="from last month"
          isCurrency
        />
      </div>

      {/* Tasks and Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TasksList tasks={pendingTasks || []} />
        <UpcomingContracts contracts={upcomingContracts || []} />
      </div>

      {/* Map */}
      <DashboardMap locations={mapLocations || []} />
    </div>
  )
}

export default Dashboard
