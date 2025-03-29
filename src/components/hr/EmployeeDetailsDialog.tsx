
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Employee } from '@/types/employee.types'
import { useEmployeeEditor } from '@/hooks/hr/useEmployeeEditor'
import EmployeeDialogFooter from './employee-details/EmployeeDialogFooter'
import EmployeeDetailTabs from './employee-details/EmployeeDetailTabs'

interface EmployeeDetailsDialogProps {
  employee: Employee | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const EmployeeDetailsDialog: React.FC<EmployeeDetailsDialogProps> = ({
  employee,
  isOpen,
  onOpenChange,
}) => {
  const [selectedTab, setSelectedTab] = useState('details')
  
  const {
    isEditing,
    isSubmitting,
    editedEmployee,
    terminationReasons,
    handleEdit,
    handleCancelEdit,
    handleInputChange,
    handleSelectChange,
    handleEndDateChange,
    handleEndReasonChange,
    handleSave
  } = useEmployeeEditor(employee)

  if (!employee || !editedEmployee) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee.first_name} {employee.last_name} Details</DialogTitle>
          <DialogDescription>
            View and manage employee information.
          </DialogDescription>
        </DialogHeader>

        <EmployeeDetailTabs 
          employee={editedEmployee}
          isEditing={isEditing}
          selectedTab={selectedTab}
          terminationReasons={terminationReasons}
          onTabChange={setSelectedTab}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleEndDateChange={handleEndDateChange}
          handleEndReasonChange={handleEndReasonChange}
        />

        <EmployeeDialogFooter 
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onEdit={handleEdit}
          onCancelEdit={handleCancelEdit}
          onSave={handleSave}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeDetailsDialog
