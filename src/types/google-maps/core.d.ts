/**
 * Core Google Maps type definitions
 */

declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions)
    setCenter(latLng: LatLng | LatLngLiteral): void
    getCenter(): LatLng
    setZoom(zoom: number): void
    fitBounds(bounds: LatLngBounds, padding?: number | Padding): void
  }

  class LatLng {
    constructor(lat: number, lng: number, noWrap?: boolean)
    lat(): number
    lng(): number
    toString(): string
  }

  class LatLngBounds {
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral)
    extend(point: LatLng | LatLngLiteral): LatLngBounds
  }

  interface LatLngLiteral {
    lat: number
    lng: number
  }

  interface LatLngBoundsLiteral {
    east: number
    north: number
    south: number
    west: number
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral
    zoom?: number
    mapTypeId?: string
    mapTypeControl?: boolean
    streetViewControl?: boolean
    fullscreenControl?: boolean
    styles?: MapTypeStyle[]
  }

  interface MapTypeStyle {
    featureType?: string
    elementType?: string
    stylers: any[]
  }

  interface Padding {
    top: number
    right: number
    bottom: number
    left: number
  }

  interface Size {
    width: number
    height: number
    equals(other: Size): boolean
    toString(): string
  }

  interface Point {
    x: number
    y: number
    equals(other: Point): boolean
    toString(): string
  }
}
