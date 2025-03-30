
import React from 'react'
import { Form } from '@/components/ui/form'
import { WorkOrder } from '@/schema/operations/workOrder.schema'
import { useWorkOrderForm } from './hooks/useWorkOrderForm'
import {
  BasicInfoSection,
  SchedulingSection,
  DescriptionSection,
  FormActions
} from './form-sections'

interface WorkOrderFormProps {
  initialData?: Partial<WorkOrder>
  onSuccess: () => void
  onCancel: () => void
}

export function WorkOrderForm({ initialData, onSuccess, onCancel }: WorkOrderFormProps) {
  const {
    form,
    sites,
    statuses,
    categories,
    priorities,
    onSubmit,
    isEditing
  } = useWorkOrderForm({
    initialData,
    onSuccess
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection 
          sites={sites}
          categories={categories}
          priorities={priorities}
          statuses={statuses}
        />
        
        <SchedulingSection />
        
        <DescriptionSection />
        
        <FormActions onCancel={onCancel} isEditing={isEditing} />
      </form>
    </Form>
  )
}
