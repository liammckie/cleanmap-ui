
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Employee } from '@/types/employee.types'
import { formatDate } from '@/utils/dateUtils'

interface BasicEmploymentDetailsProps {
  employee: Employee
  isEditing: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (field: string, value: string) => void
}

const BasicEmploymentDetails: React.FC<BasicEmploymentDetailsProps> = ({
  employee,
  isEditing,
  handleInputChange,
  handleSelectChange,
}) => {
  return (
    <div className="space-y-6">
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
    </div>
  )
}

export default BasicEmploymentDetails
