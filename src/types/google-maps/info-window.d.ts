
/**
 * Google Maps InfoWindow type definitions
 */

/// <reference path="./core.d.ts" />

declare namespace google.maps {
  class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    open(map: Map, anchor?: MVCObject | null): void;
    close(): void;
    setContent(content: string | Node): void;
  }

  interface InfoWindowOptions {
    content?: string | Node;
    maxWidth?: number;
    position?: LatLng | LatLngLiteral;
  }

  interface MVCObject {}
}
