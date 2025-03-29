
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
import { Checkbox } from '@/components/ui/checkbox'
import type { Site } from '@/schema/operations/site.schema'

interface SitesTableProps {
  sites: Site[]
  isLoading: boolean
  error?: Error | null
  selectedSites?: string[]
  onSelectSite?: (siteId: string, isSelected: boolean) => void
  onSelectAll?: (isSelected: boolean) => void
}

const SitesTable: React.FC<SitesTableProps> = ({ 
  sites, 
  isLoading, 
  error,
  selectedSites = [],
  onSelectSite,
  onSelectAll
}) => {
  const navigate = useNavigate()
  const selectionEnabled = !!onSelectSite && !!onSelectAll

  const handleRowClick = (id: string, isCheckbox: boolean) => {
    // Don't navigate if clicking on the checkbox
    if (isCheckbox) return
    navigate(`/operations/sites/${id}`)
  }

  const handleSelectSite = (e: React.ChangeEvent<HTMLInputElement>, siteId: string) => {
    e.stopPropagation()
    if (onSelectSite) {
      onSelectSite(siteId, e.target.checked)
    }
  }
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (onSelectAll) {
      onSelectAll(e.target.checked)
    }
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load sites data. Please try again.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="w-full h-12 bg-muted/40 animate-pulse rounded-md" />
        ))}
      </div>
    )
  }

  if (sites?.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {selectionEnabled && (
              <TableHead className="w-[50px]">
                <Checkbox 
                  onCheckedChange={(checked) => {
                    if (onSelectAll) onSelectAll(!!checked)
                  }}
                  checked={sites.length > 0 && selectedSites.length === sites.length}
                  indeterminate={selectedSites.length > 0 && selectedSites.length < sites.length}
                />
              </TableHead>
            )}
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
              onClick={() => handleRowClick(site.id, false)}
            >
              {selectionEnabled && (
                <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    checked={selectedSites.includes(site.id)}
                    onCheckedChange={(checked) => {
                      if (onSelectSite) onSelectSite(site.id, !!checked)
                    }}
                  />
                </TableCell>
              )}
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
    </div>
  )
}

export default SitesTable
