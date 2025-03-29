
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
    | 'success'
    | 'warning'
    | null
    | undefined

  switch (status) {
    case 'Active':
      variant = 'success'
      break
    case 'Onboarding':
      variant = 'secondary'
      break
    case 'Terminated':
      variant = 'destructive'
      break
    default:
      variant = 'default'
  }

  return <Badge variant={variant}>{status}</Badge>
}

export default StatusBadge
