
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Employee } from '@/types/employee.types'
import { fetchEmploymentTerminationReasons } from '@/services/employeeService'
import EmployeePersonalInfoTab from './EmployeePersonalInfoTab'
import EmployeeEmploymentTab from './EmployeeEmploymentTab'
import DialogFooter from './employee-details/DialogFooter'
import { useEmployeeDetails } from '@/hooks/hr/useEmployeeDetails'

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
  const [terminationReasons, setTerminationReasons] = useState<string[]>([])
  
  const {
    employee: editedEmployee,
    isEditing,
    isSubmitting,
    handleEdit,
    handleCancelEdit,
    handleInputChange,
    handleSelectChange,
    handleEndDateChange,
    handleSave
  } = useEmployeeDetails(employee)

  // Handle end reason change specifically for the EndOfEmploymentSection
  const handleEndReasonChange = (reason: string) => {
    handleSelectChange('end_of_employment_reason', reason)
  }

  useEffect(() => {
    // Fetch termination reasons when component mounts
    const fetchTerminationReasons = async () => {
      try {
        const reasons = await fetchEmploymentTerminationReasons()
        setTerminationReasons(reasons)
      } catch (error) {
        console.error('Error fetching termination reasons:', error)
      }
    }

    fetchTerminationReasons()
  }, [])

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

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <EmployeePersonalInfoTab
                  employee={editedEmployee}
                  isEditing={isEditing}
                  handleInputChange={handleInputChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employment" className="space-y-2">
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <EmployeeEmploymentTab
                  employee={editedEmployee}
                  isEditing={isEditing}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  handleEndDateChange={handleEndDateChange}
                  handleEndReasonChange={handleEndReasonChange}
                  terminationReasons={terminationReasons}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onEdit={handleEdit}
          onCancel={handleCancelEdit}
          onSave={handleSave}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeDetailsDialog
