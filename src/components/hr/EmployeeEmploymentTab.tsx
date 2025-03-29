import React from 'react'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Employee, EmploymentTerminationReason } from '@/types/employee.types'
import EndOfEmploymentSection from './EndOfEmploymentSection'

interface EmployeeEmploymentTabProps {
  employee: Employee
  isEditing: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (field: string, value: string) => void
  handleEndDateChange: (date: Date | undefined) => void
  handleEndReasonChange: (reason: string) => void
  terminationReasons: string[]
}

const EmployeeEmploymentTab: React.FC<EmployeeEmploymentTabProps> = ({
  employee,
  isEditing,
  handleInputChange,
  handleSelectChange,
  handleEndDateChange,
  handleEndReasonChange,
  terminationReasons,
}) => {
  // Helper to format dates safely
  const formatDate = (date: string | Date | undefined | null) => {
    if (!date) return 'N/A'
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      return format(dateObj, 'dd MMM yyyy')
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  // Convert to Date object if it's a string, or keep as Date, or null if undefined
  const endDate = employee.end_of_employment_date
    ? (typeof employee.end_of_employment_date === 'string' 
        ? new Date(employee.end_of_employment_date) 
        : employee.end_of_employment_date)
    : null

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Employee ID</Label>
            <Input
              name="employee_id"
              value={employee.employee_id || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Job Title</Label>
            <Input
              name="job_title"
              value={employee.job_title || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Department</Label>
            <Input
              name="department"
              value={employee.department || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Start Date</Label>
            <Input
              value={formatDate(employee.start_date)}
              disabled
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Employment Type</Label>
            <Select
              value={employee.employment_type || ''}
              onValueChange={(value) => handleSelectChange('employment_type', value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={employee.status || ''}
              onValueChange={(value) => handleSelectChange('status', value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Onboarding">Onboarding</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Wage Classification</Label>
            <Input
              name="wage_classification"
              value={employee.wage_classification || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Pay Rate ($/hr)</Label>
            <Input
              name="pay_rate"
              type="number"
              value={employee.pay_rate?.toString() || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Pay Cycle</Label>
            <Select
              value={employee.pay_cycle || ''}
              onValueChange={(value) => handleSelectChange('pay_cycle', value)}
              disabled={!isEditing}
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
          <div>
            <Label>Tax File Number</Label>
            <Input
              name="tax_id"
              value={employee.tax_id || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Bank BSB</Label>
            <Input
              name="bank_bsb"
              value={employee.bank_bsb || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Bank Account Number</Label>
            <Input
              name="bank_account_number"
              value={employee.bank_account_number || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Superannuation Fund</Label>
            <Input
              name="super_fund_name"
              value={employee.super_fund_name || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Super Member Number</Label>
            <Input
              name="super_member_number"
              value={employee.super_member_number || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      <EndOfEmploymentSection
        endDate={endDate}
        endReason={employee.end_of_employment_reason}
        terminationReasons={terminationReasons}
        onEndDateChange={handleEndDateChange}
        onEndReasonChange={handleEndReasonChange}
        isEditable={isEditing}
      />
    </div>
  )
}

export default EmployeeEmploymentTab
