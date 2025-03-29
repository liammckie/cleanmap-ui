
import { useState } from 'react'
import { Employee } from '@/types/employee.types'

export function useEmployeeDialogs() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)

  return {
    selectedEmployee,
    setSelectedEmployee,
    isDetailOpen,
    setIsDetailOpen,
    isAddEmployeeOpen,
    setIsAddEmployeeOpen,
  }
}
