
import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AddressAutocomplete from '@/components/common/AddressAutocomplete'

interface AddressFormProps {
  form: any
  streetName: string
  cityName: string
  stateName: string
  postcodeName: string
}

const AddressForm = ({ form, streetName, cityName, stateName, postcodeName }: AddressFormProps) => {
  const handleAddressSelected = (address: {
    street: string
    city: string
    state: string
    postcode: string
  }) => {
    // Update the form fields with the selected address
    form.setValue(streetName, address.street)
    form.setValue(cityName, address.city)
    form.setValue(stateName, address.state)
    form.setValue(postcodeName, address.postcode)
  }

  // Generate unique IDs for form elements to fix label issues
  const streetId = `street-${streetName}`
  const cityId = `city-${cityName}`
  const stateId = `state-${stateName}`
  const postcodeId = `postcode-${postcodeName}`
  const autocompleteId = "address-autocomplete"

  return (
    <div className="space-y-4">
      <div>
        <FormItem>
          <FormLabel htmlFor={autocompleteId}>Address Lookup</FormLabel>
          <AddressAutocomplete
            onAddressSelected={handleAddressSelected}
            placeholder="Search for an address"
            className="w-full"
            id={autocompleteId}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Search for an address to auto-fill the fields below, or enter manually
          </p>
        </FormItem>
      </div>

      <FormField
        control={form.control}
        name={streetName}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={streetId}>Street Address</FormLabel>
            <FormControl>
              <Input id={streetId} placeholder="123 Main St" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={cityName}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={cityId}>City</FormLabel>
              <FormControl>
                <Input id={cityId} placeholder="Sydney" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={stateName}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={stateId}>State</FormLabel>
              <FormControl>
                <Input id={stateId} placeholder="NSW" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={postcodeName}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={postcodeId}>Postcode</FormLabel>
              <FormControl>
                <Input id={postcodeId} placeholder="2000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default AddressForm
