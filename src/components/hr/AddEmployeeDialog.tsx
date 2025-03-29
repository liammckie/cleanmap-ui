
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { createEmployee } from '@/services/employeeService'
import { Employee, EmploymentTerminationReason } from '@/types/employee.types'
import PersonalInfoForm from './PersonalInfoForm'
import EmploymentDetailsForm from './EmploymentDetailsForm'
import PayrollDetailsForm from './PayrollDetailsForm'

interface AddEmployeeDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  departments: string[]
  employeeStatuses: string[]
  employmentTypes: string[]
  onEmployeeAdded: () => void
}

// Helper function to validate termination reasons
const isValidTerminationReason = (value: string): value is EmploymentTerminationReason => {
  const validReasons: EmploymentTerminationReason[] = [
    'Resignation', 'Contract End', 'Termination', 'Retirement', 'Other'
  ];
  return validReasons.includes(value as EmploymentTerminationReason);
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  isOpen,
  onOpenChange,
  departments,
  employeeStatuses,
  employmentTypes,
  onEmployeeAdded,
}) => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dobCalendarOpen, setDobCalendarOpen] = useState(false)
  const [startDateCalendarOpen, setStartDateCalendarOpen] = useState(false)

  // Initial form state
  const [formData, setFormData] = useState<Partial<Employee>>({
    first_name: '',
    last_name: '',
    date_of_birth: new Date(),
    contact_phone: '',
    contact_email: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_postcode: '',
    employee_id: `EMP-${Math.floor(100000 + Math.random() * 900000)}`, // Generate random employee ID
    job_title: '',
    department: '',
    start_date: new Date(),
    employment_type: 'Full-time',
    status: 'Onboarding',
    wage_classification: '',
    pay_rate: 0,
    pay_cycle: 'Fortnightly',
    tax_id: '',
    bank_bsb: '',
    bank_account_number: '',
    super_fund_name: '',
    super_member_number: '',
    end_of_employment_date: null,
    end_of_employment_reason: null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pay_rate' ? parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    // Special handling for end_of_employment_reason
    if (name === 'end_of_employment_reason') {
      setFormData((prev) => ({
        ...prev,
        [name]: isValidTerminationReason(value) ? value : null,
      }));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [name]: date,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('Submitting employee data:', formData)
      
      // Create the employee
      await createEmployee(formData as Employee)

      // Show success message
      toast({
        title: 'Employee Added',
        description: `Successfully added ${formData.first_name} ${formData.last_name} to the system.`,
      })

      // Close the dialog and refresh the employee list
      onOpenChange(false)
      onEmployeeAdded()

      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: new Date(),
        contact_phone: '',
        contact_email: '',
        address_street: '',
        address_city: '',
        address_state: '',
        address_postcode: '',
        employee_id: `EMP-${Math.floor(100000 + Math.random() * 900000)}`,
        job_title: '',
        department: '',
        start_date: new Date(),
        employment_type: 'Full-time',
        status: 'Onboarding',
        wage_classification: '',
        pay_rate: 0,
        pay_cycle: 'Fortnightly',
        tax_id: '',
        bank_bsb: '',
        bank_account_number: '',
        super_fund_name: '',
        super_member_number: '',
        end_of_employment_date: null,
        end_of_employment_reason: null,
      })
    } catch (error) {
      console.error('Error adding employee:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add employee. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Enter employee details to create a new record in the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <PersonalInfoForm
              formData={formData as any}
              handleInputChange={handleInputChange}
              handleDateChange={handleDateChange}
              dobCalendarOpen={dobCalendarOpen}
              setDobCalendarOpen={setDobCalendarOpen}
            />

            {/* Employment Details Section */}
            <EmploymentDetailsForm
              formData={formData as any}
              departments={departments}
              employmentTypes={employmentTypes}
              employeeStatuses={employeeStatuses}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleDateChange={handleDateChange}
              startDateCalendarOpen={startDateCalendarOpen}
              setStartDateCalendarOpen={setStartDateCalendarOpen}
            />
          </div>

          {/* Payroll Details Section */}
          <PayrollDetailsForm
            formData={formData as any}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddEmployeeDialog
