
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { Link } from 'react-router-dom'

export interface Contract {
  id: string
  contract_number: string
  client_id: string
  start_date: string
  end_date: string
  status: string
  base_fee: number
  clients?: {
    company_name: string
  }
}

interface UpcomingContractsProps {
  contracts: Contract[]
}

const UpcomingContracts: React.FC<UpcomingContractsProps> = ({ contracts }) => {
  const formatExpiryDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return 'Invalid date'
    }
  }

  const getDaysRemaining = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return differenceInDays(date, new Date())
    } catch (error) {
      return 0
    }
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contracts Expiring Soon</CardTitle>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No contracts expiring in the next 30 days</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => {
              const daysRemaining = getDaysRemaining(contract.end_date)
              const isUrgent = daysRemaining <= 7
              
              return (
                <div
                  key={contract.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">
                      <Link to={`/operations/contracts/${contract.id}`} className="hover:text-brand-blue">
                        {contract.contract_number}
                      </Link>
                    </h3>
                    <div className="text-sm font-medium">
                      {formatCurrency(contract.base_fee)}
                    </div>
                  </div>
                  
                  <div className="text-sm mb-2">
                    {contract.clients?.company_name || 'Unknown Client'}
                  </div>
                  
                  <div className={`text-xs ${isUrgent ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                    Expires {formatExpiryDate(contract.end_date)}
                    {isUrgent && ' - Requires attention!'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UpcomingContracts
