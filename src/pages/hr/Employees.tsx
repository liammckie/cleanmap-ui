
import React, { useState } from 'react';
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
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, FilterX } from 'lucide-react';

// Temporary mock data - will be replaced with actual API calls
const mockEmployees = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    job_title: 'Cleaning Supervisor',
    department: 'Operations',
    employment_type: 'Full-time',
    status: 'Active',
    contact_email: 'john.doe@example.com',
    contact_phone: '0412 345 678'
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    job_title: 'Cleaner',
    department: 'Operations',
    employment_type: 'Part-time',
    status: 'Onboarding',
    contact_email: 'jane.smith@example.com',
    contact_phone: '0423 456 789'
  },
  {
    id: '3',
    first_name: 'Michael',
    last_name: 'Brown',
    job_title: 'HR Specialist',
    department: 'Human Resources',
    employment_type: 'Full-time',
    status: 'Active',
    contact_email: 'michael.brown@example.com',
    contact_phone: '0434 567 890'
  }
];

// Status badge component
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    employmentType: ''
  });

  // This will be replaced with an actual API call using react-query
  // const { data: employees, isLoading, error } = useQuery({
  //   queryKey: ['employees', searchTerm, filters],
  //   queryFn: () => fetchEmployees(searchTerm, filters)
  // });

  // For now, we're using mock data
  const employees = mockEmployees.filter(emp => 
    (emp.first_name.toLowerCase() + ' ' + emp.last_name.toLowerCase()).includes(searchTerm.toLowerCase()) ||
    emp.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearFilters = () => {
    setFilters({
      department: '',
      status: '',
      employmentType: ''
    });
    setSearchTerm('');
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* More filter options would go here in a real implementation */}
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={clearFilters}
            >
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            {employees.length} employees found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="cursor-pointer hover:bg-muted">
                  <TableCell className="font-medium">
                    {employee.first_name} {employee.last_name}
                  </TableCell>
                  <TableCell>{employee.job_title}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.employment_type}</TableCell>
                  <TableCell>
                    <StatusBadge status={employee.status} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{employee.contact_email}</div>
                      <div className="text-muted-foreground">{employee.contact_phone}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesPage;
