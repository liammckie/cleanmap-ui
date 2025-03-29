/**
 * Google Maps Places type definitions
 */

/// <reference path="./core.d.ts" />
/// <reference path="./geocoder.d.ts" />

declare namespace google.maps {
  namespace places {
    class Autocomplete {
      constructor(inputElement: HTMLInputElement, opts?: AutocompleteOptions)
      addListener(eventName: string, handler: Function): MapsEventListener
      getPlace(): PlaceResult
    }
  }

  interface AutocompleteOptions {
    bounds?: LatLngBounds | LatLngBoundsLiteral
    componentRestrictions?: GeocoderComponentRestrictions
    types?: string[]
  }

  interface PlaceResult {
    address_components?: GeocoderAddressComponent[]
    formatted_address?: string
    geometry?: {
      location: LatLng
      viewport: LatLngBounds
    }
    place_id?: string
    name?: string
    types?: string[]
  }
}
