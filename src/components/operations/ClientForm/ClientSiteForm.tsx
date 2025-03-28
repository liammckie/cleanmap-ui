
import React from 'react';
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

type SiteFormData = {
  site_name: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_postcode: string;
  site_type: string;
  region: string;
  price_per_service: number;
  price_frequency: string;
  special_instructions?: string;
};

interface ClientSiteFormProps {
  form: UseFormReturn<any>;
  index: number;
  onRemove: () => void;
}

const ClientSiteForm: React.FC<ClientSiteFormProps> = ({ 
  form,
  index,
  onRemove
}) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Site #{index + 1}</h3>
      
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`sites.${index}.region`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Input placeholder="Enter region" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`sites.${index}.service_start_date`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`sites.${index}.price_per_service`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Service*</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`sites.${index}.price_frequency`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billing Frequency*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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

      <button
        type="button"
        className="text-red-500 hover:text-red-700 text-sm mt-2"
        onClick={onRemove}
      >
        Remove Site
      </button>
    </div>
  );
};

export default ClientSiteForm;
