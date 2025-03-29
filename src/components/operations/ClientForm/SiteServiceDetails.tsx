
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface SiteServiceDetailsProps {
  form: UseFormReturn<any>;
  index: number;
}

const SiteServiceDetails: React.FC<SiteServiceDetailsProps> = ({ form, index }) => {
  // Function to determine field names based on whether this is a standalone form or part of client form
  const getFieldName = (field: string) => {
    return index === -1 ? field : `sites.${index}.${field}`;
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-medium">Service Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Type */}
        <FormField
          control={form.control}
          name={getFieldName('service_type')}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Service Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                  value={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Internal" id={`internal-${index !== -1 ? index : 'single'}`} />
                    <label htmlFor={`internal-${index !== -1 ? index : 'single'}`} className="text-sm font-normal">
                      Internal
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Contractor" id={`contractor-${index !== -1 ? index : 'single'}`} />
                    <label htmlFor={`contractor-${index !== -1 ? index : 'single'}`} className="text-sm font-normal">
                      Contractor
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service Frequency */}
        <FormField
          control={form.control}
          name={getFieldName('service_frequency')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Frequency</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || ""}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="fortnightly">Fortnightly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Custom frequency field - appears when "custom" is selected */}
      {form.watch(getFieldName('service_frequency')) === 'custom' && (
        <FormField
          control={form.control}
          name={getFieldName('custom_frequency')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Frequency Details</FormLabel>
              <FormControl>
                <Input placeholder="Please describe the frequency" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <FormField
          control={form.control}
          name={getFieldName('service_start_date')}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Service Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* End Date */}
        <FormField
          control={form.control}
          name={getFieldName('service_end_date')}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Service End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Select date (optional)</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const startDate = form.watch(getFieldName('service_start_date'));
                      return startDate && date < startDate;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SiteServiceDetails;
