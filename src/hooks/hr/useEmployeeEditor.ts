
import { useState, useEffect } from 'react'
import { Employee, EmploymentTerminationReason } from '@/types/employee.types'
import { updateEmployee, fetchEmploymentTerminationReasons } from '@/services/employeeService'
import { useToast } from '@/hooks/use-toast'

// Helper function to validate if a value is a valid EmploymentTerminationReason
const isValidTerminationReason = (value: string): value is EmploymentTerminationReason => {
  const validReasons: EmploymentTerminationReason[] = [
    'Resignation', 'Contract End', 'Termination', 'Retirement', 'Other'
  ];
  return validReasons.includes(value as EmploymentTerminationReason);
}

export function useEmployeeEditor(employee: Employee | null) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null)
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
    setEditedEmployee((prev) => {
      if (!prev) return null;
      
      // Special handling for end_of_employment_reason to ensure it's properly typed
      if (field === 'end_of_employment_reason') {
        // Validate if the value is a valid EmploymentTerminationReason
        return {
          ...prev,
          [field]: isValidTerminationReason(value) ? value as EmploymentTerminationReason : null
        };
      }
      
      return { ...prev, [field]: value };
    })
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setEditedEmployee((prev) => (prev ? { ...prev, end_of_employment_date: date } : null))
    }
  }

  const handleEndReasonChange = (reason: string) => {
    // Validate and set the reason
    setEditedEmployee((prev) => {
      if (!prev) return null;
      
      return {
        ...prev,
        end_of_employment_reason: isValidTerminationReason(reason) ? reason as EmploymentTerminationReason : null
      };
    })
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
        // Ensure the updated employee has the correct type for end_of_employment_reason
        const processedEmployee: Employee = {
          ...updatedEmployee,
          end_of_employment_reason: isValidTerminationReason(updatedEmployee.end_of_employment_reason as string) 
            ? updatedEmployee.end_of_employment_reason as EmploymentTerminationReason 
            : null
        };
        setEditedEmployee(processedEmployee);
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
  }
}
