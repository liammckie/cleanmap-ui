
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MapContainer from '@/components/Map/MapContainer'
import type { MapLocation } from '@/components/Map/types'

interface DashboardMapProps {
  locations: MapLocation[]
}

const DashboardMap: React.FC<DashboardMapProps> = ({ locations = [] }) => {
  return (
    <Card className="h-[500px]">
      <CardHeader className="pb-0">
        <CardTitle>Service Locations</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        {locations.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No active service locations found</p>
          </div>
        ) : (
          <MapContainer locations={locations} />
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardMap
