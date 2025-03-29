
import React from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { Pencil, Trash2, UserCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { fetchWorkOrderById } from '@/services/workOrders'
import { fetchWorkOrderAssignments } from '@/services/workOrders/workOrderAssignmentService'
import { StatusBadge, PriorityBadge } from './WorkOrderBadges'
import { confirm } from '@/components/ui/confirm'
import { useToast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'

interface WorkOrderDetailsProps {
  workOrderId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => Promise<void>
}

export function WorkOrderDetails({
  workOrderId,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: WorkOrderDetailsProps) {
  const { toast } = useToast()

  // Fetch work order details
  const {
    data: workOrder,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['workOrder', workOrderId],
    queryFn: () => fetchWorkOrderById(workOrderId),
    enabled: open && !!workOrderId,
  })

  // Fetch work order assignments
  const { data: assignments = [] } = useQuery({
    queryKey: ['workOrderAssignments', workOrderId],
    queryFn: () => fetchWorkOrderAssignments(workOrderId),
    enabled: open && !!workOrderId,
  })

  // Handle delete confirmation
  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Work Order',
      description: 'Are you sure you want to delete this work order? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })

    if (confirmed) {
      try {
        await onDelete()
        toast({
          title: 'Work Order Deleted',
          description: 'The work order has been successfully deleted.',
        })
        onOpenChange(false)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete work order. Please try again.',
        })
      }
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Work Order Details</SheetTitle>
          <SheetDescription>View work order information and details</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading work order details...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Error loading work order details. Please try again.</p>
          </div>
        ) : workOrder ? (
          <div className="space-y-6 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{workOrder.title}</h3>
                <p className="text-muted-foreground">
                  {workOrder.work_order_number || `WO-${workOrder.id.slice(0, 8)}`}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                <StatusBadge status={workOrder.status} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Priority</p>
                <PriorityBadge priority={workOrder.priority} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Category</p>
                <p>{workOrder.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Site</p>
                <p>{workOrder.site?.site_name || 'Not specified'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Client</p>
                <p>{workOrder.site?.client?.company_name || 'Not specified'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Estimated Hours</p>
                <p>{workOrder.estimated_hours || 'Not specified'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Scheduled Start</p>
                <p>
                  {workOrder.scheduled_start 
                    ? format(new Date(workOrder.scheduled_start), 'PPp') 
                    : 'Not scheduled'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Due Date</p>
                <p>
                  {workOrder.due_date
                    ? format(new Date(workOrder.due_date), 'PPp')
                    : 'No due date'}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-sm whitespace-pre-wrap">{workOrder.description}</p>
            </div>

            {workOrder.notes && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Notes</h4>
                <p className="text-sm whitespace-pre-wrap">{workOrder.notes}</p>
              </div>
            )}

            <Separator />

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Assigned Staff</CardTitle>
                  <Button variant="ghost" size="sm">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>
                <CardDescription>Staff assigned to this work order</CardDescription>
              </CardHeader>
              <CardContent>
                {assignments.length > 0 ? (
                  <ul className="space-y-2">
                    {assignments.map((assignment) => (
                      <li key={assignment.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {assignment.employee?.first_name} {assignment.employee?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.assignment_type}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No staff assigned yet</p>
                )}
              </CardContent>
            </Card>

            {workOrder.completion_date && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Completion Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Completed On</p>
                      <p>
                        {format(new Date(workOrder.completion_date), 'PPp')}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Actual Hours</p>
                      <p>{workOrder.actual_hours || 'Not recorded'}</p>
                    </div>
                  </div>
                  {workOrder.outcome_notes && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Outcome Notes</p>
                      <p className="text-sm whitespace-pre-wrap">{workOrder.outcome_notes}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
