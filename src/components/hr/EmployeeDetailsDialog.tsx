
import React, { useState, useEffect } from 'react'
import { Edit, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Employee, EmploymentTerminationReason } from '@/types/employee.types'
import { updateEmployee, fetchEmploymentTerminationReasons } from '@/services/employeeService'
import { useToast } from '@/hooks/use-toast'
import EmployeePersonalInfoTab from './EmployeePersonalInfoTab'
import EmployeeEmploymentTab from './EmployeeEmploymentTab'

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
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null)
  const [selectedTab, setSelectedTab] = useState('details')
  const [terminationReasons, setTerminationReasons] = useState<string[]>([])

  useEffect(() => {
    if (employee) {
      setEditedEmployee({ ...employee })
    }

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
  }, [employee])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (employee) {
      setEditedEmployee({ ...employee })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedEmployee((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSelectChange = (field: string, value: string) => {
    setEditedEmployee((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setEditedEmployee((prev) => (prev ? { ...prev, end_of_employment_date: date } : null))
    }
  }

  const handleEndReasonChange = (reason: string) => {
    setEditedEmployee((prev) => 
      prev ? { ...prev, end_of_employment_reason: reason as EmploymentTerminationReason } : null
    )
  }

  const handleSave = async () => {
    if (!editedEmployee || !employee) return

    setIsSubmitting(true)

    try {
      const updatedEmployee = await updateEmployee(employee.id, editedEmployee)

      toast({
        title: 'Success',
        description: 'Employee details updated successfully.',
      })

      setIsEditing(false)
      // Update the employee data with the changes
      if (updatedEmployee) {
        setEditedEmployee(updatedEmployee)
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update employee details. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

        <DialogFooter>
          {isEditing ? (
            <div className="space-x-2">
              <Button variant="ghost" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeDetailsDialog
