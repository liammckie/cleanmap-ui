
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { fetchSites } from '@/services/sites'
import { querySitesByClientId } from '@/services/sites/siteQueryService'
import { 
  fetchWorkOrderStatuses, 
  fetchWorkOrderCategories, 
  fetchWorkOrderPriorities,
  createWorkOrder,
  updateWorkOrder 
} from '@/services/workOrders'
import { useToast } from '@/hooks/use-toast'
import { 
  workOrderFormSchema, 
  WorkOrder, 
  type WorkOrderFormValues 
} from '@/schema/operations/workOrder.schema'

interface WorkOrderFormProps {
  initialData?: Partial<WorkOrder>
  onSuccess: () => void
  onCancel: () => void
}

export function WorkOrderForm({ initialData, onSuccess, onCancel }: WorkOrderFormProps) {
  const { toast } = useToast()
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    initialData?.site?.client_id
  )

  // Fetch all sites if no client is selected
  const { data: allSites } = useQuery({
    queryKey: ['sites'],
    queryFn: () => fetchSites({}),
    enabled: !selectedClientId,
  })

  // Fetch sites filtered by client
  const { data: clientSites } = useQuery({
    queryKey: ['sites', selectedClientId],
    queryFn: () => selectedClientId ? querySitesByClientId(selectedClientId) : [],
    enabled: !!selectedClientId,
  })

  // Combine sites data
  const sites = selectedClientId ? clientSites : allSites

  // Fetch work order metadata
  const { data: statuses = [] } = useQuery({
    queryKey: ['workOrderStatuses'],
    queryFn: fetchWorkOrderStatuses,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['workOrderCategories'],
    queryFn: fetchWorkOrderCategories,
  })

  const { data: priorities = [] } = useQuery({
    queryKey: ['workOrderPriorities'],
    queryFn: fetchWorkOrderPriorities,
  })

  // Initialize form with default values or initial data
  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      site_id: initialData?.site_id || '',
      client_id: initialData?.site?.client_id,
      status: initialData?.status || 'Scheduled',
      priority: initialData?.priority || 'Medium',
      category: initialData?.category || 'Routine Clean',
      scheduled_start: initialData?.scheduled_start ? new Date(initialData.scheduled_start) : new Date(),
      due_date: initialData?.due_date ? new Date(initialData.due_date) : new Date(),
      actual_duration: initialData?.actual_duration || null,
      outcome_notes: initialData?.outcome_notes || '',
    },
  })

  async function onSubmit(values: WorkOrderFormValues) {
    try {
      if (initialData?.id) {
        // Update existing work order
        await updateWorkOrder(initialData.id, values)
        toast({
          title: 'Success',
          description: 'Work order updated successfully',
        })
      } else {
        // Create new work order
        await createWorkOrder(values)
        toast({
          title: 'Success',
          description: 'Work order created successfully',
        })
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving work order:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save work order. Please try again.',
      })
    }
  }

  // Update site when client changes
  useEffect(() => {
    if (selectedClientId && form.getValues('site_id')) {
      // Reset site selection if client changes
      form.setValue('site_id', '')
    }
  }, [selectedClientId, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter work order title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Site selection field */}
          <FormField
            control={form.control}
            name="site_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sites?.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.site_name} ({site.client?.company_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority field */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estimated hours field */}
          <FormField
            control={form.control}
            name="actual_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Hours</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Estimated hours"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                    }
                    value={field.value === null ? '' : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Scheduled start date field */}
          <FormField
            control={form.control}
            name="scheduled_start"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Scheduled Start</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Due date field */}
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter detailed work order description" 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes field */}
        <FormField
          control={form.control}
          name="outcome_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Optional notes" 
                  className="min-h-24"
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Additional notes for this work order (internal only)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData?.id ? 'Update Work Order' : 'Create Work Order'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
