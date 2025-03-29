import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserPlus } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  fetchEmployees,
  fetchDepartments,
  fetchEmploymentTypes,
  fetchEmployeeStatuses,
} from '@/services/employeeService'
import { Employee, EmployeeFilters, EmploymentTerminationReason } from '@/types/employee.types'
import { createQueryErrorHandler } from '@/utils/databaseErrorHandlers'

// Import our components
import EmployeeFilterCard from '@/components/hr/EmployeeFilters'
import EmployeeTable from '@/components/hr/EmployeeTable'
import EmployeeDetailsDialog from '@/components/hr/EmployeeDetailsDialog'
import EmployeePagination from '@/components/hr/EmployeePagination'
import AddEmployeeDialog from '@/components/hr/AddEmployeeDialog'

// Helper function to validate termination reasons
function isValidTerminationReason(reason: string | null | undefined): reason is EmploymentTerminationReason {
  if (!reason) return false;
  const validReasons: EmploymentTerminationReason[] = [
    'Resignation', 'Contract End', 'Termination', 'Retirement', 'Other'
  ];
  return validReasons.includes(reason as EmploymentTerminationReason);
}

const EmployeesPage = () => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<EmployeeFilters>({
    department: '',
    status: '',
    employmentType: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)

  const [sortColumn, setSortColumn] = useState<keyof Employee | null>('last_name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const {
    data: employeesRaw,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['employees', searchTerm, filters],
    queryFn: () => fetchEmployees(searchTerm, filters),
    meta: {
      onError: createQueryErrorHandler('employees')
    },
  })

  // Process employee data to ensure correct typing
  const employees = useMemo(() => {
    if (!employeesRaw) return [] as Employee[];
    
    return employeesRaw.map(emp => ({
      ...emp,
      end_of_employment_reason: isValidTerminationReason(emp.end_of_employment_reason) 
        ? emp.end_of_employment_reason 
        : null
    })) as Employee[];
  }, [employeesRaw]);

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    meta: {
      onError: createQueryErrorHandler('departments')
    },
  })

  const { data: employmentTypes = [] } = useQuery({
    queryKey: ['employmentTypes'],
    queryFn: fetchEmploymentTypes,
    meta: {
      onError: createQueryErrorHandler('employment types')
    },
  })

  const { data: employeeStatuses = [] } = useQuery({
    queryKey: ['employeeStatuses'],
    queryFn: fetchEmployeeStatuses,
    meta: {
      onError: createQueryErrorHandler('employee statuses')
    },
  })

  const clearFilters = () => {
    setFilters({
      department: '',
      status: '',
      employmentType: '',
    })
    setSearchTerm('')
  }

  const handleSort = (column: keyof Employee) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedEmployees = useMemo(() => {
    if (!employees || !sortColumn) return employees || []

    return [...employees].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue == null) return 1
      if (bValue == null) return -1

      const comparison = aValue
        .toString()
        .localeCompare(bValue.toString(), undefined, { numeric: true })

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [employees, sortColumn, sortDirection])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedEmployees
    ? sortedEmployees.slice(indexOfFirstItem, indexOfLastItem)
    : []
  const totalPages = sortedEmployees ? Math.ceil(sortedEmployees.length / itemsPerPage) : 0

  const handleViewEmployee = (employee: Employee) => {
    const processedEmployee: Employee = {
      ...employee,
      end_of_employment_reason: isValidTerminationReason(employee.end_of_employment_reason as any) 
        ? employee.end_of_employment_reason 
        : null
    };
    setSelectedEmployee(processedEmployee);
    setIsDetailOpen(true);
  }

  const handleFilterChange = (newFilters: EmployeeFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleEmployeeAdded = () => {
    refetch()
    toast({
      title: 'Success',
      description: 'Employee list has been refreshed with the new data.',
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your staff and team members</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsAddEmployeeOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <EmployeeFilterCard
        searchTerm={searchTerm}
        filters={filters}
        departments={departments}
        employeeStatuses={employeeStatuses}
        employmentTypes={employmentTypes}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${sortedEmployees?.length || 0} employees found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeTable
            employees={currentItems}
            isLoading={isLoading}
            error={error as Error}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEditEmployee={handleViewEmployee}
          />
        </CardContent>
        {employees && employees.length > 0 && (
          <CardFooter className="flex justify-center py-4">
            <EmployeePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardFooter>
        )}
      </Card>

      <EmployeeDetailsDialog
        employee={selectedEmployee}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <AddEmployeeDialog
        isOpen={isAddEmployeeOpen}
        onOpenChange={setIsAddEmployeeOpen}
        departments={departments}
        employeeStatuses={employeeStatuses}
        employmentTypes={employmentTypes}
        onEmployeeAdded={handleEmployeeAdded}
      />
    </div>
  )
}

export default EmployeesPage
