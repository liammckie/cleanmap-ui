
import { useState } from 'react'
import { Employee, EmploymentTerminationReason } from '@/types/employee.types'
import { updateEmployee } from '@/services/employeeService'
import { useToast } from '@/hooks/use-toast'

// A type guard to validate employment termination reasons
const isValidTerminationReason = (value: string | null | undefined): value is EmploymentTerminationReason => {
  if (!value) return false
  const validReasons: EmploymentTerminationReason[] = [
    'Resignation', 'Contract End', 'Termination', 'Retirement', 'Other'
  ]
  return validReasons.includes(value as EmploymentTerminationReason)
}

export const useEmployeeDetails = (initialEmployee: Employee | null) => {
  const { toast } = useToast()
  const [employee, setEmployee] = useState<Employee | null>(initialEmployee)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update employee when the initialEmployee changes (e.g., when switching employees)
  if (initialEmployee && initialEmployee.id !== employee?.id) {
    setEmployee(initialEmployee)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEmployee(initialEmployee) // Reset to initial employee
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmployee((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSelectChange = (field: string, value: string) => {
    setEmployee((prev) => {
      if (!prev) return null;
      
      // Special handling for end_of_employment_reason to ensure it's properly typed
      if (field === 'end_of_employment_reason') {
        return {
          ...prev,
          [field]: isValidTerminationReason(value) ? value : null
        };
      }
      
      return { ...prev, [field]: value };
    })
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (!employee) return;
    
    setEmployee({
      ...employee,
      end_of_employment_date: date || null
    })
  }

  const handleSave = async () => {
    if (!employee || !initialEmployee) return

    setIsSubmitting(true)

    try {
      const updatedEmployee = await updateEmployee(employee.id, employee)

      toast({
        title: 'Success',
        description: 'Employee details updated successfully.',
      })

      setIsEditing(false)
      
      // Update the employee with the response from the server
      if (updatedEmployee) {
        // Ensure proper typing of end_of_employment_reason
        const processedEmployee: Employee = {
          ...updatedEmployee,
          end_of_employment_reason: isValidTerminationReason(updatedEmployee.end_of_employment_reason as string) 
            ? updatedEmployee.end_of_employment_reason as EmploymentTerminationReason 
            : null
        }
        setEmployee(processedEmployee)
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

  return {
    employee,
    isEditing,
    isSubmitting,
    handleEdit,
    handleCancelEdit,
    handleInputChange,
    handleSelectChange,
    handleEndDateChange,
    handleSave,
  }
}
