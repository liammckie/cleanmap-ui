import React from 'react'
import { Badge } from '@/components/ui/badge'

interface ContractStatusBadgeProps {
  status: string
  underNegotiation?: boolean
}

const ContractStatusBadge: React.FC<ContractStatusBadgeProps> = ({ status, underNegotiation }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div>
      <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
      {underNegotiation && <div className="text-xs text-blue-600 mt-1">Under Negotiation</div>}
    </div>
  )
}

export default ContractStatusBadge
