
import React from 'react'
import { Edit, AlertCircle } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import StatusBadge from './StatusBadge'
import { Employee } from '@/types/employee.types'
import { createErrorFallbackUI } from '@/utils/databaseErrorHandlers'
import { formatDate } from './employment/DateFormatter'

interface EmployeeTableProps {
  employees: Employee[] | null
  isLoading: boolean
  error: Error | null
  sortColumn: keyof Employee | null
  sortDirection: 'asc' | 'desc'
  onSort: (column: keyof Employee) => void
  onEditEmployee: (employee: Employee) => void
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  error,
  sortColumn,
  sortDirection,
  onSort,
  onEditEmployee,
}) => {
  const getOnboardingTasksIndicator = (employee: Employee) => {
    const totalTasks = 7
    const completedTasks = employee.status === 'Onboarding' ? 3 : 0

    return employee.status === 'Onboarding' ? (
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
        {completedTasks}/{totalTasks} Tasks
      </div>
    ) : null
  }

  const isTerminated = (employee: Employee) => {
    return employee.status === 'Terminated' && employee.end_of_employment_date
  }

  if (error) {
    const supabaseError = (error as any).error || error;
    
    if (supabaseError?.code === '42P17' || 
        supabaseError?.message?.includes('infinite recursion')) {
      return createErrorFallbackUI(supabaseError, 'employees');
    }
    
    return (
      <div className="text-center py-4 text-red-500">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        Failed to load employees data. Please try again.
        <p className="text-sm mt-2 text-red-400">Error: {error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent align-[-0.125em]"></div>
        <p className="mt-2 text-muted-foreground">Loading employee data...</p>
      </div>
    )
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="mb-2">No employees found</p>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => onSort('first_name')}
              className="cursor-pointer hover:bg-gray-100"
            >
              Name {sortColumn === 'first_name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead
              onClick={() => onSort('job_title')}
              className="cursor-pointer hover:bg-gray-100"
            >
              Position {sortColumn === 'job_title' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead
              onClick={() => onSort('department')}
              className="cursor-pointer hover:bg-gray-100"
            >
              Department {sortColumn === 'department' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead
              onClick={() => onSort('start_date')}
              className="cursor-pointer hover:bg-gray-100"
            >
              Start Date {sortColumn === 'start_date' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead>Status/Details</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                {employee.first_name} {employee.last_name}
              </TableCell>
              <TableCell>{employee.job_title}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{formatDate(employee.start_date)}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <StatusBadge status={employee.status} />
                  
                  {isTerminated(employee) ? (
                    <div className="text-sm text-red-600">
                      End: {formatDate(employee.end_of_employment_date)}
                    </div>
                  ) : (
                    getOnboardingTasksIndicator(employee)
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => onEditEmployee(employee)}>
                  <Edit className="h-4 w-4 mr-2" /> View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default EmployeeTable
