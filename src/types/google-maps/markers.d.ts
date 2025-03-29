/**
 * Google Maps marker-related type definitions
 */

/// <reference path="./core.d.ts" />

declare namespace google.maps {
  class Marker {
    constructor(opts?: MarkerOptions)
    setMap(map: Map | null): void
    setPosition(latLng: LatLng | LatLngLiteral): void
    addListener(eventName: string, handler: Function): MapsEventListener
    getPosition(): LatLng
  }

  namespace marker {
    class AdvancedMarkerElement {
      constructor(opts?: AdvancedMarkerElementOptions)
      position: LatLng | LatLngLiteral | null
      map: Map | null
      title: string | null
      content: Node | null
      addListener(eventName: string, handler: Function): MapsEventListener
    }
  }

  interface MarkerOptions {
    position: LatLng | LatLngLiteral
    map?: Map
    title?: string
    label?: string | MarkerLabel
    animation?: Animation
    icon?: string | Icon | Symbol
  }

  interface AdvancedMarkerElementOptions {
    position?: LatLng | LatLngLiteral
    map?: Map
    title?: string
    content?: Node
  }

  interface MarkerLabel {
    text: string
    color?: string
    fontWeight?: string
    fontSize?: string
  }

  interface Icon {
    url: string
    size?: Size
    scaledSize?: Size
    origin?: Point
    anchor?: Point
    labelOrigin?: Point
  }

  interface Symbol {
    path: string
    fillColor?: string
    fillOpacity?: number
    scale?: number
    strokeColor?: string
    strokeOpacity?: number
    strokeWeight?: number
  }

  enum Animation {
    DROP,
    BOUNCE,
  }
}
