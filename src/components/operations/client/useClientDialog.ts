
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/services/clients'
import { mapClientFormToDb } from '@/mappers/clientMappers'
import { ClientFormData } from './types'

interface UseClientDialogProps {
  onClientAdded?: () => void
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

      // Transform camelCase form data to snake_case DB format using our mapper
      const clientData = mapClientFormToDb(formData)

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
