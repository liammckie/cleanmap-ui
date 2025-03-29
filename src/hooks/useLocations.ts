import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { MapLocation } from '@/components/Map/types'
import { parseCoordinatesFromStorage } from '@/utils/googleMaps'

export type LocationData = MapLocation

const validateLocationData = (data: any[]): boolean => {
  if (!Array.isArray(data)) {
    console.error('Location data is not an array', data)
    return false
  }

  const requiredFields: (keyof MapLocation)[] = ['id', 'name', 'lat', 'lng', 'count', 'address', 'city']

  const issues: string[] = []

  data.forEach((location, index) => {
    requiredFields.forEach(field => {
      if (location[field] === undefined || location[field] === null) {
        issues.push(`Location at index ${index} is missing required field: ${field}`)
      }
    })

    // Validate numeric fields
    if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      issues.push(`Location at index ${index} has invalid latitude or longitude`)
    }

    // Optional: Additional validations can be added here
  })

  if (issues.length > 0) {
    console.error('Location data validation issues:', issues)
    return false
  }

  console.log('Location data validation passed for', data.length, 'records')
  return true
}

export const useLocations = (options?: { clientId?: string; onlyActive?: boolean }) => {
  return useQuery({
    queryKey: ['locations', options?.clientId, options?.onlyActive],
    queryFn: async (): Promise<LocationData[]> => {
      try {
        const { data: sites, error } = await supabase
          .from('sites')
          .select(
            `
            id,
            site_name,
            address_street,
            address_city,
            address_state,
            address_postcode,
            coordinates,
            client_id,
            clients(company_name)
          `,
          )
          .eq('status', options?.onlyActive === false ? undefined : 'Active')
          .eq('client_id', options?.clientId || undefined)
          .order('site_name')

        if (error) throw error

        const locations: LocationData[] = (sites || []).map((site: any) => {
          let lat = -33.8688 + (Math.random() - 0.5) * 0.1
          let lng = 151.2093 + (Math.random() - 0.5) * 0.1
          
          if (site.coordinates) {
            const parsedCoords = parseCoordinatesFromStorage(site.coordinates)
            if (parsedCoords) {
              lat = parsedCoords.lat
              lng = parsedCoords.lng
            }
          }

          return {
            id: site.id,
            name: site.site_name,
            lat,
            lng,
            count: 1,
            address: site.address_street,
            city: site.address_city,
            clientName: site.clients?.company_name,
          }
        })

        // Validate location data before returning
        if (!validateLocationData(locations)) {
          console.warn('Using mock location data due to validation failure')
          return mockLocations
        }

        return locations
      } catch (error) {
        console.error('Error fetching locations:', error)
        // Fallback to mock data if fetch fails
        return mockLocations
      }
    },
    meta: {
      onError: (err: Error) => {
        console.error('Failed to fetch locations:', err)
      },
    },
  })
}

// Mock Locations (same as in Locations.tsx)
const mockLocations: LocationData[] = [
  {
    id: '1',
    name: 'Corporate Headquarters',
    lat: -33.865143,
    lng: 151.2099,
    count: 5,
    address: '123 Business Ave',
    city: 'Sydney',
    clientName: 'Acme Corporation',
  },
  {
    id: '2',
    name: 'Downtown Branch',
    lat: -37.813629,
    lng: 144.963058,
    count: 3,
    address: '456 Main Street',
    city: 'Melbourne',
    clientName: 'City Financial',
  },
  // ... other mock locations
]

export default useLocations
