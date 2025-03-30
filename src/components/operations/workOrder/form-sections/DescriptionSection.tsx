
import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import type { WorkOrderFormValues } from '@/schema/operations/workOrder.schema'

export function DescriptionSection() {
  const { control } = useFormContext<WorkOrderFormValues>()

  return (
    <>
      {/* Description field */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter detailed work order description" 
                className="min-h-32"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Notes field */}
      <FormField
        control={control}
        name="outcome_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Optional notes" 
                className="min-h-24"
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Additional notes for this work order (internal only)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
