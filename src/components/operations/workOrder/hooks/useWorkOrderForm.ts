
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { formatISO } from 'date-fns'
import { 
  WorkOrderFormValues, 
  workOrderSchema,
  WorkOrder
} from '@/schema/operations/workOrder.schema'
import { 
  fetchWorkOrderStatuses, 
  fetchWorkOrderCategories, 
  fetchWorkOrderPriorities, 
  createWorkOrder, 
  updateWorkOrder 
} from '@/services/workOrders'
import { fetchSites } from '@/services/sites'
import { useToast } from '@/hooks/use-toast'

interface UseWorkOrderFormProps {
  initialData?: Partial<WorkOrder>
  onSuccess: () => void
}

export function useWorkOrderForm({ initialData, onSuccess }: UseWorkOrderFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = initialData && 'id' in initialData ? true : false

  // Fetch sites for the dropdown
  const { data: sitesData } = useQuery({
    queryKey: ['sites'],
    queryFn: () => fetchSites({}),
  })

  // Fetch status options
  const { data: statusesData } = useQuery({
    queryKey: ['workOrderStatuses'],
    queryFn: fetchWorkOrderStatuses,
  })

  // Fetch category options
  const { data: categoriesData } = useQuery({
    queryKey: ['workOrderCategories'],
    queryFn: fetchWorkOrderCategories,
  })

  // Fetch priority options
  const { data: prioritiesData } = useQuery({
    queryKey: ['workOrderPriorities'],
    queryFn: fetchWorkOrderPriorities,
  })

  // Convert query results to arrays
  const sites = Array.isArray(sitesData) ? sitesData : []
  const statuses = Array.isArray(statusesData) ? statusesData : []
  const categories = Array.isArray(categoriesData) ? categoriesData : []
  const priorities = Array.isArray(prioritiesData) ? prioritiesData : []

  // Initialize the form with default values
  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      title: '',
      site_id: '',
      category: 'Routine Clean', // Default category
      priority: 'Medium', // Default priority
      status: 'Scheduled', // Default status
      scheduled_start: new Date(),
      due_date: new Date(),
      description: '',
    },
  })

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      // Convert initialData (WorkOrder) to WorkOrderFormValues format
      const formValues: Partial<WorkOrderFormValues> = {
        ...initialData,
        // Ensure dates are Date objects
        scheduled_start: initialData.scheduled_start
          ? typeof initialData.scheduled_start === 'string' 
            ? new Date(initialData.scheduled_start)
            : initialData.scheduled_start
          : new Date(),
        due_date: initialData.due_date
          ? typeof initialData.due_date === 'string'
            ? new Date(initialData.due_date)
            : initialData.due_date
          : new Date(),
      }
      
      // Reset form with converted values
      form.reset(formValues as WorkOrderFormValues)
    }
  }, [initialData, form])

  // Form submission handler
  const onSubmit = async (data: WorkOrderFormValues) => {
    try {
      setIsSubmitting(true)

      if (isEditing && initialData && 'id' in initialData) {
        // Format dates as ISO strings for API
        const formattedData = {
          ...data,
          scheduled_start: formatISO(data.scheduled_start),
          due_date: formatISO(data.due_date)
        };
        
        // Update existing work order
        await updateWorkOrder(initialData.id as string, formattedData)
        toast({
          title: 'Work Order Updated',
          description: 'The work order has been successfully updated.',
        })
      } else {
        // Ensure site_id is provided and convert dates to strings for API
        if (!data.site_id) {
          throw new Error('Site ID is required for work orders');
        }
        
        const createData = {
          ...data,
          site_id: data.site_id, // Explicitly include required field
          description: data.description || '', // Ensure description is not undefined
          scheduled_start: formatISO(data.scheduled_start),
          due_date: formatISO(data.due_date)
        };
        
        // Create new work order
        await createWorkOrder(createData)
        form.reset() // Clear form after successful creation
        toast({
          title: 'Work Order Created',
          description: 'A new work order has been successfully created.',
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
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    sites,
    statuses,
    categories,
    priorities,
    isSubmitting,
    onSubmit,
    isEditing,
  }
}
