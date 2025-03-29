
import { useState, useMemo } from 'react'
import { Employee } from '@/types/employee.types'

export function useEmployeeSorting(employees: Employee[] | undefined) {
  const [sortColumn, setSortColumn] = useState<keyof Employee | null>('last_name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (column: keyof Employee) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedEmployees = useMemo(() => {
    if (!employees || !sortColumn) return employees || []

    return [...employees].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue == null) return 1
      if (bValue == null) return -1

      const comparison = String(aValue).localeCompare(String(bValue), undefined, { numeric: true })
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [employees, sortColumn, sortDirection])

  return {
    sortColumn,
    sortDirection,
    handleSort,
    sortedEmployees
  }
}
