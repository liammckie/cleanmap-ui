
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

interface CompanyContactSectionProps {
  formData: ClientFormData
  onChange: (field: keyof ClientFormData, value: string) => void
  loading?: boolean
}

const CompanyContactSection: React.FC<CompanyContactSectionProps> = ({ 
  formData, 
  onChange, 
  loading = false 
}) => {
  const { companyName, contactName, contactEmail, contactPhone } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    onChange(id as keyof ClientFormData, value)
  }

  return (
    <>
      {/* Company and Contact Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name*</Label>
          <Input
            type="text"
            id="companyName"
            value={companyName}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactName">Contact Name*</Label>
          <Input
            type="text"
            id="contactName"
            value={contactName}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            type="email"
            id="contactEmail"
            value={contactEmail}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            type="tel"
            id="contactPhone"
            value={contactPhone}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>
    </>
  )
}

export default CompanyContactSection
