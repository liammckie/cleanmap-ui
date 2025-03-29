
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

interface RevenueData {
  name: string
  revenue: number
}

interface RevenueChartProps {
  data: RevenueData[]
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data = [] }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    })
  }

  const calculatePercentChange = () => {
    if (data.length < 2) return 0
    const current = data[data.length - 1].revenue
    const previous = data[data.length - 2].revenue
    return ((current - previous) / previous) * 100
  }

  const percentChange = calculatePercentChange()
  const isPositive = percentChange >= 0

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-start justify-between">
          <div>
            <div className="text-sm font-normal text-muted-foreground">Revenue Trend</div>
            <div className="text-2xl font-bold">
              {data.length > 0 ? formatCurrency(data[data.length - 1].revenue) : '$0'}
            </div>
          </div>
          <div className={`text-sm px-2 py-1 rounded-full ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {isPositive ? '+' : ''}{percentChange.toFixed(1)}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] w-full">
        <ChartContainer 
          config={{
            revenue: { theme: { light: 'hsla(215, 100%, 50%, 0.5)', dark: 'hsla(215, 100%, 50%, 0.5)' } }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                tickFormatter={(value) => `$${value/1000}k`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                width={40}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default RevenueChart
