import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Search, 
  FilterX, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  AlertCircle,
  Edit,
  ClipboardList
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchEmployees, 
  fetchDepartments, 
  fetchEmploymentTypes,
  fetchEmployeeStatuses 
} from '@/services/employeeService';
import { format } from 'date-fns';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'onboarding':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge className={`${getStatusColor(status)}`}>
      {status}
    </Badge>
  );
};

const EmployeesPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    employmentType: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [sortColumn, setSortColumn] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employees', searchTerm, filters],
    queryFn: () => fetchEmployees(searchTerm, filters),
    meta: {
      onError: (err: Error) => {
        console.error('Failed to fetch employees:', err);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load employees data. Please try again.',
        });
      }
    }
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments
  });

  const { data: employmentTypes = [] } = useQuery({
    queryKey: ['employmentTypes'],
    queryFn: fetchEmploymentTypes
  });

  const { data: employeeStatuses = [] } = useQuery({
    queryKey: ['employeeStatuses'],
    queryFn: fetchEmployeeStatuses
  });

  const clearFilters = () => {
    setFilters({
      department: '',
      status: '',
      employmentType: ''
    });
    setSearchTerm('');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employees ? employees.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = employees ? Math.ceil(employees.length / itemsPerPage) : 0;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDetailOpen(true);
  };

  const handleSort = (column: keyof Employee) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedEmployees = useMemo(() => {
    if (!employees || !sortColumn) return employees || [];

    return [...employees].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const comparison = 
        aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true });
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [employees, sortColumn, sortDirection]);

  const getOnboardingTasksIndicator = (employee: any) => {
    const totalTasks = 7;
    const completedTasks = employee.status === 'Onboarding' ? 3 : 0;

    return employee.status === 'Onboarding' ? (
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <ClipboardList className="h-4 w-4" />
        {completedTasks}/{totalTasks} Tasks
      </div>
    ) : null;
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your staff and team members</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find employees by name, email, role, or other criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={clearFilters}
            >
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Department</label>
              <Select 
                value={filters.department} 
                onValueChange={(value) => setFilters({...filters, department: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all-departments">All Departments</SelectItem>
                    {departments.map((dept: string) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters({...filters, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all-statuses">All Statuses</SelectItem>
                    {employeeStatuses.map((status: string) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Employment Type</label>
              <Select 
                value={filters.employmentType} 
                onValueChange={(value) => setFilters({...filters, employmentType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all-types">All Types</SelectItem>
                    {employmentTypes.map((type: string) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${sortedEmployees?.length || 0} employees found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-4 text-red-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              Failed to load employees data. Please try again.
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">Loading employee data...</div>
          ) : sortedEmployees?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No employees found. Try adjusting your search or filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    onClick={() => handleSort('first_name')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    Name {sortColumn === 'first_name' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('job_title')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    Position {sortColumn === 'job_title' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('department')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    Department {sortColumn === 'department' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('start_date')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    Start Date {sortColumn === 'start_date' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead>Onboarding Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.first_name} {employee.last_name}</TableCell>
                    <TableCell>{employee.job_title}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      {employee.start_date ? format(new Date(employee.start_date), 'dd MMM yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {getOnboardingTasksIndicator(employee)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={employee.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewEmployee(employee)}
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {employees && employees.length > 0 && (
          <CardFooter className="flex justify-center py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => {
                  if (
                    i === 0 || 
                    i === totalPages - 1 || 
                    (i >= currentPage - 2 && i <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    i === currentPage - 3 || 
                    i === currentPage + 2
                  ) {
                    return <PaginationEllipsis key={i} />;
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedEmployee.first_name} {selectedEmployee.last_name}
                </DialogTitle>
                <DialogDescription>
                  Employee ID: {selectedEmployee.employee_id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2 text-md">Personal Details</h3>
                  <div className="text-sm grid gap-2">
                    <div>
                      <span className="text-muted-foreground">Date of Birth:</span>{' '}
                      {selectedEmployee.date_of_birth ? format(new Date(selectedEmployee.date_of_birth), 'dd MMM yyyy') : 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      {selectedEmployee.contact_phone}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      {selectedEmployee.contact_email}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Address:</span>{' '}
                      {selectedEmployee.address_street}, {selectedEmployee.address_city}, {selectedEmployee.address_state} {selectedEmployee.address_postcode}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-md">Employment Details</h3>
                  <div className="text-sm grid gap-2">
                    <div>
                      <span className="text-muted-foreground">Position:</span>{' '}
                      {selectedEmployee.job_title}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Department:</span>{' '}
                      {selectedEmployee.department}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Start Date:</span>{' '}
                      {selectedEmployee.start_date ? format(new Date(selectedEmployee.start_date), 'dd MMM yyyy') : 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>{' '}
                      {selectedEmployee.employment_type}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>{' '}
                      <StatusBadge status={selectedEmployee.status} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-md">Payroll Details</h3>
                <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Wage Classification:</span>{' '}
                    {selectedEmployee.wage_classification}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pay Rate:</span>{' '}
                    ${selectedEmployee.pay_rate}/hr
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pay Cycle:</span>{' '}
                    {selectedEmployee.pay_cycle}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Super Fund:</span>{' '}
                    {selectedEmployee.super_fund_name}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">View Full Profile</Button>
                <Button>Edit Employee</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;
