
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { BuildingIcon, Wrench } from 'lucide-react'

interface StatusBadgeProps {
  status: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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

  return (
    <Badge className={`mr-2 ${getStatusColor(status)}`}>
      {status}
    </Badge>
  )
}

interface ServiceTypeBadgeProps {
  type: string
}

export const ServiceTypeBadge: React.FC<ServiceTypeBadgeProps> = ({ type }) => {
  const getIconAndColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'internal':
        return {
          icon: <BuildingIcon className="h-3 w-3 mr-1" />,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        }
      case 'contractor':
        return {
          icon: <Wrench className="h-3 w-3 mr-1" />,
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        }
      default:
        return {
          icon: null,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }
  }

  const { icon, className } = getIconAndColor(type)

  return (
    <Badge className={className} variant="outline">
      <span className="flex items-center">
        {icon}
        {type}
      </span>
    </Badge>
  )
}
