
import { useState, useMemo } from 'react'
import { Employee } from '@/types/employee.types'

export function useEmployeePagination(sortedEmployees: Employee[]) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage)

  // Reset to first page when data changes
  const resetPagination = () => {
    setCurrentPage(1)
  }

  return {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
    resetPagination
  }
}
