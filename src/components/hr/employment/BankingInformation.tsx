
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Employee } from '@/types/employee.types'

interface BankingInformationProps {
  employee: Employee
  isEditing: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const BankingInformation: React.FC<BankingInformationProps> = ({
  employee,
  isEditing,
  handleInputChange,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-md font-medium text-neutral-600">Banking Details</h3>
      
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
  )
}

export default BankingInformation
