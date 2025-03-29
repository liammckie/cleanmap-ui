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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="companyName" className="text-right">
          Company Name
        </Label>
        <Input
          type="text"
          id="companyName"
          value={companyName}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contactName" className="text-right">
          Contact Name
        </Label>
        <Input
          type="text"
          id="contactName"
          value={contactName}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contactEmail" className="text-right">
          Contact Email
        </Label>
        <Input
          type="email"
          id="contactEmail"
          value={contactEmail}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contactPhone" className="text-right">
          Contact Phone
        </Label>
        <Input
          type="tel"
          id="contactPhone"
          value={contactPhone}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="street" className="text-right">
          Street Address
        </Label>
        <Input
          type="text"
          id="street"
          value={street}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="city" className="text-right">
          City
        </Label>
        <Input
          type="text"
          id="city"
          value={city}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="state" className="text-right">
          State
        </Label>
        <Input
          type="text"
          id="state"
          value={state}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="postcode" className="text-right">
          Postcode
        </Label>
        <Input
          type="text"
          id="postcode"
          value={postcode}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="paymentTerms" className="text-right">
          Payment Terms
        </Label>
        <Input
          type="text"
          id="paymentTerms"
          value={paymentTerms}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="industry" className="text-right">
          Industry
        </Label>
        <Input
          type="text"
          id="industry"
          value={industry}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <Select
          value={status}
          onValueChange={(value) => onChange('status', value)}
          disabled={loading}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {status === 'On Hold' && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="onHoldReason" className="text-right">
            On Hold Reason
          </Label>
          <Input
            type="text"
            id="onHoldReason"
            value={onHoldReason}
            onChange={handleChange}
            className="col-span-3"
            disabled={loading}
          />
        </div>
      )}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="businessNumber" className="text-right">
          Business Number
        </Label>
        <Input
          type="text"
          id="businessNumber"
          value={businessNumber}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="region" className="text-right">
          Region
        </Label>
        <Input
          type="text"
          id="region"
          value={region}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="notes" className="text-right mt-2">
          Notes
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={handleChange}
          className="col-span-3"
          disabled={loading}
        />
      </div>
    </div>
  )
}

export default ClientForm
