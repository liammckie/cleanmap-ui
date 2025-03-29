
import React from 'react'
import { ChevronDown, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Site } from '@/schema/operations/site.schema'

interface SiteBulkActionsProps {
  selectedSites: string[]
  sites: Site[]
}

const SiteBulkActions: React.FC<SiteBulkActionsProps> = ({ selectedSites, sites }) => {
  const { toast } = useToast()
  
  const handleExportSelected = () => {
    const selectedSitesData = sites.filter(site => selectedSites.includes(site.id))
    
    if (selectedSitesData.length === 0) {
      toast({
        description: 'No sites selected for export',
      })
      return
    }
    
    // Create CSV content
    const headers = ['Site Name', 'Type', 'Client', 'Address', 'City', 'State', 'Postcode', 'Status']
    const rows = selectedSitesData.map(site => [
      site.site_name,
      site.site_type,
      site.client?.company_name || 'N/A',
      site.address_street,
      site.address_city,
      site.address_state,
      site.address_postcode,
      site.status
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `sites-export-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: 'Export successful',
      description: `Exported ${selectedSitesData.length} sites to CSV`,
    })
  }

  if (selectedSites.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Actions
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className="flex items-center gap-2"
          onClick={handleExportSelected}
        >
          <Download className="h-4 w-4" />
          Export {selectedSites.length} selected
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive"
          onClick={() => {}}
        >
          Clear selection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SiteBulkActions
