
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select'
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ChevronDown, 
  Download, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { fetchSites, fetchSitesCount } from '@/services/sites'
import SitesTable from '@/components/operations/site/SitesTable'
import DataPagination from '@/components/common/DataPagination'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSiteTesting } from '@/hooks/testing/useSiteTesting'

const PAGE_SIZE = 10

const SiteList = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedSites, setSelectedSites] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showTestPanel, setShowTestPanel] = useState(false)
  
  const { 
    isRunningTests, 
    testErrors, 
    runFormValidationTests, 
    testSiteRetrieval 
  } = useSiteTesting()

  // Calculate pagination offset
  const offset = (currentPage - 1) * PAGE_SIZE

  // Fetch sites with filtering and pagination
  const {
    data: sites = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sites', searchTerm, statusFilter, currentPage, PAGE_SIZE],
    queryFn: () => fetchSites({
      search: searchTerm,
      status: statusFilter || undefined,
      limit: PAGE_SIZE,
      offset,
      sortBy: 'site_name',
      sortOrder: 'asc'
    }),
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

  // Fetch total count for pagination
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['sites-count', searchTerm, statusFilter],
    queryFn: () => fetchSitesCount({
      search: searchTerm,
      status: statusFilter || undefined,
    }),
  })

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  // Reset selected sites when data changes
  useEffect(() => {
    setSelectedSites([])
  }, [sites])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCreateSite = () => {
    navigate('/operations/sites/create')
  }

  const handleSiteSelection = (siteId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedSites(prev => [...prev, siteId])
    } else {
      setSelectedSites(prev => prev.filter(id => id !== siteId))
    }
  }

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedSites(sites.map(site => site.id))
    } else {
      setSelectedSites([])
    }
  }

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

  const handleRefresh = () => {
    refetch()
    toast({
      description: 'Refreshing site data...',
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sites</h1>
          <p className="text-muted-foreground">Manage service locations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="icon" title="Refresh data">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button className="flex items-center gap-2" onClick={handleCreateSite}>
            <PlusCircle className="h-4 w-4" />
            New Site
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Sites</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading...' : `${totalCount} sites found`}
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10 w-full sm:w-[250px]"
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending Launch">Pending Launch</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              
              {selectedSites.length > 0 && (
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
                      onClick={() => setSelectedSites([])}
                    >
                      Clear selection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SitesTable 
            sites={sites} 
            isLoading={isLoading} 
            error={error as Error}
            selectedSites={selectedSites}
            onSelectSite={handleSiteSelection}
            onSelectAll={handleSelectAll}
          />
          
          {!isLoading && sites.length > 0 && (
            <DataPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          
          {/* For development and testing: Add a way to run the tests */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-8">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowTestPanel(!showTestPanel)}
                className="flex items-center gap-2"
              >
                {showTestPanel ? 'Hide' : 'Show'} Testing Panel
              </Button>
              
              {showTestPanel && (
                <div className="mt-4 p-4 border rounded-md bg-muted/20">
                  <h3 className="font-medium mb-2">Sites Testing Panel</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Run tests to validate site functionality
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={runFormValidationTests}
                      disabled={isRunningTests}
                    >
                      Test Form Validation
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={testSiteRetrieval}
                      disabled={isRunningTests}
                    >
                      Test Data Retrieval
                    </Button>
                  </div>
                  
                  {testErrors.length > 0 && (
                    <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded text-sm">
                      <div className="flex items-center gap-2 font-medium text-destructive mb-1">
                        <AlertTriangle className="h-4 w-4" />
                        Test Errors
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {testErrors.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SiteList
