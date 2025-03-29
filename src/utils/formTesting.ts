/**
 * Utilities for testing form inputs and validation
 */

/**
 * Test a form with various input combinations to catch validation issues
 * @param formSchema The Zod schema used for form validation
 * @param testCases Array of test cases with input values and expected validation results
 * @returns Array of validation results with pass/fail status and error messages
 */
export function testFormValidation(
  formSchema: any,
  testCases: Array<{
    description: string
    values: Record<string, any>
    shouldPass: boolean
  }>,
) {
  return testCases.map((testCase) => {
    const result = formSchema.safeParse(testCase.values)
    const passed = result.success === testCase.shouldPass

    return {
      description: testCase.description,
      passed,
      values: testCase.values,
      expectedToPass: testCase.shouldPass,
      actuallyPassed: result.success,
      errors: result.success ? [] : result.error.errors,
    }
  })
}

/**
 * Generate boundary test cases for a field based on its constraints
 * @param fieldName Name of the field to test
 * @param config Field configuration (type, min, max, etc.)
 * @param baseValues Base values for other form fields
 * @returns Array of test cases for the field
 */
export function generateFieldBoundaryTests(
  fieldName: string,
  config: {
    type: 'string' | 'number' | 'date' | 'email' | 'phone' | 'select'
    required?: boolean
    min?: number
    max?: number
    options?: string[]
  },
  baseValues: Record<string, any>,
) {
  const testCases = []

  // Test required constraint if applicable
  if (config.required) {
    testCases.push({
      description: `${fieldName} - missing required field`,
      values: { ...baseValues, [fieldName]: undefined },
      shouldPass: false,
    })

    if (config.type === 'string' || config.type === 'email' || config.type === 'phone') {
      testCases.push({
        description: `${fieldName} - empty string in required field`,
        values: { ...baseValues, [fieldName]: '' },
        shouldPass: false,
      })
    }
  }

  // Test min/max constraints for string types
  if (
    (config.type === 'string' || config.type === 'email' || config.type === 'phone') &&
    config.min !== undefined
  ) {
    const tooShort = 'a'.repeat(config.min - 1)
    const exactMin = 'a'.repeat(config.min)

    testCases.push({
      description: `${fieldName} - string too short (${tooShort.length} chars, min ${config.min})`,
      values: { ...baseValues, [fieldName]: tooShort },
      shouldPass: false,
    })

    testCases.push({
      description: `${fieldName} - string exact min length (${exactMin.length} chars)`,
      values: { ...baseValues, [fieldName]: exactMin },
      shouldPass: true,
    })
  }

  if (
    (config.type === 'string' || config.type === 'email' || config.type === 'phone') &&
    config.max !== undefined
  ) {
    const exactMax = 'a'.repeat(config.max)
    const tooLong = 'a'.repeat(config.max + 1)

    testCases.push({
      description: `${fieldName} - string exact max length (${exactMax.length} chars)`,
      values: { ...baseValues, [fieldName]: exactMax },
      shouldPass: true,
    })

    testCases.push({
      description: `${fieldName} - string too long (${tooLong.length} chars, max ${config.max})`,
      values: { ...baseValues, [fieldName]: tooLong },
      shouldPass: false,
    })
  }

  // Test min/max constraints for number types
  if (config.type === 'number') {
    if (config.min !== undefined) {
      testCases.push({
        description: `${fieldName} - number too small (${config.min - 1}, min ${config.min})`,
        values: { ...baseValues, [fieldName]: config.min - 1 },
        shouldPass: false,
      })

      testCases.push({
        description: `${fieldName} - number exact min (${config.min})`,
        values: { ...baseValues, [fieldName]: config.min },
        shouldPass: true,
      })
    }

    if (config.max !== undefined) {
      testCases.push({
        description: `${fieldName} - number exact max (${config.max})`,
        values: { ...baseValues, [fieldName]: config.max },
        shouldPass: true,
      })

      testCases.push({
        description: `${fieldName} - number too large (${config.max + 1}, max ${config.max})`,
        values: { ...baseValues, [fieldName]: config.max + 1 },
        shouldPass: false,
      })
    }
  }

  // Test select options
  if (config.type === 'select' && config.options && config.options.length > 0) {
    // Valid option
    testCases.push({
      description: `${fieldName} - valid select option (${config.options[0]})`,
      values: { ...baseValues, [fieldName]: config.options[0] },
      shouldPass: true,
    })

    // Invalid option
    testCases.push({
      description: `${fieldName} - invalid select option`,
      values: { ...baseValues, [fieldName]: 'INVALID_OPTION_VALUE' },
      shouldPass: false,
    })
  }

  return testCases
}

/**
 * Run the test cases and log results to console
 * @param testResults Array of test results from testFormValidation
 */
export function logTestResults(
  testResults: Array<{
    description: string
    passed: boolean
    values: Record<string, any>
    expectedToPass: boolean
    actuallyPassed: boolean
    errors: any[]
  }>,
) {
  console.group('Form Validation Tests')

  const passedCount = testResults.filter((result) => result.passed).length
  const totalCount = testResults.length

  console.log(
    `Passed: ${passedCount}/${totalCount} (${Math.round((passedCount / totalCount) * 100)}%)`,
  )

  testResults.forEach((result) => {
    if (result.passed) {
      console.log(`✅ PASS: ${result.description}`)
    } else {
      console.log(`❌ FAIL: ${result.description}`)
      console.log('  Values:', result.values)
      console.log('  Expected to pass:', result.expectedToPass)
      console.log('  Actual result:', result.actuallyPassed ? 'Passed' : 'Failed')
      if (result.errors.length > 0) {
        console.log('  Errors:', result.errors)
      }
    }
  })

  console.groupEnd()
}
