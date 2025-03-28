
import React from 'react';
import { format } from 'date-fns';
import { ClipboardList, Edit, AlertCircle } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import { Employee } from '@/types/employee.types';

interface EmployeeTableProps {
  employees: Employee[] | null;
  isLoading: boolean;
  error: Error | null;
  sortColumn: keyof Employee | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof Employee) => void;
  onEditEmployee: (employee: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  error,
  sortColumn,
  sortDirection,
  onSort,
  onEditEmployee
}) => {
  const getOnboardingTasksIndicator = (employee: Employee) => {
    const totalTasks = 7;
    const completedTasks = employee.status === 'Onboarding' ? 3 : 0;

    return employee.status === 'Onboarding' ? (
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <ClipboardList className="h-4 w-4" />
        {completedTasks}/{totalTasks} Tasks
      </div>
    ) : null;
  };

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        Failed to load employees data. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading employee data...</div>;
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No employees found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            onClick={() => onSort('first_name')} 
            className="cursor-pointer hover:bg-gray-100"
          >
            Name {sortColumn === 'first_name' && (sortDirection === 'asc' ? '▲' : '▼')}
          </TableHead>
          <TableHead 
            onClick={() => onSort('job_title')} 
            className="cursor-pointer hover:bg-gray-100"
          >
            Position {sortColumn === 'job_title' && (sortDirection === 'asc' ? '▲' : '▼')}
          </TableHead>
          <TableHead 
            onClick={() => onSort('department')} 
            className="cursor-pointer hover:bg-gray-100"
          >
            Department {sortColumn === 'department' && (sortDirection === 'asc' ? '▲' : '▼')}
          </TableHead>
          <TableHead 
            onClick={() => onSort('start_date')} 
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
        {employees.map((employee) => (
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
                  onClick={() => onEditEmployee(employee)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EmployeeTable;
