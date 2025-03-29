
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { MapLocation } from '@/components/Map/types'
import { parseCoordinatesFromStorage } from '@/utils/googleMaps'

export type LocationData = MapLocation

export const useLocations = (options?: { clientId?: string; onlyActive?: boolean }) => {
  return useQuery({
    queryKey: ['locations', options?.clientId, options?.onlyActive],
    queryFn: async (): Promise<LocationData[]> => {
      try {
        // Fetch sites data from Supabase with client information
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

        if (error) {
          throw error
        }

        // Process the data to match the expected MapLocation format
        const locations: LocationData[] = (sites || []).map((site) => {
          // Parse coordinates if they exist, otherwise generate random coordinates around Sydney
          let lat = -33.8688 + (Math.random() - 0.5) * 0.1
          let lng = 151.2093 + (Math.random() - 0.5) * 0.1
          
          if (site.coordinates) {
            const parsedCoords = parseCoordinatesFromStorage(site.coordinates)
            if (parsedCoords) {
              lat = parsedCoords.lat
              lng = parsedCoords.lng
            }
          }

          // Build the location object
          return {
            id: site.id,
            name: site.site_name,
            lat,
            lng,
            count: 1, // This would normally be something like staff assigned to this site
            address: site.address_street,
            city: site.address_city,
            clientName: site.clients?.company_name,
          }
        })

        return locations
      } catch (error) {
        console.error('Error fetching locations:', error)
        // Return empty array as fallback
        return []
      }
    },
    meta: {
      onError: (err: Error) => {
        console.error('Failed to fetch locations:', err)
      },
    },
  })
}
