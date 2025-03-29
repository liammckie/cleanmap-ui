
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
import { Textarea } from '@/components/ui/textarea'

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

interface ClientFormProps {
  formData: ClientFormData
  onChange: (field: keyof ClientFormData, value: string) => void
  loading?: boolean
}

const ClientForm: React.FC<ClientFormProps> = ({ formData, onChange, loading = false }) => {
  const {
    companyName,
    contactName,
    contactEmail,
    contactPhone,
    street,
    city,
    state,
    postcode,
    paymentTerms,
    industry,
    status,
    businessNumber,
    region,
    notes,
    onHoldReason,
  } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    onChange(id as keyof ClientFormData, value)
  }

  return (
    <div className="grid gap-4 py-4">
      {/* Company and Contact Information - First Column */}
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Input
            type="text"
            id="region"
            value={region}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={handleChange}
          className="h-20"
          disabled={loading}
        />
      </div>
    </div>
  )
}

export default ClientForm
