
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  fetchWorkOrderStatuses, 
  fetchWorkOrderCategories, 
  fetchWorkOrderPriorities,
  createWorkOrder,
  updateWorkOrder 
} from '@/services/workOrders'
import { fetchSites } from '@/services/sites'
import { querySitesByClientId } from '@/services/sites/siteQueryService'
import { 
  workOrderFormSchema, 
  WorkOrder, 
  type WorkOrderFormValues 
} from '@/schema/operations/workOrder.schema'

interface UseWorkOrderFormProps {
  initialData?: Partial<WorkOrder>;
  onSuccess: () => void;
}

export function useWorkOrderForm({ initialData, onSuccess }: UseWorkOrderFormProps) {
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

  return {
    form,
    sites,
    statuses,
    categories,
    priorities,
    onSubmit,
    selectedClientId,
    setSelectedClientId,
    isEditing: !!initialData?.id
  }
}
