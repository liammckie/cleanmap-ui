
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Users, Clock, Star } from 'lucide-react'

interface KpiMetricsProps {
  taskCompletionRate: number
  clientRetentionRate: number
  staffUtilization: number
  customerSatisfaction: number
}

const KpiMetrics: React.FC<KpiMetricsProps> = ({
  taskCompletionRate = 0,
  clientRetentionRate = 0,
  staffUtilization = 0,
  customerSatisfaction = 0
}) => {
  // Helper to get color based on percentage value
  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }

  // Format satisfaction rating
  const formatRating = (rating: number) => {
    return rating.toFixed(1) + ' / 5.0'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance KPIs</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Task Completion Rate</span>
            </div>
            <span className="text-sm font-medium">{taskCompletionRate}%</span>
          </div>
          <Progress value={taskCompletionRate} className={getProgressColor(taskCompletionRate)} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Client Retention</span>
            </div>
            <span className="text-sm font-medium">{clientRetentionRate}%</span>
          </div>
          <Progress value={clientRetentionRate} className={getProgressColor(clientRetentionRate)} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Staff Utilization</span>
            </div>
            <span className="text-sm font-medium">{staffUtilization}%</span>
          </div>
          <Progress value={staffUtilization} className={getProgressColor(staffUtilization)} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Customer Satisfaction</span>
            </div>
            <span className="text-sm font-medium">{formatRating(customerSatisfaction)}</span>
          </div>
          <Progress 
            value={(customerSatisfaction / 5) * 100} 
            className={getProgressColor((customerSatisfaction / 5) * 100)} 
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default KpiMetrics
