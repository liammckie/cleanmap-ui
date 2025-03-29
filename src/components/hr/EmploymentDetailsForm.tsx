
import React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

interface EmploymentDetailsFormProps {
  formData: {
    employee_id: string
    job_title: string
    department: string
    start_date: Date
    employment_type: string
    status: string
    wage_classification: string
    pay_rate: number
    pay_cycle: string
  }
  departments: string[]
  employmentTypes: string[]
  employeeStatuses: string[]
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (field: string, value: string) => void
  handleDateChange: (name: string, date: Date | undefined) => void
  startDateCalendarOpen: boolean
  setStartDateCalendarOpen: (open: boolean) => void
}

const EmploymentDetailsForm: React.FC<EmploymentDetailsFormProps> = ({
  formData,
  departments,
  employmentTypes,
  employeeStatuses,
  handleInputChange,
  handleSelectChange,
  handleDateChange,
  startDateCalendarOpen,
  setStartDateCalendarOpen,
}) => {
  return (
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
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.start_date
                ? format(formData.start_date as Date, 'dd MMM yyyy')
                : 'Select Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
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
    </div>
  )
}

export default EmploymentDetailsForm
