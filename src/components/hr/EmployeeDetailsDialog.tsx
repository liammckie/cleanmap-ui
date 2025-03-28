
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"; 
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
  const [isEditMode, setIsEditMode] = useState(false);

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

  // For demonstration, we'll use fake data for onboarding tasks and site assignments
  const onboardingTasks = [
    { id: 1, task: "Complete tax declaration form", status: "Completed", dueDate: new Date(), assignee: "HR" },
    { id: 2, task: "IT setup and account creation", status: "Completed", dueDate: new Date(), assignee: "IT" },
    { id: 3, task: "Site-specific training", status: "In Progress", dueDate: new Date(), assignee: "Training" },
    { id: 4, task: "Health & safety induction", status: "Pending", dueDate: new Date(), assignee: "Operations" },
    { id: 5, task: "Review company policies", status: "Pending", dueDate: new Date(), assignee: "HR" },
  ];

  const siteAssignments = [
    { id: 1, site: "Metropolis Tower", role: "Cleaner", startDate: new Date() },
    { id: 2, site: "Waterfront Office Park", role: "Team Lead", startDate: new Date() },
  ];

  // If we're in edit mode, show the employee edit form in a side sheet
  if (isEditMode) {
    return (
      <Sheet open={isEditMode} onOpenChange={setIsEditMode}>
        <SheetContent side="right" className="w-[900px] max-w-full">
          <SheetHeader>
            <SheetTitle>Edit Employee: {employee.first_name} {employee.last_name}</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <p className="text-muted-foreground">
              Employee editing form would be implemented here.
            </p>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsEditMode(false)}>Cancel</Button>
            <Button>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-xl">
                {employee.first_name} {employee.last_name}
              </DialogTitle>
              <DialogDescription>
                Employee ID: {employee.employee_id}
              </DialogDescription>
            </div>
            <StatusBadge status={employee.status} />
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            {employee.status === 'Onboarding' && (
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            )}
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-md border-b pb-2">Personal Details</h3>
                <div className="text-sm grid gap-3">
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
                <h3 className="font-semibold mb-3 text-md border-b pb-2">Employment Details</h3>
                <div className="text-sm grid gap-3">
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
          </TabsContent>
          
          <TabsContent value="payroll">
            <div className="space-y-6">
              <h3 className="font-semibold mb-3 text-md border-b pb-2">Payroll Details</h3>
              <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  <span className="text-muted-foreground">Tax File Number:</span>{' '}
                  {employee.tax_id}
                </div>
                <div>
                  <span className="text-muted-foreground">Bank Account:</span>{' '}
                  {employee.bank_bsb} / {employee.bank_account_number}
                </div>
                <div>
                  <span className="text-muted-foreground">Super Fund:</span>{' '}
                  {employee.super_fund_name} ({employee.super_member_number})
                </div>
              </div>
            </div>
          </TabsContent>
          
          {employee.status === 'Onboarding' && (
            <TabsContent value="onboarding">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-md border-b pb-2">Onboarding Tasks</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {Math.round((onboardingTasks.filter(t => t.status === "Completed").length / onboardingTasks.length) * 100)}% Complete
                  </Badge>
                </div>
                
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                      <th className="p-2">Task</th>
                      <th className="p-2">Assignee</th>
                      <th className="p-2">Due Date</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {onboardingTasks.map(task => (
                      <tr key={task.id} className="border-b">
                        <td className="p-2">{task.task}</td>
                        <td className="p-2">{task.assignee}</td>
                        <td className="p-2">{format(task.dueDate, 'dd MMM yyyy')}</td>
                        <td className="p-2">
                          <Badge variant="outline" className={
                            task.status === "Completed" ? "bg-green-50 text-green-700" :
                            task.status === "In Progress" ? "bg-blue-50 text-blue-700" :
                            "bg-yellow-50 text-yellow-700"
                          }>
                            {task.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="assignments">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-md border-b pb-2">Site Assignments</h3>
                <Button variant="outline" size="sm">Assign to Site</Button>
              </div>
              
              {siteAssignments.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                      <th className="p-2">Site</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Start Date</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteAssignments.map(assignment => (
                      <tr key={assignment.id} className="border-b">
                        <td className="p-2">{assignment.site}</td>
                        <td className="p-2">{assignment.role}</td>
                        <td className="p-2">{format(assignment.startDate, 'dd MMM yyyy')}</td>
                        <td className="p-2">
                          <Button variant="outline" size="sm">Remove</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No site assignments found for this employee.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => setIsEditMode(true)}>Edit Employee</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsDialog;
