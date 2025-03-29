
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Site } from '@/schema/operations'

interface SiteHeaderProps {
  site: Site
  isLoading: boolean
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ site, isLoading }) => {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Loading site...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Button variant="ghost" className="mr-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{site?.site_name || 'Site'}</h1>
          <p className="text-muted-foreground flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {site?.address_city || 'City'}, {site?.address_state}
            {site?.region && <span className="ml-2">• Region: {site?.region}</span>}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(`/operations/sites/edit/${site.id}`)}>
          Edit Site
        </Button>
        <Button onClick={() => navigate(`/operations/work-orders/create?siteId=${site.id}`)}>
          Create Work Order
        </Button>
      </div>
    </div>
  )
}

export default SiteHeader
