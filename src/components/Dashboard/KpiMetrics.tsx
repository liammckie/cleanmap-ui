
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Users, Clock, Building } from 'lucide-react'

interface KpiMetricsProps {
  kpi: {
    taskCompletionRate: number
    clientRetentionRate: number
    employeeProductivity: number
    sitesSatisfactionRate: number
  }
}

const KpiMetrics: React.FC<KpiMetricsProps> = ({ kpi }) => {
  const metrics = [
    {
      label: 'Task Completion Rate',
      value: kpi.taskCompletionRate,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      color: 'bg-green-500',
    },
    {
      label: 'Client Retention',
      value: kpi.clientRetentionRate,
      icon: <Users className="h-4 w-4 text-blue-500" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Employee Productivity',
      value: kpi.employeeProductivity,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      color: 'bg-amber-500',
    },
    {
      label: 'Site Satisfaction',
      value: kpi.sitesSatisfactionRate,
      icon: <Building className="h-4 w-4 text-purple-500" />,
      color: 'bg-purple-500',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Performance Indicators</CardTitle>
        <CardDescription>Performance metrics tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {metric.icon}
                <span className="text-sm font-medium">{metric.label}</span>
              </div>
              <span className="text-sm font-medium">{metric.value}%</span>
            </div>
            <Progress value={metric.value} className={`h-2 ${metric.color}`} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default KpiMetrics
