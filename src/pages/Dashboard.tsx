import { Activity, Building2, Calendar, DollarSign, Users } from 'lucide-react'
import StatCard from '@/components/Dashboard/StatCard'
import TasksList from '@/components/Dashboard/TasksList'
import UpcomingContracts from '@/components/Dashboard/UpcomingContracts'
import DashboardMap from '@/components/Dashboard/DashboardMap'

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Contracts"
          value="28"
          icon={Activity}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Clients"
          value="143"
          icon={Users}
          trend={{ value: 4, isPositive: true }}
        />
        <StatCard
          title="Cleaning Locations"
          value="56"
          icon={Building2}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Monthly Revenue"
          value="$84,521"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TasksList />
        <UpcomingContracts />
      </div>

      <DashboardMap />
    </div>
  )
}

export default Dashboard
