
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MapIcon, Maximize2 } from 'lucide-react';

// Mock locations data
const mockLocations = [
  { id: 1, name: 'Office Building A', lat: -33.865143, lng: 151.209900, count: 3 },
  { id: 2, name: 'Business Plaza', lat: -33.882130, lng: 151.195370, count: 9 },
  { id: 3, name: 'Corporate Headquarters', lat: -33.889967, lng: 151.274846, count: 3 },
];

const LocationsMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Simulate map loading
    if (mapRef.current) {
      const mapElement = mapRef.current;
      
      // Add a loading class then remove it after a delay to simulate loading
      mapElement.classList.add('animate-pulse', 'bg-gray-200', 'dark:bg-gray-700');
      
      const timer = setTimeout(() => {
        mapElement.classList.remove('animate-pulse', 'bg-gray-200', 'dark:bg-gray-700');
        mapElement.style.backgroundImage = 'url("https://api.mapbox.com/styles/v1/mapbox/light-v10/static/151.21,-33.868,10,0/600x400?access_token=pk.demo")';
        mapElement.style.backgroundSize = 'cover';
        mapElement.style.backgroundPosition = 'center';
        
        // Add mock location markers
        mockLocations.forEach(location => {
          const marker = document.createElement('div');
          marker.className = 'absolute flex items-center justify-center';
          marker.style.left = `${Math.random() * 80 + 10}%`;
          marker.style.top = `${Math.random() * 80 + 10}%`;
          
          const dot = document.createElement('div');
          dot.className = cn(
            'w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center',
            'text-xs font-semibold shadow-md transform transition-transform duration-200',
            'cursor-pointer hover:scale-110'
          );
          dot.textContent = location.count.toString();
          
          marker.appendChild(dot);
          mapElement.appendChild(marker);
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

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
        {/* Map will be rendered here by the useEffect hook */}
      </div>
    </div>
  );
};

export default LocationsMap;
