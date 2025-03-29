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
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ClipboardList, Search, FilterX } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { fetchWorkOrders } from '@/services/workOrders'
import { format } from 'date-fns'

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
}

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return <Badge className={`${getPriorityColor(priority)}`}>{priority}</Badge>
}

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

  // Use react-query to fetch work orders data with proper error handling
  const {
    data: workOrders,
    isLoading,
    error,
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
        <Button className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          New Work Order
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find work orders by title, description, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search work orders..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* More filter options would go here in a real implementation */}
            <Button variant="outline" className="flex items-center gap-2" onClick={clearFilters}>
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

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
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders?.map((workOrder) => (
                  <TableRow key={workOrder.id} className="cursor-pointer hover:bg-muted">
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkOrdersPage
