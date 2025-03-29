
import React from 'react'
import CompanyContactSection from './form-sections/CompanyContactSection'
import AddressSection from './form-sections/AddressSection'
import BusinessDetailsSection from './form-sections/BusinessDetailsSection'
import AdditionalInfoSection from './form-sections/AdditionalInfoSection'

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
  return (
    <div className="grid gap-4 py-4">
      <CompanyContactSection formData={formData} onChange={onChange} loading={loading} />
      <AddressSection formData={formData} onChange={onChange} loading={loading} />
      <BusinessDetailsSection formData={formData} onChange={onChange} loading={loading} />
      <AdditionalInfoSection formData={formData} onChange={onChange} loading={loading} />
    </div>
  )
}

export default ClientForm
