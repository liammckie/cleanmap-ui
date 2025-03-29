
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
  Mail
} from 'lucide-react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Site } from '@/schema/operations'

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
  const [searchTerm, setSearchTerm] = useState('')
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
    // Future implementation: navigate to site detail page
    console.log('View site details:', siteId)
    // Will be implemented in a future task to show site details
  }

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
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find sites by name, location, or other criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2" onClick={clearFilters}>
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
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
                {sites?.map((site) => (
                  <TableRow key={site.id} className="hover:bg-muted">
                    <TableCell>
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
                      <span>{site.client?.company_name}</span>
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
                      {site.price_per_service ? (
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>${site.price_per_service}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            /{site.price_frequency || 'service'}
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
                          <DropdownMenuItem>Edit Site</DropdownMenuItem>
                          <DropdownMenuItem>Add Contract</DropdownMenuItem>
                          <DropdownMenuItem>Create Work Order</DropdownMenuItem>
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
    </div>
  )
}

export default SiteListPage
