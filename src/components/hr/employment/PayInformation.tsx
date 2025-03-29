
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

interface PayInformationProps {
  employee: Employee
  isEditing: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (field: string, value: string) => void
}

const PayInformation: React.FC<PayInformationProps> = ({
  employee,
  isEditing,
  handleInputChange,
  handleSelectChange,
}) => {
  return (
    <div className="space-y-6">
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
    </div>
  )
}

export default PayInformation
