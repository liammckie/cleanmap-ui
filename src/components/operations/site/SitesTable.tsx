
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table'
import { MapPin, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Site } from '@/schema/operations'

interface SitesTableProps {
  sites: Site[]
  isLoading: boolean
  error?: Error | null
}

const SitesTable: React.FC<SitesTableProps> = ({ sites, isLoading, error }) => {
  const navigate = useNavigate()

  const handleRowClick = (id: string) => {
    navigate(`/operations/sites/${id}`)
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load sites data. Please try again.
      </div>
    )
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading site data...</div>
  }

  if (sites?.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No sites found. Try adjusting your search or filters.
      </div>
    )
  }

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Site Name</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sites.map((site) => (
          <TableRow 
            key={site.id} 
            className="cursor-pointer hover:bg-muted"
            onClick={() => handleRowClick(site.id)}
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {site.site_name}
              </div>
              {site.region && (
                <div className="text-xs text-muted-foreground">Region: {site.region}</div>
              )}
            </TableCell>
            <TableCell>{site.client?.company_name || 'N/A'}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div>{site.address_street}</div>
                  <div className="text-xs text-muted-foreground">
                    {site.address_city}, {site.address_state} {site.address_postcode}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{site.site_type}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(site.status)}>
                {site.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default SitesTable
