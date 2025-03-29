
import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchSiteById } from '@/services/sites/siteCoreService'
import { useToast } from '@/hooks/use-toast'

// Import refactored components
import SiteHeader from '@/components/operations/site/SiteHeader'
import SiteLoadingSkeleton from '@/components/operations/site/SiteLoadingSkeleton'
import SiteErrorState from '@/components/operations/site/SiteErrorState'
import DetailTabs from '@/components/operations/site/DetailTabs'

const SiteDetailsPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>()
  const { toast } = useToast()

  const {
    data: site,
    isLoading,
    error
  } = useQuery({
    queryKey: ['site', siteId],
    queryFn: () => fetchSiteById(siteId as string),
    enabled: !!siteId,
    meta: {
      onError: (err: Error) => {
        console.error('Failed to fetch site:', err)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load site data. Please try again.'
        })
      }
    }
  })

  if (isLoading) {
    return <SiteLoadingSkeleton />
  }

  if (error || !site) {
    return <SiteErrorState error={error} />
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <SiteHeader site={site} isLoading={isLoading} />
      <DetailTabs site={site} />
    </div>
  )
}

export default SiteDetailsPage
