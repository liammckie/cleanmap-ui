
import { useState } from 'react'
import { EmployeeFilters } from '@/types/employee.types'

export function useEmployeeFilters() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<EmployeeFilters>({
    department: '',
    status: '',
    employmentType: '',
  })

  const handleFilterChange = (newFilters: EmployeeFilters) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      department: '',
      status: '',
      employmentType: '',
    })
    setSearchTerm('')
  }

  return {
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    clearFilters
  }
}
