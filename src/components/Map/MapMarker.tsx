
import { useRef, useEffect, useMemo } from 'react';
import { MapMarkerProps } from './types';

const MapMarker = ({ location, map }: MapMarkerProps) => {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Create marker content element
  const createMarkerContent = useMemo(() => {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background-color: #3b82f6;
      color: white;
      font-weight: bold;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      font-size: 14px;
      position: relative;
    `;
    markerElement.textContent = location.count.toString();
    
    return markerElement;
  }, [location.count]);

  // Create info window content
  const infoWindowContent = useMemo(() => {
    return `
      <div style="padding: 8px;">
        <h3 style="margin: 0; font-size: 16px;">${location.name}</h3>
        <p style="margin: 4px 0 0;">Staff assigned: ${location.count}</p>
        <p style="margin: 4px 0 0;">${location.address}, ${location.city}</p>
      </div>
    `;
  }, [location.name, location.count, location.address, location.city]);

  // Initialize marker and info window
  useEffect(() => {
    if (!map || !window.google) return;

    // Create info window
    infoWindowRef.current = new window.google.maps.InfoWindow({
      content: infoWindowContent
    });

    // Create marker
    markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      title: location.name,
      content: createMarkerContent
    });

    // Add click listener to marker
    const marker = markerRef.current;
    if (marker) {
      marker.addListener('click', () => {
        if (infoWindowRef.current && map) {
          infoWindowRef.current.open(map, marker);
        }
      });
    }

    // Cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
      }
    };
  }, [map, location, infoWindowContent, createMarkerContent]);

  // This is a non-rendering component that manages its own DOM elements
  return null;
};

export default MapMarker;
