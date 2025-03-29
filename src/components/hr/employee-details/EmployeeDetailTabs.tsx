import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Employee } from '@/types/employee.types'
import EmployeePersonalInfoTab from '../EmployeePersonalInfoTab'
import EmployeeEmploymentTab from '../EmployeeEmploymentTab'

interface EmployeeDetailTabsProps {
  employee: Employee
  isEditing: boolean
  selectedTab: string
  terminationReasons: string[]
  onTabChange: (value: string) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (field: string, value: string) => void
  handleEndDateChange: (date: Date | undefined) => void
  handleEndReasonChange: (reason: string) => void
}

const EmployeeDetailTabs: React.FC<EmployeeDetailTabsProps> = ({
  employee,
  isEditing,
  selectedTab,
  terminationReasons,
  onTabChange,
  handleInputChange,
  handleSelectChange,
  handleEndDateChange,
  handleEndReasonChange
}) => {
  // Convert to Date object if it's a string, or keep as Date, or null if undefined
  const endDate = employee.end_of_employment_date
    ? (typeof employee.end_of_employment_date === 'string' 
        ? new Date(employee.end_of_employment_date) 
        : employee.end_of_employment_date)
    : null

  return (
    <Tabs value={selectedTab} onValueChange={onTabChange} className="mt-4">
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
              employee={employee}
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
              employee={employee}
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
  )
}

export default EmployeeDetailTabs
