
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';

interface SiteServiceDetailsProps {
  form: UseFormReturn<any>;
  index: number;
}

const SiteServiceDetails: React.FC<SiteServiceDetailsProps> = ({
  form,
  index
}) => {
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
      </div>
    </>;
};

export default SiteServiceDetails;
