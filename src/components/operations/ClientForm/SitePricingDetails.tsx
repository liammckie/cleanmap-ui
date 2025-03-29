
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
      { id: newId, description: '', amount: 0 }
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
          name={getFieldName('price_per_service')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Per Service*</FormLabel>
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
          <div key={itemIndex} className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-8">
              <FormField
                control={form.control}
                name={`${getServiceItemAt(itemIndex)}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Item description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="col-span-3">
              <FormField
                control={form.control}
                name={`${getServiceItemAt(itemIndex)}.amount`}
                render={({ field }) => (
                  <FormItem>
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
            
            <div className="col-span-1 flex items-center justify-center">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => removeServiceItem(itemIndex)}
                disabled={serviceItems.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
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
