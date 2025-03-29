import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'

interface SiteAddressFieldsProps {
  form: UseFormReturn<any>
  index: number
}

const SiteAddressFields: React.FC<SiteAddressFieldsProps> = ({ form, index }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={`sites.${index}.address_street`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address*</FormLabel>
            <FormControl>
              <Input placeholder="Enter street address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`sites.${index}.address_city`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City*</FormLabel>
              <FormControl>
                <Input placeholder="Enter city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`sites.${index}.address_state`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State*</FormLabel>
              <FormControl>
                <Input placeholder="Enter state" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`sites.${index}.address_postcode`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postcode*</FormLabel>
              <FormControl>
                <Input placeholder="Enter postcode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default SiteAddressFields
