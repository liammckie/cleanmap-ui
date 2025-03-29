
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ClientFormData } from '../types'

interface AdditionalInfoSectionProps {
  formData: ClientFormData
  onChange: (field: keyof ClientFormData, value: string) => void
  loading?: boolean
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ 
  formData, 
  onChange, 
  loading = false 
}) => {
  const { region, notes } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    onChange(id as keyof ClientFormData, value)
  }

  return (
    <>
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
    </>
  )
}

export default AdditionalInfoSection
