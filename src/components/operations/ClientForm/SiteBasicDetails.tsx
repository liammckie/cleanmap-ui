
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';

interface SiteBasicDetailsProps {
  form: UseFormReturn<any>;
  index: number;
}

const SiteBasicDetails: React.FC<SiteBasicDetailsProps> = ({ form, index }) => {
  // Function to copy client contact to site contact
  const copyClientContact = () => {
    const primaryContact = form.getValues('contact_name');
    const contactEmail = form.getValues('contact_email');
    const contactPhone = form.getValues('contact_phone');
    
    form.setValue(`sites.${index}.primary_contact`, primaryContact);
    form.setValue(`sites.${index}.contact_email`, contactEmail);
    form.setValue(`sites.${index}.contact_phone`, contactPhone);
  };

  return (
    <div className="space-y-5">
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
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Site Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <FormField
            control={form.control}
            name={`sites.${index}.contact_email`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="Site contact email" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <Checkbox id={`copy-client-contact-${index}`} onClick={copyClientContact} />
          <label htmlFor={`copy-client-contact-${index}`} className="text-sm text-muted-foreground cursor-pointer">
            Use client primary contact for this site
          </label>
        </div>
      </div>
    </div>
  );
};

export default SiteBasicDetails;
