
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClipboardList, ClipboardEdit } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { fetchWorkOrders, deleteWorkOrder } from '@/services/workOrders'
import { format } from 'date-fns'
import { StatusBadge, PriorityBadge } from '@/components/operations/workOrder/WorkOrderBadges'
import { WorkOrderFilters } from '@/components/operations/workOrder/WorkOrderFilters'
import { WorkOrderDialog } from '@/components/operations/workOrder/WorkOrderDialog'
import { WorkOrderDetails } from '@/components/operations/workOrder/WorkOrderDetails'

const WorkOrdersPage = () => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    siteId: '',
    status: '',
    category: '',
    priority: '',
    fromDate: '',
    toDate: '',
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null)

  // Use react-query to fetch work orders data with proper error handling
  const {
    data: workOrders,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['workOrders', searchTerm, filters],
    queryFn: () => fetchWorkOrders(searchTerm, filters),
    meta: {
      onError: (err: Error) => {
        console.error('Failed to fetch work orders:', err)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load work orders data. Please try again.',
        })
      },
    },
  })

  const clearFilters = () => {
    setFilters({
      siteId: '',
      status: '',
      category: '',
      priority: '',
      fromDate: '',
      toDate: '',
    })
    setSearchTerm('')
  }

  const handleCreateWorkOrder = () => {
    setSelectedWorkOrder(null)
    setIsCreateDialogOpen(true)
  }

  const handleEditWorkOrder = (workOrder: any) => {
    setSelectedWorkOrder(workOrder)
    setIsEditDialogOpen(true)
  }

  const handleViewDetails = (workOrder: any) => {
    setSelectedWorkOrder(workOrder)
    setIsDetailsOpen(true)
  }

  const handleDeleteWorkOrder = async () => {
    if (!selectedWorkOrder?.id) return

    try {
      await deleteWorkOrder(selectedWorkOrder.id)
      toast({
        title: 'Work Order Deleted',
        description: 'The work order has been successfully deleted.',
      })
      refetch()
    } catch (error) {
      console.error('Error deleting work order:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete work order. Please try again.',
      })
    }
  }

  // Function to get assigned staff names from work order assignments
  const getAssignedStaff = (workOrder: any) => {
    if (!workOrder.assignments || workOrder.assignments.length === 0) {
      return '-'
    }

    return (
      workOrder.assignments
        .map(
          (assignment: any) =>
            `${assignment.employee?.first_name || ''} ${assignment.employee?.last_name || ''}`,
        )
        .filter((name: string) => name.trim() !== '')
        .join(', ') || '-'
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-muted-foreground">Manage scheduled jobs and tasks</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleCreateWorkOrder}>
          <ClipboardList className="h-4 w-4" />
          New Work Order
        </Button>
      </div>

      <WorkOrderFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Work Orders</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${workOrders?.length || 0} work orders found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-4 text-red-500">
              Failed to load work orders data. Please try again.
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">Loading work order data...</div>
          ) : workOrders?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No work orders found. Try adjusting your search or filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders?.map((workOrder) => (
                  <TableRow 
                    key={workOrder.id} 
                    className="hover:bg-muted"
                    onClick={() => handleViewDetails(workOrder)}
                  >
                    <TableCell className="font-medium">{workOrder.title}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{workOrder.site?.site_name || '-'}</div>
                        {workOrder.site && workOrder.site.client && (
                          <div className="text-muted-foreground">
                            {workOrder.site.client.company_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(new Date(workOrder.scheduled_start), 'PPp')}</div>
                        <div className="text-muted-foreground">
                          Due: {format(new Date(workOrder.due_date), 'PPp')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{workOrder.category}</TableCell>
                    <TableCell>
                      <PriorityBadge priority={workOrder.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={workOrder.status} />
                    </TableCell>
                    <TableCell>{getAssignedStaff(workOrder)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWorkOrder(workOrder);
                        }}
                      >
                        <ClipboardEdit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Work Order Dialog */}
      <WorkOrderDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refetch}
      />

      {/* Edit Work Order Dialog */}
      <WorkOrderDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        workOrder={selectedWorkOrder}
        onSuccess={refetch}
      />

      {/* Work Order Details Sheet */}
      {selectedWorkOrder && (
        <WorkOrderDetails
          workOrderId={selectedWorkOrder.id}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onEdit={() => {
            setIsDetailsOpen(false)
            setIsEditDialogOpen(true)
          }}
          onDelete={handleDeleteWorkOrder}
        />
      )}
    </div>
  )
}

export default WorkOrdersPage
