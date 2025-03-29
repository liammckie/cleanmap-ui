
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { WorkOrderForm } from './WorkOrderForm'
import type { WorkOrder } from '@/schema/operations/workOrder.schema'

interface WorkOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workOrder?: Partial<WorkOrder>
  onSuccess: () => void
}

export function WorkOrderDialog({ open, onOpenChange, workOrder, onSuccess }: WorkOrderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {workOrder?.id ? 'Edit Work Order' : 'Create New Work Order'}
          </DialogTitle>
        </DialogHeader>
        <WorkOrderForm
          initialData={workOrder}
          onSuccess={() => {
            onSuccess()
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
