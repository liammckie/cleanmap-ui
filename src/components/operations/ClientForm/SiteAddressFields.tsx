
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';

interface SiteAddressFieldsProps {
  form: UseFormReturn<any>;
  index: number;
}

const SiteAddressFields: React.FC<SiteAddressFieldsProps> = ({ form, index }) => {
  // Function to determine field names based on whether this is a standalone form or part of client form
  const getFieldName = (field: string) => {
    return index === -1 ? field : `sites.${index}.${field}`;
  };

  // Copy client billing address to site address
  const copyClientAddress = () => {
    // Only in the context of client creation, copy from client billing address
    if (index >= 0) {
      const street = form.getValues('billing_address_street');
      const city = form.getValues('billing_address_city');
      const state = form.getValues('billing_address_state');
      const postcode = form.getValues('billing_address_postcode');
      
      form.setValue(`sites.${index}.address_street`, street);
      form.setValue(`sites.${index}.address_city`, city);
      form.setValue(`sites.${index}.address_state`, state);
      form.setValue(`sites.${index}.address_postcode`, postcode);
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-medium">Site Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={getFieldName('address_street')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address*</FormLabel>
              <FormControl>
                <Input placeholder="Street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={getFieldName('address_city')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City*</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={getFieldName('address_state')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State*</FormLabel>
              <FormControl>
                <Input placeholder="State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={getFieldName('address_postcode')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code*</FormLabel>
              <FormControl>
                <Input placeholder="Postal code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {index >= 0 && (
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox id={`copy-client-address-${index}`} onClick={copyClientAddress} />
          <label htmlFor={`copy-client-address-${index}`} className="text-sm text-muted-foreground cursor-pointer">
            Use client billing address for this site
          </label>
        </div>
      )}
    </div>
  );
};

export default SiteAddressFields;
