
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import SiteMap from '@/components/Map/SiteMap'
import { Site } from '@/schema/operations'
import { MapLocation } from '@/components/Map/types'

interface SiteLocationProps {
  site: Site
}

const SiteLocation: React.FC<SiteLocationProps> = ({ site }) => {
  const coordinates = site?.coordinates
    ? site.coordinates.split(',').map(Number)
    : [0, 0]
  
  const siteLocation: MapLocation = {
    id: site?.id || '',
    name: site?.site_name || '',
    lat: coordinates[0] || 0,
    lng: coordinates[1] || 0,
    count: 1,
    address: site?.address_street || '',
    city: site?.address_city || '',
    clientName: site?.client?.company_name || ''
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Location</CardTitle>
        <CardDescription>
          Map view of this service location
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[350px]">
        <SiteMap locations={[siteLocation]} isFullscreen={false} />
      </CardContent>
    </Card>
  )
}

export default SiteLocation
