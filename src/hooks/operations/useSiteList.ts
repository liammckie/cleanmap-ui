
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { fetchSites, fetchSitesCount } from '@/services/sites'
import type { Site } from '@/schema/operations/site.schema'

interface UseSiteListProps {
  pageSize?: number
}

export function useSiteList({ pageSize = 10 }: UseSiteListProps = {}) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedSites, setSelectedSites] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  
  // Calculate pagination offset
  const offset = (currentPage - 1) * pageSize

  // Fetch sites with filtering and pagination
  const {
    data: sites = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sites', searchTerm, statusFilter, currentPage, pageSize],
    queryFn: () => fetchSites({
      search: searchTerm,
      status: statusFilter || undefined,
      limit: pageSize,
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
  const totalPages = Math.ceil(totalCount / pageSize)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  // Reset selected sites when data changes
  useEffect(() => {
    setSelectedSites([])
  }, [sites])

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

  const handleRefresh = () => {
    refetch()
    toast({
      description: 'Refreshing site data...',
    })
  }

  return {
    sites,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedSites,
    setSelectedSites,
    currentPage,
    totalPages,
    totalCount,
    handleSiteSelection,
    handleSelectAll,
    handleRefresh,
    handlePageChange: setCurrentPage,
  }
}
