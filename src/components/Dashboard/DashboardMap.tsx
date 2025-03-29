
import React from 'react'
import { MapLocation } from '@/components/Map/types'
import MapContainer from '@/components/Map/MapContainer'

export interface DashboardMapProps {
  locations: MapLocation[]
}

const DashboardMap: React.FC<DashboardMapProps> = ({ locations = [] }) => {
  if (!locations || locations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No location data available
      </div>
    )
  }

  return <MapContainer locations={locations} isFullscreen={false} />
}

export default DashboardMap
