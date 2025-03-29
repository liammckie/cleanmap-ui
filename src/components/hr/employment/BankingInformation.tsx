
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
          <Label htmlFor="bank_bsb">Bank BSB</Label>
          <Input
            id="bank_bsb"
            name="bank_bsb"
            value={employee.bank_bsb || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="bank_account_number">Bank Account Number</Label>
          <Input
            id="bank_account_number"
            name="bank_account_number"
            value={employee.bank_account_number || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="super_fund_name">Superannuation Fund</Label>
          <Input
            id="super_fund_name"
            name="super_fund_name"
            value={employee.super_fund_name || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="super_member_number">Super Member Number</Label>
          <Input
            id="super_member_number"
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
