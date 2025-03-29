
/**
 * Map component types
 */

// Location data for a map marker
export interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  address: string
  city: string
  count?: number
  clientName?: string
  color?: string
}

// Props for map components
export interface MapProps {
  locations: MapLocation[]
  isFullscreen?: boolean
  centerLat?: number
  centerLng?: number
  defaultZoom?: number
  onMarkerClick?: (location: MapLocation) => void
}
