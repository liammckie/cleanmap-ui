
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface SiteBasicDetailsProps {
  form: UseFormReturn<any>;
  index: number;
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
            <FormControl>
              <Input placeholder="e.g., Office, Retail, Warehouse" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`sites.${index}.primary_contact`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Contact Name</FormLabel>
            <FormControl>
              <Input placeholder="Site contact name" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`sites.${index}.contact_phone`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone</FormLabel>
            <FormControl>
              <Input placeholder="Site contact phone" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SiteBasicDetails;
