
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Expand, Minimize } from 'lucide-react'
import MapContainer from '@/components/Map/MapContainer'
import { useGoogleMaps } from '@/components/Map/useGoogleMaps'
import { MapLocation } from '@/components/Map/types'

interface DashboardMapProps {
  locations: MapLocation[]
}

const DashboardMap: React.FC<DashboardMapProps> = ({ locations = [] }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { isLoading, isError, googleMapsLoaded } = useGoogleMaps()

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Card className={`relative ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <span>Service Locations Map</span>
            <span className="text-sm font-normal text-muted-foreground">
              ({locations.length} active locations)
            </span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Expand className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && (
          <div className="flex items-center justify-center h-[300px] bg-muted/20">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center h-[300px] bg-muted/20">
            <div className="text-center p-4">
              <p className="text-muted-foreground mb-2">
                Could not load the map. Please check your internet connection.
              </p>
              <Button size="sm" variant="outline">
                Retry
              </Button>
            </div>
          </div>
        )}

        {googleMapsLoaded && !isError && (
          <MapContainer locations={locations} isFullscreen={isFullscreen} />
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardMap
