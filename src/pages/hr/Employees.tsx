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

import {
  Employee,
  EmployeeFilters,
  EmploymentTerminationReason,
} from '@/types/employee.types'

import EmployeeFilterCard from '@/components/hr/EmployeeFilters'
import EmployeeTable from '@/components/hr/EmployeeTable'
import EmployeeDetailsDialog from '@/components/hr/EmployeeDetailsDialog'
import EmployeePagination from '@/components/hr/EmployeePagination'
import AddEmployeeDialog from '@/components/hr/AddEmployeeDialog'

function isValidTerminationReason(
  reason: string | null | undefined
): reason is EmploymentTerminationReason {
  const validReasons: EmploymentTerminationReason[] = [
    'Resignation',
    'Contract End',
    'Termination',
    'Retirement',
    'Other',
  ]
  return !!reason && validReasons.includes(reason as EmploymentTerminationReason)
}

const EmployeesPage = () => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    employmentType: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)

  const [sortColumn, setSortColumn] = useState<keyof Employee>('last_name')
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
      onError: (err: Error) => {
        console.error('Failed to fetch employees:', err)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load employees data. Please try again.',
        })
      },
    },
  })

  const employees = useMemo(() => {
    if (!employeesRaw) return [] as Employee[]
    return employeesRaw.map((emp) => ({
      ...emp,
      end_of_employment_reason: isValidTerminationReason(
        emp.end_of_employment_reason
      )
        ? emp.end_of_employment_reason
        : null,
    }))
  }, [employeesRaw])

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  })

  const { data: employmentTypes = [] } = useQuery({
    queryKey: ['employmentTypes'],
    queryFn: fetchEmploymentTypes,
  })

  const { data: employeeStatuses = [] } = useQuery({
    queryKey: ['employeeStatuses'],
    queryFn: fetchEmployeeStatuses,
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
  const currentItems = sortedEmployees?.slice(indexOfFirstItem, indexOfLastItem) || []
  const totalPages = Math.ceil(sortedEmployees?.length / itemsPerPage)

  const handleViewEmployee = (employee: Employee) => {
    const processedEmployee: Employee = {
      ...employee,
      end_of_employment_reason: isValidTerminationReason(
        employee.end_of_employment_reason
      )
        ? employee.end_of_employment_reason
        : null,
    }
    setSelectedEmployee(processedEmployee)
    setIsDetailOpen(true)
  }

  const handleFilterChange = (newFilters: EmployeeFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleEmployeeAdded = () => {
    refetch()
    toast({
      title: 'Success',
      description: 'Employee list has been refreshed with the new data.',
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Button onClick={() => setIsAddEmployeeOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <p className="text-muted-foreground">Manage your staff and team members</p>

      <EmployeeFilterCard
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={clearFilters}
        departments={departments}
        employmentTypes={employmentTypes}
        statuses={employeeStatuses}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Employee Directory</h2>
        <span className="text-sm text-muted-foreground">
          {isLoading
            ? 'Loading...'
            : `${sortedEmployees?.length || 0} employees found`}
        </span>
      </div>

      {employees.length > 0 && (
        <EmployeeTable
          employees={currentItems}
          onRowClick={handleViewEmployee}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      )}

      <EmployeePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <AddEmployeeDialog
        open={isAddEmployeeOpen}
        onOpenChange={setIsAddEmployeeOpen}
        onEmployeeAdded={handleEmployeeAdded}
      />

      {selectedEmployee && (
        <EmployeeDetailsDialog
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          employee={selectedEmployee}
        />
      )}
    </div>
  )
}

export default EmployeesPage