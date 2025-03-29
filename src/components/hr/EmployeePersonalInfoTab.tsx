
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Employee } from '@/types/employee.types'
import { formatDate } from '@/utils/dateUtils'

interface EmployeePersonalInfoTabProps {
  employee: Employee
  isEditing: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const EmployeePersonalInfoTab: React.FC<EmployeePersonalInfoTabProps> = ({
  employee,
  isEditing,
  handleInputChange,
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            name="first_name"
            value={employee.first_name || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            name="last_name"
            value={employee.last_name || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Date of Birth</Label>
          <Input
            value={formatDate(employee.date_of_birth)}
            disabled
          />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input
            name="contact_phone"
            value={employee.contact_phone || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div>
        <Label>Email Address</Label>
        <Input
          name="contact_email"
          type="email"
          value={employee.contact_email || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </div>

      <div>
        <Label>Street Address</Label>
        <Input
          name="address_street"
          value={employee.address_street || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>City</Label>
          <Input
            name="address_city"
            value={employee.address_city || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label>State</Label>
          <Input
            name="address_state"
            value={employee.address_state || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label>Postcode</Label>
          <Input
            name="address_postcode"
            value={employee.address_postcode || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  )
}

export default EmployeePersonalInfoTab
