
/**
 * Google Maps type definitions index file
 */

/// <reference path="./core.d.ts" />
/// <reference path="./markers.d.ts" />
/// <reference path="./info-window.d.ts" />
/// <reference path="./geocoder.d.ts" />
/// <reference path="./places.d.ts" />
/// <reference path="./events.d.ts" />

/**
 * Add the google property to the Window interface
 */
interface Window {
  google: typeof google;
}
