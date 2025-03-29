
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/services/clients'

interface UseClientDialogProps {
  onClientAdded?: () => void
}

export interface ClientFormData {
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

export function useClientDialog({ onClientAdded }: UseClientDialogProps = {}) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ClientFormData>({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    paymentTerms: 'Net 30',
    industry: '',
    status: 'Active',
    businessNumber: '',
    region: '',
    notes: '',
    onHoldReason: '',
  })

  const resetForm = () => {
    setFormData({
      companyName: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      street: '',
      city: '',
      state: '',
      postcode: '',
      paymentTerms: 'Net 30',
      industry: '',
      status: 'Active',
      businessNumber: '',
      region: '',
      notes: '',
      onHoldReason: '',
    })
  }

  const handleChange = (field: keyof ClientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic form validation
    if (!formData.companyName || !formData.contactName || !formData.street || 
        !formData.city || !formData.state || !formData.postcode) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
      })
      return
    }

    try {
      setLoading(true)

      // Prepare client data - properly map the form fields to the database fields
      const clientData = {
        company_name: formData.companyName,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail || null,
        contact_phone: formData.contactPhone || null,
        billing_address_street: formData.street,
        billing_address_city: formData.city,
        billing_address_state: formData.state,
        billing_address_postcode: formData.postcode,
        // Remove billing_address_zip field which doesn't match the schema
        payment_terms: formData.paymentTerms,
        industry: formData.industry || null,
        status: formData.status as 'Active' | 'On Hold',
        business_number: formData.businessNumber || null,
        region: formData.region || null,
        notes: formData.notes || null,
        on_hold_reason: formData.status === 'On Hold' ? formData.onHoldReason : null,
      }

      console.log('Sending client data to API:', clientData);

      // Create client in database
      const result = await createClient(clientData)
      
      console.log('Client created successfully:', result)

      // Show success toast
      toast({
        title: 'Success',
        description: 'Client has been created successfully.',
      })

      // Close dialog and reset form
      setOpen(false)
      resetForm()

      // Refresh client list if a callback was provided
      if (onClientAdded) {
        onClientAdded()
      }
    } catch (error) {
      console.error('Error creating client:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create client. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    open,
    setOpen,
    loading,
    formData,
    handleChange,
    handleSubmit,
  }
}
