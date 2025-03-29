
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { fetchSites } from '@/services/sites'
import { fetchSiteTypes, fetchSiteRegions, fetchSiteStatuses } from '@/services/sites/siteFilterService'
import { 
  Search, 
  FilterX, 
  PlusCircle, 
  DollarSign, 
  Calendar, 
  MoreHorizontal, 
  Building,
  MapPin,
  Phone,
  Mail,
  FileDown,
  FileText,
  Map
} from 'lucide-react'
import { format } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { parseCoordinatesFromStorage } from '@/utils/googleMaps'
import type { Site } from '@/schema/operations'
import SiteMap from '@/components/Map/SiteMap'

const StatusBadge = ({ status }: { status: string }) => {
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

const ServiceTypeBadge = ({ type }: { type: string }) => {
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

const SiteListPage: React.FC = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [isMapViewOpen, setIsMapViewOpen] = useState(false)
  const [filters, setFilters] = useState<{
    clientId: string
    status: string
    region: string
    siteType: string
  }>({
    clientId: '',
    status: '',
    region: '',
    siteType: '',
  })

  // Fetch sites data
  const {
    data: sites,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sites', searchTerm, filters],
    queryFn: () => fetchSites(searchTerm, filters),
    meta: {
      onError: (err: Error) => {
        console.error('Failed to fetch sites:', err)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load sites data. Please try again.',
        })
      },
    },
  })

  // Fetch filter options
  const { data: siteTypes = [] } = useQuery({
    queryKey: ['siteTypes'],
    queryFn: fetchSiteTypes,
  })

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: fetchSiteRegions,
  })

  const { data: statuses = [] } = useQuery({
    queryKey: ['siteStatuses'],
    queryFn: fetchSiteStatuses,
  })

  const clearFilters = () => {
    setFilters({
      clientId: '',
      status: '',
      region: '',
      siteType: '',
    })
    setSearchTerm('')
  }

  const handleViewSite = (siteId: string) => {
    navigate(`/operations/sites/${siteId}`)
  }

  const handleEditSite = (siteId: string) => {
    navigate(`/operations/sites/edit/${siteId}`)
  }

  const handleCreateWorkOrder = (siteId: string) => {
    navigate(`/operations/work-orders/create?siteId=${siteId}`)
  }

  const handleExportSites = () => {
    // Export the sites data as CSV
    if (!sites || sites.length === 0) return

    const headers = [
      'Site Name',
      'Client',
      'Address',
      'City',
      'State',
      'Postcode',
      'Type',
      'Status',
      'Service Start',
      'Region'
    ].join(',')

    const rows = sites.map((site: any) => [
      `"${site.site_name}"`,
      `"${site.clients?.company_name || ''}"`,
      `"${site.address_street}"`,
      `"${site.address_city}"`,
      `"${site.address_state}"`,
      `"${site.address_postcode}"`,
      `"${site.site_type}"`,
      `"${site.status}"`,
      site.service_start_date ? `"${format(new Date(site.service_start_date), 'yyyy-MM-dd')}"` : '',
      `"${site.region || ''}"`
    ].join(','))

    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sites-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: 'Export Successful',
      description: `${sites.length} sites exported to CSV.`,
    })
  }

  // Transform site data for map display
  const mapLocations = sites?.map((site: any) => {
    let lat = 0
    let lng = 0

    if (site.coordinates) {
      const coords = parseCoordinatesFromStorage(site.coordinates)
      if (coords) {
        lat = coords.lat
        lng = coords.lng
      }
    }

    return {
      id: site.id,
      name: site.site_name,
      lat,
      lng,
      count: 1,
      address: site.address_street,
      city: site.address_city,
      clientName: site.clients?.company_name
    }
  }).filter((location: any) => location.lat !== 0 && location.lng !== 0) || []

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sites</h1>
          <p className="text-muted-foreground">Manage your service locations</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2" asChild>
            <Link to="/operations/sites/create">
              <PlusCircle className="h-4 w-4" />
              Add Site
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link to="/operations/clients/create">
              <PlusCircle className="h-4 w-4" />
              Add Client with Sites
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsMapViewOpen(true)}>
                <Map className="h-4 w-4 mr-2" />
                View Map
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportSites}>
                <FileDown className="h-4 w-4 mr-2" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate('/operations/sites/import')}
                disabled
              >
                <FileText className="h-4 w-4 mr-2" />
                Import Sites
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find sites by name, location, or other criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {statuses.map((status: string) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.region}
              onValueChange={(value) => setFilters({ ...filters, region: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Regions</SelectItem>
                {regions.map((region: string) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.siteType}
              onValueChange={(value) => setFilters({ ...filters, siteType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Site Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {siteTypes.map((type: string) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="lg:col-span-5 flex justify-end">
              <Button variant="outline" className="flex items-center gap-2" onClick={clearFilters}>
                <FilterX className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Site Directory</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${sites?.length || 0} sites found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-4 text-red-500">
              Failed to load sites data. Please try again.
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">Loading site data...</div>
          ) : sites?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No sites found. Try adjusting your search or filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Info</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Service Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites?.map((site: any) => (
                  <TableRow key={site.id} className="hover:bg-muted">
                    <TableCell className="cursor-pointer" onClick={() => handleViewSite(site.id)}>
                      <div className="flex flex-col">
                        <span className="font-medium">{site.site_name}</span>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Building className="h-3 w-3 mr-1" />
                          <span>{site.site_type}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>
                            {site.address_city}, {site.address_state}
                          </span>
                        </div>
                        {site.region && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Region: {site.region}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span>{site.clients?.company_name}</span>
                    </TableCell>
                    
                    <TableCell>
                      {site.primary_contact ? (
                        <div className="flex flex-col">
                          <span>{site.primary_contact}</span>
                          {site.contact_phone && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              <span>{site.contact_phone}</span>
                            </div>
                          )}
                          {site.contact_email && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              <span>{site.contact_email}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No contact info</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="mb-1">
                          <ServiceTypeBadge type={site.service_type || 'Internal'} />
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {site.service_frequency ? (
                            <span>
                              {site.service_frequency.charAt(0).toUpperCase() + 
                                site.service_frequency.slice(1)} service
                            </span>
                          ) : (
                            <span>Service schedule not set</span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>
                            {site.service_start_date
                              ? format(new Date(site.service_start_date), 'PP')
                              : 'No start date'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <StatusBadge status={site.status} />
                    </TableCell>
                    
                    <TableCell>
                      {site.price_per_week ? (
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>${site.price_per_week}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            /{site.price_frequency || 'week'}
                          </span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewSite(site.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditSite(site.id)}>
                            Edit Site
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCreateWorkOrder(site.id)}>
                            Create Work Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Map View Dialog */}
      <Dialog open={isMapViewOpen} onOpenChange={setIsMapViewOpen}>
        <DialogContent className="max-w-5xl h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Sites Map View</DialogTitle>
            <DialogDescription>
              Geographic view of all service locations
            </DialogDescription>
          </DialogHeader>
          <div className="h-full p-6 pt-0">
            <div className="h-[calc(80vh-120px)]">
              {mapLocations.length > 0 ? (
                <SiteMap locations={mapLocations} isFullscreen={false} />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
                  <div className="text-center p-6">
                    <Map className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">No locations to display</h3>
                    <p className="text-muted-foreground mt-1">
                      No sites with valid coordinates were found. Try adjusting your filters.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SiteListPage
