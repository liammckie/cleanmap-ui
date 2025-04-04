
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Search, FilterX } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { fetchSites } from '@/services/sites'
import { format } from 'date-fns'
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

const SitesPage = () => {
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
    data: sites = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sites'],
    queryFn: () => fetchSites(),
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

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sites</h1>
          <p className="text-muted-foreground">Manage your service locations</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Site
        </Button>
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
                  <TableHead>Site Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Service Start</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites?.map((site: any) => (
                  <TableRow key={site.id} className="cursor-pointer hover:bg-muted">
                    <TableCell className="font-medium">
                      {site.site_name}
                      {site.region && (
                        <div className="text-xs text-muted-foreground">Region: {site.region}</div>
                      )}
                    </TableCell>
                    <TableCell>{site.clients?.company_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{site.address_street}</div>
                        <div className="text-muted-foreground">
                          {site.address_city}, {site.address_state} {site.address_postcode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{site.site_type}</TableCell>
                    <TableCell>
                      <StatusBadge status={site.status} />
                    </TableCell>
                    <TableCell>
                      {site.service_start_date
                        ? format(new Date(site.service_start_date), 'PP')
                        : '-'}
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

export default SitesPage
