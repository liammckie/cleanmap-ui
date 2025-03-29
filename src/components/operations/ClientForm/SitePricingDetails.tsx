import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Trash } from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface SitePricingDetailsProps {
  form: UseFormReturn<any>
  index: number
  priceBreakdown?: { weekly: number; monthly: number; annual: number }
}

const SitePricingDetails: React.FC<SitePricingDetailsProps> = ({ form, index, priceBreakdown }) => {
  // Function to determine field names based on whether this is a standalone form or part of client form
  const getFieldName = (field: string) => {
    return index === -1 ? field : `sites.${index}.${field}`
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0)
  }

  // Get service items array from form
  const serviceItems = form.watch(getFieldName('service_items')) || []

  // Add a new service item
  const addServiceItem = () => {
    const currentItems = form.getValues(getFieldName('service_items')) || []
    const newItemId = currentItems.length > 0 
      ? Math.max(...currentItems.map((item: any) => item.id)) + 1 
      : 1
    
    form.setValue(getFieldName('service_items'), [
      ...currentItems,
      {
        id: newItemId,
        description: '',
        amount: 0,
        frequency: 'weekly',
        provider: 'Internal'
      }
    ])
  }

  // Remove a service item
  const removeServiceItem = (itemId: number) => {
    const currentItems = form.getValues(getFieldName('service_items')) || []
    if (currentItems.length <= 1) return // Keep at least one item
    
    const updatedItems = currentItems.filter((item: any) => item.id !== itemId)
    form.setValue(getFieldName('service_items'), updatedItems)
  }

  // Calculate total price from all service items
  const calculateTotalPrice = () => {
    if (!serviceItems || serviceItems.length === 0) {
      return form.watch(getFieldName('price_per_service')) || 0
    }
    
    return serviceItems.reduce((total: number, item: any) => total + (Number(item.amount) || 0), 0)
  }

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-medium">Pricing Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={getFieldName('price_per_service')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Price per Service*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  value={field.value || ''}
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
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

      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base">Service Items</CardTitle>
              <CardDescription>Add individual services with their own prices</CardDescription>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addServiceItem}
              className="flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceItems.map((item: any, itemIndex: number) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      placeholder="Service description"
                      value={item.description || ''}
                      onChange={(e) => {
                        const updatedItems = [...serviceItems]
                        updatedItems[itemIndex].description = e.target.value
                        form.setValue(getFieldName('service_items'), updatedItems)
                      }}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={item.amount || ''}
                      onChange={(e) => {
                        const updatedItems = [...serviceItems]
                        updatedItems[itemIndex].amount = parseFloat(e.target.value) || 0
                        form.setValue(getFieldName('service_items'), updatedItems)
                      }}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.frequency || 'weekly'}
                      onValueChange={(value) => {
                        const updatedItems = [...serviceItems]
                        updatedItems[itemIndex].frequency = value
                        form.setValue(getFieldName('service_items'), updatedItems)
                      }}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="Weekly" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="fortnightly">Fortnightly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <RadioGroup
                      value={item.provider || 'Internal'}
                      onValueChange={(value) => {
                        const updatedItems = [...serviceItems]
                        updatedItems[itemIndex].provider = value
                        form.setValue(getFieldName('service_items'), updatedItems)
                      }}
                      className="flex"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="Internal" id={`internal-${item.id}`} />
                        <label htmlFor={`internal-${item.id}`} className="text-sm cursor-pointer">Internal</label>
                      </div>
                      <div className="flex items-center space-x-1 ml-3">
                        <RadioGroupItem value="Contractor" id={`contractor-${item.id}`} />
                        <label htmlFor={`contractor-${item.id}`} className="text-sm cursor-pointer">Contractor</label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeServiceItem(item.id)}
                      disabled={serviceItems.length <= 1}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {serviceItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No service items added. Click "Add Item" to add services.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {priceBreakdown && (
        <div className="mt-6 bg-muted/30 p-4 rounded-md">
          <h4 className="font-medium mb-2">Price Breakdown</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Weekly</p>
              <p className="font-medium">{formatCurrency(priceBreakdown.weekly)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly</p>
              <p className="font-medium">{formatCurrency(priceBreakdown.monthly)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Annual</p>
              <p className="font-medium">{formatCurrency(priceBreakdown.annually)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SitePricingDetails
