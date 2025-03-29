
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';

interface SiteServiceDetailsProps {
  form: UseFormReturn<any>;
  index: number;
}

const SiteServiceDetails: React.FC<SiteServiceDetailsProps> = ({
  form,
  index
}) => {
  // Function to copy client address to site address
  const copyClientAddress = () => {
    const clientAddress = {
      street: form.getValues('billing_address_street'),
      city: form.getValues('billing_address_city'),
      state: form.getValues('billing_address_state'),
      postcode: form.getValues('billing_address_postcode'),
    };
    
    form.setValue(`sites.${index}.address_street`, clientAddress.street);
    form.setValue(`sites.${index}.address_city`, clientAddress.city);
    form.setValue(`sites.${index}.address_state`, clientAddress.state);
    form.setValue(`sites.${index}.address_postcode`, clientAddress.postcode);
  };

  return <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name={`sites.${index}.region`} render={({
        field
      }) => <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Input placeholder="Enter region" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

        <FormField control={form.control} name={`sites.${index}.service_type`} render={({
        field
      }) => <FormItem className="space-y-3">
              <FormLabel>Service Type*</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="Internal" />
                    </FormControl>
                    <FormLabel className="font-normal">Internal</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="Contractor" />
                    </FormControl>
                    <FormLabel className="font-normal">Contractor</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={form.control} name={`sites.${index}.service_start_date`} render={({
        field
      }) => <FormItem>
              <FormLabel>Contract Start Date*</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : null)} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

        <FormField control={form.control} name={`sites.${index}.service_end_date`} render={({
        field
      }) => <FormItem>
              <FormLabel>Contract End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : null)} />
              </FormControl>
              <FormMessage />
            </FormItem>} />

        <FormField control={form.control} name={`sites.${index}.service_frequency`} render={({
        field
      }) => <FormItem>
              <FormLabel>Service Frequency</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Daily, Twice weekly" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <Checkbox id={`copy-client-address-${index}`} onClick={copyClientAddress} />
        <label htmlFor={`copy-client-address-${index}`} className="text-sm text-muted-foreground cursor-pointer">
          Use client address for this site
        </label>
      </div>
    </>;
};

export default SiteServiceDetails;
