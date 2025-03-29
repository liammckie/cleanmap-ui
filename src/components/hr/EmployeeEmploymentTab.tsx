import React from 'react'
import { Employee } from '@/types/employee.types'
import EndOfEmploymentSection from './EndOfEmploymentSection'
import BasicEmploymentDetails from './employment/BasicEmploymentDetails'
import PayInformation from './employment/PayInformation'
import BankingInformation from './employment/BankingInformation'

interface EmployeeEmploymentTabProps {
  employee: Employee
  isEditing: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (field: string, value: string) => void
  handleEndDateChange: (date: Date | undefined) => void
  handleEndReasonChange: (reason: string) => void
  terminationReasons: string[]
}

const EmployeeEmploymentTab: React.FC<EmployeeEmploymentTabProps> = ({
  employee,
  isEditing,
  handleInputChange,
  handleSelectChange,
  handleEndDateChange,
  handleEndReasonChange,
  terminationReasons,
}) => {
  // Convert to Date object if it's a string, or keep as Date, or null if undefined
  const endDate = employee.end_of_employment_date
    ? (typeof employee.end_of_employment_date === 'string' 
        ? new Date(employee.end_of_employment_date) 
        : employee.end_of_employment_date)
    : null

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Basic Employment Details */}
        <BasicEmploymentDetails 
          employee={employee}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />

        {/* Pay Information */}
        <PayInformation 
          employee={employee}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />

        {/* Banking Information */}
        <BankingInformation 
          employee={employee}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
        />
      </div>

      {/* End of Employment Section */}
      <EndOfEmploymentSection
        endDate={endDate}
        endReason={employee.end_of_employment_reason}
        terminationReasons={terminationReasons}
        onEndDateChange={handleEndDateChange}
        onEndReasonChange={handleEndReasonChange}
        isEditable={isEditing}
      />
    </div>
  )
}

export default EmployeeEmploymentTab
