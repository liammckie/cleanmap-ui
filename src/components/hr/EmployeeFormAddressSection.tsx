import React from 'react'
import AddressForm from './AddressForm'

const EmployeeFormAddressSection = ({ form }: { form: any }) => {
  return (
    <AddressForm
      form={form}
      streetName="address_street"
      cityName="address_city"
      stateName="address_state"
      postcodeName="address_postcode"
    />
  )
}

export default EmployeeFormAddressSection
