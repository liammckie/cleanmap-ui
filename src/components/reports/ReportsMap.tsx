import { useState, useEffect } from 'react'
import { useLocations } from '@/hooks/useLocations'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import LocationsMap from '@/components/Map/LocationsMap'
import { MapLocation } from '@/components/Map/types'

const ReportsMap = () => {
  const { data: locations, isLoading, error } = useLocations({ onlyActive: true })
  const { toast } = useToast()
  const [showError, setShowError] = useState(false)
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([])

  // Transform location data to the format expected by LocationsMap
  useEffect(() => {
    if (locations) {
      const mappedLocations: MapLocation[] = locations.map((location) => ({
        id: location.id,
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        count: location.count,
        address: location.address,
        city: location.city,
        clientName: location.clientName,
      }))
      setMapLocations(mappedLocations)
    }
  }, [locations])

  useEffect(() => {
    if (error) {
      console.error('Error loading locations:', error)
      toast({
        title: 'Error loading locations',
        description: 'Could not load location data. Please try again later.',
        variant: 'destructive',
      })
      setShowError(true)
    }
  }, [error, toast])

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue mr-2" />
        <span>Loading locations...</span>
      </div>
    )
  }

  if (showError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-center h-[300px]">
        <span>Error loading locations. Please try again later.</span>
      </div>
    )
  }

  return <LocationsMap locations={mapLocations} />
}

export default ReportsMap
