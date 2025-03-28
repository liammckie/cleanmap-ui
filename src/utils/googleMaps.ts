
/**
 * Utility functions for Google Maps API integration
 */

// Google Maps API key
export const GOOGLE_MAPS_API_KEY = 'AIzaSyCOq_jmfFfsXhdOOThKNTOkW0Z3o3A8DmE';

// Function to load the Google Maps API script
export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the script is already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Create the script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Set up callbacks
    script.onload = () => resolve();
    script.onerror = (error) => reject(new Error(`Google Maps script loading failed: ${error}`));
    
    // Add the script to the document
    document.head.appendChild(script);
  });
};

/**
 * Get latitude and longitude for an address
 * @param address Full address string
 * @returns Promise with lat/lng coordinates
 */
export const getCoordinatesFromAddress = async (address: string): Promise<{lat: number, lng: number}> => {
  await loadGoogleMapsScript();
  
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng()
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

/**
 * Format coordinates for the database
 * Converts a lat/lng object to a string or array format suitable for storage
 */
export const formatCoordinatesForStorage = (coordinates: {lat: number, lng: number}): string => {
  return `${coordinates.lat},${coordinates.lng}`;
};

/**
 * Parse coordinates from storage format
 * Converts a stored string format back to a lat/lng object
 */
export const parseCoordinatesFromStorage = (storedCoordinates: string): {lat: number, lng: number} | null => {
  if (!storedCoordinates) return null;
  
  const [lat, lng] = storedCoordinates.split(',').map(Number);
  if (isNaN(lat) || isNaN(lng)) return null;
  
  return { lat, lng };
};
