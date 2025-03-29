
import React, { useEffect } from 'react'
import { UserPlus } from 'lucide-react'
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Employee } from '@/types/employee.types'
import { useToast } from '@/hooks/use-toast'
import { useEmployeeList } from '@/hooks/hr/useEmployeeList'

// Import our components
import EmployeeFilterCard from '@/components/hr/EmployeeFilters'
import EmployeeTable from '@/components/hr/EmployeeTable'
import EmployeeDetailsDialog from '@/components/hr/EmployeeDetailsDialog'
import EmployeePagination from '@/components/hr/EmployeePagination'
import AddEmployeeDialog from '@/components/hr/AddEmployeeDialog'

const EmployeesPage = () => {
  const { toast } = useToast()
  
  const {
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
  } = useEmployeeList();

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailOpen(true);
  }

  const handleEmployeeAdded = () => {
    refetch();
    toast({
      title: 'Success',
      description: 'Employee added successfully.',
    });
  }

  // Show appropriate error message if something goes wrong
  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Employee Page</h1>
        <div className="bg-red-50 p-4 rounded mt-4">
          <p>There was an error loading the employee data.</p>
          <p className="text-sm mt-2 font-mono">{error instanceof Error ? error.message : String(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your staff and team members</p>
        </div>
        <Button 
          className="flex items-center gap-2" 
          onClick={() => setIsAddEmployeeOpen(true)}
        >
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Employee Directory</h2>
              <CardDescription>
                {isLoading 
                  ? 'Loading employee data...' 
                  : `${currentItems?.length || 0} ${currentItems?.length === 1 ? 'employee' : 'employees'} found`
                }
              </CardDescription>
            </div>
          </div>
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
        {currentItems && currentItems.length > 0 && (
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
  );
}

export default EmployeesPage
