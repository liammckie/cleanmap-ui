import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { loadGoogleMapsScript } from '@/utils/googleMaps'

interface Address {
  street: string
  city: string
  state: string
  postcode: string
  country: string
  coordinates?: { lat: number; lng: number }
}

interface AddressAutocompleteProps {
  onAddressSelected: (address: Address) => void
  placeholder?: string
  defaultValue?: string
  className?: string
}

const AddressAutocomplete = ({
  onAddressSelected,
  placeholder = 'Enter an address',
  defaultValue = '',
  className,
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        await loadGoogleMapsScript()
        setIsLoaded(true)
      } catch (error) {
        console.error('Failed to load Google Maps script:', error)
      }
    }

    initAutocomplete()
  }, [])

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
      })

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace()

        if (place && place.address_components) {
          // Initialize the address object
          const addressData: Address = {
            street: '',
            city: '',
            state: '',
            postcode: '',
            country: '',
          }

          // Process address components
          place.address_components.forEach((component) => {
            const types = component.types

            if (types.includes('street_number')) {
              addressData.street = component.long_name
            } else if (types.includes('route')) {
              addressData.street += (addressData.street ? ' ' : '') + component.long_name
            } else if (types.includes('locality')) {
              addressData.city = component.long_name
            } else if (types.includes('administrative_area_level_1')) {
              addressData.state = component.short_name
            } else if (types.includes('postal_code')) {
              addressData.postcode = component.long_name
            } else if (types.includes('country')) {
              addressData.country = component.long_name
            }
          })

          // Get coordinates if available
          if (place.geometry && place.geometry.location) {
            addressData.coordinates = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }
          }

          onAddressSelected(addressData)
        }
      })
    }

    return () => {
      // Clean up event listener if component unmounts
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [isLoaded, onAddressSelected])

  return (
    <Input
      ref={inputRef}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className={className}
    />
  )
}

export default AddressAutocomplete
