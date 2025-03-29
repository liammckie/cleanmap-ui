
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

interface ClientFormData {
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  street: string
  city: string
  state: string
  postcode: string
  paymentTerms: string
  industry: string
  status: string
  businessNumber: string
  region: string
  notes: string
  onHoldReason: string
}

interface BusinessDetailsSectionProps {
  formData: ClientFormData
  onChange: (field: keyof ClientFormData, value: string) => void
  loading?: boolean
}

const BusinessDetailsSection: React.FC<BusinessDetailsSectionProps> = ({ 
  formData, 
  onChange, 
  loading = false 
}) => {
  const { paymentTerms, industry, status, businessNumber, onHoldReason } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    onChange(id as keyof ClientFormData, value)
  }

  return (
    <>
      {/* Business Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms*</Label>
          <Input
            type="text"
            id="paymentTerms"
            value={paymentTerms}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            type="text"
            id="industry"
            value={industry}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status*</Label>
          <Select
            value={status}
            onValueChange={(value) => onChange('status', value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="businessNumber">Business Number</Label>
          <Input
            type="text"
            id="businessNumber"
            value={businessNumber}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      {status === 'On Hold' && (
        <div className="space-y-2">
          <Label htmlFor="onHoldReason">On Hold Reason*</Label>
          <Input
            type="text"
            id="onHoldReason"
            value={onHoldReason}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
      )}
    </>
  )
}

export default BusinessDetailsSection
