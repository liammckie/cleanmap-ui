
import React from 'react'
import { Search, FilterX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmployeeFilters } from '@/types/employee.types'

interface EmployeeFiltersProps {
  searchTerm: string
  filters: EmployeeFilters
  departments: string[]
  employeeStatuses: string[]
  employmentTypes: string[]
  onSearchChange: (value: string) => void
  onFilterChange: (filters: EmployeeFilters) => void
  onClearFilters: () => void
}

const EmployeeFilterCard: React.FC<EmployeeFiltersProps> = ({
  searchTerm,
  filters,
  departments,
  employeeStatuses,
  employmentTypes,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Search & Filter</CardTitle>
        <CardDescription>Find employees by name, email, role, or other criteria</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Button variant="outline" className="flex items-center gap-2" onClick={onClearFilters}>
            <FilterX className="h-4 w-4" />
            Clear
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Department</label>
            <Select
              value={filters.department}
              onValueChange={(value) => onFilterChange({ ...filters, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-departments">All Departments</SelectItem>
                  {departments.map((dept: string) => (
                    <SelectItem key={dept} value={dept || "unknown"}>
                      {dept || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFilterChange({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  {employeeStatuses.map((status: string) => (
                    <SelectItem key={status} value={status || "unknown"}>
                      {status || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Employment Type</label>
            <Select
              value={filters.employmentType}
              onValueChange={(value) => onFilterChange({ ...filters, employmentType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-types">All Types</SelectItem>
                  {employmentTypes.map((type: string) => (
                    <SelectItem key={type} value={type || "unknown"}>
                      {type || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmployeeFilterCard
