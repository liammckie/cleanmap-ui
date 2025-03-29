
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Employee } from '@/types/employee.types'
import { 
  fetchEmployees, 
  fetchDepartments, 
  fetchEmploymentTypes, 
  fetchEmployeeStatuses 
} from '@/services/employees'
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

  // Fetch employees with enhanced logging
  const employeeQuery = useQuery({
    queryKey: ['employees', searchTerm, filters],
    queryFn: () => {
      console.group('Employee Data Fetch');
      console.log('Search Term:', searchTerm);
      console.log('Filters:', filters);
      return fetchEmployees(searchTerm, filters)
        .then(data => {
          console.log('Raw Employee Data:', data);
          console.log('Employee Data Type:', typeof data);
          console.log('Employee Data Length:', data?.length);
          console.groupEnd();
          return data;
        })
        .catch(error => {
          console.error('Employee Fetch Error:', error);
          console.groupEnd();
          throw error;
        });
    },
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

  // Enhanced logging for data processing
  const employees = useMemo(() => {
    console.group('Employee Data Processing');
    console.log('Raw Data:', employeesRaw);
    
    if (!employeesRaw) {
      console.warn('No raw employee data to process');
      console.groupEnd();
      return [];
    }
    
    try {
      const processedEmployees = processEmployeeData(employeesRaw) as Employee[];
      console.log('Processed Employees:', processedEmployees);
      console.log('Processed Employees Length:', processedEmployees.length);
      console.groupEnd();
      return processedEmployees;
    } catch (error) {
      console.error('Employee Data Processing Error:', error);
      console.groupEnd();
      return [];
    }
  }, [employeesRaw]);

  // Extract sorting functionality
  const { 
    sortColumn, 
    sortDirection, 
    handleSort, 
    sortedEmployees 
  } = useEmployeeSorting(employees);

  // Extract pagination functionality
  const { 
    currentPage, 
    setCurrentPage, 
    currentItems, 
    totalPages, 
    resetPagination 
  } = useEmployeePagination(sortedEmployees);

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
