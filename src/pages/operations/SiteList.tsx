import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { fetchSites } from '@/services/sites'
import SitesTable from '@/components/operations/site/SitesTable'

const SiteList = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

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

  const handleCreateSite = () => {
    navigate('/operations/sites/create')
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sites</h1>
          <p className="text-muted-foreground">Manage service locations</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleCreateSite}>
          <PlusCircle className="h-4 w-4" />
          New Site
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Sites</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${sites?.length || 0} sites found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SitesTable sites={sites} isLoading={isLoading} error={error as Error} />
        </CardContent>
      </Card>
    </div>
  )
}

export default SiteList
