import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UseFormReturn } from 'react-hook-form'

interface SiteBasicDetailsProps {
  form: UseFormReturn<any>
  index: number
}

const SiteBasicDetails: React.FC<SiteBasicDetailsProps> = ({ form, index }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={`sites.${index}.site_name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site Name*</FormLabel>
            <FormControl>
              <Input placeholder="Enter site name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`sites.${index}.site_type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site Type*</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select site type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Educational">Educational</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default SiteBasicDetails
