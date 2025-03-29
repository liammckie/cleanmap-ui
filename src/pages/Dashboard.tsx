
import React from 'react'
import { Activity, Building2, DollarSign, Users, Clock, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDashboardData } from '@/hooks/useDashboardData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '@/components/Dashboard/StatCard'
import RevenueChart from '@/components/Dashboard/RevenueChart'
import KpiMetrics from '@/components/Dashboard/KpiMetrics'
import DashboardMap from '@/components/Dashboard/DashboardMap'
import UpcomingContracts from '@/components/Dashboard/UpcomingContracts'
import TasksList from '@/components/Dashboard/TasksList'
import { formatDate } from '@/utils/dateFormatters'
import { MapLocation } from '@/components/Map/types'

// Define the shape of task and contract data for the dashboard
interface DashboardTask {
  id: string
  title: string
  description: string
  status: 'In Progress' | 'Completed' | 'Scheduled' | 'Overdue' | 'Cancelled'
  priority: 'Low' | 'Medium' | 'High'
  due_date: string
  scheduled_start: string
  sites: {
    site_name: string
    client_id: string
    clients?: { company_name: string }
  }
}

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardData()
  const navigate = useNavigate()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-32">
              <CardContent className="pt-6">
                <div className="h-full w-full bg-muted/20 animate-pulse rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <h2 className="text-xl font-bold">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'An unexpected error occurred.'}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  // Transform task data to match expected shape
  const transformedTasks = data.pendingTasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    due_date: task.due_date,
    scheduled_start: task.scheduled_start || '',
    sites: {
      site_name: task.sites?.site_name || 'Unknown site',
      client_id: task.sites?.client_id || ''
    }
  }));

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Active Clients"
          value={data.activeClients}
          icon={<Users className="h-5 w-5" />}
          changeLabel="of total clients"
          change={data.totalClients > 0 ? (data.activeClients / data.totalClients) * 100 : 0}
          onClick={() => navigate('/operations/clients')}
        />

        <StatCard
          title="Cleaning Locations"
          value={data.cleaningLocations}
          icon={<Building2 className="h-5 w-5" />}
          change={data.sitesAwaitingContracts > 0 ? 5.2 : 0}
          changeLabel={`${data.sitesAwaitingContracts} awaiting contracts`}
          onClick={() => navigate('/operations/sites')}
        />

        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(data.monthlyRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          change={data.revenueChange}
          isCurrency={true}
          onClick={() => navigate('/operations/contracts')}
        />

        <StatCard
          title="Work Orders"
          value={data.newWorkOrders}
          icon={<Activity className="h-5 w-5" />}
          change={0}
          changeLabel="scheduled"
          onClick={() => navigate('/operations/work-orders')}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart data={data.revenueChartData} />
        </div>
        <div>
          <KpiMetrics kpi={data.kpi} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <TasksList 
          tasks={transformedTasks} 
        />
        
        <UpcomingContracts 
          contracts={data.upcomingContracts}
        />
      </div>

      {/* Create map locations array to match expected type */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Cleaning Locations</CardTitle>
            <CardDescription>Map of active service locations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px]">
              <DashboardMap locations={data.sites || []} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
