
import React from 'react'
import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let variant:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'

  switch (status) {
    case 'Active':
      variant = 'default'
      break
    case 'Onboarding':
      variant = 'secondary'
      break
    case 'Terminated':
      variant = 'destructive'
      break
    default:
      variant = 'outline'
  }

  return <Badge variant={variant}>{status}</Badge>
}

export default StatusBadge
