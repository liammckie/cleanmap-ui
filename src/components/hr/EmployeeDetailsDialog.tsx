import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import EmployeeForm from './EmployeeForm'
import { Employee } from '@/types/employee.types'
import { updateEmployee, fetchEmploymentTerminationReasons } from '@/services/employeeService'
import { useToast } from '@/hooks/use-toast'
import EndOfEmploymentSection from './EndOfEmploymentSection'

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
      prev ? { ...prev, end_of_employment_reason: reason } : null
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

  // Helper to format dates safely
  const formatDate = (date: string | Date | undefined | null) => {
    if (!date) return 'N/A'
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      return format(dateObj, 'dd MMM yyyy')
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  if (!employee || !editedEmployee) {
    return null
  }

  const endDate = editedEmployee.end_of_employment_date
    ? new Date(editedEmployee.end_of_employment_date)
    : null

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
            {/* Add more tabs as needed */}
          </TabsList>
          <TabsContent value="details" className="space-y-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      name="first_name"
                      value={editedEmployee.first_name || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      name="last_name"
                      value={editedEmployee.last_name || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      value={formatDate(editedEmployee.date_of_birth)}
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      name="contact_phone"
                      value={editedEmployee.contact_phone || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label>Email Address</Label>
                  <Input
                    name="contact_email"
                    type="email"
                    value={editedEmployee.contact_email || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label>Street Address</Label>
                  <Input
                    name="address_street"
                    value={editedEmployee.address_street || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      name="address_city"
                      value={editedEmployee.address_city || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      name="address_state"
                      value={editedEmployee.address_state || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Postcode</Label>
                    <Input
                      name="address_postcode"
                      value={editedEmployee.address_postcode || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employment" className="space-y-2">
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Employee ID</Label>
                    <Input
                      name="employee_id"
                      value={editedEmployee.employee_id || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Job Title</Label>
                    <Input
                      name="job_title"
                      value={editedEmployee.job_title || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Department</Label>
                    <Input
                      name="department"
                      value={editedEmployee.department || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      value={formatDate(editedEmployee.start_date)}
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Employment Type</Label>
                    <Select
                      value={editedEmployee.employment_type || ''}
                      onValueChange={(value) => handleSelectChange('employment_type', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contractor">Contractor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={editedEmployee.status || ''}
                      onValueChange={(value) => handleSelectChange('status', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Onboarding">Onboarding</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Wage Classification</Label>
                    <Input
                      name="wage_classification"
                      value={editedEmployee.wage_classification || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Pay Rate ($/hr)</Label>
                    <Input
                      name="pay_rate"
                      type="number"
                      value={editedEmployee.pay_rate?.toString() || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Pay Cycle</Label>
                    <Select
                      value={editedEmployee.pay_cycle || ''}
                      onValueChange={(value) => handleSelectChange('pay_cycle', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Pay Cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Fortnightly">Fortnightly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tax File Number</Label>
                    <Input
                      name="tax_id"
                      value={editedEmployee.tax_id || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Bank BSB</Label>
                    <Input
                      name="bank_bsb"
                      value={editedEmployee.bank_bsb || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Bank Account Number</Label>
                    <Input
                      name="bank_account_number"
                      value={editedEmployee.bank_account_number || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Superannuation Fund</Label>
                    <Input
                      name="super_fund_name"
                      value={editedEmployee.super_fund_name || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Super Member Number</Label>
                    <Input
                      name="super_member_number"
                      value={editedEmployee.super_member_number || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <EndOfEmploymentSection
              endDate={endDate}
              endReason={editedEmployee.end_of_employment_reason || null}
              terminationReasons={terminationReasons}
              onEndDateChange={handleEndDateChange}
              onEndReasonChange={handleEndReasonChange}
              isEditable={isEditing}
            />
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
