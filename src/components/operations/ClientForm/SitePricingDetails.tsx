
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { 
  Select, 
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SitePricingDetailsProps {
  form: UseFormReturn<any>;
  index: number;
  priceBreakdown: {
    weekly: number;
    monthly: number;
    annually: number;
  };
}

const SitePricingDetails: React.FC<SitePricingDetailsProps> = ({ form, index, priceBreakdown }) => {
  // Function to determine field names based on whether this is a standalone form or part of client form
  const getFieldName = (field: string) => {
    return index === -1 ? field : `sites.${index}.${field}`;
  };

  const getServiceItemsFieldName = () => {
    return index === -1 ? 'service_items' : `sites.${index}.service_items`;
  };

  const getServiceItemAt = (itemIndex: number) => {
    return index === -1 ? `service_items.${itemIndex}` : `sites.${index}.service_items.${itemIndex}`;
  };

  // Function to add a new service item
  const addServiceItem = () => {
    const items = form.getValues(getServiceItemsFieldName()) || [];
    const newId = items.length > 0 ? Math.max(...items.map((item: any) => item.id)) + 1 : 1;
    
    form.setValue(getServiceItemsFieldName(), [
      ...items,
      { 
        id: newId, 
        description: '', 
        amount: 0,
        frequency: 'weekly',
        provider: 'Internal' 
      }
    ]);
  };

  // Function to remove a service item
  const removeServiceItem = (itemIndex: number) => {
    const items = form.getValues(getServiceItemsFieldName()) || [];
    if (items.length <= 1) return; // Don't remove the last item
    
    const updatedItems = [...items];
    updatedItems.splice(itemIndex, 1);
    form.setValue(getServiceItemsFieldName(), updatedItems);
  };

  // Get service items array
  const serviceItems = form.watch(getServiceItemsFieldName()) || [];

  // Calculate total amount of all service items
  const totalAmount = serviceItems.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-medium">Pricing Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={getFieldName('price_per_week')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Per Week*</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  value={field.value || 0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={getFieldName('price_frequency')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billing Frequency*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <SelectItem value="per-service">Per Service</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="border p-4 rounded-md bg-muted/20">
        <h4 className="text-sm font-medium mb-3">Service Line Items</h4>
        
        {serviceItems.map((_, itemIndex) => (
          <div key={itemIndex} className="mb-4 p-3 bg-muted/10 rounded-md">
            <div className="grid grid-cols-12 gap-2 mb-3">
              <div className="col-span-12 md:col-span-6">
                <FormField
                  control={form.control}
                  name={`${getServiceItemAt(itemIndex)}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Item description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-6 md:col-span-3">
                <FormField
                  control={form.control}
                  name={`${getServiceItemAt(itemIndex)}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                          value={field.value || 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-6 md:col-span-3">
                <FormField
                  control={form.control}
                  name={`${getServiceItemAt(itemIndex)}.frequency`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Frequency</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value || "weekly"}
                        value={field.value || "weekly"}
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
                          <SelectItem value="biannually">Bi-annually</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="mb-1">
              <FormField
                control={form.control}
                name={`${getServiceItemAt(itemIndex)}.provider`}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">Service Provider</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value || "Internal"}
                        value={field.value || "Internal"}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Internal" id={`internal-item-${index}-${itemIndex}`} />
                          <label htmlFor={`internal-item-${index}-${itemIndex}`} className="text-sm font-normal">
                            Internal
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Contractor" id={`contractor-item-${index}-${itemIndex}`} />
                          <label htmlFor={`contractor-item-${index}-${itemIndex}`} className="text-sm font-normal">
                            Contractor
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => removeServiceItem(itemIndex)}
                disabled={serviceItems.length <= 1}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ))}
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addServiceItem}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Item
          </Button>
          
          <div className="text-sm">
            <span className="font-medium">Total: ${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4 p-3 bg-muted/10 rounded-md">
        <div>
          <div className="text-sm text-muted-foreground">Weekly</div>
          <div className="font-medium">${priceBreakdown.weekly.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Monthly</div>
          <div className="font-medium">${priceBreakdown.monthly.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Annually</div>
          <div className="font-medium">${priceBreakdown.annually.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default SitePricingDetails;
