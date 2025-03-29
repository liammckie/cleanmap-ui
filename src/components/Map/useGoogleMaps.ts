import { useState, useEffect } from 'react'
import { loadGoogleMapsScript } from '@/utils/googleMaps'
import { useToast } from '@/hooks/use-toast'

/**
 * Custom hook to load and initialize Google Maps
 */
export const useGoogleMaps = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        setIsLoading(true)
        await loadGoogleMapsScript()

        if (window.google && window.google.maps) {
          setGoogleMapsLoaded(true)
        } else {
          throw new Error('Google Maps failed to load properly')
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        toast({
          title: 'Map Loading Error',
          description: 'Failed to load Google Maps. Please try again later.',
          variant: 'destructive',
        })
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    initGoogleMaps()
  }, [toast])

  return { isLoading, isError, googleMapsLoaded }
}
