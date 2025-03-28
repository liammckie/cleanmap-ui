
import React from 'react';
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface SiteSpecialInstructionsProps {
  form: UseFormReturn<any>;
  index: number;
}

const SiteSpecialInstructions: React.FC<SiteSpecialInstructionsProps> = ({ form, index }) => {
  return (
    <FormField
      control={form.control}
      name={`sites.${index}.special_instructions`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Special Instructions</FormLabel>
          <FormControl>
            <Textarea placeholder="Enter any special instructions for this site" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SiteSpecialInstructions;
