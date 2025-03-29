
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

interface SiteSpecialInstructionsProps {
  form: UseFormReturn<any>;
  index: number;
}

const SiteSpecialInstructions: React.FC<SiteSpecialInstructionsProps> = ({ form, index }) => {
  // Function to determine field names based on whether this is a standalone form or part of client form
  const getFieldName = (field: string) => {
    return index === -1 ? field : `sites.${index}.${field}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Special Instructions</h3>
      <FormField
        control={form.control}
        name={getFieldName('special_instructions')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Instructions or Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter any special instructions or notes for this site"
                className="min-h-[120px]"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SiteSpecialInstructions;
