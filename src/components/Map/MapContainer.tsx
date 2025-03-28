
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { MapProps, MapLocation } from './types';
import MapMarker from './MapMarker';

const MapContainer = ({ locations = [], isFullscreen = false }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || !window.google || !window.google.maps) return;

    // Default map center (Sydney, Australia)
    const mapCenter = { lat: -33.8688, lng: 151.2093 };

    // Create the map
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
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

    setMapInitialized(true);
  }, []);

  // Fit bounds when locations change
  useEffect(() => {
    if (!googleMapRef.current || !window.google || locations.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    locations.forEach(location => {
      bounds.extend({ lat: location.lat, lng: location.lng });
    });
    
    googleMapRef.current.fitBounds(bounds);
  }, [locations]);

  // Handle resize events for the map
  useEffect(() => {
    if (!googleMapRef.current || !window.google) return;

    // Trigger resize event on the map
    window.google.maps.event.trigger(googleMapRef.current, 'resize');
    
    // Re-center the map
    const center = googleMapRef.current.getCenter();
    if (center) {
      setTimeout(() => {
        if (googleMapRef.current) {
          googleMapRef.current.setCenter(center);
        }
      }, 100);
    }
  }, [isFullscreen]);

  return (
    <div 
      ref={mapRef}
      className={cn(
        "relative w-full rounded-b-lg overflow-hidden transition-all duration-300",
        isFullscreen ? "h-[calc(100%-60px)]" : "h-[300px]"
      )}
    >
      {mapInitialized && googleMapRef.current && locations.map((location: MapLocation) => (
        <MapMarker 
          key={location.id} 
          location={location} 
          map={googleMapRef.current as google.maps.Map} 
        />
      ))}
    </div>
  );
};

export default MapContainer;
