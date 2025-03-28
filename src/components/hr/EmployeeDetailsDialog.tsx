
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StatusBadge from './StatusBadge';
import { Employee } from '@/types/employee.types';

interface EmployeeDetailsDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployeeDetailsDialog: React.FC<EmployeeDetailsDialogProps> = ({
  employee,
  isOpen,
  onOpenChange
}) => {
  if (!employee) return null;

  // Helper function to safely format dates that could be strings or Date objects
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return 'N/A';
    
    try {
      // If it's a string, parse it first
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return format(dateObj, 'dd MMM yyyy');
    } catch (e) {
      console.error('Invalid date:', date);
      return 'N/A';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {employee.first_name} {employee.last_name}
          </DialogTitle>
          <DialogDescription>
            Employee ID: {employee.employee_id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2 text-md">Personal Details</h3>
            <div className="text-sm grid gap-2">
              <div>
                <span className="text-muted-foreground">Date of Birth:</span>{' '}
                {formatDate(employee.date_of_birth)}
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>{' '}
                {employee.contact_phone}
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>{' '}
                {employee.contact_email}
              </div>
              <div>
                <span className="text-muted-foreground">Address:</span>{' '}
                {employee.address_street}, {employee.address_city}, {employee.address_state} {employee.address_postcode}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2 text-md">Employment Details</h3>
            <div className="text-sm grid gap-2">
              <div>
                <span className="text-muted-foreground">Position:</span>{' '}
                {employee.job_title}
              </div>
              <div>
                <span className="text-muted-foreground">Department:</span>{' '}
                {employee.department}
              </div>
              <div>
                <span className="text-muted-foreground">Start Date:</span>{' '}
                {formatDate(employee.start_date)}
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>{' '}
                {employee.employment_type}
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>{' '}
                <StatusBadge status={employee.status} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-md">Payroll Details</h3>
          <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">Wage Classification:</span>{' '}
              {employee.wage_classification}
            </div>
            <div>
              <span className="text-muted-foreground">Pay Rate:</span>{' '}
              ${employee.pay_rate}/hr
            </div>
            <div>
              <span className="text-muted-foreground">Pay Cycle:</span>{' '}
              {employee.pay_cycle}
            </div>
            <div>
              <span className="text-muted-foreground">Super Fund:</span>{' '}
              {employee.super_fund_name}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline">View Full Profile</Button>
          <Button>Edit Employee</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsDialog;
