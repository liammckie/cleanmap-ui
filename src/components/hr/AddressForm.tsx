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

  return (
    <div className="space-y-4">
      <div>
        <FormItem>
          <FormLabel>Address Lookup</FormLabel>
          <AddressAutocomplete
            onAddressSelected={handleAddressSelected}
            placeholder="Search for an address"
            className="w-full"
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
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St" {...field} />
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
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Sydney" {...field} />
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
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="NSW" {...field} />
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
              <FormLabel>Postcode</FormLabel>
              <FormControl>
                <Input placeholder="2000" {...field} />
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
