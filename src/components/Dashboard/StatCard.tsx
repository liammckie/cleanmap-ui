
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowDown, ArrowUp } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: number
  changeLabel?: string
  isCurrency?: boolean
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change = 0,
  changeLabel = 'from last period',
  isCurrency = false,
}) => {
  const isPositive = change > 0
  const isNegative = change < 0
  const absChange = Math.abs(change)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="p-2 rounded-full bg-muted/30">{icon}</div>
        </div>
        
        {change !== 0 && (
          <div className="mt-4 flex items-center text-sm">
            <span
              className={`inline-flex items-center mr-1 ${
                isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {isPositive ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : isNegative ? (
                <ArrowDown className="w-3 h-3 mr-1" />
              ) : null}
              {absChange.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard
