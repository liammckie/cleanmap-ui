
import React from 'react'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Edit } from 'lucide-react'

interface EmployeeDialogFooterProps {
  isEditing: boolean
  isSubmitting: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onClose: () => void
}

const EmployeeDialogFooter: React.FC<EmployeeDialogFooterProps> = ({
  isEditing,
  isSubmitting,
  onEdit,
  onCancel,
  onSave,
  onClose,
}) => {
  return (
    <DialogFooter>
      {isEditing ? (
        <div className="space-x-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Details
        </Button>
      )}
      <Button type="button" variant="secondary" onClick={onClose}>
        Close
      </Button>
    </DialogFooter>
  )
}

export default EmployeeDialogFooter
