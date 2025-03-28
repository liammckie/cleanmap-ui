
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MapIcon, Maximize2, Loader2 } from 'lucide-react';
import { loadGoogleMapsScript, GOOGLE_MAPS_API_KEY } from '@/utils/googleMaps';
import { LocationData } from '@/hooks/useLocations';

interface LocationsMapProps {
  locations?: LocationData[];
}

const LocationsMap = ({ locations = [] }: LocationsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLocations, setMapLocations] = useState<LocationData[]>([]);

  // Set default locations if none provided
  useEffect(() => {
    if (locations && locations.length > 0) {
      setMapLocations(locations);
    } else {
      // Sample locations data as fallback
      setMapLocations([
        { id: '1', name: 'Office Building A', lat: -33.865143, lng: 151.209900, count: 3, address: '123 Sample St', city: 'Sydney' },
        { id: '2', name: 'Business Plaza', lat: -33.882130, lng: 151.195370, count: 9, address: '456 Sample Ave', city: 'Sydney' },
        { id: '3', name: 'Corporate Headquarters', lat: -33.889967, lng: 151.274846, count: 3, address: '789 Sample Blvd', city: 'Sydney' },
      ]);
    }
  }, [locations]);

  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMapsScript();
        initializeMap();
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setIsLoading(false);
      }
    };

    initMap();
    
    return () => {
      // Clean up markers
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
      }
    };
  }, []);

  // Re-initialize map when locations change
  useEffect(() => {
    if (googleMapRef.current && mapLocations.length > 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      // Add new markers
      addMarkersToMap();
    }
  }, [mapLocations]);

  // Set up the map whenever fullscreen changes
  useEffect(() => {
    if (googleMapRef.current) {
      google.maps.event.trigger(googleMapRef.current, 'resize');
      
      // Re-center the map on window resize
      const center = googleMapRef.current.getCenter();
      if (center) {
        setTimeout(() => {
          googleMapRef.current?.setCenter(center);
        }, 100);
      }
    }
  }, [isFullscreen]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    setIsLoading(true);

    // Default map center (Sydney, Australia)
    const mapCenter = { lat: -33.8688, lng: 151.2093 };

    // Create the map
    googleMapRef.current = new google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    addMarkersToMap();

    setIsLoading(false);
  };

  const addMarkersToMap = () => {
    if (!googleMapRef.current || mapLocations.length === 0) return;

    // Add markers for each location
    mapLocations.forEach(location => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: googleMapRef.current,
        title: location.name,
        label: {
          text: location.count.toString(),
          color: 'white',
          fontWeight: 'bold'
        },
        animation: google.maps.Animation.DROP
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0; font-size: 16px;">${location.name}</h3>
            <p style="margin: 4px 0 0;">Staff assigned: ${location.count}</p>
          </div>
        `
      });

      // Add click event for the marker
      marker.addListener('click', () => {
        infoWindow.open(googleMapRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    // Fit the map to show all markers if we have any
    if (mapLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      mapLocations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      googleMapRef.current.fitBounds(bounds);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-100 dark:border-gray-700",
      "transition-all duration-300 ease-in-out",
      isFullscreen && "fixed inset-4 z-50"
    )}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="h-5 w-5 text-brand-blue" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Cleaning Locations</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleFullscreen}
            className="text-sm"
          >
            <Maximize2 className="h-4 w-4 mr-1" />
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </div>
      
      <div 
        ref={mapRef}
        className={cn(
          "relative w-full rounded-b-lg overflow-hidden transition-all duration-300",
          isFullscreen ? "h-[calc(100%-60px)]" : "h-[300px]"
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading map...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationsMap;
