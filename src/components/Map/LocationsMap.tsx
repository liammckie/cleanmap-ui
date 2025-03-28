
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MapIcon, Maximize2, Loader2 } from 'lucide-react';
import { useGoogleMaps } from './useGoogleMaps';
import MapContainer from './MapContainer';
import { MapLocation } from './types';

interface LocationsMapProps {
  locations?: MapLocation[];
}

const LocationsMap = ({ locations = [] }: LocationsMapProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const { isLoading, isError, googleMapsLoaded } = useGoogleMaps();

  // Set default locations if none provided
  useState(() => {
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
  });

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
      
      {isLoading && (
        <div className="relative w-full h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading map...</span>
        </div>
      )}

      {isError && (
        <div className="relative w-full h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <span className="text-gray-600 dark:text-gray-300">Failed to load map. Please try again later.</span>
        </div>
      )}

      {googleMapsLoaded && !isLoading && !isError && (
        <MapContainer 
          locations={mapLocations} 
          isFullscreen={isFullscreen} 
        />
      )}
    </div>
  );
};

export default LocationsMap;
