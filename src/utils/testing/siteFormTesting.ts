
import { z } from 'zod'
import { siteSchema } from '@/schema/operations/site.schema'
import { testFormValidation } from '@/utils/formTesting'

/**
 * Test cases for site form validation
 */
export const siteFormTestCases = [
  {
    description: 'Valid site with all required fields',
    values: {
      site_name: 'Test Site',
      site_type: 'Office',
      client_id: '12345',
      address_street: '123 Main St',
      address_city: 'Sydney',
      address_state: 'NSW',
      address_postcode: '2000',
      status: 'Active',
      service_start_date: new Date(),
      price_per_week: 500,
      price_frequency: 'weekly',
    },
    shouldPass: true,
  },
  {
    description: 'Missing required fields',
    values: {
      site_name: '', // Empty required field
      site_type: 'Office',
      client_id: '12345',
      address_street: '123 Main St',
      address_city: 'Sydney',
      address_state: 'NSW',
      address_postcode: '2000',
    },
    shouldPass: false,
  },
  {
    description: 'Invalid email format',
    values: {
      site_name: 'Test Site',
      site_type: 'Office',
      client_id: '12345',
      address_street: '123 Main St',
      address_city: 'Sydney',
      address_state: 'NSW',
      address_postcode: '2000',
      contact_email: 'invalid-email', // Invalid email format
    },
    shouldPass: false,
  },
  {
    description: 'Negative price',
    values: {
      site_name: 'Test Site',
      site_type: 'Office',
      client_id: '12345',
      address_street: '123 Main St',
      address_city: 'Sydney',
      address_state: 'NSW',
      address_postcode: '2000',
      price_per_week: -100, // Negative price
      price_frequency: 'weekly',
    },
    shouldPass: false,
  },
]

/**
 * Run validation tests for site form
 */
export function testSiteFormValidation() {
  const results = testFormValidation(siteSchema, siteFormTestCases)
  
  console.group('Site Form Validation Test Results')
  results.forEach(result => {
    if (result.passed) {
      console.log(`✅ PASSED: ${result.description}`)
    } else {
      console.log(`❌ FAILED: ${result.description}`)
      console.log('Errors:', result.errors)
    }
  })
  console.groupEnd()
  
  return results
}
