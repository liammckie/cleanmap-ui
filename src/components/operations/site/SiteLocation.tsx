
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Map } from 'lucide-react'
import SiteMap from '@/components/Map/SiteMap'
import { Site } from '@/schema/operations/site.schema'
import { MapLocation } from '@/components/Map/types'
import { parseCoordinatesFromStorage } from '@/utils/googleMaps'

interface SiteLocationProps {
  site: Site
}

const SiteLocation: React.FC<SiteLocationProps> = ({ site }) => {
  const [hasMapError, setHasMapError] = useState(false)
  
  // Parse coordinates safely
  const parseCoordinates = (): { lat: number; lng: number } | null => {
    if (!site?.coordinates) return null
    
    try {
      // First try the utility function
      const parsed = parseCoordinatesFromStorage(site.coordinates)
      if (parsed) return parsed
      
      // Fallback to manual parsing
      const [lat, lng] = site.coordinates.split(',').map(Number)
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
    } catch (error) {
      console.error('Error parsing coordinates:', error)
    }
    
    return null
  }
  
  const coordinates = parseCoordinates()
  
  // If coordinates are invalid, show an error state
  if (!coordinates) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Location</CardTitle>
          <CardDescription>
            Map view of this service location
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4 h-[300px] text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground/60" />
          <div>
            <h3 className="font-medium text-lg">No location data available</h3>
            <p className="text-muted-foreground mb-4">
              This site does not have valid coordinates stored.
            </p>
            <Button variant="outline">
              <Map className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const siteLocation: MapLocation = {
    id: site?.id || '',
    name: site?.site_name || '',
    lat: coordinates.lat,
    lng: coordinates.lng,
    count: 1,
    address: site?.address_street || '',
    city: site?.address_city || '',
    clientName: site?.client?.company_name || ''
  }

  const handleMapError = () => {
    setHasMapError(true)
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
        {hasMapError ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground/60 mb-4" />
            <h3 className="font-medium text-lg">Map could not be loaded</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the map for this location.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setHasMapError(false)}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <SiteMap 
            locations={[siteLocation]} 
            isFullscreen={false}
            onError={handleMapError}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default SiteLocation
