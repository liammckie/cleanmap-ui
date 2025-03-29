
import React from 'react'
import AddressForm from './AddressForm'

interface EmployeeFormAddressSectionProps {
  form: any
}

const EmployeeFormAddressSection: React.FC<EmployeeFormAddressSectionProps> = ({ form }) => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-md font-medium mb-4">Address Information</h3>
      <AddressForm
        form={form}
        streetName="address_street"
        cityName="address_city"
        stateName="address_state"
        postcodeName="address_postcode"
      />
    </div>
  )
}

export default EmployeeFormAddressSection
