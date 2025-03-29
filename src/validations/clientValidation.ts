import { z } from 'zod'
import { createFormSchema, ValidationPatterns, ErrorMessages } from '@/utils/formValidation'

/**
 * Client form validation schema
 */
export const clientFormSchema = createFormSchema({
  company_name: {
    type: 'string',
    required: true,
    min: 2,
    max: 100,
    errorMessage: 'Company name is required',
  },
  billing_address_street: {
    type: 'string',
    required: true,
    min: 2,
    max: 100,
    errorMessage: 'Street address is required',
  },
  billing_address_city: {
    type: 'string',
    required: true,
    min: 2,
    max: 50,
    errorMessage: 'City is required',
  },
  billing_address_state: {
    type: 'string',
    required: true,
    min: 2,
    max: 50,
    errorMessage: 'State is required',
  },
  billing_address_postcode: {
    type: 'string',
    required: true,
    pattern: ValidationPatterns.POSTAL_CODE,
    errorMessage: 'Valid postcode is required',
  },
  contact_phone: {
    type: 'phone',
    pattern: ValidationPatterns.PHONE,
    errorMessage: ErrorMessages.PHONE,
    required: false,
  },
  contact_email: {
    type: 'email',
    required: false,
    errorMessage: ErrorMessages.EMAIL,
  },
  payment_terms: {
    type: 'string',
    required: true,
    min: 2,
    max: 50,
    errorMessage: 'Payment terms are required',
  },
  status: {
    type: 'select',
    required: true,
    options: ['Active', 'On Hold'],
    errorMessage: 'Valid status is required',
  },
  industry: {
    type: 'string',
    required: false,
    max: 50,
  },
  notes: {
    type: 'string',
    required: false,
    max: 500,
  },
  business_number: {
    type: 'string',
    required: false,
    max: 20,
  },
  on_hold_reason: {
    type: 'string',
    required: false,
    max: 200,
  },
})

/**
 * Type for client form values based on the schema
 */
export type ClientFormValues = z.infer<typeof clientFormSchema>

/**
 * Function to test client form validation
 */
export function testClientFormValidation() {
  // Import the testing utilities
  const {
    testFormValidation,
    generateFieldBoundaryTests,
    logTestResults,
  } = require('@/utils/formTesting')

  // Valid base values for testing
  const validClientData = {
    company_name: 'Acme Corporation',
    billing_address_street: '123 Main St',
    billing_address_city: 'Sydney',
    billing_address_state: 'NSW',
    billing_address_postcode: '2000',
    contact_phone: '0412 345 678',
    contact_email: 'contact@acme.com',
    payment_terms: 'Net 30',
    status: 'Active',
    industry: 'Manufacturing',
    notes: 'Test client',
    business_number: 'ABN12345678',
    on_hold_reason: '',
  }

  // Generate test cases for company_name field
  const companyNameTests = generateFieldBoundaryTests(
    'company_name',
    { type: 'string', required: true, min: 2, max: 100 },
    validClientData,
  )

  // Generate test cases for email field
  const emailTests = [
    {
      description: 'contact_email - invalid email format',
      values: { ...validClientData, contact_email: 'notanemail' },
      shouldPass: false,
    },
    {
      description: 'contact_email - valid email',
      values: { ...validClientData, contact_email: 'valid@example.com' },
      shouldPass: true,
    },
    {
      description: 'contact_email - empty (optional field)',
      values: { ...validClientData, contact_email: '' },
      shouldPass: true,
    },
  ]

  // Generate test cases for status field
  const statusTests = [
    {
      description: 'status - valid option (Active)',
      values: { ...validClientData, status: 'Active' },
      shouldPass: true,
    },
    {
      description: 'status - valid option (On Hold)',
      values: { ...validClientData, status: 'On Hold' },
      shouldPass: true,
    },
    {
      description: 'status - invalid option',
      values: { ...validClientData, status: 'Invalid Status' },
      shouldPass: false,
    },
  ]

  // Combine all test cases
  const allTests = [
    ...companyNameTests,
    ...emailTests,
    ...statusTests,
    // More test cases could be added here
  ]

  // Run the tests
  const results = testFormValidation(clientFormSchema, allTests)

  // Log the results
  logTestResults(results)

  return results
}
