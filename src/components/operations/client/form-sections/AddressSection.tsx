
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

interface AddressSectionProps {
  formData: ClientFormData
  onChange: (field: keyof ClientFormData, value: string) => void
  loading?: boolean
}

const AddressSection: React.FC<AddressSectionProps> = ({ 
  formData, 
  onChange, 
  loading = false 
}) => {
  const { street, city, state, postcode } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    onChange(id as keyof ClientFormData, value)
  }

  return (
    <>
      {/* Address Information */}
      <div className="mt-2 space-y-2">
        <Label htmlFor="street">Street Address*</Label>
        <Input
          type="text"
          id="street"
          value={street}
          onChange={handleChange}
          disabled={loading}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City*</Label>
          <Input
            type="text"
            id="city"
            value={city}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State*</Label>
          <Input
            type="text"
            id="state"
            value={state}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode*</Label>
          <Input
            type="text"
            id="postcode"
            value={postcode}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
      </div>
    </>
  )
}

export default AddressSection
