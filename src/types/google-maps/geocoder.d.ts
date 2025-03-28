
/**
 * Google Maps Geocoder type definitions
 */

/// <reference path="./core.d.ts" />

declare namespace google.maps {
  class Geocoder {
    constructor();
    geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
  }

  interface GeocoderRequest {
    address?: string;
    location?: LatLng | LatLngLiteral;
    placeId?: string;
    bounds?: LatLngBounds | LatLngBoundsLiteral;
    componentRestrictions?: GeocoderComponentRestrictions;
    region?: string;
  }

  interface GeocoderComponentRestrictions {
    country: string | string[];
  }

  interface GeocoderResult {
    address_components: GeocoderAddressComponent[];
    formatted_address: string;
    geometry: GeocoderGeometry;
    place_id: string;
    types: string[];
  }

  interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  interface GeocoderGeometry {
    location: LatLng;
    location_type: string;
    viewport: LatLngBounds;
    bounds?: LatLngBounds;
  }

  enum GeocoderStatus {
    OK,
    ZERO_RESULTS,
    OVER_DAILY_LIMIT,
    OVER_QUERY_LIMIT,
    REQUEST_DENIED,
    INVALID_REQUEST,
    UNKNOWN_ERROR
  }
}
