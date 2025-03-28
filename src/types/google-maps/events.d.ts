
/**
 * Google Maps Events type definitions
 */

declare namespace google.maps {
  namespace event {
    function addListener(instance: any, eventName: string, handler: Function): MapsEventListener;
    function removeListener(listener: MapsEventListener): void;
    function clearInstanceListeners(instance: any): void;
    function trigger(instance: any, eventName: string, ...args: any[]): void;
  }

  interface MapsEventListener {
    remove(): void;
  }
}
