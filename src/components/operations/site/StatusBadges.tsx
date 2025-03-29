
import React from 'react'
import { Badge } from '@/components/ui/badge'

export const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'pending launch':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
}

export const ServiceTypeBadge = ({ type }: { type: string }) => {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'internal':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'contractor':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return <Badge className={`${getTypeColor(type)}`}>{type}</Badge>
}
