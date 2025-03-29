
import React from 'react'
import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  let className = '';

  switch (status) {
    case 'Active':
      variant = 'default';
      className = 'bg-green-500 hover:bg-green-600';
      break;
    case 'Onboarding':
      variant = 'secondary';
      className = 'bg-blue-500 hover:bg-blue-600 text-white';
      break;
    case 'Terminated':
      variant = 'destructive';
      break;
    default:
      variant = 'outline';
  }

  return <Badge variant={variant} className={className}>{status}</Badge>
}

export default StatusBadge
