
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSiteList } from '@/hooks/operations/useSiteList'
import SitesTable from '@/components/operations/site/SitesTable'
import DataPagination from '@/components/common/DataPagination'
import SiteListHeader from '@/components/operations/site/SiteListHeader'
import SiteListFilters from '@/components/operations/site/SiteListFilters'
import SiteBulkActions from '@/components/operations/site/SiteBulkActions'
import SiteTestingPanel from '@/components/operations/site/SiteTestingPanel'

const PAGE_SIZE = 10

const SiteList = () => {
  const navigate = useNavigate()
  const [showTestPanel, setShowTestPanel] = useState(false)
  
  const {
    sites,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedSites,
    currentPage,
    totalPages,
    handleSiteSelection,
    handleSelectAll,
    handleRefresh,
    handlePageChange,
  } = useSiteList({ pageSize: PAGE_SIZE })

  const handleCreateSite = () => {
    navigate('/operations/sites/create')
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <SiteListHeader 
        onRefresh={handleRefresh} 
        onCreateSite={handleCreateSite} 
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Sites</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading...' : `${sites.length} sites found`}
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <SiteListFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
              
              {selectedSites.length > 0 && (
                <SiteBulkActions 
                  selectedSites={selectedSites} 
                  sites={sites} 
                />
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
          
          <SiteTestingPanel 
            showTestPanel={showTestPanel} 
            setShowTestPanel={setShowTestPanel} 
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default SiteList
