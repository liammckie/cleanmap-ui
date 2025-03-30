
import React from 'react'
import { Button } from '@/components/ui/button'

interface FormActionsProps {
  onCancel: () => void
  isEditing: boolean
  isSubmitting: boolean
}

export function FormActions({ onCancel, isEditing, isSubmitting }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-4">
      <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : isEditing ? 'Update Work Order' : 'Create Work Order'}
      </Button>
    </div>
  )
}
