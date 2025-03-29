import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

const StatCard = ({ title, value, icon: Icon, trend, className }: StatCardProps) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg p-6 shadow-soft flex flex-col',
        'border border-gray-100 dark:border-gray-700 transition-all duration-300',
        'hover:shadow-glossy hover:border-gray-200 dark:hover:border-gray-600',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            {trend && (
              <span
                className={cn(
                  'ml-2 text-xs font-medium flex items-center',
                  trend.isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400',
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
        <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-900/20">
          <Icon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
        </div>
      </div>
    </div>
  )
}

export default StatCard
