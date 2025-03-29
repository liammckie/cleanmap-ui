
import React, { useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { useToast } from '@/hooks/use-toast'
import { createEmployee } from '@/services/employeeService'
import { Employee } from '@/types/employee.types'

interface AddEmployeeDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  departments: string[]
  employeeStatuses: string[]
  employmentTypes: string[]
  onEmployeeAdded: () => void
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
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pay_rate' ? parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
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
            <div className="space-y-4">
              <h3 className="font-semibold text-md border-b pb-2">Personal Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name*</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name*</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth*</Label>
                <Popover open={dobCalendarOpen} onOpenChange={setDobCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.date_of_birth
                        ? format(formData.date_of_birth as Date, 'dd MMM yyyy')
                        : 'Select Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.date_of_birth as Date}
                      onSelect={(date) => {
                        handleDateChange('date_of_birth', date)
                        setDobCalendarOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone Number*</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Email Address*</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_street">Street Address*</Label>
                <Input
                  id="address_street"
                  name="address_street"
                  value={formData.address_street}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address_city">City*</Label>
                  <Input
                    id="address_city"
                    name="address_city"
                    value={formData.address_city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_state">State*</Label>
                  <Input
                    id="address_state"
                    name="address_state"
                    value={formData.address_state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_postcode">Postcode*</Label>
                <Input
                  id="address_postcode"
                  name="address_postcode"
                  value={formData.address_postcode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Employment Details Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-md border-b pb-2">Employment Details</h3>

              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee ID*</Label>
                <Input
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title*</Label>
                <Input
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department*</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date*</Label>
                <Popover open={startDateCalendarOpen} onOpenChange={setStartDateCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.start_date
                        ? format(formData.start_date as Date, 'dd MMM yyyy')
                        : 'Select Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.start_date as Date}
                      onSelect={(date) => {
                        handleDateChange('start_date', date)
                        setStartDateCalendarOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type*</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) => handleSelectChange('employment_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status*</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wage_classification">Wage Classification*</Label>
                <Input
                  id="wage_classification"
                  name="wage_classification"
                  value={formData.wage_classification}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pay_rate">Pay Rate ($/hr)*</Label>
                <Input
                  id="pay_rate"
                  name="pay_rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pay_rate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pay_cycle">Pay Cycle*</Label>
                <Select
                  value={formData.pay_cycle}
                  onValueChange={(value) => handleSelectChange('pay_cycle', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Pay Cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Fortnightly">Fortnightly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Payroll Details Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-md border-b pb-2">Payroll Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tax_id">Tax File Number*</Label>
                <Input
                  id="tax_id"
                  name="tax_id"
                  value={formData.tax_id}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank_bsb">Bank BSB*</Label>
                <Input
                  id="bank_bsb"
                  name="bank_bsb"
                  value={formData.bank_bsb}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank_account_number">Bank Account Number*</Label>
                <Input
                  id="bank_account_number"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="super_fund_name">Superannuation Fund*</Label>
                <Input
                  id="super_fund_name"
                  name="super_fund_name"
                  value={formData.super_fund_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="super_member_number">Super Member Number*</Label>
                <Input
                  id="super_member_number"
                  name="super_member_number"
                  value={formData.super_member_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

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
