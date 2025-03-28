
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MapLocation } from '@/components/Map/types';

export type LocationData = MapLocation;

export const useLocations = (options?: { 
  clientId?: string;
  onlyActive?: boolean;
}) => {
  return useQuery({
    queryKey: ['locations', options?.clientId, options?.onlyActive],
    queryFn: async (): Promise<LocationData[]> => {
      try {
        // In a real app, this would fetch from the sites table and join with client
        // and count employees assigned to each location
        
        // Placeholder implementation
        const { data: sites, error } = await supabase
          .from('sites')
          .select(`
            id,
            site_name,
            address_street,
            address_city,
            address_state,
            address_postcode,
            client_id,
            clients(company_name)
          `)
          .eq('status', 'Active')
          .order('site_name');

        if (error) {
          throw error;
        }

        // Process the data to match the expected format
        // In a real implementation, you'd have geo coordinates stored in the DB
        const locations: LocationData[] = await Promise.all(
          (sites || []).map(async (site) => {
            // Get random coordinates near Sydney for demo purposes
            const baseLat = -33.8688;
            const baseLng = 151.2093;
            const lat = baseLat + (Math.random() - 0.5) * 0.1;
            const lng = baseLng + (Math.random() - 0.5) * 0.1;
            
            return {
              id: site.id,
              name: site.site_name,
              lat,
              lng,
              count: Math.floor(Math.random() * 10) + 1, // Random staff count for demo
              address: site.address_street,
              city: site.address_city,
              clientName: site.clients?.company_name,
            };
          })
        );

        return locations;
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Return mock data as fallback
        return sampleLocations.map(loc => ({
          id: loc.id.toString(),
          name: loc.name,
          lat: loc.lat,
          lng: loc.lng,
          count: loc.count,
          address: '123 Sample St',
          city: 'Sydney'
        }));
      }
    },
    meta: {
      onError: (err: Error) => {
        console.error('Failed to fetch locations:', err);
      }
    }
  });
};

// Sample locations data as fallback
const sampleLocations = [
  { id: 1, name: 'Office Building A', lat: -33.865143, lng: 151.209900, count: 3 },
  { id: 2, name: 'Business Plaza', lat: -33.882130, lng: 151.195370, count: 9 },
  { id: 3, name: 'Corporate Headquarters', lat: -33.889967, lng: 151.274846, count: 3 },
];
