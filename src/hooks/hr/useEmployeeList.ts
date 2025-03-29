
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Employee } from '@/types/employee.types'
import { 
  fetchEmployees, 
  fetchDepartments, 
  fetchEmploymentTypes, 
  fetchEmployeeStatuses 
} from '@/services/employeeService'
import { createQueryErrorHandler } from '@/utils/databaseErrorHandlers'
import { useEmployeeFilters } from './useEmployeeFilters'
import { useEmployeeSorting } from './useEmployeeSorting'
import { useEmployeePagination } from './useEmployeePagination'
import { useEmployeeDialogs } from './useEmployeeDialogs'
import { processEmployeeData } from '@/utils/employeeDataUtils'

export function useEmployeeList() {
  console.log('Initializing useEmployeeList hook');
  
  // Extract filter functionality
  const {
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    clearFilters
  } = useEmployeeFilters();

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
      return processEmployeeData(employeesRaw) as Employee[];
    }, [employeesRaw]);

    // Extract sorting functionality
    const { sortColumn, sortDirection, handleSort, sortedEmployees } = useEmployeeSorting(employees);

    // Extract pagination functionality
    const { currentPage, setCurrentPage, currentItems, totalPages, resetPagination } = useEmployeePagination(sortedEmployees);

    // Extract dialog functionality
    const {
      selectedEmployee,
      setSelectedEmployee,
      isDetailOpen,
      setIsDetailOpen,
      isAddEmployeeOpen,
      setIsAddEmployeeOpen,
    } = useEmployeeDialogs();

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

    // Enhanced filter change that also resets pagination
    const handleFilterChangeWithReset = (newFilters) => {
      handleFilterChange(newFilters);
      resetPagination();
    };

    return {
      searchTerm,
      setSearchTerm,
      filters,
      handleFilterChange: handleFilterChangeWithReset,
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
