
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

interface PayrollDetailsFormProps {
  formData: {
    pay_cycle: string
    tax_id: string
    bank_bsb: string
    bank_account_number: string
    super_fund_name: string
    super_member_number: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (field: string, value: string) => void
}

const PayrollDetailsForm: React.FC<PayrollDetailsFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-md border-b pb-2">Payroll Details</h3>

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
  )
}

export default PayrollDetailsForm
