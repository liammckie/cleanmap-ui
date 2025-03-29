
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
          <Label htmlFor="wage_classification">Wage Classification</Label>
          <Input
            id="wage_classification"
            name="wage_classification"
            value={employee.wage_classification || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="pay_rate">Pay Rate ($/hr)</Label>
          <Input
            id="pay_rate"
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
          <Label htmlFor="pay_cycle">Pay Cycle</Label>
          <Select
            value={employee.pay_cycle || ''}
            onValueChange={(value) => handleSelectChange('pay_cycle', value)}
            disabled={!isEditing}
          >
            <SelectTrigger id="pay_cycle">
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
          <Label htmlFor="tax_id">Tax File Number</Label>
          <Input
            id="tax_id"
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
