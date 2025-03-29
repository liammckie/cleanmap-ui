
import React, { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { formatCurrency } from '@/utils/billingCalculations';
import { Button } from '@/components/ui/button';
import { PlusCircle, X, Calculator } from 'lucide-react';

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
  const [services, setServices] = useState<Array<{id: number, description: string, amount: number}>>([
    { id: 0, description: '', amount: 0 }
  ]);
  
  const [totalServiceAmount, setTotalServiceAmount] = useState(0);

  // Calculate total amount from services
  useEffect(() => {
    const total = services.reduce((sum, service) => sum + (service.amount || 0), 0);
    setTotalServiceAmount(total);
    
    // Update the main price_per_service field with the total
    form.setValue(`sites.${index}.price_per_service`, total);
  }, [services, form, index]);

  // Handle adding a new service line
  const addService = () => {
    setServices(prevServices => [
      ...prevServices,
      { id: prevServices.length, description: '', amount: 0 }
    ]);
  };

  // Handle removing a service line
  const removeService = (serviceId: number) => {
    if (services.length > 1) {
      setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
    }
  };

  // Update the service line
  const updateService = (serviceId: number, field: 'description' | 'amount', value: string | number) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, [field]: field === 'amount' ? Number(value) || 0 : value }
          : service
      )
    );
  };

  // Handle saving service items to form data
  useEffect(() => {
    form.setValue(`sites.${index}.service_items`, services);
  }, [services, form, index]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`sites.${index}.price_frequency`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billing Frequency*</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || 'weekly'}
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

        <FormField
          control={form.control}
          name={`sites.${index}.price_per_service`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Price Per Service (ex GST)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  value={totalServiceAmount}
                  disabled
                  className="bg-muted"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Service Line Items */}
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Service Items</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addService}
            className="flex items-center space-x-1"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            <span>Add Service Item</span>
          </Button>
        </div>

        {services.map((service) => (
          <div key={service.id} className="grid grid-cols-12 gap-2 items-start">
            <div className="col-span-7">
              <FormItem>
                <FormLabel className="text-xs">Description</FormLabel>
                <Input 
                  placeholder="e.g., Regular office cleaning"
                  value={service.description}
                  onChange={(e) => updateService(service.id, 'description', e.target.value)}
                  className="h-9"
                />
              </FormItem>
            </div>
            <div className="col-span-4">
              <FormItem>
                <FormLabel className="text-xs">Amount (ex GST)</FormLabel>
                <Input 
                  type="number"
                  placeholder="0.00"
                  value={service.amount || ''}
                  onChange={(e) => updateService(service.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="h-9"
                />
              </FormItem>
            </div>
            <div className="col-span-1 pt-6">
              {services.length > 1 && (
                <Button
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeService(service.id)}
                  className="h-9 w-9 p-0"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Price breakdown display */}
      <div className="mt-4 p-3 bg-muted rounded-md">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Price Breakdown</h4>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </div>
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
    </div>
  );
};

export default SitePricingDetails;
