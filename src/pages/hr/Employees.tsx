
import React from 'react'
import { UserPlus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Employee } from '@/types/employee.types'
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
            {isLoading ? 'Loading...' : `${currentItems?.length || 0} employees found`}
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
  )
}

export default EmployeesPage
