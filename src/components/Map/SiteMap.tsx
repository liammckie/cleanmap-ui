
import React, { useEffect, useRef } from 'react'
import { loadGoogleMapsScript } from '@/utils/googleMaps'
import { useGoogleMaps } from '@/components/Map/useGoogleMaps'
import { useToast } from '@/hooks/use-toast'
import { MapLocation, MapProps } from './types'

const SiteMap: React.FC<MapProps> = ({ locations = [], isFullscreen = false }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const { isLoading, isError, googleMapsLoaded } = useGoogleMaps()
  const { toast } = useToast()
  
  useEffect(() => {
    const initMap = async () => {
      if (!googleMapsLoaded || !mapContainer.current || locations.length === 0) return
      
      try {
        // Initialize the map
        const map = new google.maps.Map(mapContainer.current, {
          center: { lat: locations[0].lat, lng: locations[0].lng },
          zoom: locations.length === 1 ? 15 : 10,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        })
        
        mapInstance.current = map
        
        // Add markers for each location
        locations.forEach((location) => {
          // Create marker
          const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map,
            title: location.name,
            animation: google.maps.Animation.DROP,
          })
          
          // Create info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold text-base">${location.name}</h3>
                <p class="text-sm">${location.address}</p>
                <p class="text-sm">${location.city}</p>
                ${location.clientName ? `<p class="text-sm text-gray-500 mt-1">Client: ${location.clientName}</p>` : ''}
              </div>
            `,
          })
          
          // Add click event to open info window
          marker.addListener('click', () => {
            infoWindow.open(map, marker)
          })
        })
        
        // If multiple locations, fit bounds to show all markers
        if (locations.length > 1) {
          const bounds = new google.maps.LatLngBounds()
          locations.forEach((location) => {
            bounds.extend({ lat: location.lat, lng: location.lng })
          })
          map.fitBounds(bounds)
        }
      } catch (error) {
        console.error('Error initializing map:', error)
        toast({
          title: 'Map Error',
          description: 'Failed to initialize the map. Please try again.',
          variant: 'destructive',
        })
      }
    }
    
    initMap()
  }, [googleMapsLoaded, locations, toast])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }
  
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <div className="text-center">
          <p className="text-destructive font-medium">Failed to load map</p>
          <p className="text-muted-foreground text-sm mt-1">Please refresh and try again</p>
        </div>
      </div>
    )
  }
  
  return (
    <div 
      ref={mapContainer} 
      className={`w-full ${isFullscreen ? 'h-screen' : 'h-full'} rounded-md overflow-hidden`}
    ></div>
  )
}

export default SiteMap
