
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
import { UseFormReturn } from 'react-hook-form';
import { formatCurrency } from '@/utils/billingCalculations';

interface SitePricingDetailsProps {
  form: UseFormReturn<any>;
  index: number;
  priceBreakdown: {
    weekly: number;
    monthly: number;
    annually: number;
  };
}

const SitePricingDetails: React.FC<SitePricingDetailsProps> = ({ 
  form, 
  index,
  priceBreakdown
}) => {
  return (
    <>
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
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="fortnightly">Fortnightly</SelectItem>
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
      
      {/* Price breakdown display */}
      <div className="mt-2 p-3 bg-muted rounded-md">
        <h4 className="text-sm font-medium mb-2">Price Breakdown</h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Weekly</p>
            <p className="font-medium">{formatCurrency(priceBreakdown.weekly)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Monthly</p>
            <p className="font-medium">{formatCurrency(priceBreakdown.monthly)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Annually</p>
            <p className="font-medium">{formatCurrency(priceBreakdown.annually)}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SitePricingDetails;
