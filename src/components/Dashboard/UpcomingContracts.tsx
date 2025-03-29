import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Contract {
  id: string
  client: string
  location: string
  startDate: string
  contractValue: string
  status: 'pending' | 'active' | 'completed' | 'renewal'
}

const contracts: Contract[] = [
  {
    id: '1',
    client: 'Acme Corporation',
    location: 'Downtown Office Tower',
    startDate: 'Aug 15, 2023',
    contractValue: '$12,500',
    status: 'active',
  },
  {
    id: '2',
    client: 'Global Tech Industries',
    location: 'Tech Park Campus',
    startDate: 'Sep 1, 2023',
    contractValue: '$8,750',
    status: 'pending',
  },
  {
    id: '3',
    client: 'City Financial Services',
    location: 'Multiple Branches',
    startDate: 'Jul 20, 2023',
    contractValue: '$24,000',
    status: 'renewal',
  },
  {
    id: '4',
    client: 'Omega Healthcare',
    location: 'Medical Center Building',
    startDate: 'Aug 5, 2023',
    contractValue: '$15,200',
    status: 'active',
  },
]

const UpcomingContracts = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      case 'renewal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Upcoming Contracts
        </h3>
        <Button variant="outline" size="sm" className="text-sm">
          View All
        </Button>
      </div>

      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {contracts.map((contract) => (
            <li
              key={contract.id}
              className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {contract.client}
                    </p>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                        getStatusBadge(contract.status),
                      )}
                    >
                      {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <p>📍 {contract.location}</p>
                    <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                    <p>Starting: {contract.startDate}</p>
                    <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                    <p>{contract.contractValue}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="ml-2">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UpcomingContracts
