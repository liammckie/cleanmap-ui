
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Employee, EmployeeFilters } from '@/types/employee.types'
import { 
  fetchEmployees, 
  fetchDepartments, 
  fetchEmploymentTypes, 
  fetchEmployeeStatuses 
} from '@/services/employeeService'
import { createQueryErrorHandler } from '@/utils/databaseErrorHandlers'

// Helper function to validate termination reasons - moved outside to avoid eval
function isValidTerminationReason(reason: string | null | undefined): boolean {
  if (!reason) return false;
  const validReasons = [
    'Resignation', 'Contract End', 'Termination', 'Retirement', 'Other'
  ];
  return validReasons.includes(reason);
}

export function useEmployeeList() {
  console.log('Initializing useEmployeeList hook');
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

  try {
    console.log('Setting up employee query');
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
    });

    // Process employee data to ensure correct typing
    const employees = useMemo(() => {
      console.log('Processing employee data', employeesRaw);
      if (!employeesRaw) return [] as Employee[];
      
      return employeesRaw.map(emp => ({
        ...emp,
        end_of_employment_reason: isValidTerminationReason(emp.end_of_employment_reason) 
          ? emp.end_of_employment_reason 
          : null
      })) as Employee[];
    }, [employeesRaw]);

    console.log('Setting up department query');
    const { data: departments = [] } = useQuery({
      queryKey: ['departments'],
      queryFn: fetchDepartments,
      meta: {
        onError: createQueryErrorHandler('departments')
      },
    });

    console.log('Setting up employment types query');
    const { data: employmentTypes = [] } = useQuery({
      queryKey: ['employmentTypes'],
      queryFn: fetchEmploymentTypes,
      meta: {
        onError: createQueryErrorHandler('employment types')
      },
    });

    console.log('Setting up employee statuses query');
    const { data: employeeStatuses = [] } = useQuery({
      queryKey: ['employeeStatuses'],
      queryFn: fetchEmployeeStatuses,
      meta: {
        onError: createQueryErrorHandler('employee statuses')
      },
    });

    const handleFilterChange = (newFilters: EmployeeFilters) => {
      setFilters(newFilters)
      setCurrentPage(1) // Reset to first page when filters change
    }

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

        const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true })
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }, [employees, sortColumn, sortDirection]);

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = sortedEmployees
      ? sortedEmployees.slice(indexOfFirstItem, indexOfLastItem)
      : []
    const totalPages = sortedEmployees ? Math.ceil(sortedEmployees.length / itemsPerPage) : 0

    return {
      searchTerm,
      setSearchTerm,
      filters,
      handleFilterChange,
      clearFilters,
      currentPage,
      setCurrentPage,
      sortColumn,
      sortDirection,
      handleSort,
      employees: sortedEmployees,
      currentItems,
      totalPages,
      isLoading,
      error,
      departments,
      employmentTypes,
      employeeStatuses,
      selectedEmployee,
      setSelectedEmployee,
      isDetailOpen,
      setIsDetailOpen,
      isAddEmployeeOpen,
      setIsAddEmployeeOpen,
      refetch
    }
  } catch (error) {
    console.error('Error in useEmployeeList hook:', error);
    // Return default values to prevent the application from crashing
    return {
      searchTerm: '',
      setSearchTerm: () => {},
      filters: { department: '', status: '', employmentType: '' },
      handleFilterChange: () => {},
      clearFilters: () => {},
      currentPage: 1,
      setCurrentPage: () => {},
      sortColumn: 'last_name' as keyof Employee,
      sortDirection: 'asc' as 'asc' | 'desc',
      handleSort: () => {},
      employees: [],
      currentItems: [],
      totalPages: 0,
      isLoading: false,
      error: new Error('Hook initialization failed'),
      departments: [],
      employmentTypes: [],
      employeeStatuses: [],
      selectedEmployee: null,
      setSelectedEmployee: () => {},
      isDetailOpen: false,
      setIsDetailOpen: () => {},
      isAddEmployeeOpen: false,
      setIsAddEmployeeOpen: () => {},
      refetch: () => Promise.resolve()
    }
  }
}
