
export interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  count: number;
  address: string;
  city: string;
  clientName?: string;
}

export interface MapProps {
  locations?: MapLocation[];
  isFullscreen?: boolean;
}

export interface MapMarkerProps {
  location: MapLocation;
  map: google.maps.Map;
}
