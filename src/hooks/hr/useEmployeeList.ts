
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

  // Safely wrap the employee query to prevent syntax errors
  const employeeQuery = useQuery({
    queryKey: ['employees', searchTerm, filters],
    queryFn: () => fetchEmployees(searchTerm, filters),
    meta: {
      onError: createQueryErrorHandler('employees')
    },
  });

  const {
    data: employeesRaw,
    isLoading,
    error,
    refetch,
  } = employeeQuery;

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

  // Department query
  const departmentQuery = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    meta: {
      onError: createQueryErrorHandler('departments')
    },
  });

  // Employment types query
  const employmentTypesQuery = useQuery({
    queryKey: ['employmentTypes'],
    queryFn: fetchEmploymentTypes,
    meta: {
      onError: createQueryErrorHandler('employment types')
    },
  });

  // Employee statuses query
  const employeeStatusesQuery = useQuery({
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
    departments: departmentQuery.data || [],
    employmentTypes: employmentTypesQuery.data || [],
    employeeStatuses: employeeStatusesQuery.data || [],
    selectedEmployee,
    setSelectedEmployee,
    isDetailOpen,
    setIsDetailOpen,
    isAddEmployeeOpen,
    setIsAddEmployeeOpen,
    refetch
  };
}
